import express from 'express';
import { ENV } from './config/env';
import { connectDatabase } from './config/database';

async function startServer() {
  // เชื่อมต่อฐานข้อมูล
  await connectDatabase();

  // เริ่มเซิร์ฟเวอร์
  const app = express();

  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT} in ${ENV.isDevelopment ? 'Development' : 'Production'} mode`);
  });
}

startServer();
