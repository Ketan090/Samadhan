import { Router, Response } from 'express';
import Collaboration from '../models/Collaboration';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/collaborations
router.get('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { challenge, status } = req.query;
    const filter: any = {};
    if (challenge) filter.challenge = challenge;
    if (status) filter.status = status;

    const collaborations = await Collaboration.find(filter)
      .populate('challenge', 'title category location')
      .populate('initiatorOrganization', 'name type logo')
      .populate('partnerOrganization', 'name type logo')
      .sort({ matchScore: -1 });

    res.json({ success: true, collaborations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch collaborations', error: error.message });
  }
});

// GET /api/collaborations/:id
router.get('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const collab = await Collaboration.findById(req.params.id)
      .populate('challenge', 'title category description')
      .populate('initiatorOrganization', 'name type logo')
      .populate('partnerOrganization', 'name type logo');
    
    if (!collab) {
      res.status(404).json({ success: false, message: 'Collaboration not found' });
      return;
    }
    res.json({ success: true, collaboration: collab });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch collaboration', error: error.message });
  }
});

// POST /api/collaborations
router.post('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const collab = await Collaboration.create({
      ...req.body,
      initiator: req.user!._id,
      initiatorOrganization: req.user!.organization
    });
    res.status(201).json({ success: true, collaboration: collab });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create collaboration', error: error.message });
  }
});

// PATCH /api/collaborations/:id
router.patch('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const collab = await Collaboration.findById(req.params.id);
    if (!collab) {
      res.status(404).json({ success: false, message: 'Collaboration not found' });
      return;
    }

    if (req.body.status) collab.status = req.body.status;
    await collab.save();

    res.json({ success: true, collaboration: collab });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update collaboration', error: error.message });
  }
});

export default router;
