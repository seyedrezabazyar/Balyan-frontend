import type { UseFetchOptions } from 'nuxt/app'

export const useApi = <T = any>(
  url: string | (() => string),
  options?: UseFetchOptions<T>
) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  
  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.apiBase,
    
    // Add authentication header
    onRequest({ options }) {
      const token = useCookie('auth-token').value
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        }
      }
    },
    
    // Handle token refresh on 401
    async onResponseError({ response }) {
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await authStore.refreshAccessToken()
        if (!refreshed) {
          // Redirect to login if refresh fails
          await authStore.logout()
        }
      }
    },

    // Transform the response
    transform: (data: any) => {
      // If the API returns data in a 'data' wrapper, unwrap it
      return data?.data || data
    }
  }

  // Merge options
  const params = defu(options, defaults)
  
  return useFetch(url, params)
}