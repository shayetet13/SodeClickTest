import dotenv from 'dotenv';

// เลือกไฟล์ .env ตามสภาพแวดล้อม
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.development';

dotenv.config({ path: envFile });

export const ENV = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/sodeclick',
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  
  CORS_ORIGIN: process.env.CORS_ORIGIN
};
