# Admin Chat Management

## ✅ การตั้งค่าสิทธิ์ Admin ในการจัดการแชท

### 🎯 ความต้องการ
**ตั้งค่าให้ admin ลบ แชท / ห้องแชท / ห้องแชทส่วนตัว /รูป /ข้อความ**

### 🔧 การแก้ไขที่ทำ

**1. เพิ่ม API Routes ใน `backend/routes/admin.js`:**

**GET `/api/admin/chatrooms` - ดูรายการห้องแชททั้งหมด:**
```javascript
router.get('/chatrooms', requireAdmin, async (req, res) => {
  // รองรับการค้นหา, กรองตามประเภท, pagination
  // Admin สามารถดูห้องแชททั้งหมด (สาธารณะและส่วนตัว)
});
```

**DELETE `/api/admin/chatrooms/:roomId` - ลบห้องแชท:**
```javascript
router.delete('/chatrooms/:roomId', requireAdmin, async (req, res) => {
  // ลบข้อความทั้งหมดในห้อง
  await Message.deleteMany({ chatRoom: roomId });
  // ลบห้องแชท
  await ChatRoom.findByIdAndDelete(roomId);
});
```

**GET `/api/admin/messages` - ดูรายการข้อความทั้งหมด:**
```javascript
router.get('/messages', requireAdmin, async (req, res) => {
  // รองรับการค้นหา, กรองตามห้อง, ประเภทข้อความ, pagination
  // Admin สามารถดูข้อความทั้งหมด
});
```

**DELETE `/api/admin/messages/:messageId` - ลบข้อความ:**
```javascript
router.delete('/messages/:messageId', requireAdmin, async (req, res) => {
  // ลบข้อความเดี่ยว
  await Message.findByIdAndDelete(messageId);
});
```

**DELETE `/api/admin/messages/room/:roomId` - ลบข้อความทั้งหมดในห้อง:**
```javascript
router.delete('/messages/room/:roomId', requireAdmin, async (req, res) => {
  // ลบข้อความทั้งหมดในห้อง
  const result = await Message.deleteMany({ chatRoom: roomId });
});
```

**DELETE `/api/admin/images/:messageId` - ลบรูปภาพจากข้อความ:**
```javascript
router.delete('/images/:messageId', requireAdmin, async (req, res) => {
  // ลบไฟล์รูปภาพถ้ามี
  if (message.fileUrl) {
    const filePath = path.join(__dirname, '..', message.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  // ลบข้อความรูปภาพ
  await Message.findByIdAndDelete(messageId);
});
```

**DELETE `/api/admin/images/room/:roomId` - ลบรูปภาพทั้งหมดในห้อง:**
```javascript
router.delete('/images/room/:roomId', requireAdmin, async (req, res) => {
  // หาข้อความรูปภาพทั้งหมดในห้อง
  const imageMessages = await Message.find({ 
    chatRoom: roomId, 
    messageType: 'image',
    isDeleted: false 
  });
  
  // ลบไฟล์รูปภาพ
  for (const message of imageMessages) {
    if (message.fileUrl) {
      const filePath = path.join(__dirname, '..', message.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
  
  // ลบข้อความรูปภาพทั้งหมด
  const result = await Message.deleteMany({ 
    chatRoom: roomId, 
    messageType: 'image' 
  });
});
```

**2. สร้าง Frontend Component `frontend/src/components/AdminChatManagement.jsx`:**

**ฟีเจอร์หลัก:**
- **Tabs Interface**: แยกการจัดการห้องแชทและข้อความ
- **Search Functionality**: ค้นหาห้องแชทและข้อความ
- **Delete Confirmation**: Modal ยืนยันการลบ
- **Real-time Updates**: อัปเดตรายการหลังการลบ

**การจัดการห้องแชท:**
- ดูรายการห้องแชททั้งหมด (สาธารณะและส่วนตัว)
- แสดงข้อมูล: ชื่อ, ประเภท, เจ้าของ, จำนวนสมาชิก, จำนวนข้อความ
- ลบห้องแชท (จะลบข้อความและรูปภาพทั้งหมดด้วย)

