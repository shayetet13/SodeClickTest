import mongoose from 'mongoose';
import { ENV } from './env';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(ENV.MONGODB_URI, {
      retryWrites: true,
      w: 'majority'
    });

    console.log(`Connected to MongoDB: ${ENV.isDevelopment ? 'Local' : 'Production'}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
