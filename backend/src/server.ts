import express from 'express';
import { ENV } from './config/env';
import { connectDatabase } from './config/database';
import { configureCORS } from './config/cors';

async function startServer() {
  // เชื่อมต่อฐานข้อมูล
  await connectDatabase();

  // เริ่มเซิร์ฟเวอร์
  const app = express();

  // ใช้ CORS middleware
  app.use(configureCORS());

  // Middleware เพื่อบันทึก CORS errors
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.message === 'Not allowed by CORS') {
      console.error(`CORS blocked origin: ${req.headers.origin}`);
      return res.status(403).json({ error: 'Not allowed by CORS' });
    }
    next(err);
  });

  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT} in ${ENV.isDevelopment ? 'Development' : 'Production'} mode`);
  });
}

startServer();
