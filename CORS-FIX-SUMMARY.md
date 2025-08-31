# خلاصه رفع مشکل CORS و صفحه کاربران

## مشکل اصلی
صفحه کاربران به دلیل خطای CORS نمی‌توانست اطلاعات را از backend دریافت کند.

## راه‌حل‌های اعمال شده

### 1. تنظیمات Proxy در Nuxt
فایل `nuxt.config.ts` را آپدیت کردیم:
```typescript
nitro: {
  devProxy: {
    '/api/auth': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    }
  }
}
```

### 2. ایجاد Server API Routes
فایل‌های زیر را برای handle کردن درخواست‌ها در سمت سرور ایجاد کردیم:
- `/server/api/auth/users.get.ts` - دریافت لیست کاربران
- `/server/api/auth/users/[id].put.ts` - ویرایش کاربر
- `/server/api/auth/users/[id]/toggle-lock.post.ts` - تغییر وضعیت کاربر

### 3. بهبود صفحه کاربران
فایل `/app/pages/users.vue` را آپدیت کردیم:
- استفاده از proxy endpoint به جای direct API calls
- اضافه کردن proper error handling
- بهبود authentication checks

### 4. ایجاد Composable جدید
فایل `/app/composables/useApi.ts` را ایجاد کردیم برای:
- مدیریت متمرکز API calls
- Error handling یکپارچه
- Automatic token management

### 5. Global Error Handler
فایل `/app/plugins/api-error-handler.client.ts` را ایجاد کردیم برای:
- Handle کردن 401 errors به صورت global
- Automatic redirect به صفحه login

## نحوه استفاده

### برای توسعه‌دهندگان:
1. مطمئن شوید backend در `http://127.0.0.1:8000` در حال اجرا است
2. Frontend را با `npm run dev` اجرا کنید
3. به `http://127.0.0.1:3000` بروید

### تست عملکرد:
1. فایل `test-users-api.html` را در مرورگر باز کنید
2. ابتدا login کنید
3. سپس لیست کاربران را دریافت کنید
4. می‌توانید CORS را با و بدون proxy تست کنید

## API Endpoints

### Frontend Routes (با Proxy):
- `GET /api/auth/users` - دریافت لیست کاربران
- `POST /api/auth/users` - ایجاد کاربر جدید
- `PUT /api/auth/users/{id}` - ویرایش کاربر
- `POST /api/auth/users/{id}/toggle-lock` - تغییر وضعیت کاربر

### Backend Routes (مستقیم):
- `GET http://127.0.0.1:8000/auth/users`
- `POST http://127.0.0.1:8000/auth/users`
- `PUT http://127.0.0.1:8000/auth/users/{id}`
- `POST http://127.0.0.1:8000/auth/users/{id}/toggle-lock`

## نکات مهم

1. **CORS در Backend**: اگر می‌خواهید از backend مستقیم استفاده کنید، باید CORS را در Laravel تنظیم کنید:
```php
// در فایل config/cors.php
'paths' => ['api/*', 'auth/*'],
'allowed_origins' => ['http://127.0.0.1:3000'],
'allowed_headers' => ['*'],
'allowed_methods' => ['*'],
'supports_credentials' => true,
```

2. **Authentication**: همیشه مطمئن شوید token در headers ارسال می‌شود:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

3. **Error Handling**: از composable `useApi` برای API calls استفاده کنید تا error handling automatic داشته باشید.

## فایل‌های تغییر یافته
- `/nuxt.config.ts`
- `/app/pages/users.vue`
- `/app/composables/useApi.ts`
- `/app/plugins/api-error-handler.client.ts`
- `/server/api/auth/users.get.ts`
- `/server/api/auth/users/[id].put.ts`
- `/server/api/auth/users/[id]/toggle-lock.post.ts`

## تست‌ها
برای تست کامل سیستم:
1. Login با admin credentials
2. مشاهده لیست کاربران
3. ویرایش یک کاربر
4. تغییر وضعیت یک کاربر
5. ایجاد کاربر جدید