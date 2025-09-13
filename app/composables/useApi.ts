// ~/composables/useApi.ts
import { useRuntimeConfig } from '#app'
import type { FetchOptions } from 'ofetch'

export const useApi = (token: string | null = null) => {
  const config = useRuntimeConfig()

  const fetchApi = (url: string, options: FetchOptions) => {
    // Get the base URL from the public runtime config.
    const apiBase = config.public.apiBase || ''

    // Handle the Sanctum CSRF cookie route as a special case.
    if (url === '/sanctum/csrf-cookie') {
      return $fetch(url, { ...options, baseURL: apiBase })
    }

    // Always construct the full versioned URL.
    // Call sites should NOT include /v1/.
    const versionedApiBase = `${apiBase}/v1`

    return $fetch(url, {
      ...options,
      baseURL: versionedApiBase
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
