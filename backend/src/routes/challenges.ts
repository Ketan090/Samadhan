import { Router, Response } from 'express';
import Challenge from '../models/Challenge';
import AuditLog from '../models/AuditLog';
import Notification from '../models/Notification';
import { protect, authorize, AuthRequest } from '../middleware/auth';
import { validateChallenge, handleValidationErrors } from '../middleware/validation';
import AIService from '../services/aiService';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const aiService = AIService.getInstance();

const uploadDir = path.join(__dirname, '../../uploads/challenges');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp|jpg)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPG, PNG, WEBP images allowed'));
  }
});

function jaccard(a: string, b: string) {
  const sa = new Set(a.toLowerCase().split(/\W+/).filter(w=>w.length>2));
  const sb = new Set(b.toLowerCase().split(/\W+/).filter(w=>w.length>2));
  if (!sa.size || !sb.size) return 0;
  let inter=0; for(const w of sa) if(sb.has(w)) inter++;
  return inter / (sa.size + sb.size - inter);
}
async function findDuplicates(category: string, city: string, title: string, description: string) {
  const recent = await Challenge.find({ category, 'location.city': city, createdAt: { $gte: new Date(Date.now()-30*24*60*60*1000) } }).limit(20);
  const dups:any[] = [];
  for(const c of recent){
    const titleSim = jaccard(title, c.title);
    const descSim = jaccard(description, c.description);
    const score = titleSim*0.6 + descSim*0.4;
    if(score > 0.55) dups.push({ challenge: c, score: Math.round(score*100) });
  }
  dups.sort((a,b)=>b.score-a.score);
  return dups.slice(0,3);
}
function computePriority(severity: string, affected: number, supporters=0, verified=false, daysOpen=0) {
  const sevMap:any={ low: 20, medium: 40, high: 65, critical: 85 };
  let score = sevMap[severity] || 40;
  score += Math.min(15, Math.log10(Math.max(affected,1))*4);
  score += Math.min(10, supporters*2);
  if(verified) score += 5;
  score += Math.min(5, daysOpen*0.3);
  score = Math.min(100, Math.round(score));
  const level = score>=80 ? 'HIGH' : score>=60 ? 'MEDIUM' : 'LOW';
  const why = `Severity ${severity} (${sevMap[severity]}), ${affected.toLocaleString()} affected, ${supporters} supporters${verified ? ', verified' : ''}`;
  return { score, level, why };
}

// GET /api/challenges
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, state, city, severity, status, urgency, search, expertise, sortBy, page = 1, limit = 20, isDemo } = req.query;
    
    const filter: any = {};
    if (category) filter.category = category;
    if (state) filter['location.state'] = state;
    if (city) filter['location.city'] = city;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    if (expertise) filter.suggestedExpertise = { $in: (expertise as string).split(',') };
    if (isDemo !== undefined) filter.isDemoData = isDemo === 'true';
    if (search) {
      filter.$text = { $search: search as string };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Challenge.countDocuments(filter);
    const challenges = await Challenge.find(filter)
      .populate('submittedBy', 'name role avatar')
      .populate('organization', 'name type logo')
      .sort(sortBy ? { [sortBy as string]: -1 } : { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      challenges,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch challenges', error: error.message });
  }
});

// GET /api/challenges/:id
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('submittedBy', 'name role avatar organization')
      .populate('organization', 'name type logo website')
      .populate('verifiedBy', 'name role')
      .populate('participatingOrganizations', 'name type logo');
    
    if (!challenge) {
      res.status(404).json({ success: false, message: 'Challenge not found' });
      return;
    }
    res.json({ success: true, challenge });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch challenge', error: error.message });
  }
});

