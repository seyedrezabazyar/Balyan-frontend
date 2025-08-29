// middleware/guest.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const token = localStorage.getItem('auth_access_token');
    const user = localStorage.getItem('auth_user');
    const legacy = localStorage.getItem('isLoggedIn');

    // Check new auth
    if (token && user) {
      try {
        JSON.parse(user);
        return navigateTo('/dashboard');
      } catch {
        ['auth_access_token', 'auth_refresh_token', 'auth_user']
          .forEach(key => localStorage.removeItem(key));
      }
    }

    // Check legacy
    if (legacy === 'true') {
      return navigateTo('/dashboard');
    }
  }
});
