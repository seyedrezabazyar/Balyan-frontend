// ~/composables/useApi.ts
import { useRuntimeConfig } from '#app'
import type { FetchOptions } from 'ofetch'

// A centralized fetch function that handles API base URL and versioning.
const useFetchApi = (url: string, options: FetchOptions) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || '/api/v1'

  // In development, Nuxt's proxy is used, so we call the path directly.
  // In production, we use the configured apiBase as the baseURL.
  const baseURL = process.dev ? '' : apiBase;

  // Prepend the API version path if it's not already in the URL,
  // but avoid prefixing special paths like /sanctum.
  const fullUrl = (url.startsWith('/api') || url.startsWith('/sanctum')) ? url : `${apiBase}${url}`

  return $fetch(fullUrl, {
    ...options,
    baseURL,
    credentials: 'include',
    onRequest({ request, options }) {
      console.log('Request details:', {
        url: request,
        baseURL: options.baseURL,
        headers: options.headers,
      })
    },
    onRequestError({ request, error }) {
      console.error('Request Error:', { url: request, error: error.message })
    },
    onResponse({ response }) {
      console.log('Raw response received:', {
        status: response.status,
        bodyType: typeof response._data,
      })
    },
    onResponseError({ request, response }) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: request,
        response: response._data,
      })
    },
  })
}

export const useApi = (token: string | null = null) => {
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

  const processResponse = (response: any): any => {
    if (typeof response === 'string') {
      const trimmed = response.trim()
      if (trimmed && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
        try {
          return JSON.parse(trimmed)
        } catch (e) {
          console.error('Failed to parse response string as JSON:', e)
          return response
        }
      }
    }
    return response
  }

  return {
    get: (url: string, options: FetchOptions = {}) => {
      return useFetchApi(url, {
        ...options,
        method: 'GET',
        headers: createHeaders(false),
      }).then(processResponse)
    },

    post: (url: string, body: any = {}, options: FetchOptions = {}) => {
      return useFetchApi(url, {
        ...options,
        method: 'POST',
        body,
        headers: createHeaders(true),
      }).then(processResponse)
    },

    put: (url: string, body: any = {}, options: FetchOptions = {}) => {
      return useFetchApi(url, {
        ...options,
        method: 'PUT',
        body,
        headers: createHeaders(true),
      }).then(processResponse)
    },

    patch: (url: string, body: any = {}, options: FetchOptions = {}) => {
      return useFetchApi(url, {
        ...options,
        method: 'PATCH',
        body,
        headers: createHeaders(true),
      }).then(processResponse)
    },

    delete: (url: string, options: FetchOptions = {}) => {
      return useFetchApi(url, {
        ...options,
        method: 'DELETE',
        headers: createHeaders(false),
      }).then(processResponse)
    },
  }
}
