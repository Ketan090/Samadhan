import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/samadhanhub');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn('MongoDB not available — running in demo mode without DB. Set MONGODB_URI to a valid Atlas URI to enable persistence.');
    console.warn((error as any)?.message || error);
  }
};

export default connectDB;
