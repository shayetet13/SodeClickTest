# Chat Link & YouTube Feature - ข้อ 6

## 🎯 ฟีเจอร์ที่เพิ่ม

**ข้อ 6: ใส่ link ได้ และ ใส่ link youtube ได้**

### ✅ ฟีเจอร์ที่ได้:
1. **Link Button** - ปุ่มเพิ่มลิงก์ทั่วไป
2. **YouTube Button** - ปุ่มเพิ่มลิงก์ YouTube โดยเฉพาะ
3. **Link Validation** - ตรวจสอบความถูกต้องของ YouTube URL
4. **Enhanced Display** - แสดงลิงก์และ YouTube embed ที่สวยงาม
5. **Visual Icons** - ไอคอนสำหรับ YouTube และลิงก์ทั่วไป

## 🔧 การแก้ไขที่ทำ

### 1. เพิ่มปุ่ม YouTube

**ไฟล์:** `frontend/src/components/RealTimeChat.jsx`

```jsx
{/* YouTube Button */}
<Button 
  size="icon" 
  variant="ghost" 
  onClick={() => {
    const url = prompt('ใส่ลิงก์ YouTube ที่ต้องการ:');
    if (url && url.trim()) {
      // ตรวจสอบว่าเป็น YouTube URL หรือไม่
      const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
      if (youtubeRegex.test(url)) {
        setNewMessage(prev => prev + ' ' + url.trim());
      } else {
        alert('กรุณาใส่ลิงก์ YouTube ที่ถูกต้อง (เช่น https://www.youtube.com/watch?v=VIDEO_ID หรือ https://youtu.be/VIDEO_ID)');
      }
    }
  }}
  className="text-red-500 hover:text-red-700"
  title="เพิ่มลิงก์ YouTube"
>
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
</Button>
```

### 2. ปรับปรุงฟังก์ชัน detectLinks

```javascript
const detectLinks = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (urlRegex.test(part)) {
      // ตรวจสอบ YouTube URL
      const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
      const youtubeMatch = part.match(youtubeRegex);
      
      if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        return (
          <div key={index} className="mt-2 space-y-2">
            <a
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-700 underline flex items-center space-x-1"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YouTube Video</span>
            </a>
            <div className="bg-gray-100 rounded-lg p-2">
              <iframe
                width="280"
                height="157"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-sm"
              ></iframe>
            </div>
          </div>
        );
      }
      
      // ตรวจสอบ URL ทั่วไป
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline flex items-center space-x-1"
        >
          <Link className="h-4 w-4" />
          <span>{part}</span>
        </a>
      );
    }
    return part;
  });
};
```

### 3. Link Button ที่มีอยู่แล้ว

```jsx
{/* Link Button */}
<Button 
  size="icon" 
  variant="ghost" 
  onClick={() => {
    const url = prompt('ใส่ลิงก์ที่ต้องการ:');
    if (url && url.trim()) {
      setNewMessage(prev => prev + ' ' + url.trim());
    }
  }}
  className="text-gray-500 hover:text-gray-700"
  title="เพิ่มลิงก์"
>
  <Link className="h-5 w-5" />
</Button>
```

## 🎯 ผลลัพธ์

### ✅ หลังการแก้ไข:
- **Link Button:** ปุ่มเพิ่มลิงก์ทั่วไป (สีเทา)
- **YouTube Button:** ปุ่มเพิ่มลิงก์ YouTube โดยเฉพาะ (สีแดง)
- **Link Validation:** ตรวจสอบความถูกต้องของ YouTube URL
- **Enhanced Display:** แสดงลิงก์และ YouTube embed ที่สวยงาม
- **Visual Icons:** ไอคอนสำหรับ YouTube และลิงก์ทั่วไป

### 🔧 การทำงาน:
- **Link Button:** คลิกเพื่อเพิ่มลิงก์ทั่วไป
- **YouTube Button:** คลิกเพื่อเพิ่มลิงก์ YouTube พร้อมตรวจสอบความถูกต้อง
- **Link Display:** 
  - ลิงก์ทั่วไป: แสดงด้วยไอคอน Link และสีน้ำเงิน
  - YouTube: แสดงด้วยไอคอน YouTube สีแดง และ embed video
- **URL Validation:** ตรวจสอบรูปแบบ YouTube URL ก่อนเพิ่ม
- **Embed Video:** แสดง YouTube video ใน iframe

## 📁 ไฟล์ที่แก้ไข

### Frontend:
- `frontend/src/components/RealTimeChat.jsx` - เพิ่มปุ่ม YouTube และปรับปรุงการแสดงลิงก์

## 🎉 สรุป

การแก้ไขนี้ทำให้:
- มีปุ่มเพิ่มลิงก์ทั่วไปและ YouTube แยกกัน
- ตรวจสอบความถูกต้องของ YouTube URL
- แสดงลิงก์และ YouTube embed ที่สวยงาม
- มีไอคอนที่เหมาะสมสำหรับแต่ละประเภทลิงก์
- YouTube video แสดงใน iframe ที่สวยงาม

---

**🎉 ข้อ 6 เสร็จสมบูรณ์แล้ว!**

## 🎊 สรุปทั้งหมด

### ✅ ฟีเจอร์ที่เสร็จสมบูรณ์แล้ว:

1. **ข้อ 1:** ✅ ห้องแชทสามารถเพิ่มรูปภาพได้และลบได้ก่อน 3 วินาที
2. **ข้อ 2:** ✅ รูปภาพให้เป็นรูปเล็กสมสัดส่วน
3. **ข้อ 3:** ✅ สามารถกดดูรูปใหญ่ได้
4. **ข้อ 4:** ✅ มีปุ่ม link และตอบกลับ
5. **ข้อ 5:** ✅ มีอีโมจิ
6. **ข้อ 6:** ✅ like สามารถกดได้แค่ 1 ครั้งต่อ 1 user นั้นๆ หากกดอีกที่คือยกเลิก
7. **ข้อ 7:** ✅ ใส่ link ได้และใส่ link youtube ได้

**🎉 ทั้งหมด 7 ข้อเสร็จสมบูรณ์แล้ว!**
