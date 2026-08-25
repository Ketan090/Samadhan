import mongoose, { Schema, Document } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  location: {
    city: string;
    state: string;
    pincode?: string;
    coordinates?: { lat: number; lng: number };
  };
  submittedBy: mongoose.Types.ObjectId;
  organization?: mongoose.Types.ObjectId;
  affectedPopulation: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  severity: 'critical' | 'high' | 'medium' | 'low';
  currentConsequences: string;
  existingAttempts: string;
  desiredOutcome: string;
  constraints?: string;
  availableResources?: string;
  suggestedExpertise: string[];
  status: 'draft' | 'submitted' | 'verified' | 'open' | 'in-progress' | 'solved' | 'implemented' | 'closed';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  // AI Analysis
  aiAnalysis?: {
    summary: string;
    classification: string;
    impactScore: number;
    urgencyScore: number;
    requiredExpertise: string[];
    similarChallenges: mongoose.Types.ObjectId[];
    recommendedCollaborators: mongoose.Types.ObjectId[];
  };
  // Evidence
  evidence: {
    images: string[];
    documents: string[];
    videos: string[];
    links: string[];
  };
  // Stats
  numberOfTeams: number;
  numberOfSolutions: number;
  participatingOrganizations: mongoose.Types.ObjectId[];
  tags: string[];
  isDemoData: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const challengeSchema = new Schema<IChallenge>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: String,
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: String,
    coordinates: { lat: Number, lng: Number }
  },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
  affectedPopulation: { type: Number, default: 0 },
  urgency: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'medium' },
  severity: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'medium' },
  currentConsequences: String,
  existingAttempts: String,
  desiredOutcome: String,
  constraints: String,
  availableResources: String,
  suggestedExpertise: [String],
  status: { type: String, enum: ['draft', 'submitted', 'verified', 'open', 'in-progress', 'solved', 'implemented', 'closed'], default: 'draft' },
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
  aiAnalysis: {
    summary: String,
    classification: String,
    impactScore: Number,
    urgencyScore: Number,
    requiredExpertise: [String],
    similarChallenges: [{ type: Schema.Types.ObjectId, ref: 'Challenge' }],
    recommendedCollaborators: [{ type: Schema.Types.ObjectId, ref: 'Organization' }]
  },
  evidence: {
    images: [String],
    documents: [String],
    videos: [String],
    links: [String]
  },
  numberOfTeams: { type: Number, default: 0 },
  numberOfSolutions: { type: Number, default: 0 },
  participatingOrganizations: [{ type: Schema.Types.ObjectId, ref: 'Organization' }],
  tags: [String],
  isDemoData: { type: Boolean, default: false }
}, { timestamps: true });

challengeSchema.index({ category: 1 });
challengeSchema.index({ status: 1 });
challengeSchema.index({ 'location.state': 1 });
challengeSchema.index({ severity: 1 });
challengeSchema.index({ createdAt: -1 });
challengeSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IChallenge>('Challenge', challengeSchema);
