# API Documentation

## مقدمة | Introduction

هذا التوثيق يغطي جميع نقاط نهاية API في PolyLang Hub.

### Base URL
```
http://localhost:3000/api/v1
```

### المصادقة | Authentication

جميع الطلبات المحمية تتطلب header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🔐 المصادقة | Auth Endpoints

### تسجيل مستخدم جديد | Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "CLIENT"  // CLIENT, TRANSLATOR, ADMIN
}
```

### تسجيل الدخول | Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 👤 المستخدمين | Users Endpoints

### الحصول على الملف الشخصي | Get Profile
```http
GET /users/profile
Authorization: Bearer TOKEN
```

### تحديث الملف الشخصي | Update Profile
```http
PATCH /users/profile
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "New Name",
  "phone": "+213123456789",
  "address": "Address",
  "city": "City",
  "preferredLanguage": "ar"
}
```

### الحصول على رصيد المحفظة | Get Wallet Balance
```http
GET /users/wallet
Authorization: Bearer TOKEN
```

---

## 📦 الطلبات | Orders Endpoints

### إنشاء طلب ترجمة | Create Order
```http
POST /orders
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "sourceLanguage": "en",
  "targetLanguage": "ar",
  "fileUrl": "https://example.com/file.pdf",
  "fileName": "file.pdf",
  "fileSize": 102400,
  "documentType": "legal",
  "wordCount": 2500,
  "description": "Translation of legal document"
}
```

### الحصول على طلباتي | Get My Orders
```http
GET /orders/client/my-orders
Authorization: Bearer TOKEN
```

### الحصول على طلب محدد | Get Order
```http
GET /orders/:id
Authorization: Bearer TOKEN
```

---

## 💳 الدفع | Payment Endpoints

### معالجة الدفع | Process Payment
```http
POST /payments/process
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "orderId": "order-uuid",
  "amount": 125000,
  "paymentMethod": "EDAHABIA"  // EDAHABIA, GOLDEN_CARD, WALLET
}
```

### تأكيد الدفع | Confirm Payment
```http
POST /payments/:id/confirm?gatewayReference=REF123
```

### الحصول على معاملات المستخدم | Get User Transactions
```http
GET /payments/user/transactions
Authorization: Bearer TOKEN
```

---

## ⭐ التقييمات | Ratings Endpoints

### إضافة تقييم | Create Rating
```http
POST /ratings
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "translationId": "translation-uuid",
  "score": 5,
  "comment": "Excellent translation!"
}
```

### الحصول على تقييمات المترجم | Get Translator Ratings
```http
GET /ratings/translator/:translatorId
```

---

## 🚨 النزاعات | Disputes Endpoints

### فتح نزاع | Create Dispute
```http
POST /disputes
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "orderId": "order-uuid",
  "reportedBy": "user-uuid",
  "reason": "Poor quality",
  "description": "Detailed description of the issue"
}
```

### الحصول على نزاعاتي | Get My Disputes
```http
GET /disputes/user/my-disputes
Authorization: Bearer TOKEN
```

---

## 🔧 Response Format

### النجاح | Success Response
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "User Name",
  "role": "CLIENT",
  "createdAt": "2026-09-12T12:00:00Z"
}
```

### الخطأ | Error Response
```json
{
  "statusCode": 400,
  "message": "Error message",
  "timestamp": "2026-09-12T12:00:00Z"
}
```

---

**آخر تحديث: 2026-09-12**
