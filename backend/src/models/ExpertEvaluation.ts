import mongoose, { Schema, Document } from 'mongoose';

export interface IExpertEvaluation extends Document {
  solution: mongoose.Types.ObjectId;
  evaluator: mongoose.Types.ObjectId;
  challenge: mongoose.Types.ObjectId;
  scores: {
    impact: number;
    feasibility: number;
    scalability: number;
    innovation: number;
    costEffectiveness: number;
  };
  weightedScore: number;
  comments: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  recommendation: 'approve' | 'approve-with-conditions' | 'revise' | 'reject';
  status: 'pending' | 'submitted';
  isDemoData: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const evaluationSchema = new Schema<IExpertEvaluation>({
  solution: { type: Schema.Types.ObjectId, ref: 'Solution', required: true },
  evaluator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
  scores: {
    impact: { type: Number, min: 0, max: 10, required: true },
    feasibility: { type: Number, min: 0, max: 10, required: true },
    scalability: { type: Number, min: 0, max: 10, required: true },
    innovation: { type: Number, min: 0, max: 10, required: true },
    costEffectiveness: { type: Number, min: 0, max: 10, required: true }
  },
  weightedScore: { type: Number, min: 0, max: 10 },
  comments: String,
  strengths: [String],
  weaknesses: [String],
  recommendations: [String],
  recommendation: { type: String, enum: ['approve', 'approve-with-conditions', 'revise', 'reject'], required: true },
  status: { type: String, enum: ['pending', 'submitted'], default: 'submitted' },
  isDemoData: { type: Boolean, default: false }
}, { timestamps: true });

// Calculate weighted score before saving
evaluationSchema.pre('save', function(next) {
  if (this.scores) {
    this.weightedScore = (
      this.scores.impact * 0.30 +
      this.scores.feasibility * 0.25 +
      this.scores.scalability * 0.20 +
      this.scores.innovation * 0.15 +
      this.scores.costEffectiveness * 0.10
    );
  }
  next();
});

evaluationSchema.index({ solution: 1 });
evaluationSchema.index({ evaluator: 1 });

export default mongoose.model<IExpertEvaluation>('ExpertEvaluation', evaluationSchema);