// POST /api/challenges — supports JSON or multipart with image
router.post('/', protect, upload.single('image'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Handle both JSON and multipart
    const body:any = req.body;
    // Parse JSON fields if multipart sent them as strings
    if (body.affectedPopulation) body.affectedPopulation = Number(body.affectedPopulation);
    if (body.suggestedExpertise && typeof body.suggestedExpertise === 'string') {
      try { body.suggestedExpertise = JSON.parse(body.suggestedExpertise); } catch { body.suggestedExpertise = body.suggestedExpertise.split(',').map((s:string)=>s.trim()).filter(Boolean); }
    }
    // Basic validation (mirrors validateChallenge but works with multipart)
    if (!body.title || body.title.length < 6) { res.status(400).json({ success:false, message:'Title at least 6 chars' }); return; }
    if (!body.description || body.description.length < 20) { res.status(400).json({ success:false, message:'Description at least 20 chars' }); return; }
    if (!body.category) { res.status(400).json({ success:false, message:'Category required' }); return; }

    const file = (req as any).file as Express.Multer.File | undefined;
    let imageUrl: string | undefined;
    if (file) imageUrl = `/uploads/challenges/${file.filename}`;
    else if (body.imageBase64) imageUrl = body.imageBase64; // fallback for base64 from old client
    else if (body.evidence?.images?.[0]) imageUrl = body.evidence.images[0];

    // Duplicate detection
    const city = body.location?.city || body.city || 'Unknown';
    const dups = await findDuplicates(body.category, city, body.title, body.description);

    // Priority
    const priority = computePriority(body.severity || 'medium', Number(body.affectedPopulation)||0, 0, false, 0);

    const challenge = await Challenge.create({
      title: body.title,
      description: body.description,
      category: body.category,
      subcategory: body.subcategory,
      location: body.location || { city, state: body.location?.state || body.state || 'Unknown', pincode: body.location?.pincode || '' },
      affectedPopulation: Number(body.affectedPopulation)||0,
      urgency: body.urgency || 'medium',
      severity: body.severity || 'medium',
      currentConsequences: body.currentConsequences,
      existingAttempts: body.existingAttempts,
      desiredOutcome: body.desiredOutcome,
      constraints: body.constraints,
      availableResources: body.availableResources,
      suggestedExpertise: body.suggestedExpertise || [],
      evidence: { images: imageUrl ? [imageUrl] : [], links: body.evidence?.links || [] },
      tags: body.tags,
      submittedBy: req.user!._id,
      organization: req.user!.organization,
      status: 'submitted',
      verificationStatus: 'pending',
      priorityScore: priority.score,
      priorityLevel: priority.level,
    });

    // Save image URL already handled; Run AI analysis (non-blocking for duplicate)
    // Duplicate warning is returned immediately; client can decide to continue or view existing
    const duplicateWarning = dups.length ? { message: 'A similar problem may already have been reported nearby.', duplicates: dups.map(d=>({ _id: d.challenge._id, title: d.challenge.title, location: d.challenge.location, score: d.score })) } : null;

    // Run AI analysis
    try {
      const analysis = await aiService.analyzeChallenge({
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        location: challenge.location,
        affectedPopulation: challenge.affectedPopulation,
        urgency: challenge.urgency,
        currentConsequences: challenge.currentConsequences,
        existingAttempts: challenge.existingAttempts
      });
      
      challenge.aiAnalysis = {
        summary: analysis.summary,
        classification: analysis.classification,
        impactScore: analysis.impactScore,
        urgencyScore: analysis.urgencyScore,
        requiredExpertise: analysis.requiredExpertise,
        similarChallenges: [],
        recommendedCollaborators: []
      };
      await challenge.save();
    } catch (aiError) {
      console.log('AI analysis failed, continuing without it');
    }

    res.status(201).json({ success: true, challenge, duplicateWarning, priority, imageUrl });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create challenge', error: error.message });
  }
});

// PATCH /api/challenges/:id
router.patch('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      res.status(404).json({ success: false, message: 'Challenge not found' });
      return;
    }

    // Only submitter, government, or admin can update
    const isOwner = challenge.submittedBy.toString() === req.user!._id.toString();
    const isGovOrAdmin = ['government', 'admin'].includes(req.user!.role);
    
    if (!isOwner && !isGovOrAdmin) {
      res.status(403).json({ success: false, message: 'Not authorized to update this challenge' });
      return;
    }

    // Government/admin can update verification status + audit + notify
    if (isGovOrAdmin && req.body.verificationStatus) {
      const old = challenge.verificationStatus;
      challenge.verificationStatus = req.body.verificationStatus;
      challenge.verifiedBy = req.user!._id;
      challenge.verifiedAt = new Date();
      if (req.body.verificationStatus === 'verified') {
        challenge.status = 'verified';
      }
      try {
        await AuditLog.create({ user: req.user!._id, action: `challenge:${req.body.verificationStatus}`, entity: 'Challenge', entityId: challenge._id, details: `${old} → ${req.body.verificationStatus}`, ipAddress: req.ip, userAgent: req.headers['user-agent'] });
        await Notification.create({ recipient: challenge.submittedBy, sender: req.user!._id, type: 'status_change', title: `Your report ${req.body.verificationStatus}`, message: `Problem "${challenge.title}" is now ${req.body.verificationStatus}`, relatedId: challenge._id, relatedModel: 'Challenge' });
        const io = req.app.get('io'); if (io) io.to(`challenge-${challenge._id}`).emit('status-updated', { challengeId: challenge._id, verificationStatus: challenge.verificationStatus, status: challenge.status });
      } catch {}
    }

    const allowedUpdates = ['title', 'description', 'category', 'location', 'affectedPopulation', 'urgency', 'severity', 'currentConsequences', 'existingAttempts', 'desiredOutcome', 'constraints', 'availableResources', 'suggestedExpertise', 'status', 'workflowStage', 'tags'];
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        (challenge as any)[field] = req.body[field];
      }
    }
    // Auto-advance workflowStage based on status if not explicitly set
    if (!req.body.workflowStage && challenge.workflowStage === 'registration' && challenge.verificationStatus === 'verified') {
      (challenge as any).workflowStage = 'ai-analyses';
    }

    await challenge.save();
    res.json({ success: true, challenge });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update challenge', error: error.message });
  }
});

// DELETE /api/challenges/:id
router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      res.status(404).json({ success: false, message: 'Challenge not found' });
      return;
    }

    const isOwner = challenge.submittedBy.toString() === req.user!._id.toString();
    const isAdmin = req.user!.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      res.status(403).json({ success: false, message: 'Not authorized to delete this challenge' });
      return;
    }

    await Challenge.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Challenge deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete challenge', error: error.message });
  }
});

export default router;
