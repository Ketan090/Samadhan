import { Router, Response } from 'express';
import Organization from '../models/Organization';
import { protect, authorize, AuthRequest } from '../middleware/auth';
import { validateOrganization, handleValidationErrors } from '../middleware/validation';

const router = Router();

// GET /api/organizations
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, state, verified, search, page = 1, limit = 20 } = req.query;
    const filter: any = {};
    if (type) filter.type = type;
    if (state) filter['address.state'] = state;
    if (verified !== undefined) filter.isVerified = verified === 'true';
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Organization.countDocuments(filter);
    const organizations = await Organization.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      organizations,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch organizations', error: error.message });
  }
});

// GET /api/organizations/:id
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) {
      res.status(404).json({ success: false, message: 'Organization not found' });
      return;
    }
    res.json({ success: true, organization: org });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch organization', error: error.message });
  }
});

// POST /api/organizations
router.post('/', protect, validateOrganization, handleValidationErrors, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const org = await Organization.create(req.body);
    res.status(201).json({ success: true, organization: org });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create organization', error: error.message });
  }
});

export default router;
