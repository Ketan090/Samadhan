import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  challenge: mongoose.Types.ObjectId;
  leader: mongoose.Types.ObjectId;
  members: {
    user: mongoose.Types.ObjectId;
    role: 'leader' | 'member' | 'mentor' | 'advisor';
    joinedAt: Date;
  }[];
  university?: mongoose.Types.ObjectId;
  industryMentor?: mongoose.Types.ObjectId;
  status: 'forming' | 'active' | 'completed' | 'disbanded';
  progress: number;
  isDemoData: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>({
  name: { type: String, required: true, trim: true },
  challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
  leader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['leader', 'member', 'mentor', 'advisor'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  university: { type: Schema.Types.ObjectId, ref: 'Organization' },
  industryMentor: { type: Schema.Types.ObjectId, ref: 'Organization' },
  status: { type: String, enum: ['forming', 'active', 'completed', 'disbanded'], default: 'forming' },
  progress: { type: Number, default: 0 },
  isDemoData: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<ITeam>('Team', teamSchema);
