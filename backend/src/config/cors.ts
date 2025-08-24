import cors from 'cors';
import { ENV } from './env';

const corsOptions = {
  origin: function (origin: string | undefined, callback: any) {
    // Allowed origins - ใช้ * เพื่อให้ครอบคลุมทุก origin ในช่วงแรก
    const allowedOrigins = [
      'https://sodeclicktest-front-production.up.railway.app',
      'http://localhost:5173', 
      'http://localhost:3000', 
      ENV.CORS_ORIGIN,
      '*' // เพิ่ม wildcard เพื่อตรวจสอบ
    ];

    // Allow all origins in production for initial testing
    if (ENV.isProduction) {
      return callback(null, true);
    }

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Origin', 
    'X-Requested-With', 
    'Accept'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

export const configureCORS = () => cors(corsOptions);
