# Professional Nuxt 4 Dashboard Application

یک اپلیکیشن حرفه‌ای با Nuxt 4 که شامل صفحه اصلی، داشبورد، و سیستم احراز هویت کامل است.

## ✨ ویژگی‌ها

- 🚀 **Nuxt 4** - جدیدترین نسخه Nuxt
- 🎨 **Nuxt UI** - کامپوننت‌های حرفه‌ای و مدرن
- 🎯 **TypeScript** - Type Safety کامل
- 🔐 **سیستم احراز هویت** - لاگین، ثبت نام، و مدیریت توکن
- 📊 **داشبورد حرفه‌ای** - با نمودارها و آمار
- 🌙 **Dark Mode** - پشتیبانی از تم تاریک و روشن
- 📱 **Responsive** - سازگار با تمام دستگاه‌ها
- 🔄 **API Integration** - آماده اتصال به Laravel Backend
- 🛡️ **Middleware** - محافظت از روت‌ها
- 🎭 **Pinia** - State Management
- ✅ **Form Validation** - با VeeValidate و Zod

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها

- Node.js 18+ 
- npm یا yarn

### مراحل نصب

1. **کلون کردن پروژه**
```bash
git clone <repository-url>
cd nuxt-app
```

2. **نصب وابستگی‌ها**
```bash
npm install
```

3. **تنظیم Environment Variables**
```bash
cp .env.example .env
```

سپس فایل `.env` را ویرایش کرده و مقادیر مورد نظر را وارد کنید:

```env
NUXT_PUBLIC_API_BASE=http://your-laravel-api.com/api
```

4. **اجرای پروژه در حالت Development**
```bash
npm run dev
```

پروژه در آدرس `http://localhost:3000` در دسترس خواهد بود.

## 📁 ساختار پروژه

```
├── app/
│   ├── layouts/          # لایه‌های مختلف (default, auth, dashboard)
│   ├── pages/            # صفحات اپلیکیشن
│   │   ├── index.vue     # صفحه اصلی
│   │   ├── login.vue     # صفحه ورود
│   │   ├── register.vue  # صفحه ثبت نام
│   │   └── dashboard/    # صفحات داشبورد
│   └── app.vue          # کامپوننت اصلی
├── assets/
│   └── css/
│       └── main.css      # استایل‌های سفارشی
├── composables/          # Composables
│   └── useApi.ts        # API Helper
├── middleware/           # Middleware ها
│   ├── auth.ts          # بررسی احراز هویت
│   └── guest.ts         # بررسی عدم احراز هویت
├── stores/              # Pinia Stores
│   └── auth.ts          # مدیریت احراز هویت
├── types/               # TypeScript Types
│   └── index.ts         # تایپ‌های اصلی
└── nuxt.config.ts       # تنظیمات Nuxt
```

## 🔑 احراز هویت

### ورود (Login)
- آدرس: `/login`
- فیلدهای مورد نیاز: `email`, `password`
- پس از ورود موفق به داشبورد هدایت می‌شود

### ثبت نام (Register)
- آدرس: `/register`
- فیلدهای مورد نیاز: `name`, `email`, `password`, `password_confirmation`
- اعتبارسنجی قوی رمز عبور (حداقل 8 کاراکتر، حرف بزرگ، عدد)

### Middleware
- `auth`: محافظت از صفحات نیازمند احراز هویت
- `guest`: هدایت کاربران لاگین شده از صفحات ورود/ثبت نام

## 🔌 اتصال به Laravel API

برای اتصال به Backend لاراول، موارد زیر را تنظیم کنید:

### 1. تنظیم API Base URL
در فایل `.env`:
```env
NUXT_PUBLIC_API_BASE=http://your-laravel-domain.com/api
```

### 2. API Endpoints مورد نیاز در Laravel

Backend لاراول شما باید این endpoint ها را داشته باشد:

#### Authentication Endpoints:
- `POST /api/auth/login` - ورود کاربر
- `POST /api/auth/register` - ثبت نام کاربر
- `POST /api/auth/logout` - خروج کاربر
- `GET /api/auth/user` - دریافت اطلاعات کاربر فعلی
- `POST /api/auth/refresh` - تازه‌سازی توکن

#### Response Format:
```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com"
    },
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

### 3. CORS Configuration در Laravel

در فایل `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

## 🎨 سفارشی‌سازی

### تغییر رنگ‌ها
در فایل `tailwind.config.ts`:
```ts
theme: {
  extend: {
    colors: {
      primary: colors.blue, // تغییر به رنگ دلخواه
    }
  }
}
```

### اضافه کردن صفحات جدید
1. فایل جدید در `app/pages/` ایجاد کنید
2. در صورت نیاز middleware اضافه کنید:
```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

### اضافه کردن آیتم به منوی داشبورد
در فایل `app/layouts/dashboard.vue`:
```ts
const menuItems = [
  // آیتم جدید اضافه کنید
  { id: 'new-item', label: 'آیتم جدید', icon: 'i-heroicons-star', to: '/dashboard/new-page' }
]
```

## 📦 Build برای Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🛠️ تکنولوژی‌های استفاده شده

- **Nuxt 4** - Full-stack Vue framework
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Nuxt UI** - Beautiful UI components
- **Pinia** - State management
- **VeeValidate + Zod** - Form validation
- **VueUse** - Collection of Vue composition utilities

## 📝 نکات مهم

1. **امنیت**: حتماً `NUXT_AUTH_SECRET` را در production تغییر دهید
2. **HTTPS**: در production از HTTPS استفاده کنید
3. **Rate Limiting**: برای API endpoints محدودیت درخواست اعمال کنید
4. **Validation**: همیشه ورودی‌ها را در سمت سرور نیز اعتبارسنجی کنید

## 🤝 پشتیبانی

برای سوالات و مشکلات:
- Issue در GitHub ایجاد کنید
- به تیم پشتیبانی ایمیل بزنید

## 📄 لایسنس

MIT License

---

ساخته شده با ❤️ و ☕