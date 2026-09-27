import { Router, Response } from 'express';
import Solution from '../models/Solution';
import Challenge from '../models/Challenge';
import { protect, AuthRequest } from '../middleware/auth';
import { validateSolution, handleValidationErrors } from '../middleware/validation';
import { sheetsAppend, solutionRow } from '../services/sheetsSync';

const router = Router();

// GET /api/solutions
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { challenge, status, page = 1, limit = 20 } = req.query;
    const filter: any = {};
    if (challenge) filter.challenge = challenge;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Solution.countDocuments(filter);
    const solutions = await Solution.find(filter)
      .populate('challenge', 'title category location')
      .populate('submittedBy', 'name role avatar')
      .populate('team', 'name members')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      solutions,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch solutions', error: error.message });
  }
});

// GET /api/solutions/:id
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const solution = await Solution.findById(req.params.id)
      .populate('challenge', 'title category location description')
      .populate('submittedBy', 'name role avatar organization')
      .populate('team', 'name members leader');
    
    if (!solution) {
      res.status(404).json({ success: false, message: 'Solution not found' });
      return;
    }
    res.json({ success: true, solution });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch solution', error: error.message });
  }
});

// POST /api/solutions
router.post('/', protect, validateSolution, handleValidationErrors, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Poster flow: university proposes solution with per-step breakdown
    const steps = Array.isArray(req.body.steps)
      ? req.body.steps.slice(0, 12).map((s: any) => ({
          title: typeof s === 'string' ? s : (s.title || 'Step'),
          description: typeof s === 'string' ? '' : (s.description || ''),
          status: 'pending' as const,
          progressPhotos: [],
        }))
      : [];
    const solution = await Solution.create({
      ...req.body,
      steps,
      submittedBy: req.user!._id,
      status: 'submitted'
    });

    // Mirror to Google Sheet (Apps Script) — silent no-op when unconfigured.
    sheetsAppend('solutions', solutionRow(solution));

    // Update challenge stats + advance workflow to university-proposed (poster flow)
    await Challenge.findByIdAndUpdate(req.body.challenge, {
      $inc: { numberOfSolutions: 1 },
      $set: { workflowStage: 'university-proposed', status: 'in-progress' }
    });

    res.status(201).json({ success: true, solution });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create solution', error: error.message });
  }
});

// PATCH /api/solutions/:id
router.patch('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      res.status(404).json({ success: false, message: 'Solution not found' });
      return;
    }

    const role = req.user!.role;
    // Poster flow transitions
    // Government/admin approves → government-approved
    if (['government', 'admin'].includes(role) && req.body.status) {
      solution.status = req.body.status;
      if (req.body.status === 'approved') {
        await Challenge.findByIdAndUpdate(solution.challenge, { $set: { workflowStage: 'government-approved', status: 'verified' } });
      } else if (req.body.status === 'pilot') {
        await Challenge.findByIdAndUpdate(solution.challenge, { $set: { workflowStage: 'industry-collaborating', status: 'in-progress' } });
      } else if (req.body.status === 'implemented') {
        await Challenge.findByIdAndUpdate(solution.challenge, { $set: { workflowStage: 'citizen-satisfied', status: 'implemented' } });
      }
    }

    // Industry joins & collaborates (poster: INDUSTRY JOINS AND COLLABORATES)
    if (['industry', 'admin'].includes(role) && req.body.joinIndustry) {
      solution.status = 'pilot';
      await Challenge.findByIdAndUpdate(solution.challenge, { $set: { workflowStage: 'industry-collaborating', status: 'in-progress' } });
    }

    // Progress photo per step (poster: UPLOAD PROGRESS PHOTOS REGULARLY)
    if (req.body.progressPhoto && typeof req.body.stepIndex === 'number') {
      const idx = req.body.stepIndex;
      if (solution.steps?.[idx]) {
        solution.steps[idx].progressPhotos = [...(solution.steps[idx].progressPhotos || []), req.body.progressPhoto].slice(0, 10);
        if (solution.steps[idx].status === 'pending') solution.steps[idx].status = 'in-progress';
      }
      solution.progressUpdates = [...(solution.progressUpdates || []), {
        stepIndex: idx,
        photoUrl: req.body.progressPhoto,
        caption: req.body.caption || '',
        uploadedBy: req.user!._id as any,
        createdAt: new Date(),
      }].slice(-50);
      await Challenge.findByIdAndUpdate(solution.challenge, { $set: { workflowStage: 'progress-photos', status: 'in-progress' } });
    }

    // Step status update
    if (req.body.stepIndex !== undefined && req.body.stepStatus && solution.steps?.[req.body.stepIndex]) {
      (solution.steps[req.body.stepIndex] as any).status = req.body.stepStatus;
    }

    // Citizen satisfaction (poster: CITIZEN GETS SATISFIED)
    if (req.body.citizenRating) {
      (solution as any).citizenRating = Math.min(5, Math.max(1, Number(req.body.citizenRating)));
      (solution as any).citizenFeedback = req.body.citizenFeedback || '';
      await Challenge.findByIdAndUpdate(solution.challenge, { $set: { workflowStage: 'citizen-satisfied', status: 'implemented' } });
    }

    // Update other fields
    const allowedUpdates = ['title', 'problemAddressed', 'proposedApproach', 'technology', 'architecture', 'expectedImpact', 'estimatedCost', 'implementationTimeline', 'scalability', 'attachments', 'steps'];
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        (solution as any)[field] = req.body[field];
      }
    }

    await solution.save();
    res.json({ success: true, solution });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update solution', error: error.message });
  }
});

export default router;
