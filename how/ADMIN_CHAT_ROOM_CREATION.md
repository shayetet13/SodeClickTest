# Admin Chat Room Creation System

## 🎯 ฟีเจอร์ที่เพิ่ม

**Admin สามารถสร้างห้องแชทให้ User เข้าไปแชทได้ โดยมีเงื่อนไข:**
1. **จำนวนเหรียญ** - กำหนดจำนวนเหรียญที่ต้องมี
2. **เข้าได้เลย ถ้าไม่มีเงื่อนไขอะไร** - ไม่มีเงื่อนไขพิเศษ
3. **เสียเงินจริง ตามจำนวนที่ใส่** - ต้องชำระเงินจริง
4. **สร้าง link เชิญเข้าห้องแชทได้** - สร้าง invite link

## 🔧 การแก้ไขที่ทำ

### 1. ปรับปรุง ChatRoom Model

**เพิ่มฟิลด์ใหม่ใน `backend/models/ChatRoom.js`:**

```javascript
// เงื่อนไขการเข้าห้องแชท
entryConditions: {
  // จำนวนเหรียญที่ต้องมี
  requiredCoins: {
    type: Number,
    default: 0,
    min: 0
  },
  // เงื่อนไขพิเศษ (เช่น ต้องเป็น Premium, ต้องมีอายุขั้นต่ำ)
  specialConditions: {
    type: String,
    default: ''
  },
  // ต้องเสียเงินจริงหรือไม่
  requireRealPayment: {
    type: Boolean,
    default: false
  },
  // จำนวนเงินที่ต้องเสีย (บาท)
  realPaymentAmount: {
    type: Number,
    default: 0,
    min: 0
  }
},

// Invite link
inviteLink: {
  code: {
    type: String,
    unique: true,
    sparse: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date
  },
  maxUses: {
    type: Number,
    default: -1 // -1 = ไม่จำกัด
  },
  usedCount: {
    type: Number,
    default: 0
  }
}
```

### 2. เพิ่ม API Routes

**ใน `backend/routes/admin.js`:**

#### POST `/api/admin/chatrooms/create` - สร้างห้องแชทใหม่
```javascript
router.post('/chatrooms/create', requireAdmin, async (req, res) => {
  // สร้างห้องแชทพร้อมเงื่อนไขต่างๆ
  // รองรับ: entryConditions, inviteLink, settings
});
```

#### POST `/api/admin/chatrooms/:roomId/invite-link` - สร้าง invite link
```javascript
router.post('/chatrooms/:roomId/invite-link', requireAdmin, async (req, res) => {
  // สร้าง invite link สำหรับห้องแชท
});
```

#### GET `/api/admin/chatrooms/:roomId/invite-link` - ดู invite link
```javascript
router.get('/chatrooms/:roomId/invite-link', requireAdmin, async (req, res) => {
  // ดูข้อมูล invite link
});
```

#### DELETE `/api/admin/chatrooms/:roomId/invite-link` - ลบ invite link
```javascript
router.delete('/chatrooms/:roomId/invite-link', requireAdmin, async (req, res) => {
  // ลบ invite link
});
```

#### POST `/api/admin/chatrooms/join-by-invite` - เข้าร่วมห้องด้วย invite link
```javascript
router.post('/chatrooms/join-by-invite', async (req, res) => {
  // ตรวจสอบเงื่อนไขและเข้าร่วมห้อง
});
```

### 3. สร้าง Frontend Components

#### `frontend/src/components/AdminCreateChatRoom.jsx`
**ฟีเจอร์:**
- **4 Tabs Interface:**
  - ข้อมูลพื้นฐาน (ชื่อ, คำอธิบาย, ประเภท, ค่าเข้าห้อง)
  - เงื่อนไข (เหรียญ, เงื่อนไขพิเศษ, เงินจริง, อายุ)
  - การตั้งค่า (สมาชิกสูงสุด, ของขวัญ, การตรวจสอบ)
  - Invite Link (สร้างลิงก์, วันหมดอายุ, จำนวนครั้งใช้)

- **Form Validation:**
  - ตรวจสอบข้อมูลที่จำเป็น
  - แสดง error messages
  - Loading states

- **Success Page:**
  - แสดงข้อมูลห้องที่สร้าง
  - แสดง invite link
  - ปุ่มคัดลอกลิงก์

