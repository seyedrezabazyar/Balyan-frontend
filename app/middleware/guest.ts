// middleware/guest.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // بررسی ساده تر برای تست
  if (process.client) {
    // چک کردن سیستم legacy
    const legacyLogin = localStorage.getItem('isLoggedIn');
    if (legacyLogin === 'true') {
      return navigateTo('/dashboard');
    }

    // چک کردن سیستم جدید
    const newAuthToken = localStorage.getItem('auth_token');
    if (newAuthToken) {
      return navigateTo('/dashboard');
    }
  }
});
