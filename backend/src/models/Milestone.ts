import mongoose, { Schema, Document } from 'mongoose';

export interface IMilestone extends Document {
  title: string;
  description?: string;
  team: mongoose.Types.ObjectId;
  challenge: mongoose.Types.ObjectId;
  dueDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  order: number;
  dependencies: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const milestoneSchema = new Schema<IMilestone>({
  title: { type: String, required: true, trim: true },
  description: String,
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
  dueDate: { type: Date, required: true },
  completedDate: Date,
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'overdue'], default: 'pending' },
  order: { type: Number, default: 0 },
  dependencies: [{ type: Schema.Types.ObjectId, ref: 'Milestone' }]
}, { timestamps: true });

export default mongoose.model<IMilestone>('Milestone', milestoneSchema);
