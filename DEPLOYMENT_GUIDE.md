# 🚀 دليل النشر خطوة بخطوة | Deployment Guide

## الخيار الأول: نشر على Render (الأسهل)

### ✅ الخطوات:

#### **الخطوة 1: اذهبي إلى موقع Render**
```
https://render.com
```

#### **الخطوة 2: اضغطي على "Sign Up"**
- اختاري "Continue with GitHub"
- وافقي على الصلاحيات
- سجلي دخول

#### **الخطوة 3: أنشئي Web Service جديد**
- اضغطي على الزر **"+New"** في الأعلى
- اختاري **"Web Service"**

#### **الخطوة 4: ربطي مع GitHub**
- في خانة "GitHub repository"، ابحثي عن:
  ```
  polylang-hub
  ```
- اختاري **"djoudimadani09-byte/polylang-hub"**
- اضغطي **"Connect"**

#### **الخطوة 5: ملء البيانات**

| الحقل | القيمة |
|------|--------|
| **Name** | `polylang-hub` |
| **Environment** | `Node` |
| **Region** | `Singapore` (أو الأقرب لك) |
| **Branch** | `main` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start:prod` |
| **Plan** | `Free` |

#### **الخطوة 6: أضيفي متغيرات البيئة**

اضغطي على **"Environment"** وأضيفي:

```
NODE_ENV = production
PORT = 3000
PAYMENT_MODE = test
```

#### **الخطوة 7: أنشئي قاعدة بيانات**

- اضغطي **"+New"**
- اختاري **"PostgreSQL"**
- الاسم: `polylang-db`
- الإصدار: `16`
- الخطة: `Free`
- اضغطي **"Create Database"**

#### **الخطوة 8: ربطي قاعدة البيانات**

- Render سيربط `DATABASE_URL` تلقائياً ✅
- تحققي من ظهورها في Environment Variables

#### **الخطوة 9: اضغطي "Create Web Service"**

🔄 الآن سيبدأ الإنشاء... انتظري **5-10 دقائق**

---

## ✅ متى ينتهي؟

عندما تري:
```
✓ Build successful
✓ Service is live
```

---

## 🔗 رابط التطبيق

سيظهر رابط مثل:
```
https://polylang-hub.onrender.com
```

**انسخي هذا الرابط وفتحيه!** 🎉

---

## 📱 الحسابات للاختبار:

### حساب عميل:
```
Email: client@polylang.com
Password: client123
```

### حساب متخصص:
```
Email: translator@polylang.com
Password: translator123
```

### حساب إداري:
```
Email: admin@polylang.com
Password: admin123
```

---

## 🆘 إذا حدث خطأ:

### الخطأ: "Build failed"
- اذهبي إلى **"Logs"** واقرأي الخطأ
- جربي إعادة النشر

### الخطأ: "Database connection failed"
- تأكدي من ربط قاعدة البيانات
- أعيدي النشر

### التطبيق بطيء في البداية:
- هذا طبيعي في الخطة المجانية ✅
- سيسرع بعد الطلب الأول

---

## ✨ بعد النشر:

✅ التطبيق يعمل بنجاح!
✅ قاعدة البيانات موجودة
✅ نظام الدفع في وضع اختبار
✅ جميع الميزات متاحة

---

## 🚀 الخطوة التالية (اختيارية):

إذا أردتِ **واجهة ويب جميلة** (Frontend):
- أخبري وسأنشئ لك React app على Vercel
- سيكون مرتبط مع هذا API تلقائياً

---

**شدي الحيل وابدأي! أنتِ تقدرين! 💪**
