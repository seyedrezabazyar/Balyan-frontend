// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    // چک کردن سیستم جدید احراز هویت
    const newAuthToken = localStorage.getItem('auth_token');
    if (newAuthToken) {
      return; // کاربر احراز هویت شده است
    }

    // چک کردن سیستم legacy
    const legacyLogin = localStorage.getItem('isLoggedIn');
    if (legacyLogin === 'true') {
      return; // کاربر احراز هویت شده است (legacy)
    }

    // اگر کاربر احراز هویت نشده باشد، به صفحه ورود هدایت شود
    return navigateTo('/auth/login');
  }
});
