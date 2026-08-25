import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'citizen' | 'university' | 'industry' | 'government' | 'admin' | 'expert';
  avatar?: string;
  phone?: string;
  bio?: string;
  organization?: mongoose.Types.ObjectId;
  expertise?: string[];
  location?: {
    city: string;
    state: string;
    coordinates?: { lat: number; lng: number };
  };
  notifications: {
    challengeApproval: boolean;
    collaborationRequest: boolean;
    solutionSubmission: boolean;
    expertEvaluation: boolean;
    taskAssignment: boolean;
    deadline: boolean;
    statusChange: boolean;
    governmentResponse: boolean;
  };
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ['citizen', 'university', 'industry', 'government', 'admin', 'expert'], default: 'citizen' },
  avatar: String,
  phone: String,
  bio: String,
  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
  expertise: [String],
  location: {
    city: String,
    state: String,
    coordinates: { lat: Number, lng: Number }
  },
  notifications: {
    challengeApproval: { type: Boolean, default: true },
    collaborationRequest: { type: Boolean, default: true },
    solutionSubmission: { type: Boolean, default: true },
    expertEvaluation: { type: Boolean, default: true },
    taskAssignment: { type: Boolean, default: true },
    deadline: { type: Boolean, default: true },
    statusChange: { type: Boolean, default: true },
    governmentResponse: { type: Boolean, default: true }
  },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'location.state': 1 });

export default mongoose.model<IUser>('User', userSchema);