#### `frontend/src/components/JoinChatRoom.jsx`
**ฟีเจอร์:**
- **ตรวจสอบเงื่อนไข:**
  - จำนวนเหรียญ
  - เงื่อนไขพิเศษ (Premium, Gold)
  - การเสียเงินจริง

- **แสดงข้อมูล:**
  - ข้อมูลห้องแชท
  - เงื่อนไขการเข้าห้อง
  - สถานะผู้ใช้

- **การเข้าร่วม:**
  - ตรวจสอบเงื่อนไขก่อนเข้าร่วม
  - แสดงข้อผิดพลาดถ้าไม่ผ่านเงื่อนไข

### 4. เพิ่มใน AdminDashboard

**เพิ่มปุ่ม "สร้างห้องแชทใหม่" ในหน้า Admin Dashboard**

### 5. เพิ่ม Route

**เพิ่ม route `/join/:inviteCode` ใน `frontend/src/main.tsx`**

## 🎯 เงื่อนไขที่รองรับ

### 1. จำนวนเหรียญ
- กำหนดจำนวนเหรียญขั้นต่ำที่ต้องมี
- ตรวจสอบเหรียญของผู้ใช้ก่อนเข้าร่วม

### 2. เงื่อนไขพิเศษ
- Premium membership
- Gold membership
- อายุขั้นต่ำ/สูงสุด
- เงื่อนไขอื่นๆ (ข้อความอิสระ)

### 3. การเสียเงินจริง
- เปิด/ปิดการเสียเงินจริง
- กำหนดจำนวนเงิน (บาท)
- เชื่อมต่อกับระบบการชำระเงิน

### 4. Invite Link
- สร้างลิงก์อัตโนมัติ
- กำหนดวันหมดอายุ
- กำหนดจำนวนครั้งที่ใช้
- ติดตามการใช้งาน

## 🚀 การใช้งาน

### สำหรับ Admin:
1. เข้าไปที่ Admin Dashboard
2. คลิก "สร้างห้องแชทใหม่"
3. กรอกข้อมูลใน 4 tabs
4. กด "สร้างห้องแชท"
5. คัดลอก invite link

### สำหรับ User:
1. คลิกลิงก์ invite
2. ตรวจสอบเงื่อนไข
3. กด "เข้าร่วมห้อง"
4. เข้าไปแชทได้เลย

## 🔒 การตรวจสอบเงื่อนไข

### ระบบตรวจสอบ:
1. **เหรียญ:** ตรวจสอบ `user.coins >= requiredCoins`
2. **Membership:** ตรวจสอบ `user.membership.tier`
3. **อายุ:** ตรวจสอบ `user.age` กับ `ageRestriction`
4. **เงินจริง:** เชื่อมต่อระบบการชำระเงิน
5. **Invite Link:** ตรวจสอบวันหมดอายุและจำนวนครั้งใช้

### Error Messages:
- "ต้องมีเหรียญอย่างน้อย X เหรียญ"
- "ต้องเป็นสมาชิก Premium"
- "ต้องเป็นสมาชิก Gold"
- "ต้องชำระเงิน X บาท"
- "Invite link หมดอายุแล้ว"
- "Invite link ใช้ครบจำนวนแล้ว"

## 📁 ไฟล์ที่แก้ไข

### Backend:
- `backend/models/ChatRoom.js` - เพิ่มฟิลด์ใหม่
- `backend/routes/admin.js` - เพิ่ม API routes

### Frontend:
- `frontend/src/components/AdminCreateChatRoom.jsx` - สร้างใหม่
- `frontend/src/components/JoinChatRoom.jsx` - สร้างใหม่
- `frontend/src/components/AdminDashboard.jsx` - เพิ่มปุ่ม
- `frontend/src/main.tsx` - เพิ่ม route

## 🎉 ผลลัพธ์

### ✅ ฟีเจอร์ที่ได้:
- Admin สร้างห้องแชทได้
- กำหนดเงื่อนไขการเข้าห้องได้
- สร้าง invite link ได้
- User เข้าร่วมด้วยลิงก์ได้
- ตรวจสอบเงื่อนไขอัตโนมัติ
- UI ที่ใช้งานง่าย

### 🔧 การปรับแต่ง:
- รองรับเงื่อนไขหลากหลาย
- ระบบ invite link ที่ยืดหยุ่น
- การตรวจสอบที่ครอบคลุม
- Error handling ที่ดี

---

**🎉 ระบบ Admin Chat Room Creation เสร็จสมบูรณ์แล้ว!**
