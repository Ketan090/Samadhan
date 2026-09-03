import mongoose, { Schema, Document } from 'mongoose';

export interface IMatchingConfig extends Document {
  weights: { skill: number; domain: number; technology: number; expertise: number; experience: number; availability: number; location: number; impact: number; };
  provider: 'mock' | 'openai' | 'gemini' | 'local' | 'lmstudio';
  apiKeys: { openai?: string; gemini?: string; };
  apiBase?: string;
  similarityThreshold: number;
  minimumMatchScore: number;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const matchingConfigSchema = new Schema<IMatchingConfig>({
  weights: {
    skill: { type: Number, default: 25 },
    domain: { type: Number, default: 20 },
    technology: { type: Number, default: 15 },
    expertise: { type: Number, default: 15 },
    experience: { type: Number, default: 10 },
    availability: { type: Number, default: 5 },
    location: { type: Number, default: 5 },
    impact: { type: Number, default: 5 },
  },
  provider: { type: String, enum: ['mock','openai','gemini','local','lmstudio'], default: 'mock' },
  apiKeys: { openai: String, gemini: String },
  apiBase: String,
  similarityThreshold: { type: Number, default: 0.72 },
  minimumMatchScore: { type: Number, default: 60 },
}, { timestamps: true });

export default mongoose.model<IMatchingConfig>('MatchingConfig', matchingConfigSchema);
