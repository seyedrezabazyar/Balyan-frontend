# راهنمای دسترسی مدیر به صفحه کاربران

## وضعیت فعلی ✅

صفحه مدیریت کاربران در مسیر `/dashboard/users` به طور کامل پیکربندی شده و فقط برای کاربران مدیر قابل دسترسی است.

## نحوه عملکرد

### 1. Middleware احراز هویت
- صفحه `app/pages/dashboard/users/index.vue` از دو middleware استفاده می‌کند:
  - `auth`: بررسی می‌کند که کاربر لاگین کرده باشد
  - `admin`: بررسی می‌کند که کاربر دسترسی مدیر داشته باشد

```javascript
definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'dashboard'
})
```

### 2. بررسی دسترسی مدیر
فایل `app/middleware/admin.ts` بررسی می‌کند که:
- کاربر لاگین کرده باشد
- فیلد `is_admin` کاربر برابر با `true` باشد
- در صورت عدم دسترسی، کاربر به صفحه `/access-denied` هدایت می‌شود

### 3. نمایش در منوی داشبورد
در فایل `app/layouts/dashboard.vue`:
- آیتم "کاربران" فقط برای کاربرانی نمایش داده می‌شود که:
  - نقش `admin` داشته باشند
  - یا دسترسی `users.view` داشته باشند

### 4. صفحات مرتبط
- `/dashboard/users` - لیست کاربران (فقط مدیران)
- `/dashboard/users/[id]` - جزئیات کاربر (فقط مدیران)
- `/access-denied` - صفحه خطای عدم دسترسی

## نحوه تست

### برای کاربر معمولی:
1. با یک حساب کاربری معمولی وارد شوید
2. سعی کنید به آدرس `http://127.0.0.1:3000/dashboard/users` بروید
3. باید به صفحه `/access-denied` هدایت شوید
4. در منوی داشبورد، آیتم "کاربران" نباید نمایش داده شود

### برای کاربر مدیر:
1. با یک حساب مدیر وارد شوید (کاربری که `is_admin: true` دارد)
2. به آدرس `http://127.0.0.1:3000/dashboard/users` بروید
3. باید صفحه مدیریت کاربران را ببینید
4. در منوی داشبورد، آیتم "کاربران" باید نمایش داده شود

## ساختار کاربر
```typescript
interface User {
  id: number
  name: string
  email?: string | null
  phone?: string | null
  is_admin?: boolean  // این فیلد تعیین می‌کند که کاربر مدیر است یا خیر
  // ... سایر فیلدها
}
```

## فایل‌های کلیدی
- `app/middleware/admin.ts` - Middleware بررسی دسترسی مدیر
- `app/pages/dashboard/users/index.vue` - صفحه لیست کاربران
- `app/pages/dashboard/users/[id].vue` - صفحه جزئیات کاربر
- `app/layouts/dashboard.vue` - Layout داشبورد با منوی شرطی
- `app/composables/useAuth.ts` - Composable احراز هویت
- `app/pages/access-denied.vue` - صفحه خطای عدم دسترسی