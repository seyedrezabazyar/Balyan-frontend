// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    // Check new auth system
    const accessToken = localStorage.getItem('auth_access_token');
    const user = localStorage.getItem('auth_user');

    if (accessToken && user) {
      try {
        JSON.parse(user); // Validate user data
        return; // User is authenticated
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('auth_access_token');
        localStorage.removeItem('auth_refresh_token');
        localStorage.removeItem('auth_user');
      }
    }

    // Check legacy system as fallback
    const legacyLogin = localStorage.getItem('isLoggedIn');
    if (legacyLogin === 'true') {
      return; // User is authenticated via legacy system
    }

    // Redirect to unified auth page
    return navigateTo('/auth');
  }
});
