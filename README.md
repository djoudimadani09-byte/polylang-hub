# 🌍 PolyLang Hub - Institutional & Professional Translation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-v10-red.svg)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-brightblue.svg)](https://www.docker.com/)

## 📝 نظرة عامة | Overview

**PolyLang Hub** هو منصة ترجمة احترافية وموثوقة توصل الشركات والأفراد بمترجمين معتمدين لترجمة الوثائق المؤسسية والقانونية والتقنية.

**PolyLang Hub** is a professional translation SaaS platform connecting businesses and individuals with certified translators for institutional, legal, and technical documents.

### ✨ الميزات الرئيسية | Key Features

- ✅ **دعم عربي RTL كامل** - Full Arabic RTL Support
- ✅ **تعدد اللغات** - Multi-language Support (AR, FR, EN, DE)
- ✅ **نظام دفع جزائري محلي** - Algerian Payment Gateways (Edahabia, Golden Card)
- ✅ **قاعدة بيانات قوية** - PostgreSQL with Prisma ORM
- ✅ **جاهز للنشر الذاتي** - Docker & Docker Compose Ready
- ✅ **نظام إدارة المترجمين** - Translator Management System
- ✅ **لوحة تحكم العميل** - Client Dashboard with Real-time Updates
- ✅ **نظام التقييمات والنزاعات** - Ratings & Disputes Resolution
- ✅ **محفظة رقمية** - Digital Wallet System

---

## 🚀 البدء السريع | Quick Start

### المتطلبات | Requirements

- **Docker** & **Docker Compose** (الطريقة الموصى بها)
- **Node.js** v20+ (للتطوير المحلي)
- **PostgreSQL** v16+

### التثبيت بـ Docker (الأسرع) | Docker Installation

```bash
# 1. استنساخ المستودع | Clone the repository
git clone https://github.com/djoudimadani09-byte/polylang-hub.git
cd polylang-hub

# 2. إنشاء ملف البيئة | Create environment file
cp .env.example .env.docker

# 3. بناء وتشغيل التطبيق | Build and run
docker-compose up --build

# 4. تنفيذ ترحيل قاعدة البيانات | Run migrations
docker-compose exec app npx prisma migrate deploy

# 5. تعبئة قاعدة البيانات بالبيانات الافتراضية | Seed the database
docker-compose exec app npx prisma db seed
```

✅ التطبيق سيكون متاحاً على: `http://localhost:3000`

### التثبيت المحلي | Local Installation

```bash
# 1. استنساخ المستودع
git clone https://github.com/djoudimadani09-byte/polylang-hub.git
cd polylang-hub

# 2. تثبيت الحزم
npm install

# 3. إنشاء ملف البيئة
cp .env.example .env

# 4. تشغيل قاعدة البيانات (PostgreSQL)
# تأكد من تشغيل PostgreSQL وحدّث DATABASE_URL في .env

# 5. تنفيذ الترحيلات
npm run db:migrate\n# 6. تعبئة قاعدة البيانات
npm run db:seed

# 7. تشغيل التطبيق
npm run start:dev
```

---

## 👥 حسابات الاختبار | Test Accounts

بعد تعبئة قاعدة البيانات، استخدم هذه الحسابات:

| Role | Email | Password |
|------|-------|----------|
| 🔐 Admin | `admin@polylang.com` | `admin123` |
| 👤 Client | `client@polylang.com` | `client123` |
| 🌐 Translator | `translator@polylang.com` | `translator123` |

---

## 📡 API Documentation

### المصادقة | Authentication

```bash
# تسجيل الدخول | Login
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "client@polylang.com",
  "password": "client123"
}

# الاستجابة | Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "client@polylang.com",
    "name": "عميل تجريبي",
    "role": "CLIENT"
  }
}
```

### الطلبات | Orders

```bash
# إنشاء طلب ترجمة | Create translation order
POST /api/v1/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "sourceLanguage": "en",
  "targetLanguage": "ar",
  "fileUrl": "https://example.com/document.pdf",
  "fileName": "document.pdf",
  "fileSize": 1024000,
  "documentType": "legal",
  "wordCount": 2500,
  "description": "ترجمة وثيقة قانونية"
}

# الحصول على طلباتي | Get my orders
GET /api/v1/orders/client/my-orders
Authorization: Bearer YOUR_TOKEN
```

### الدفع | Payments

```bash
# معالجة الدفع | Process payment
POST /api/v1/payments/process
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "orderId": "order123",
  "amount": 50000,
  "paymentMethod": "EDAHABIA"
}

# الخيارات المتاحة | Available payment methods
# - EDAHABIA (بريدي موب)
# - GOLDEN_CARD (البطاقة الذهبية)
# - WALLET (المحفظة الرقمية)
```

---

## 🏗️ بنية المشروع | Project Structure

