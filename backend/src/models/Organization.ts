import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  type: 'university' | 'industry' | 'government' | 'ngo';
  description?: string;
  website?: string;
  logo?: string;
  contactEmail: string;
  phone?: string;
  address: {
    street?: string;
    city: string;
    state: string;
    pincode?: string;
    coordinates?: { lat: number; lng: number };
  };
  // University-specific
  departments?: string[];
  researchAreas?: string[];
  faculty?: { name: string; department: string; expertise: string[] }[];
  studentTeams?: { name: string; members: number; focus: string }[];
  technologies?: string[];
  previousProjects?: { title: string; year: number; description: string }[];
  // Industry-specific
  industryType?: string;
  companySize?: string;
  capabilities?: string[];
  fundingAvailable?: boolean;
  mentorshipAvailable?: boolean;
  // Government-specific
  department?: string;
  jurisdiction?: string;
  officialCapacity?: string;
  // NGO-specific
  focusAreas?: string[];
  // Common
  verifiedByGovernment: boolean;
  isVerified: boolean;
  rating: number;
  totalChallenges: number;
  totalSolutions: number;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['university', 'industry', 'government', 'ngo'], required: true },
  description: String,
  website: String,
  logo: String,
  contactEmail: { type: String, required: true },
  phone: String,
  address: {
    street: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: String,
    coordinates: { lat: Number, lng: Number }
  },
  departments: [String],
  researchAreas: [String],
  faculty: [{ name: String, department: String, expertise: [String] }],
  studentTeams: [{ name: String, members: Number, focus: String }],
  technologies: [String],
  previousProjects: [{ title: String, year: Number, description: String }],
  industryType: String,
  companySize: String,
  capabilities: [String],
  fundingAvailable: { type: Boolean, default: false },
  mentorshipAvailable: { type: Boolean, default: false },
  department: String,
  jurisdiction: String,
  officialCapacity: String,
  focusAreas: [String],
  verifiedByGovernment: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalChallenges: { type: Number, default: 0 },
  totalSolutions: { type: Number, default: 0 }
}, { timestamps: true });

organizationSchema.index({ type: 1 });
organizationSchema.index({ 'address.state': 1 });
organizationSchema.index({ isVerified: 1 });

export default mongoose.model<IOrganization>('Organization', organizationSchema);
