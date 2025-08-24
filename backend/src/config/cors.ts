import cors from 'cors';

// Simple CORS configuration - allow all origins for now
const corsOptions = {
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['*'],
  credentials: true,
  optionsSuccessStatus: 200
};

export const configureCORS = () => cors(corsOptions);
