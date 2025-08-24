# Admin และ SuperAdmin Permissions

## ✅ การตั้งค่าสิทธิ์ Admin และ SuperAdmin

### 🎯 ความต้องการ
1. **Admin ไม่สามารถลบ/แบน/แก้ไข/ดู SuperAdmin ได้**
2. **Admin มีสิทธิ์อะไร SuperAdmin ต้องเห็นและใช้งานได้หมด**

### 🔧 การแก้ไขที่ทำ

**1. แก้ไข `backend/routes/admin.js` - ซ่อน SuperAdmin จากรายการผู้ใช้:**
```javascript
// Admin ไม่สามารถดู SuperAdmin ได้ (ซ่อน SuperAdmin จากรายการ)
if (req.user.role === 'admin') {
  query.role = { $ne: 'superadmin' };
}
```

**2. แก้ไข `backend/routes/admin.js` - ป้องกันการแก้ไข SuperAdmin:**
```javascript
// Admin ไม่สามารถแก้ไข SuperAdmin ได้
if (req.user.role === 'admin' && targetUser.role === 'superadmin') {
  return res.status(403).json({ 
    message: 'Cannot modify SuperAdmin user',
    error: 'Admin users cannot modify SuperAdmin accounts'
  });
}
```

**3. แก้ไข `backend/routes/admin.js` - ป้องกันการแบน SuperAdmin:**
```javascript
// Admin ไม่สามารถแบน SuperAdmin ได้
if (req.user.role === 'admin' && targetUser.role === 'superadmin') {
  return res.status(403).json({ 
    message: 'Cannot ban SuperAdmin user',
    error: 'Admin users cannot ban SuperAdmin accounts'
  });
}
```

**4. แก้ไข `backend/routes/admin.js` - ป้องกันการแก้ไข role ของ SuperAdmin:**
```javascript
// Admin ไม่สามารถแก้ไข role ของ SuperAdmin ได้
if (req.user.role === 'admin' && targetUser.role === 'superadmin') {
  return res.status(403).json({ 
    message: 'Cannot modify SuperAdmin role',
    error: 'Admin users cannot modify SuperAdmin roles'
  });
}
```

**5. แก้ไข `backend/routes/admin.js` - ป้องกันการแก้ไข membership ของ SuperAdmin:**
```javascript
// Admin ไม่สามารถแก้ไข membership ของ SuperAdmin ได้
if (req.user.role === 'admin' && targetUser.role === 'superadmin') {
  return res.status(403).json({ 
    message: 'Cannot modify SuperAdmin membership',
    error: 'Admin users cannot modify SuperAdmin memberships'
  });
}
```

**6. แก้ไข `backend/routes/admin.js` - ป้องกันการดูรายละเอียด SuperAdmin:**
```javascript
// Admin ไม่สามารถดูรายละเอียด SuperAdmin ได้
if (req.user.role === 'admin' && user.role === 'superadmin') {
  return res.status(403).json({ 
    message: 'Cannot view SuperAdmin details',
    error: 'Admin users cannot view SuperAdmin account details'
  });
}
```

**7. แก้ไข `backend/routes/admin.js` - ป้องกันการดูโปรไฟล์ SuperAdmin:**
```javascript
// Admin ไม่สามารถดูรายละเอียดโปรไฟล์ SuperAdmin ได้
if (req.user.role === 'admin' && user.role === 'superadmin') {
  return res.status(403).json({ 
    message: 'Cannot view SuperAdmin profile',
    error: 'Admin users cannot view SuperAdmin profile details'
  });
}
```

**8. แก้ไข `backend/routes/admin.js` - ซ่อน SuperAdmin จากรายการผู้ใช้ที่ถูกแบน:**
```javascript
// Admin ไม่สามารถดู SuperAdmin ที่ถูกแบนได้
if (req.user.role === 'admin') {
  query.role = { $ne: 'superadmin' };
}
```

### 🚀 ผลลัพธ์

**👑 SuperAdmin สามารถ:**

✅ **ดูรายการผู้ใช้ทั้งหมด**
- ดูรายการผู้ใช้ทั้งหมด (รวม Admin และ SuperAdmin)
- ดูรายการผู้ใช้ที่ถูกแบนทั้งหมด

