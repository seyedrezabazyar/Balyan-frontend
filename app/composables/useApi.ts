// ~/composables/useApi.ts
import { useRuntimeConfig } from '#app'

export const useApi = (token: string | null = null) => {
  const config = useRuntimeConfig()

  const normalizeAuthorization = (rawToken: string | null): string | undefined => {
    if (!rawToken) return undefined
    // Preserve if already includes a scheme, otherwise default to Bearer
    const hasScheme = /^(Bearer|Token)\s+/.test(rawToken)
    return hasScheme ? rawToken : `Bearer ${rawToken}`
  }

  const createHeaders = (hasBody: boolean) => {
    const headers: Record<string, string> = {
      'Accept': 'application/json'
    }

    const authHeader = normalizeAuthorization(token)
    if (authHeader) headers['Authorization'] = authHeader
    if (hasBody) headers['Content-Type'] = 'application/json'

    return headers
  }

  return {
    get: (url: string, options = {}) => {
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'GET',
        headers: createHeaders(false),
        ...options
      })
    },

    post: (url: string, body = {}, options = {}) => {
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'POST',
        body,
        headers: createHeaders(true),
        ...options
      })
    },

    put: (url: string, body = {}, options = {}) => {
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'PUT',
        body,
        headers: createHeaders(true),
        ...options
      })
    },

    patch: (url: string, body = {}, options = {}) => {
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'PATCH',
        body,
        headers: createHeaders(true),
        ...options
      })
    },

    delete: (url: string, options = {}) => {
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'DELETE',
        headers: createHeaders(false),
        ...options
      })
    }
  }
}
