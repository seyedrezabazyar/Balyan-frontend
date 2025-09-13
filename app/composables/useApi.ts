// ~/composables/useApi.ts
import { useRuntimeConfig } from '#app'
import type { FetchOptions } from 'ofetch'

export const useApi = (token: string | null = null) => {
  const config = useRuntimeConfig()

  // Centralized fetch function
  const fetchApi = (url: string, options: FetchOptions) => {
    // Determine the correct baseURL
    // In Development: Always use the relative path for the Nuxt proxy.
    // In Production: Use the environment variable.
    const baseURL = process.dev ? '/api/v1' : config.public.apiBase

    // Special case for Sanctum CSRF cookie, which should not be prefixed with /api/v1.
    if (url === '/sanctum/csrf-cookie') {
      // In dev, let the proxy handle it from the root. In prod, use the full base URL.
      const sanctumBaseURL = process.dev ? '' : config.public.apiBase
      return $fetch(url, {
        ...options,
        baseURL: sanctumBaseURL
      })
    }

    return $fetch(url, {
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

  return {
    get: (url: string, options: FetchOptions = {}) => {
      return fetchApi(url, {
        ...options,
        method: 'GET',
        headers: createHeaders(false),
      })
    },
    post: (url: string, body: any = {}, options: FetchOptions = {}) => {
      return fetchApi(url, {
        ...options,
        method: 'POST',
        body,
        headers: createHeaders(true),
      })
    },
    put: (url: string, body: any = {}, options: FetchOptions = {}) => {
      return fetchApi(url, {
        ...options,
        method: 'PUT',
        body,
        headers: createHeaders(true),
      })
    },
    patch: (url: string, body: any = {}, options: FetchOptions = {}) => {
      return fetchApi(url, {
        ...options,
        method: 'PATCH',
        body,
        headers: true,
      })
    },
    delete: (url: string, options: FetchOptions = {}) => {
      return fetchApi(url, {
        ...options,
        method: 'DELETE',
        headers: createHeaders(false),
      })
    },
  }
}
