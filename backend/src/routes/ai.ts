import { Router, Response } from 'express';
import AIService from '../services/aiService';
import Organization from '../models/Organization';
import Challenge from '../models/Challenge';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();
const aiService = AIService.getInstance();

// POST /api/ai/analyze-challenge
router.post('/analyze-challenge', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category, location, affectedPopulation, urgency, currentConsequences, existingAttempts } = req.body;

    const analysis = await aiService.analyzeChallenge({
      title,
      description,
      category,
      location,
      affectedPopulation: affectedPopulation || 0,
      urgency: urgency || 'medium',
      currentConsequences,
      existingAttempts
    });

    res.json({ success: true, analysis });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'AI analysis failed', error: error.message });
  }
});

// POST /api/ai/match-collaborators
router.post('/match-collaborators', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { challengeId, title, description, category, location, affectedPopulation, urgency } = req.body;

    let challengeInput;
    if (challengeId) {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        res.status(404).json({ success: false, message: 'Challenge not found' });
        return;
      }
      challengeInput = {
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        location: challenge.location,
        affectedPopulation: challenge.affectedPopulation,
        urgency: challenge.urgency
      };
    } else {
      challengeInput = { title, description, category, location, affectedPopulation, urgency };
    }

    const organizations = await Organization.find({}).limit(50);
    const matches = await aiService.matchCollaborators(challengeInput, organizations);

    res.json({ success: true, matches });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Collaboration matching failed', error: error.message });
  }
});

export default router;
