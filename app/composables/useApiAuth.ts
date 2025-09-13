// composables/useApiAuth.ts
import { useAuthStore } from '~/stores/auth'

export const useApiAuth = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || '/api/v1'

  const $api = $fetch.create({
    baseURL,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    onRequest({ request, options }) {
      const authStore = useAuthStore()
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.token}`,
        }
      }
    },
    onResponseError({ response }) {
      const authStore = useAuthStore()
      if (response.status === 401) {
        authStore.clearAuth()
        // Optionally redirect to login page
        // navigateTo('/login')
      }
    }
  })

  return {
    get: (url: string, opts?: any) => $api(url, { method: 'GET', ...opts }),
    post: (url: string, body?: any, opts?: any) => $api(url, { method: 'POST', body, ...opts }),
    put: (url: string, body?: any, opts?: any) => $api(url, { method: 'PUT', body, ...opts }),
    delete: (url: string, opts?: any) => $api(url, { method: 'DELETE', ...opts }),
    $api,
  }
}
