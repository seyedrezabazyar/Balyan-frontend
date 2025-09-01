# سیستم مدیریت پیشرفته

یک سیستم مدیریت مدرن و کارآمد ساخته شده با Nuxt 4 و Vue 3

## ویژگی‌ها

- 🚀 **Performance بالا** - استفاده از Lazy Loading و بهینه‌سازی‌های پیشرفته
- 🔐 **احراز هویت امن** - سیستم ورود با OTP و رمز عبور
- 👥 **مدیریت کاربران** - مدیریت کامل کاربران، نقش‌ها و دسترسی‌ها
- 📚 **مدیریت محتوا** - سیستم مدیریت کتاب‌ها و دسته‌بندی‌ها
- 🖼️ **گالری تصاویر** - مدیریت و نمایش تصاویر
- 📊 **داشبورد آماری** - نمایش آمار و اطلاعات سیستم
- 📱 **Responsive Design** - سازگار با تمام دستگاه‌ها

## نصب و راه‌اندازی

### پیش‌نیازها

- Node.js 18 یا بالاتر
- npm یا yarn

### مراحل نصب

1. کلون کردن پروژه:
```bash
git clone [repository-url]
cd management-system
```

2. نصب وابستگی‌ها:
```bash
npm install
```

3. تنظیم متغیرهای محیطی:
```bash
cp .env.example .env
```

4. اجرای پروژه در حالت توسعه:
```bash
npm run dev
```

پروژه در آدرس `http://127.0.0.1:3000` قابل دسترسی خواهد بود.

## دستورات مفید

```bash
# Build برای Production
npm run build

# اجرای Production Build
npm run preview

# بررسی Type
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# پاکسازی Cache
npm run clean
```

## ساختار پروژه

```
app/
├── assets/          # فایل‌های استاتیک و CSS
├── components/      # کامپوننت‌های Vue
│   └── dashboard/   # کامپوننت‌های داشبورد
├── composables/     # Composables (useAuth, useApi, etc.)
├── layouts/         # Layout های صفحات
├── middleware/      # Route Middleware
├── pages/           # صفحات اپلیکیشن
│   └── dashboard/   # صفحات داشبورد
├── plugins/         # Nuxt Plugins
├── types/           # TypeScript Type Definitions
└── utils/           # Utility Functions
```

## تکنولوژی‌های استفاده شده

- **Nuxt 4** - Framework اصلی
- **Vue 3** - Composition API
- **TypeScript** - Type Safety
- **CSS3** - استایل‌دهی مدرن

## بهینه‌سازی‌های انجام شده

- ✅ حذف فایل‌ها و کدهای اضافی
- ✅ Lazy Loading برای کامپوننت‌ها
- ✅ Type Definitions مرکزی
- ✅ بهینه‌سازی Bundle Size
- ✅ استانداردسازی نام‌گذاری فایل‌ها
- ✅ ESLint و Prettier Configuration

## لایسنس

Private - All Rights Reserved