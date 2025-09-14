// app/plugins/api.ts
import { ofetch } from 'ofetch';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin((_nuxtApp) => {
  globalThis.$fetch = ofetch.create({
    onRequest({ options }) {
      const authStore = useAuthStore();
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.token}`,
        };
      }
    },
    onResponseError({ response }) {
      // If a 401 Unauthorized error occurs, redirect to the login page
      if (response.status === 401) {
        const authStore = useAuthStore();
        // Clear user data from the store
        authStore.logout();
        // Redirect to the auth page. Using navigateTo for client-side redirection.
        // We use /auth because there is an auth.vue page, not login.vue
        navigateTo('/auth', { replace: true });
        alert('جلسه شما منقضی شده یا دسترسی ندارید. لطفاً دوباره وارد شوید.');
      }
    }
  });
});
