// ~/composables/useApi.ts
import { useRuntimeConfig } from '#app'
import type { FetchOptions } from 'ofetch'

export const useApi = (token: string | null = null) => {
  const config = useRuntimeConfig()

  const fetchApi = (url: string, options: FetchOptions) => {
    let baseURL = ''
    let path = url

    // Step 1: Construct the full path with the correct version prefix.
    // This ensures that calls like `api.get('/users')` become `api.get('/api/v1/users')`.
    if (!path.startsWith('/api/v1') && !path.startsWith('/sanctum')) {
      path = `/api/v1${path}`
    }

    // Step 2: Determine the base URL (domain only).
    if (process.dev) {
      // In development mode, the baseURL is empty.
      // The full path (e.g., /api/v1/users) will be called relative to the current domain,
      // which is correctly handled by the Nuxt dev server proxy.
      baseURL = ''
    } else {
      // In production mode, we need to use the configured API base.
      // We extract only the origin (e.g., http://localhost:8000) from the user's
      // configured NUXT_PUBLIC_API_BASE to avoid issues with extra path segments.
      try {
        const configuredUrl = new URL(config.public.apiBase)
        baseURL = configuredUrl.origin
      } catch (e) {
        console.error(
          "Invalid NUXT_PUBLIC_API_BASE URL in config. It should be a full URL like 'http://your-api.com'. Falling back to a relative path.",
          e
        )
        // Fallback to a safe relative path if the URL is misconfigured.
        baseURL = ''
      }
    }

    // Step 3: Handle the Sanctum CSRF cookie route as a special case.
    // It should not be prefixed with /api/v1.
    if (url === '/sanctum/csrf-cookie') {
      path = url // Reset path to not include /api/v1
    }

    // Step 4: Make the request using the constructed path and baseURL.
    return $fetch(path, {
      ...options,
      baseURL
    })
  }

  const normalizeAuthorization = (rawToken: string | null): string | undefined => {
    if (!rawToken) return undefined
    return /^(Bearer|Token)\s+/.test(rawToken) ? rawToken : `Bearer ${rawToken}`
  }

  const createHeaders = (hasBody: boolean) => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    }
    const authHeader = normalizeAuthorization(token)
    if (authHeader) headers['Authorization'] = authHeader
    if (hasBody) headers['Content-Type'] = 'application/json; charset=utf-8'
    return headers
  }

  // Return the API methods
  return {
    get: (url: string, options: FetchOptions = {}) => fetchApi(url, { ...options, method: 'GET', headers: createHeaders(false) }),
    post: (url: string, body: any = {}, options: FetchOptions = {}) => fetchApi(url, { ...options, method: 'POST', body, headers: createHeaders(true) }),
    put: (url: string, body: any = {}, options: FetchOptions = {}) => fetchApi(url, { ...options, method: 'PUT', body, headers: createHeaders(true) }),
    patch: (url: string, body: any = {}, options: FetchOptions = {}) => fetchApi(url, { ...options, method: 'PATCH', body, headers: createHeaders(true) }),
    delete: (url: string, options: FetchOptions = {}) => fetchApi(url, { ...options, method: 'DELETE', headers: createHeaders(false) }),
  }
}
