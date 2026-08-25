import { Router, Response } from 'express';
import ExpertEvaluation from '../models/ExpertEvaluation';
import Solution from '../models/Solution';
import { protect, authorize, AuthRequest } from '../middleware/auth';
import { validateEvaluation, handleValidationErrors } from '../middleware/validation';

const router = Router();

// GET /api/evaluations/solution/:solutionId
router.get('/solution/:solutionId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const evaluations = await ExpertEvaluation.find({ solution: req.params.solutionId })
      .populate('evaluator', 'name role organization');
    
    res.json({ success: true, evaluations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch evaluations', error: error.message });
  }
});

// POST /api/evaluations
router.post('/', protect, authorize('expert', 'government', 'admin'), validateEvaluation, handleValidationErrors, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const evaluation = await ExpertEvaluation.create({
      ...req.body,
      evaluator: req.user!._id,
      status: 'submitted'
    });

    // Update solution scorecard with average
    const allEvals = await ExpertEvaluation.find({ solution: req.body.solution });
    if (allEvals.length > 0) {
      const avgScores = {
        impact: allEvals.reduce((sum, e) => sum + e.scores.impact, 0) / allEvals.length,
        feasibility: allEvals.reduce((sum, e) => sum + e.scores.feasibility, 0) / allEvals.length,
        scalability: allEvals.reduce((sum, e) => sum + e.scores.scalability, 0) / allEvals.length,
        innovation: allEvals.reduce((sum, e) => sum + e.scores.innovation, 0) / allEvals.length,
        costEffectiveness: allEvals.reduce((sum, e) => sum + e.scores.costEffectiveness, 0) / allEvals.length,
        totalScore: allEvals.reduce((sum, e) => sum + (e.weightedScore || 0), 0) / allEvals.length
      };

      await Solution.findByIdAndUpdate(req.body.solution, { scorecard: avgScores });
    }

    res.status(201).json({ success: true, evaluation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create evaluation', error: error.message });
  }
});

export default router;
