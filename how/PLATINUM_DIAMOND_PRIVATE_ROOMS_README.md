# อัปเดตสิทธิ์ Platinum/Diamond และการแสดงคนออนไลน์

## 🎯 ฟีเจอร์ที่เพิ่ม

### ✅ 1. สิทธิ์การสร้างห้องแชทส่วนตัว
- **Platinum และ Diamond** สามารถสร้างห้องแชทส่วนตัวได้ไม่จำกัดคน
- **Tier อื่นๆ** ไม่สามารถสร้างห้องแชทส่วนตัวได้

### ✅ 2. การแสดงคนออนไลน์ในรายการห้องแชท
- แสดงจำนวนคนออนไลน์ข้างๆ ห้องแชท
- ใช้สีเขียวที่ตัดกับพื้นหลัง
- มี animation pulse สำหรับจุดสีเขียว

## 🔧 การแก้ไขที่ทำ

### 1. Backend - อัปเดตสิทธิ์การสร้างห้องส่วนตัว (User.js)

#### เพิ่มสิทธิ์ให้ Platinum และ Diamond:
```javascript
diamond: {
  dailyChats: 500,
  dailyImages: -1, // unlimited
  dailyVideos: -1, // unlimited
  dailyBonus: 50000,
  spinInterval: 20 * 60 * 1000, // 20 minutes
  canTransferCoins: true,
  canHideOnlineStatus: true,
  chatRoomLimit: -1, // unlimited
  canCreatePrivateRooms: true,        // ✅ เพิ่มสิทธิ์
  privateRoomMemberLimit: -1          // ✅ ไม่จำกัดคน
},
platinum: {
  dailyChats: -1, // unlimited
  dailyImages: -1, // unlimited
  dailyVideos: -1, // unlimited
  dailyBonus: 100000,
  spinInterval: 10 * 60 * 1000, // 10 minutes
  canTransferCoins: true,
  canHideOnlineStatus: true,
  chatRoomLimit: -1, // unlimited
  canCreatePrivateRooms: true,        // ✅ เพิ่มสิทธิ์
  privateRoomMemberLimit: -1          // ✅ ไม่จำกัดคน
}
```

#### กำหนดสิทธิ์ให้ Tier อื่นๆ:
```javascript
// ทุก tier อื่นๆ (member, silver, gold, vip, vip1, vip2)
canCreatePrivateRooms: false,
privateRoomMemberLimit: 0
```

### 2. Frontend - แสดงคนออนไลน์ในรายการห้องแชท (ChatRoomList.jsx)

#### เพิ่ม State สำหรับเก็บข้อมูลคนออนไลน์:
```javascript
const [onlineUsers, setOnlineUsers] = useState({}); // roomId -> onlineCount
```

#### เพิ่มฟังก์ชันดึงข้อมูลคนออนไลน์:
```javascript
const fetchOnlineUsers = async () => {
  try {
    const onlineData = {};
    
    // ดึงข้อมูลคนออนไลน์สำหรับทุกห้อง
    for (const room of chatRooms) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chatroom/${room.id}/online-users?userId=${currentUser._id}`,
          {
            credentials: 'include'
          }
        );
        const data = await response.json();
        
        if (data.success) {
          onlineData[room.id] = data.data.onlineCount;
        } else {
          onlineData[room.id] = 0;
        }
      } catch (error) {
        console.error(`Error fetching online users for room ${room.id}:`, error);
        onlineData[room.id] = 0;
      }
    }
    
    setOnlineUsers(onlineData);
  } catch (error) {
    console.error('Error fetching online users:', error);
  }
};
```

#### เพิ่มการแสดงคนออนไลน์ใน UI:
```javascript
<div className="flex items-center space-x-1">
  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
  <span className="text-green-600 font-medium">{onlineUsers[room.id] || 0} ออนไลน์</span>
</div>
```

## 🎯 ผลลัพธ์

### ✅ หลังการแก้ไข:

#### 1. สิทธิ์การสร้างห้องส่วนตัว:
- **Platinum:** ✅ สามารถสร้างห้องส่วนตัวได้ไม่จำกัดคน
- **Diamond:** ✅ สามารถสร้างห้องส่วนตัวได้ไม่จำกัดคน
- **Tier อื่นๆ:** ❌ ไม่สามารถสร้างห้องส่วนตัวได้

#### 2. การแสดงคนออนไลน์:
- **สีเขียว:** ใช้ `bg-green-500` และ `text-green-600` ที่ตัดกับพื้นหลัง
- **Animation:** จุดสีเขียวมี `animate-pulse` effect
- **ตำแหน่ง:** แสดงระหว่างจำนวนสมาชิกและจำนวนข้อความ
- **Real-time:** อัปเดตข้อมูลคนออนไลน์เมื่อโหลดรายการห้องแชท

### 🔧 การทำงาน:
1. **เมื่อโหลดรายการห้องแชท:** ระบบจะดึงข้อมูลคนออนไลน์สำหรับทุกห้อง
2. **แสดงข้อมูล:** แสดงจำนวนคนออนไลน์พร้อมจุดสีเขียวที่มี animation
3. **สิทธิ์การสร้างห้อง:** ตรวจสอบ tier ของผู้ใช้เพื่อกำหนดสิทธิ์การสร้างห้องส่วนตัว
4. **Error Handling:** จัดการกรณีที่ไม่สามารถดึงข้อมูลคนออนไลน์ได้

## 📁 ไฟล์ที่แก้ไข

### Backend:
- `backend/models/User.js` - เพิ่มสิทธิ์การสร้างห้องส่วนตัวสำหรับ Platinum และ Diamond

### Frontend:
- `frontend/src/components/ChatRoomList.jsx` - เพิ่มการแสดงคนออนไลน์ในรายการห้องแชท

## 🎉 สรุป

การแก้ไขนี้ทำให้:
- **Platinum และ Diamond** มีสิทธิ์พิเศษในการสร้างห้องแชทส่วนตัวไม่จำกัดคน
- **ผู้ใช้ทั่วไป** เห็นจำนวนคนออนไลน์ในแต่ละห้องแชทแบบ Real-time
- **UI ที่สวยงาม** ด้วยสีเขียวที่ตัดกับพื้นหลังและ animation ที่น่าสนใจ
- **ระบบสิทธิ์ที่ชัดเจน** ระหว่าง tier ต่างๆ

---

**🎉 อัปเดตเสร็จสมบูรณ์แล้ว!**
