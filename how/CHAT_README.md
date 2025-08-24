# Real-Time Chat System 💬

ระบบแชทแบบเรียลไทม์สำหรับแอปพลิเคชัน Love Project พร้อมฟีเจอร์ครบครัน

## ✨ ฟีเจอร์หลัก

### 🚀 Real-Time Communication
- **Socket.IO Integration**: การสื่อสารแบบเรียลไทม์
- **Instant Messaging**: ส่งและรับข้อความทันที
- **Typing Indicators**: แสดงสถานะการพิมพ์
- **Online Status**: แสดงสถานะออนไลน์ของผู้ใช้

### 👤 Profile & Level Display
- **User Profiles**: แสดงรูปโปรไฟล์และชื่อผู้ใช้
- **Membership Tiers**: แสดงระดับสมาชิกพร้อมสีและ badge
- **Verification Status**: แสดงสถานะการยืนยันตัวตน
- **Online Indicators**: จุดสีเขียวแสดงสถานะออนไลน์

### ❤️ Reaction System
- **Heart Reactions**: กดหัวใจได้แค่ครั้งเดียวต่อผู้ใช้
- **Multiple Emoji**: รองรับอีโมจิหลากหลาย (❤️, 👍, 😂, 😢, 😡)
- **Toggle Functionality**: กดซ้ำเพื่อยกเลิก reaction
- **Real-time Updates**: อัปเดต reaction แบบเรียลไทม์

### 🔗 Link & Media Support
- **Auto Link Detection**: ตรวจจับลิงก์อัตโนมัติ
- **YouTube Integration**: แสดงวิดีโอ YouTube แบบ embed
- **Image Preview**: แสดงตัวอย่างรูปภาพ
- **Video & Audio Support**: รองรับไฟล์วิดีโอและเสียง
- **File Attachments**: แนบไฟล์ได้หลายประเภท

### 🎨 Beautiful UI
- **Modern Design**: ดีไซน์ทันสมัยและสวยงาม
- **Gradient Backgrounds**: พื้นหลังไล่สีสวยงาม
- **Smooth Animations**: แอนิเมชันลื่นไหล
- **Responsive Layout**: รองรับทุกขนาดหน้าจอ
- **Glass Morphism**: เอฟเฟกต์กระจกโปร่งใส

## 🏗️ โครงสร้างระบบ

### Backend Components

#### Models
- **Message.js**: จัดการข้อความและ reactions
- **ChatRoom.js**: จัดการห้องแชท (มีอยู่แล้ว)
- **User.js**: จัดการข้อมูลผู้ใช้ (มีอยู่แล้ว)

#### Routes
- **messages.js**: API endpoints สำหรับข้อความ
- **chatroom.js**: API endpoints สำหรับห้องแชท (มีอยู่แล้ว)

#### Real-time Features
- **Socket.IO Server**: จัดการการเชื่อมต่อแบบเรียลไทม์
- **Room Management**: จัดการการเข้า-ออกห้องแชท
- **Message Broadcasting**: ส่งข้อความไปยังสมาชิกทั้งหมด
- **Reaction Updates**: อัปเดต reactions แบบเรียลไทม์

### Frontend Components

#### Main Components
- **RealTimeChat.jsx**: หน้าแชทหลัก
- **ChatRoomList.jsx**: รายการห้องแชท
- **MediaPreview.jsx**: แสดงตัวอย่าง media

#### Utilities
- **linkUtils.js**: ฟังก์ชันจัดการลิงก์และ media
- **CSS Animations**: แอนิเมชันสำหรับ chat UI

## 🚀 การติดตั้งและใช้งาน

### 1. ติดตั้ง Dependencies

#### Backend
```bash
cd backend
npm install socket.io
```

#### Frontend
```bash
cd frontend
npm install socket.io-client
```

### 2. การตั้งค่า Environment Variables

```env
# backend/.env
MONGODB_URI=mongodb://localhost:27017/sodeclick
FRONTEND_URL=http://localhost:5173
PORT=5000
```

```env
# frontend/.env
VITE_API_URL=http://localhost:5000
```

### 3. เริ่มต้นใช้งาน

#### เริ่ม Backend Server
```bash
cd backend
npm run dev
```

#### เริ่ม Frontend Development Server
```bash
cd frontend
npm run dev
```

## 📱 การใช้งาน

### สำหรับผู้ใช้

1. **เข้าสู่ระบบ**: ล็อกอินเพื่อเข้าใช้งานแชท
2. **เลือกห้องแชท**: เลือกห้องแชทจากรายการหรือสร้างห้องใหม่
3. **ส่งข้อความ**: พิมพ์ข้อความและกด Enter หรือปุ่มส่ง
4. **แนบไฟล์**: คลิกปุ่มแนบไฟล์เพื่อส่งรูปภาพหรือไฟล์
5. **React ข้อความ**: คลิกปุ่มอีโมจิเพื่อ react ข้อความ
6. **ตอบกลับ**: คลิกปุ่ม Reply เพื่อตอบกลับข้อความ

### สำหรับเจ้าของห้อง

1. **สร้างห้องแชท**: กำหนดชื่อ, คำอธิบาย, และการตั้งค่า
2. **จัดการสมาชิก**: เพิ่ม/ลบสมาชิก
3. **ลบข้อความ**: ลบข้อความที่ไม่เหมาะสม
4. **ตั้งค่าห้อง**: กำหนดข้อจำกัดอายุ, ค่าเข้าห้อง

