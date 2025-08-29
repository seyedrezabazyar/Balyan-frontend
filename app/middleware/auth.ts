// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const token = localStorage.getItem('auth_access_token');
    const user = localStorage.getItem('auth_user');
    const legacy = localStorage.getItem('isLoggedIn');

    // Check new auth system
    if (token && user) {
      try {
        JSON.parse(user);
        return; // Authenticated
      } catch {
        // Clear invalid data
        ['auth_access_token', 'auth_refresh_token', 'auth_user']
          .forEach(key => localStorage.removeItem(key));
      }
    }

    // Check legacy system
    if (legacy === 'true') return;

    // Redirect to auth
    return navigateTo('/auth');
  }
});
