# QR Code Payment System สำหรับระบบสมาชิก

## ภาพรวม

ระบบ QR Code Payment ที่สร้างขึ้นเพื่อรองรับการชำระเงินสำหรับการอัปเกรดสมาชิก โดยใช้มาตรฐาน PromptPay และ EMV QR Code

## คุณสมบัติหลัก

### 🎯 ฟีเจอร์หลัก
- **QR Code Generation**: สร้าง QR Code ตามมาตรฐาน PromptPay
- **Real-time Payment Tracking**: ตรวจสอบสถานะการชำระเงินแบบ Real-time
- **Multi-bank Support**: รองรับธนาคารหลักในประเทศไทย
- **Automatic Expiry**: QR Code หมดอายุอัตโนมัติใน 15 นาที
- **Payment Verification**: ตรวจสอบและยืนยันการชำระเงินอัตโนมัติ

### 🏦 ธนาคารที่รองรับ
- ธนาคารไทยพาณิชย์ (SCB)
- ธนาคารกสิกรไทย (KBANK)
- ธนาคารกรุงเทพ (BBL)
- ธนาคารกรุงไทย (KTB)
- ธนาคารทหารไทยธนชาต (TMB)
- ธนาคารเพื่อการเกษตรและสหกรณ์ (BAAC)
- ธนาคารออมสิน (GSB)

## โครงสร้างระบบ

### Backend API Endpoints

#### 1. สร้าง QR Code
```
POST /api/payment/generate-qr
```

**Request Body:**
```json
{
  "bankId": "scb",
  "amount": 1000,
  "planId": "plan_id_here",
  "planTier": "vip",
  "planName": "VIP Member",
  "userId": "user_id_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "TXN_1234567890_abc123",
    "qrCodeImage": "data:image/png;base64,...",
    "qrCodeString": "00020101021229370016A000000677010112...",
    "bankInfo": {
      "name": "ธนาคารไทยพาณิชย์",
      "accountNumber": "1234567890",
      "accountName": "Your Company Name"
    },
    "amount": 1000,
    "currency": "THB",
    "planInfo": {
      "id": "plan_id_here",
      "tier": "vip",
      "name": "VIP Member"
    },
    "expiryTime": "2024-01-15T10:30:00.000Z",
    "timeRemaining": 900000
  }
}
```

#### 2. ตรวจสอบสถานะการชำระเงิน
```
GET /api/payment/check-payment/:transactionId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "TXN_1234567890_abc123",
    "status": "pending", // pending, completed, expired, failed
    "amount": 1000,
    "currency": "THB",
    "isExpired": false,
    "timeRemaining": 450000
  }
}
```

#### 3. ยืนยันการชำระเงิน
```
POST /api/payment/confirm-payment
```

**Request Body:**
```json
{
  "transactionId": "TXN_1234567890_abc123",
  "paymentReference": "REF123456",
  "amount": 1000,
  "bankId": "scb"
}
```

#### 4. ดึงข้อมูลธนาคาร
```
GET /api/payment/banks
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "scb",
      "name": "ธนาคารไทยพาณิชย์",
      "accountNumber": "1234567890",
      "accountName": "Your Company Name",
      "bankCode": "SCB"
    }
  ]
}
```

### Frontend Components

#### PaymentGateway.jsx
คอมโพเนนต์หลักสำหรับการชำระเงินที่มีฟีเจอร์:
- เลือกธนาคาร
- สร้าง QR Code
- แสดงข้อมูลการชำระเงิน
- ตรวจสอบสถานะแบบ Real-time
- คัดลอกข้อมูลการโอนเงิน

#### paymentAPI.js
Service สำหรับเรียกใช้ Payment API:
- `generateQRCode()`: สร้าง QR Code
- `checkPaymentStatus()`: ตรวจสอบสถานะ
- `confirmPayment()`: ยืนยันการชำระเงิน
- `getBanks()`: ดึงข้อมูลธนาคาร

#### paymentHelpers.js
Helper functions สำหรับ:
- จัดรูปแบบเวลา
- ตรวจสอบการหมดอายุ
- สร้างข้อมูลการชำระเงิน
- Polling สถานะการชำระเงิน

## การติดตั้งและใช้งาน

### 1. ติดตั้ง Dependencies

