import { Router, Response } from 'express';
import Solution from '../models/Solution';
import Challenge from '../models/Challenge';
import { protect, AuthRequest } from '../middleware/auth';
import { validateSolution, handleValidationErrors } from '../middleware/validation';

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
    const solution = await Solution.create({
      ...req.body,
      submittedBy: req.user!._id,
      status: 'submitted'
    });

    // Update challenge stats
    await Challenge.findByIdAndUpdate(req.body.challenge, {
      $inc: { numberOfSolutions: 1 }
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

    // Government/admin can update status
    if (['government', 'admin'].includes(req.user!.role) && req.body.status) {
      solution.status = req.body.status;
    }

    // Update other fields
    const allowedUpdates = ['title', 'problemAddressed', 'proposedApproach', 'technology', 'architecture', 'expectedImpact', 'estimatedCost', 'implementationTimeline', 'scalability', 'attachments'];
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
