import mongoose, { Schema, Document } from 'mongoose';

export interface ICollaboration extends Document {
  challenge: mongoose.Types.ObjectId;
  initiator: mongoose.Types.ObjectId;
  initiatorOrganization: mongoose.Types.ObjectId;
  partner: mongoose.Types.ObjectId;
  partnerOrganization: mongoose.Types.ObjectId;
  type: 'university-industry' | 'university-government' | 'industry-government' | 'ngo-government' | 'expert-team';
  role: 'mentor' | 'technology-partner' | 'funding-partner' | 'pilot-partner' | 'research-partner' | 'member';
  matchScore: number;
  status: 'pending' | 'accepted' | 'rejected' | 'active' | 'completed';
  message?: string;
  matchReason: string;
  isDemoData: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const collaborationSchema = new Schema<ICollaboration>({
  challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
  initiator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  initiatorOrganization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  partner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  partnerOrganization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  type: { type: String, enum: ['university-industry', 'university-government', 'industry-government', 'ngo-government', 'expert-team'], required: true },
  role: { type: String, enum: ['mentor', 'technology-partner', 'funding-partner', 'pilot-partner', 'research-partner', 'member'], required: true },
  matchScore: { type: Number, min: 0, max: 100, default: 0 },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'active', 'completed'], default: 'pending' },
  message: String,
  matchReason: { type: String, required: true },
  isDemoData: { type: Boolean, default: false }
}, { timestamps: true });

collaborationSchema.index({ challenge: 1 });
collaborationSchema.index({ status: 1 });
collaborationSchema.index({ matchScore: -1 });

export default mongoose.model<ICollaboration>('Collaboration', collaborationSchema);
