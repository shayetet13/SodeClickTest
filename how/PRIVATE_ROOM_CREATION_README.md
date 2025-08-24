# อัปเดตการสร้างห้องแชทส่วนตัวและแก้ไขสถานะออนไลน์

## 🎯 ฟีเจอร์ที่เพิ่ม

### ✅ 1. ปุ่มสร้างห้องแชทส่วนตัว
- **Platinum และ Diamond** สามารถสร้างห้องแชทส่วนตัวได้จากหน้าแชท
- ปุ่มแสดงเฉพาะสำหรับ tier ที่มีสิทธิ์
- Modal สำหรับกรอกข้อมูลห้องแชท

### ✅ 2. แก้ไขสถานะออนไลน์
- นับคนออนไลน์จาก user ที่เข้ามาใช้งานจริงๆ
- ใช้ Set เพื่อนับ unique users
- แสดงจำนวนคนออนไลน์ที่แม่นยำ

## 🔧 การแก้ไขที่ทำ

### 1. Frontend - เพิ่มปุ่มสร้างห้องแชทส่วนตัว (ChatRoomList.jsx)

#### เพิ่ม import:
```javascript
import { Plus } from 'lucide-react';
```

#### เพิ่ม prop สำหรับ onCreatePrivateRoom:
```javascript
const ChatRoomList = ({ currentUser, onSelectRoom, onCreatePrivateRoom }) => {
```

#### เพิ่มฟังก์ชันตรวจสอบสิทธิ์:
```javascript
const canCreatePrivateRoom = (tier) => {
  return tier === 'platinum' || tier === 'diamond';
};
```

#### เพิ่มปุ่มใน header:
```javascript
{(currentUser.role === 'superadmin' || canCreatePrivateRoom(currentUser.membership?.tier || 'member')) && (
  <button
    onClick={onCreatePrivateRoom}
    className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors"
  >
    <Plus className="h-4 w-4" />
    <span>สร้างห้องส่วนตัว</span>
  </button>
)}
```

### 2. สร้าง Component สำหรับสร้างห้องแชทส่วนตัว (CreatePrivateRoomModal.jsx)

#### ฟีเจอร์ของ Modal:
- **ชื่อห้องแชท** (required)
- **คำอธิบาย** (optional)
- **ค่าเข้า** (เหรียญ)
- **จำนวนสมาชิกสูงสุด**
- **ข้อจำกัดอายุ** (อายุขั้นต่ำ-สูงสุด)
- **การตั้งค่าเพิ่มเติม:**
  - อนุญาตให้ส่งของขวัญ
  - อนุญาตให้ส่งเหรียญ
  - เปิดการตรวจสอบข้อความ

#### การส่งข้อมูล:
```javascript
const response = await fetch(
  `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chatroom`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      name: formData.name,
      description: formData.description,
      type: 'private',
      ownerId: currentUser._id,
      entryFee: parseInt(formData.entryFee) || 0,
      settings: {
        maxMembers: parseInt(formData.maxMembers) || 100,
        allowGifts: formData.allowGifts,
        allowCoinGifts: formData.allowCoinGifts,
        moderationEnabled: formData.moderationEnabled
      },
      ageRestriction: {
        minAge: parseInt(formData.minAge) || 18,
        maxAge: parseInt(formData.maxAge) || 100
      }
    })
  }
);
```

### 3. แก้ไข App.tsx เพื่อจัดการ Modal

#### เพิ่ม state:
```javascript
const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)
```

#### เพิ่ม prop ให้ ChatRoomList:
```javascript
<ChatRoomList
  currentUser={user}
  onSelectRoom={handleSelectRoom}
  onCreatePrivateRoom={() => setShowCreateRoomModal(true)}
/>
```

#### เพิ่ม Modal:
```javascript
<CreatePrivateRoomModal
  isOpen={showCreateRoomModal}
  onClose={() => setShowCreateRoomModal(false)}
  onCreateRoom={handleCreatePrivateRoom}
  currentUser={user}
/>
```

### 4. Backend - แก้ไขการนับคนออนไลน์ (chatroom.js)

