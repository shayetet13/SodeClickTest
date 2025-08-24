import cors from 'cors';
import { ENV } from './env';

const corsOptions = {
  origin: function (origin: string | undefined, callback: any) {
    // Allowed origins
    const allowedOrigins = [
      'https://sodeclicktest-front-production.up.railway.app',
      'http://localhost:5173', // Development frontend
      'http://localhost:3000', // Alternative dev port
      ENV.CORS_ORIGIN
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

export const configureCORS = () => cors(corsOptions);
