// middleware/guest.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    // Check new auth system
    const accessToken = localStorage.getItem('auth_access_token');
    const user = localStorage.getItem('auth_user');

    if (accessToken && user) {
      try {
        JSON.parse(user); // Validate user data
        return navigateTo('/dashboard'); // Redirect authenticated users
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('auth_access_token');
        localStorage.removeItem('auth_refresh_token');
        localStorage.removeItem('auth_user');
      }
    }

    // Check legacy system
    const legacyLogin = localStorage.getItem('isLoggedIn');
    if (legacyLogin === 'true') {
      return navigateTo('/dashboard'); // Redirect legacy authenticated users
    }

    // Allow access to guest pages
  }
});