#### แก้ไข endpoint `/online-users`:
```javascript
// ดึงข้อมูลคนออนไลน์จาก Socket.IO server
const io = req.app.get('io');
const roomUsers = io.sockets.adapter.rooms.get(roomId);

let onlineUsers = [];
let onlineCount = 0;

if (roomUsers) {
  const socketIds = Array.from(roomUsers);
  const uniqueUserIds = new Set();
  
  socketIds.forEach(socketId => {
    const socket = io.sockets.sockets.get(socketId);
    if (socket && socket.userId) {
      uniqueUserIds.add(socket.userId);
      onlineUsers.push({
        userId: socket.userId,
        socketId: socketId,
        lastSeen: new Date()
      });
    }
  });
  
  onlineCount = uniqueUserIds.size;
}
```

### 5. Backend - เพิ่ม debug logs (server.js)

#### เพิ่ม console.log สำหรับติดตามคนออนไลน์:
```javascript
console.log(`📊 Room ${roomId} online count: ${onlineCount} users`);
console.log(`📊 Room ${roomId} online count updated: ${onlineCount} users`);
```

## 🎯 ผลลัพธ์

### ✅ หลังการแก้ไข:

#### 1. การสร้างห้องแชทส่วนตัว:
- **ปุ่มแสดงเฉพาะ:** Platinum, Diamond, และ SuperAdmin
- **Modal ที่สมบูรณ์:** มีฟอร์มครบถ้วนสำหรับสร้างห้องแชท
- **การตั้งค่าที่หลากหลาย:** สามารถกำหนดค่าเข้า, จำนวนสมาชิก, ข้อจำกัดอายุ, และการตั้งค่าอื่นๆ
- **การจัดการข้อมูล:** ส่งข้อมูลไปยัง API และจัดการ response

#### 2. การนับคนออนไลน์:
- **นับ unique users:** ใช้ Set เพื่อนับคนออนไลน์ที่ไม่ซ้ำกัน
- **ข้อมูลที่แม่นยำ:** นับจาก user ที่เข้ามาใช้งานจริงๆ
- **Debug logs:** มี console.log สำหรับติดตามการทำงาน
- **Real-time updates:** อัปเดตข้อมูลแบบ Real-time

### 🔧 การทำงาน:
1. **เมื่อโหลดหน้าแชท:** ตรวจสอบ tier ของผู้ใช้และแสดงปุ่มสร้างห้องถ้ามีสิทธิ์
2. **เมื่อคลิกปุ่มสร้าง:** เปิด Modal สำหรับกรอกข้อมูลห้องแชท
3. **เมื่อส่งฟอร์ม:** ส่งข้อมูลไปยัง API และสร้างห้องแชทใหม่
4. **การนับคนออนไลน์:** ใช้ Set เพื่อนับ unique users และส่งข้อมูลกลับ
5. **Debug และติดตาม:** มี console.log สำหรับติดตามการทำงาน

## 📁 ไฟล์ที่แก้ไข

### Frontend:
- `frontend/src/components/ChatRoomList.jsx` - เพิ่มปุ่มสร้างห้องแชทส่วนตัว
- `frontend/src/components/CreatePrivateRoomModal.jsx` - สร้าง Modal สำหรับสร้างห้องแชท
- `frontend/src/App.tsx` - เพิ่มการจัดการ Modal และ state

### Backend:
- `backend/routes/chatroom.js` - แก้ไขการนับคนออนไลน์
- `backend/server.js` - เพิ่ม debug logs

## 🎉 สรุป

การแก้ไขนี้ทำให้:
- **Platinum และ Diamond** สามารถสร้างห้องแชทส่วนตัวได้จากหน้าแชท
- **Modal ที่สมบูรณ์** สำหรับกรอกข้อมูลห้องแชท
- **การนับคนออนไลน์ที่แม่นยำ** จาก user ที่เข้ามาใช้งานจริงๆ
- **UI ที่ใช้งานง่าย** และมีฟีเจอร์ครบถ้วน
- **Debug และติดตาม** การทำงานของระบบ

---

**🎉 อัปเดตเสร็จสมบูรณ์แล้ว!**