**การจัดการข้อความ:**
- ดูรายการข้อความทั้งหมด
- แสดงข้อมูล: ผู้ส่ง, ห้อง, ประเภทข้อความ, เนื้อหา
- ลบข้อความเดี่ยว
- แยกประเภทข้อความ (text, image)

**3. เพิ่มใน AdminDashboard:**

**เพิ่ม Import:**
```javascript
import AdminChatManagement from './AdminChatManagement';
```

**เพิ่ม Navigation:**
```javascript
<Button 
  variant="outline" 
  className="w-full justify-start border-slate-200 hover:bg-slate-50"
  onClick={() => setCurrentView('chat')}
>
  <MessageCircle size={16} className="mr-2" />
  จัดการแชทและข้อความ
</Button>
```

**เพิ่ม Route:**
```javascript
case 'chat':
  return <AdminChatManagement />;
```

### 🚀 ผลลัพธ์

**✅ สิทธิ์ที่ Admin มี:**

**การจัดการห้องแชท:**
- ดูรายการห้องแชททั้งหมด (สาธารณะและส่วนตัว)
- ลบห้องแชทได้ (จะลบข้อความและรูปภาพทั้งหมดด้วย)
- ค้นหาห้องแชทได้
- ดูรายละเอียดห้องแชทได้

**การจัดการข้อความ:**
- ดูรายการข้อความทั้งหมด
- ลบข้อความเดี่ยวได้
- ลบข้อความทั้งหมดในห้องได้
- ค้นหาข้อความได้
- ดูรายละเอียดข้อความได้

**การจัดการรูปภาพ:**
- ลบรูปภาพเดี่ยวได้
- ลบรูปภาพทั้งหมดในห้องได้
- ลบไฟล์รูปภาพจากเซิร์ฟเวอร์ด้วย

### 🔒 การป้องกัน

**Admin ไม่สามารถ:**
- ❌ ลบ SuperAdmin ได้
- ❌ แก้ไข SuperAdmin ได้
- ❌ แบน SuperAdmin ได้
- ❌ ดูรายการ SuperAdmin ได้

**การยืนยันการลบ:**
- ✅ Modal ยืนยันการลบทุกครั้ง
- ✅ แสดงข้อมูลที่จะลบ
- ✅ แจ้งเตือนผลกระทบของการลบ

### 📁 ไฟล์ที่แก้ไข

**Backend:**
- `backend/routes/admin.js` - เพิ่ม API routes สำหรับจัดการแชท

**Frontend:**
- `frontend/src/components/AdminChatManagement.jsx` - สร้าง component ใหม่
- `frontend/src/components/AdminDashboard.jsx` - เพิ่ม navigation และ route

### 🎯 API Endpoints ที่เพิ่ม

**ห้องแชท:**
- `GET /api/admin/chatrooms` - ดูรายการห้องแชท
- `DELETE /api/admin/chatrooms/:roomId` - ลบห้องแชท

**ข้อความ:**
- `GET /api/admin/messages` - ดูรายการข้อความ
- `DELETE /api/admin/messages/:messageId` - ลบข้อความ
- `DELETE /api/admin/messages/room/:roomId` - ลบข้อความทั้งหมดในห้อง

**รูปภาพ:**
- `DELETE /api/admin/images/:messageId` - ลบรูปภาพ
- `DELETE /api/admin/images/room/:roomId` - ลบรูปภาพทั้งหมดในห้อง

### 🎉 สิทธิ์พิเศษ

- ✅ **Admin สามารถจัดการแชทได้อย่างสมบูรณ์**
- ✅ **รองรับการลบทั้งห้องแชทและข้อความ**
- ✅ **ลบไฟล์รูปภาพจากเซิร์ฟเวอร์ด้วย**
- ✅ **UI ที่ใช้งานง่ายและปลอดภัย**
- ✅ **การยืนยันการลบทุกครั้ง**
- ✅ **Real-time updates หลังการลบ**

---

**🎉 การตั้งค่า Admin Chat Management เสร็จสมบูรณ์แล้ว!**