## 🔧 API Endpoints

### Messages API

#### GET `/api/messages/:roomId`
ดึงข้อความในห้องแชท
- **Parameters**: `roomId`, `page`, `limit`, `userId`
- **Response**: รายการข้อความพร้อม pagination

#### POST `/api/messages`
ส่งข้อความใหม่
- **Body**: `content`, `senderId`, `chatRoomId`, `messageType`, `replyToId`
- **Files**: รองรับการแนบไฟล์

#### POST `/api/messages/:messageId/react`
เพิ่ม/ลบ reaction
- **Body**: `userId`, `reactionType`
- **Response**: สถานะ reaction ที่อัปเดต

#### PUT `/api/messages/:messageId`
แก้ไขข้อความ
- **Body**: `content`, `userId`
- **Restriction**: แก้ไขได้ภายใน 15 นาที

#### DELETE `/api/messages/:messageId`
ลบข้อความ
- **Body**: `userId`
- **Permission**: เจ้าของข้อความหรือเจ้าของห้อง

### Socket.IO Events

#### Client to Server
- `join-room`: เข้าร่วมห้องแชท
- `send-message`: ส่งข้อความ
- `react-message`: React ข้อความ
- `typing-start`: เริ่มพิมพ์
- `typing-stop`: หยุดพิมพ์
- `leave-room`: ออกจากห้อง

#### Server to Client
- `new-message`: ข้อความใหม่
- `message-reaction-updated`: อัปเดต reaction
- `user-typing`: ผู้ใช้กำลังพิมพ์
- `user-stop-typing`: ผู้ใช้หยุดพิมพ์
- `user-joined`: ผู้ใช้เข้าร่วม
- `user-left`: ผู้ใช้ออกจากห้อง
- `error`: ข้อผิดพลาด

## 🎨 UI Components และ Styling

### CSS Classes

#### Chat Bubbles
- `.chat-bubble-sent`: ข้อความที่ส่ง
- `.chat-bubble-received`: ข้อความที่รับ
- `.message-slide-in`: แอนิเมชันข้อความเข้า
- `.reaction-pop`: แอนิเมชัน reaction

#### Animations
- `.typing-dots`: แอนิเมชันจุดพิมพ์
- `.online-indicator`: แอนิเมชันสถานะออนไลน์
- `.emoji-reaction`: แอนิเมชัน emoji
- `.message-highlight`: ไฮไลท์ข้อความ

#### Media
- `.media-preview`: ตัวอย่าง media
- `.link-preview`: ตัวอย่างลิงก์
- `.file-upload-area`: พื้นที่อัปโหลดไฟล์

### Responsive Design
- รองรับหน้าจอมือถือ
- ปรับ layout อัตโนมัติ
- Touch-friendly interface

## 🔒 Security Features

### Message Validation
- ตรวจสอบความยาวข้อความ (สูงสุด 2000 ตัวอักษร)
- กรองเนื้อหาไม่เหมาะสม
- ป้องกัน XSS attacks

### File Upload Security
- จำกัดประเภทไฟล์
- จำกัดขนาดไฟล์ (สูงสุด 10MB)
- ตรวจสอบ MIME type

### Rate Limiting
- จำกัดจำนวนข้อความตาม membership tier
- ป้องกัน spam
- Cooldown period สำหรับ reactions

## 📊 Performance Optimization

### Database Indexing
- Index สำหรับ `chatRoom` และ `createdAt`
- Index สำหรับ `sender` และ `reactions.user`
- Compound indexes สำหรับ queries ที่ซับซ้อน

### Real-time Optimization
- Room-based message broadcasting
- Connection pooling
- Memory-efficient event handling

### Frontend Optimization
- Virtual scrolling สำหรับข้อความจำนวนมาก
- Lazy loading สำหรับ media
- Debounced typing indicators

## 🐛 Troubleshooting

### ปัญหาที่พบบ่อย

#### ไม่สามารถเชื่อมต่อ Socket.IO
```javascript
// ตรวจสอบ CORS settings
const io = socketIo(server, {
  cors: {
    origin: FRONTEND_URL.split(','),
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

#### ข้อความไม่แสดง
- ตรวจสอบการ populate ข้อมูล sender
- ตรวจสอบ permissions ของห้องแชท
- ตรวจสอบ network connectivity

#### Reactions ไม่อัปเดต
- ตรวจสอบ Socket.IO connection
- ตรวจสอบ event listeners
- ตรวจสอบ user permissions

## 🚀 Future Enhancements

### Planned Features
- [ ] Voice Messages
- [ ] Video Calls
- [ ] Message Search
- [ ] Message Threading
- [ ] Custom Emoji
- [ ] Message Encryption
- [ ] Push Notifications
- [ ] Message Translation
- [ ] Chat Backup/Export
- [ ] Advanced Moderation Tools

### Performance Improvements
- [ ] Message Caching
- [ ] CDN Integration
- [ ] Database Sharding
- [ ] Load Balancing
- [ ] WebRTC Integration

## 📝 License

This project is part of the Love Project application.

## 👥 Contributors

- Development Team
- UI/UX Design Team
- Backend Architecture Team

---

สำหรับข้อมูลเพิ่มเติมหรือการสนับสนุน กรุณาติดต่อทีมพัฒนา