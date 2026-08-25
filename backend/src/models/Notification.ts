import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: 'challenge-approval' | 'collaboration-request' | 'solution-submission' | 'expert-evaluation' | 'task-assignment' | 'deadline' | 'status-change' | 'government-response';
  title: string;
  message: string;
  relatedChallenge?: mongoose.Types.ObjectId;
  relatedSolution?: mongoose.Types.ObjectId;
  relatedCollaboration?: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['challenge-approval', 'collaboration-request', 'solution-submission', 'expert-evaluation', 'task-assignment', 'deadline', 'status-change', 'government-response'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedChallenge: { type: Schema.Types.ObjectId, ref: 'Challenge' },
  relatedSolution: { type: Schema.Types.ObjectId, ref: 'Solution' },
  relatedCollaboration: { type: Schema.Types.ObjectId, ref: 'Collaboration' },
  read: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.model<INotification>('Notification', notificationSchema);
