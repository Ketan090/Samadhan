import { Router, Response } from 'express';
import Challenge from '../models/Challenge';
import { protect, authorize, AuthRequest } from '../middleware/auth';
import { validateChallenge, handleValidationErrors } from '../middleware/validation';
import AIService from '../services/aiService';

const router = Router();
const aiService = AIService.getInstance();

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

// POST /api/challenges
router.post('/', protect, validateChallenge, handleValidationErrors, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const challenge = await Challenge.create({
      ...req.body,
      submittedBy: req.user!._id,
      organization: req.user!.organization,
      status: 'submitted',
      verificationStatus: 'pending'
    });

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

    res.status(201).json({ success: true, challenge });
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

    // Government/admin can update verification status
    if (isGovOrAdmin && req.body.verificationStatus) {
      challenge.verificationStatus = req.body.verificationStatus;
      challenge.verifiedBy = req.user!._id;
      challenge.verifiedAt = new Date();
      if (req.body.verificationStatus === 'verified') {
        challenge.status = 'verified';
      }
    }

    const allowedUpdates = ['title', 'description', 'category', 'location', 'affectedPopulation', 'urgency', 'severity', 'currentConsequences', 'existingAttempts', 'desiredOutcome', 'constraints', 'availableResources', 'suggestedExpertise', 'status', 'tags'];
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        (challenge as any)[field] = req.body[field];
      }
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
