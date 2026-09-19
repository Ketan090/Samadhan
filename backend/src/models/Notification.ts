import mongoose, { Schema, Document } from 'mongoose';

export type NotificationAudience = 'all' | 'citizen' | 'university' | 'industry' | 'government' | 'expert' | 'admin';

export interface INotification extends Document {
  user?: mongoose.Types.ObjectId;
  audience: NotificationAudience;
  type: 'challenge-approval' | 'collaboration-request' | 'solution-submission' | 'expert-evaluation' | 'task-assignment' | 'deadline' | 'status-change' | 'government-response';
  title: string;
  message: string;
  relatedChallenge?: mongoose.Types.ObjectId;
  relatedSolution?: mongoose.Types.ObjectId;
  relatedCollaboration?: mongoose.Types.ObjectId;
  read: boolean;
  readBy: mongoose.Types.ObjectId[];
  createdAt: Date;
}

// Which notification types each role cares about — the feed filters to
// these, so every role sees a relevant list. Mirrored in
// frontend/src/lib/roleFeed.ts (keep the two maps in sync).
export const ROLE_NOTIFICATION_TYPES: Record<string, string[]> = {
  citizen: ['challenge-approval', 'status-change', 'government-response', 'deadline'],
  university: ['challenge-approval', 'collaboration-request', 'solution-submission', 'task-assignment', 'deadline'],
  industry: ['collaboration-request', 'solution-submission', 'task-assignment', 'deadline'],
  government: ['challenge-approval', 'solution-submission', 'status-change', 'government-response', 'deadline'],
  expert: ['expert-evaluation', 'solution-submission', 'task-assignment', 'deadline'],
  admin: ['challenge-approval', 'collaboration-request', 'solution-submission', 'expert-evaluation', 'task-assignment', 'deadline', 'status-change', 'government-response'],
};

const notificationSchema = new Schema<INotification>({
  // Personal recipient. Unset for role broadcasts (audience-targeted).
  user: { type: Schema.Types.ObjectId, ref: 'User', sparse: true },
  // Role broadcast target. 'all' = every role. Personal notifications also
  // carry the recipient's role here for uniform feed queries.
  audience: { type: String, enum: ['all', 'citizen', 'university', 'industry', 'government', 'expert', 'admin'], default: 'all' },
  type: { type: String, enum: ['challenge-approval', 'collaboration-request', 'solution-submission', 'expert-evaluation', 'task-assignment', 'deadline', 'status-change', 'government-response'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedChallenge: { type: Schema.Types.ObjectId, ref: 'Challenge' },
  relatedSolution: { type: Schema.Types.ObjectId, ref: 'Solution' },
  relatedCollaboration: { type: Schema.Types.ObjectId, ref: 'Collaboration' },
  read: { type: Boolean, default: false },
  // Per-user reads for broadcasts (a shared doc can't use `read` per user).
  readBy: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] }
}, { timestamps: true });

notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ audience: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.model<INotification>('Notification', notificationSchema);