✅ **ดูรายละเอียดผู้ใช้ทั้งหมด**
- ดูรายละเอียดผู้ใช้ทั้งหมด
- ดูโปรไฟล์ผู้ใช้ทั้งหมด

✅ **แก้ไขผู้ใช้ทั้งหมด**
- แก้ไขข้อมูลผู้ใช้ทั้งหมด
- แก้ไข role ทั้งหมด (ยกเว้น SuperAdmin อื่น)
- แก้ไข membership ทั้งหมด (ยกเว้น SuperAdmin อื่น)

✅ **แบนผู้ใช้ทั้งหมด**
- แบนผู้ใช้ทั้งหมด (ยกเว้น SuperAdmin อื่น)
- ตั้งเวลาการแบน

✅ **ลบผู้ใช้ทั้งหมด**
- ลบผู้ใช้ทั้งหมด (ยกเว้น SuperAdmin อื่น)

**👨‍💼 Admin สามารถ:**

✅ **ดูรายการผู้ใช้ (จำกัด)**
- ดูรายการผู้ใช้ (ยกเว้น SuperAdmin)
- ดูรายการผู้ใช้ที่ถูกแบน (ยกเว้น SuperAdmin)

✅ **ดูรายละเอียดผู้ใช้ (จำกัด)**
- ดูรายละเอียดผู้ใช้ (ยกเว้น SuperAdmin)
- ดูโปรไฟล์ผู้ใช้ (ยกเว้น SuperAdmin)

✅ **แก้ไขผู้ใช้ (จำกัด)**
- แก้ไขข้อมูลผู้ใช้ (ยกเว้น SuperAdmin)
- แก้ไข role (ยกเว้น SuperAdmin)
- แก้ไข membership (ยกเว้น SuperAdmin)

✅ **แบนผู้ใช้ (จำกัด)**
- แบนผู้ใช้ (ยกเว้น SuperAdmin)
- ตั้งเวลาการแบน

❌ **ลบผู้ใช้**
- ไม่มีสิทธิ์ลบผู้ใช้

### 🔒 การป้องกัน

**Admin ไม่สามารถ:**
- ❌ ดูรายการ SuperAdmin
- ❌ ดูรายละเอียด SuperAdmin
- ❌ แก้ไขข้อมูล SuperAdmin
- ❌ แบน SuperAdmin
- ❌ แก้ไข role ของ SuperAdmin
- ❌ แก้ไข membership ของ SuperAdmin
- ❌ ลบผู้ใช้ใดๆ

**SuperAdmin ไม่สามารถ:**
- ❌ ลบ SuperAdmin อื่น

### 📁 ไฟล์ที่แก้ไข

**`backend/routes/admin.js`:**
1. **`GET /users`** - ซ่อน SuperAdmin จากรายการผู้ใช้สำหรับ Admin
2. **`GET /users/:id`** - ป้องกันการดูรายละเอียด SuperAdmin
3. **`GET /users/:id/profile`** - ป้องกันการดูโปรไฟล์ SuperAdmin
4. **`PUT /users/:id`** - ป้องกันการแก้ไข SuperAdmin
5. **`PATCH /users/:id/ban`** - ป้องกันการแบน SuperAdmin
6. **`PATCH /users/:id/ban-duration`** - ป้องกันการแบน SuperAdmin
7. **`PATCH /users/:id/role`** - ป้องกันการแก้ไข role ของ SuperAdmin
8. **`PATCH /users/:id/membership`** - ป้องกันการแก้ไข membership ของ SuperAdmin
9. **`DELETE /users/:id`** - ป้องกันการลบ SuperAdmin
10. **`GET /banned-users`** - ซ่อน SuperAdmin จากรายการผู้ใช้ที่ถูกแบน

### 🎯 สิทธิ์พิเศษ

- ✅ **SuperAdmin มีสิทธิ์สูงสุดในระบบ**
- ✅ **SuperAdmin สามารถจัดการ Admin ได้**
- ✅ **Admin มีสิทธิ์จำกัด (ไม่สามารถจัดการ SuperAdmin)**
- ✅ **Admin สามารถจัดการผู้ใช้ทั่วไปได้**
- ✅ **ระบบป้องกันการเข้าถึงที่ไม่ได้รับอนุญาต**

---

**🎉 การตั้งค่าสิทธิ์ Admin และ SuperAdmin เสร็จสมบูรณ์แล้ว!**
