import { Router, Response } from 'express';
import Notification, { ROLE_NOTIFICATION_TYPES } from '../models/Notification';
import { protect, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Every notification endpoint needs login — feeds are per-user + per-role.
router.use(protect);

const myRole = (req: AuthRequest) => req.user!.role;
const myTypes = (req: AuthRequest) => ROLE_NOTIFICATION_TYPES[myRole(req)] || ROLE_NOTIFICATION_TYPES.citizen;

// A broadcast doc is shared, so per-user seen state lives in `readBy`.
const isRead = (n: any, me: string) =>
  n.read === true || (Array.isArray(n.readBy) && n.readBy.some((id: any) => String(id) === String(me)));

const shape = (n: any, me: string) => ({
  id: String(n._id),
  type: n.type,
  audience: n.audience,
  personal: !!n.user,
  title: n.title,
  message: n.message,
  relatedChallenge: n.relatedChallenge ? String(n.relatedChallenge) : undefined,
  relatedSolution: n.relatedSolution ? String(n.relatedSolution) : undefined,
  relatedCollaboration: n.relatedCollaboration ? String(n.relatedCollaboration) : undefined,
  read: isRead(n, me),
  createdAt: n.createdAt,
});

// GET /api/notifications — role-filtered feed: my personal items plus
// broadcasts for 'all' or my role, limited to my role's types.
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const me = String(req.user!._id);
    const role = myRole(req);
    const types = myTypes(req);
    const q: any = {
      $or: [{ user: req.user!._id }, { user: null, audience: { $in: ['all', role] } }],
      type: { $in: types },
    };
    if (req.query.unread === 'true') {
      q.$or = [
        { user: req.user!._id, read: false },
        { user: null, audience: { $in: ['all', role] }, readBy: { $ne: req.user!._id } },
      ];
    }
    const docs = await Notification.find(q).sort({ createdAt: -1 }).limit(50).lean();
    res.json({ success: true, role, types, count: docs.length, notifications: docs.map((d) => shape(d, me)) });
  } catch (e: any) {
    res.status(500).json({ success: false, message: 'Failed to load notifications', error: e.message });
  }
});

// GET /api/notifications/unread-count — badge number for the bell.
router.get('/unread-count', async (req: AuthRequest, res: Response) => {
  try {
    const role = myRole(req);
    const types = myTypes(req);
    const count = await Notification.countDocuments({
      $or: [
        { user: req.user!._id, read: false },
        { user: null, audience: { $in: ['all', role] }, readBy: { $ne: req.user!._id } },
      ],
      type: { $in: types },
    });
    res.json({ success: true, role, count });
  } catch (e: any) {
    res.status(500).json({ success: false, message: 'Failed to count notifications', error: e.message });
  }
});

// PATCH /api/notifications/:id/read — mark one as read (own or broadcast).
router.patch('/:id/read', async (req: AuthRequest, res: Response) => {
  try {
    const me = String(req.user!._id);
    const n = await Notification.findById(req.params.id);
    if (!n) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }
    if (n.user && String(n.user) === me) {
      n.read = true;
      await n.save();
    } else if (!n.user && (n.audience === 'all' || n.audience === myRole(req))) {
      await Notification.updateOne({ _id: n._id }, { $addToSet: { readBy: req.user!._id } });
    } else {
      res.status(403).json({ success: false, message: 'Not your notification' });
      return;
    }
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, message: 'Failed to mark read', error: e.message });
  }
});

// POST /api/notifications/read-all — clear the whole role feed badge.
router.post('/read-all', async (req: AuthRequest, res: Response) => {
  try {
    const role = myRole(req);
    await Notification.updateMany({ user: req.user!._id, read: false }, { $set: { read: true } });
    await Notification.updateMany(
      { user: null, audience: { $in: ['all', role] } },
      { $addToSet: { readBy: req.user!._id } }
    );
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, message: 'Failed to mark all read', error: e.message });
  }
});

// POST /api/notifications/broadcast — admin-only role-targeted announcement.
router.post('/broadcast', authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { audience = 'all', type, title, message } = req.body || {};
    const validAudiences = ['all', 'citizen', 'university', 'industry', 'government', 'expert', 'admin'];
    const validTypes = ['challenge-approval', 'collaboration-request', 'solution-submission', 'expert-evaluation', 'task-assignment', 'deadline', 'status-change', 'government-response'];
    if (!validAudiences.includes(audience) || !validTypes.includes(type) || !title || !message) {
      res.status(400).json({ success: false, message: 'audience, type, title and message required' });
      return;
    }
    const n = await Notification.create({ audience, type, title, message });
    res.status(201).json({ success: true, notification: shape(n.toObject(), String(req.user!._id)) });
  } catch (e: any) {
    res.status(500).json({ success: false, message: 'Failed to broadcast', error: e.message });
  }
});

export default router;