```
polylang-hub/
├── src/
│   ├── main.ts                 # نقطة الدخول
│   ├── app.module.ts           # الوحدة الرئيسية
│   ├── common/                 # المكونات المشتركة
│   │   ├── decorators/         # Decorators مخصصة
│   │   ├── filters/            # Exception filters
│   │   ├── guards/             # Auth guards
│   │   └── prisma/             # Prisma service
│   └── modules/                # الوحدات الرئيسية
│       ├── auth/               # المصادقة
│       ├── users/              # إدارة المستخدمين
│       ├── orders/             # إدارة الطلبات
│       ├── translations/       # إدارة الترجمات
│       ├── payment/            # نظام الدفع
│       ├── disputes/           # إدارة النزاعات
│       └── ratings/            # التقييمات
├── prisma/
│   ├── schema.prisma           # نموذج قاعدة البيانات
│   └── seed.ts                 # بيانات افتراضية
├── docker-compose.yml          # Docker Compose config
├── Dockerfile                  # Docker image
├── .env.example                # متغيرات البيئة
└── package.json                # التبعيات
```

---

## 🗄️ قاعدة البيانات | Database Schema

### الجداول الرئيسية | Main Tables

- **Users** - المستخدمين (عملاء، مترجمين، مسؤولين)
- **Orders** - طلبات الترجمة
- **Translations** - مهام الترجمة
- **Transactions** - السجلات المالية
- **Disputes** - النزاعات والشكاوى
- **Ratings** - التقييمات والتعليقات
- **WalletBalance** - رصيد المحفظة الرقمية
- **TranslatorLanguage** - اللغات المتاحة للمترجم

---

## 🔐 نظام الدفع الجزائري | Algerian Payment System

### دعم الطرق المحلية | Supported Methods

1. **Edahabia (بريدي موب)** 📱
   - نظام الدفع من البريد الجزائري
   - يدعم محافظ الهاتف المحمول
   - API integration جاهزة (test mode متوفر)

2. **Golden Card (البطاقة الذهبية)** 💳
   - نظام الدفع بالبطاقات البنكية
   - محلي وآمن
   - API integration متوفرة

3. **المحفظة الرقمية** 💰
   - نظام أموال داخل المنصة
   - تحويلات سريعة بين المستخدمين

### التكوين | Configuration

```env
# في ملف .env
PAYMENT_MODE=test              # test أو production
EDAHABIA_API_KEY=your_key
EDAHABIA_MERCHANT_ID=your_id
GOLDEN_CARD_API_KEY=your_key
```

---

## 🌐 دعم اللغات | Language Support

### اللغات المدعومة | Supported Languages

- 🇸🇦 **العربية (AR)** - Arabic RTL
- 🇫🇷 **الفرنسية (FR)** - French
- 🇬🇧 **الإنجليزية (EN)** - English
- 🇩🇪 **الألمانية (DE)** - German

### تبديل الاتجاه | Direction Switching

التطبيق يدعم تبديل تلقائي بين RTL و LTR بناءً على لغة المستخدم المختارة.

---

## 📱 استخدام الـ Docker للإنتاج | Docker for Production

```bash
# بناء الصورة
docker build -t polylang-hub:latest .

# تشغيل الحاوية
docker run -d \
  --name polylang \
  -p 3000:3000 \
  --env-file .env.docker \
  polylang-hub:latest

# عرض السجلات
docker logs -f polylang
```

---

## 🔧 الأوامر المتاحة | Available Commands

```bash
# التطوير
npm run start:dev              # تشغيل في وضع التطوير
npm run build                  # بناء المشروع
npm run start:prod             # تشغيل الإنتاج

# قاعدة البيانات
npm run db:migrate             # تنفيذ الترحيلات
npm run db:generate            # توليد Prisma client
npm run db:seed                # تعبئة البيانات

# الاختبار
npm run test                   # اختبارات الوحدة
npm run test:e2e               # الاختبارات الشاملة

# الجودة
npm run lint                   # فحص الأخطاء
npm run format                 # تنسيق الأكواد
```

---

## 📚 التوثيق الإضافية | Additional Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guide](./CONTRIBUTING.md)

---

## 🤝 المساهمة | Contributing

نرحب بمساهماتك! يرجى:

1. Fork المستودع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للـ branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

---

## 📄 الترخيص | License

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](./LICENSE) للتفاصيل.

---

## 📞 التواصل | Contact

- 📧 **البريد الإلكتروني**: support@polylang-hub.com
- 🌐 **الموقع**: https://polylang-hub.com
- 💬 **Discord**: [Join our community](https://discord.gg/polylang)

---

## 🙌 شكر خاص | Special Thanks

شكر لجميع المساهمين والمترجمين الذين ساهموا في بناء هذه المنصة! 🎉

---

## 🚀 الخطوات التالية | Next Steps

- [ ] إضافة تطبيق frontend (React/Next.js)
- [ ] تطبيق موبايل (React Native/Flutter)
- [ ] نظام التنبيهات والإشعارات
- [ ] تحسينات الأداء والـ Caching
- [ ] Analytics و Reporting
- [ ] AI-powered quality checks

---

**Made with ❤️ by PolyLang Hub Team**

آخر تحديث: **2026-09-12**