**Backend:**
```bash
cd backend
npm install qrcode
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. ตั้งค่า Environment Variables

**Backend (.env):**
```env
# Payment Configuration
PAYMENT_EXPIRY_MINUTES=15
PAYMENT_POLLING_INTERVAL=5000
```

### 3. รันระบบ

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## การทำงานของระบบ

### 1. การสร้าง QR Code
1. ผู้ใช้เลือกธนาคารและแพ็กเกจ
2. ระบบสร้าง Transaction ID และ QR Code
3. แสดง QR Code พร้อมข้อมูลการชำระเงิน
4. เริ่มการตรวจสอบสถานะแบบ Polling

### 2. การตรวจสอบสถานะ
1. ระบบตรวจสอบสถานะทุก 5 วินาที
2. อัปเดตสถานะในหน้าจอแบบ Real-time
3. หยุดการตรวจสอบเมื่อชำระเงินสำเร็จหรือหมดอายุ

### 3. การยืนยันการชำระเงิน
1. ระบบตรวจสอบข้อมูลการชำระเงิน
2. อัปเกรดสมาชิกของผู้ใช้
3. ส่งการแจ้งเตือนสำเร็จ

## มาตรฐาน QR Code

### PromptPay Standard
ระบบใช้มาตรฐาน PromptPay สำหรับการสร้าง QR Code:

```javascript
const payload = {
  "00": "02", // Payload Format Indicator
  "01": "12", // Point of Initiation Method
  "26": {
    "00": "A000000677010112", // Global Unique Identifier
    "01": data.accountNumber, // PromptPay ID
    "02": "00" // PromptPay ID Type
  },
  "52": "0000", // Merchant Category Code
  "53": "764", // Transaction Currency
  "54": data.amount.toFixed(2), // Transaction Amount
  "58": "TH", // Country Code
  "59": data.accountName, // Merchant Name
  "60": "Bangkok", // Merchant City
  "62": {
    "01": data.transactionId // Reference 1
  }
}
```

## การปรับแต่ง

### 1. เพิ่มธนาคารใหม่
แก้ไขไฟล์ `backend/routes/payment.js`:

```javascript
const bankAccounts = {
  // เพิ่มธนาคารใหม่
  newBank: {
    name: 'ธนาคารใหม่',
    accountNumber: '1234567890',
    accountName: 'Your Company Name',
    bankCode: 'NEWBANK'
  }
}
```

### 2. ปรับเวลาหมดอายุ
แก้ไขใน `generateQRCode()` function:

```javascript
const expiryTime = new Date(Date.now() + 30 * 60 * 1000); // 30 นาที
```

### 3. ปรับการ Polling
แก้ไขใน `paymentHelpers.js`:

```javascript
setTimeout(poll, 3000); // ตรวจสอบทุก 3 วินาที
```

## การทดสอบ

### 1. ทดสอบการสร้าง QR Code
```bash
curl -X POST http://localhost:5000/api/payment/generate-qr \
  -H "Content-Type: application/json" \
  -d '{
    "bankId": "scb",
    "amount": 1000,
    "planId": "test_plan",
    "planTier": "vip",
    "planName": "VIP Member",
    "userId": "test_user"
  }'
```

### 2. ทดสอบการตรวจสอบสถานะ
```bash
curl http://localhost:5000/api/payment/check-payment/TXN_1234567890_abc123
```

## การรักษาความปลอดภัย

### 1. การเข้ารหัสข้อมูล
- ใช้ HTTPS สำหรับการสื่อสาร
- เข้ารหัสข้อมูลการชำระเงิน
- ตรวจสอบความถูกต้องของข้อมูล

### 2. การตรวจสอบสิทธิ์
- ตรวจสอบสิทธิ์ผู้ใช้ก่อนสร้าง QR Code
- ตรวจสอบความถูกต้องของ Transaction ID
- ป้องกันการเข้าถึงข้อมูลที่ไม่ได้รับอนุญาต

### 3. การบันทึก Log
- บันทึกการสร้าง QR Code
- บันทึกการตรวจสอบสถานะ
- บันทึกการยืนยันการชำระเงิน

## การบำรุงรักษา

### 1. การตรวจสอบ Log
```bash
# ตรวจสอบ log การชำระเงิน
tail -f logs/payment.log
```

### 2. การตรวจสอบฐานข้อมูล
```javascript
// ตรวจสอบ transactions ที่หมดอายุ
db.transactions.find({
  status: "pending",
  expiryTime: { $lt: new Date() }
})
```

### 3. การสำรองข้อมูล
```bash
# สำรองข้อมูล transactions
mongodump --db sodeclick --collection transactions
```

## การแก้ไขปัญหา

### 1. QR Code ไม่แสดง
- ตรวจสอบการติดตั้ง qrcode library
- ตรวจสอบข้อมูลธนาคาร
- ตรวจสอบ console errors

### 2. การตรวจสอบสถานะไม่ทำงาน
- ตรวจสอบ API endpoint
- ตรวจสอบ network connection
- ตรวจสอบ CORS settings

### 3. การชำระเงินไม่สำเร็จ
- ตรวจสอบข้อมูลการชำระเงิน
- ตรวจสอบการหมดอายุของ QR Code
- ตรวจสอบการเชื่อมต่อกับธนาคาร

## การพัฒนาต่อ

### 1. เพิ่มฟีเจอร์
- การแจ้งเตือนผ่าน Line Notify
- การส่งอีเมลยืนยัน
- การสร้างรายงานการชำระเงิน

### 2. ปรับปรุงประสิทธิภาพ
- ใช้ Redis สำหรับ caching
- ปรับปรุงการ polling
- เพิ่มการ compress ข้อมูล

### 3. เพิ่มความปลอดภัย
- เพิ่มการตรวจสอบ 2FA
- เพิ่มการเข้ารหัสข้อมูล
- เพิ่มการตรวจสอบ fraud

## สรุป

ระบบ QR Code Payment ที่สร้างขึ้นเป็นระบบที่ครบถ้วนและพร้อมใช้งานสำหรับการชำระเงินในระบบสมาชิก โดยมีฟีเจอร์ที่จำเป็นครบถ้วนและสามารถปรับแต่งได้ตามความต้องการ
