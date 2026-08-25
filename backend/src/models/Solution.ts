import mongoose, { Schema, Document } from 'mongoose';

export interface ISolution extends Document {
  challenge: mongoose.Types.ObjectId;
  team: mongoose.Types.ObjectId;
  submittedBy: mongoose.Types.ObjectId;
  title: string;
  problemAddressed: string;
  proposedApproach: string;
  technology: string[];
  architecture?: string;
  expectedImpact: string;
  estimatedCost: number;
  implementationTimeline: string;
  scalability: string;
  attachments: string[];
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'pilot' | 'implemented';
  scorecard?: {
    impact: number;
    feasibility: number;
    scalability: number;
    innovation: number;
    costEffectiveness: number;
    totalScore: number;
  };
  isDemoData: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const solutionSchema = new Schema<ISolution>({
  challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  problemAddressed: { type: String, required: true },
  proposedApproach: { type: String, required: true },
  technology: [String],
  architecture: String,
  expectedImpact: String,
  estimatedCost: { type: Number, default: 0 },
  implementationTimeline: String,
  scalability: String,
  attachments: [String],
  status: { type: String, enum: ['draft', 'submitted', 'under-review', 'approved', 'rejected', 'pilot', 'implemented'], default: 'draft' },
  scorecard: {
    impact: { type: Number, min: 0, max: 10 },
    feasibility: { type: Number, min: 0, max: 10 },
    scalability: { type: Number, min: 0, max: 10 },
    innovation: { type: Number, min: 0, max: 10 },
    costEffectiveness: { type: Number, min: 0, max: 10 },
    totalScore: { type: Number, min: 0, max: 10 }
  },
  isDemoData: { type: Boolean, default: false }
}, { timestamps: true });

solutionSchema.index({ challenge: 1 });
solutionSchema.index({ status: 1 });

export default mongoose.model<ISolution>('Solution', solutionSchema);
