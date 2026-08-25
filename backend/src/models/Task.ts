import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  team: mongoose.Types.ObjectId;
  challenge: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  assignedBy: mongoose.Types.ObjectId;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  deadline?: Date;
  completedAt?: Date;
  comments: {
    user: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true, trim: true },
  description: String,
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['todo', 'in-progress', 'review', 'done'], default: 'todo' },
  priority: { type: String, enum: ['urgent', 'high', 'medium', 'low'], default: 'medium' },
  deadline: Date,
  completedAt: Date,
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  attachments: [String]
}, { timestamps: true });

taskSchema.index({ team: 1, status: 1 });
taskSchema.index({ assignedTo: 1 });

export default mongoose.model<ITask>('Task', taskSchema);
