// ~/composables/useApi.ts
import { useRuntimeConfig } from '#app'
import type { FetchOptions } from 'ofetch'

export const useApi = (token: string | null = null) => {
  const config = useRuntimeConfig()

  // Centralized fetch function
  const fetchApi = (url: string, options: FetchOptions) => {
    console.log('--- [useApi] Initiating new API call ---')
    console.log(`[useApi] Received URL: ${url}`)

    // Log environment and config variables
    console.log(`[useApi] process.dev: ${process.dev}`)
    console.log(`[useApi] config.public.apiBase: ${config.public.apiBase}`)

    // Determine the correct baseURL
    const baseURL = process.dev ? '/api/v1' : config.public.apiBase
    console.log(`[useApi] Calculated baseURL: ${baseURL}`)

    // Special case for Sanctum CSRF cookie
    if (url === '/sanctum/csrf-cookie') {
      console.log('[useApi] Handling special case for /sanctum/csrf-cookie')
      const sanctumBaseURL = process.dev ? '' : config.public.apiBase
      console.log(`[useApi] Sanctum baseURL: ${sanctumBaseURL}`)
      return $fetch(url, {
        ...options,
        baseURL: sanctumBaseURL,
        onRequest({ request, options }) {
          console.log('[useApi] Final $fetch request details (Sanctum):', { url: request.toString(), options })
        }
      })
    }

    return $fetch(url, {
      ...options,
      baseURL,
      onRequest({ request, options }) {
        console.log('[useApi] Final $fetch request details:', { url: request.toString(), options })
      }
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
