import mongoose, { Schema, Document } from 'mongoose';

export interface IImpactMetric extends Document {
  challenge: mongoose.Types.ObjectId;
  solution: mongoose.Types.ObjectId;
  team: mongoose.Types.ObjectId;
  metric: string;
  category: 'people-benefited' | 'cost-saved' | 'time-saved' | 'problems-resolved' | 'coverage' | 'environmental' | 'resource-saved';
  unit: string;
  beforeValue: number;
  afterValue: number;
  improvement: number;
  improvementPercent: number;
  description: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verified: boolean;
  evidence?: string;
  measuredAt: Date;
  isDemoData: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const impactMetricSchema = new Schema<IImpactMetric>({
  challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
  solution: { type: Schema.Types.ObjectId, ref: 'Solution', required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  metric: { type: String, required: true },
  category: { type: String, enum: ['people-benefited', 'cost-saved', 'time-saved', 'problems-resolved', 'coverage', 'environmental', 'resource-saved'], required: true },
  unit: { type: String, required: true },
  beforeValue: { type: Number, required: true },
  afterValue: { type: Number, required: true },
  improvement: Number,
  improvementPercent: Number,
  description: String,
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verified: { type: Boolean, default: false },
  evidence: String,
  measuredAt: { type: Date, default: Date.now },
  isDemoData: { type: Boolean, default: false }
}, { timestamps: true });

// Calculate improvement before saving
impactMetricSchema.pre('save', function(next) {
  this.improvement = this.afterValue - this.beforeValue;
  if (this.beforeValue > 0) {
    this.improvementPercent = ((this.afterValue - this.beforeValue) / this.beforeValue) * 100;
  }
  next();
});

impactMetricSchema.index({ challenge: 1 });
impactMetricSchema.index({ category: 1 });

export default mongoose.model<IImpactMetric>('ImpactMetric', impactMetricSchema);
