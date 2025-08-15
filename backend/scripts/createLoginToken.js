const jwt = require('jsonwebtoken');
require('dotenv').config();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// สร้าง token สำหรับ user ทั่วไป
const createUserToken = () => {
  const userPayload = {
    id: '689ca2d937b777871ef0a', // ใช้ user ID ที่มีอยู่จริง
    username: 'testuser',
    email: 'test@example.com',
    role: 'user'
  };

  const token = jwt.sign(
    userPayload,
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log('🔑 User Token created:');
  console.log('Token:', token);
  console.log('Payload:', userPayload);
  console.log('JWT_SECRET used:', JWT_SECRET);
  
  // ตรวจสอบ token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verification successful:');
    console.log('Decoded:', decoded);
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
  }
  
  return token;
};

// สร้าง token สำหรับ admin
const createAdminToken = () => {
  const adminPayload = {
    id: 'admin_id_here', // ใส่ admin ID ที่มีอยู่จริง
    username: 'admin',
    email: 'admin@loveapp.com',
    role: 'admin'
  };

  const token = jwt.sign(
    adminPayload,
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log('\n👑 Admin Token created:');
  console.log('Token:', token);
  console.log('Payload:', adminPayload);
  
  return token;
};

// เรียกใช้ฟังก์ชัน
console.log('🚀 Creating JWT tokens...\n');
createUserToken();
console.log('\n' + '='.repeat(50) + '\n');
createAdminToken();
console.log('\n✨ Token creation completed!');
