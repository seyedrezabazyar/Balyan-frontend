// ~/composables/useApi.ts
import { useRuntimeConfig } from '#app'

export const useApi = (token: string | null = null) => {
  const config = useRuntimeConfig()

  console.log('useApi called with token:', token ? `${token.substring(0, 20)}...` : 'null')

  const normalizeAuthorization = (rawToken: string | null): string | undefined => {
    if (!rawToken) {
      console.log('No token provided to normalizeAuthorization')
      return undefined
    }
    // Preserve if already includes a scheme, otherwise default to Bearer
    const hasScheme = /^(Bearer|Token)\s+/.test(rawToken)
    const result = hasScheme ? rawToken : `Bearer ${rawToken}`
    console.log('Authorization header:', result.substring(0, 30) + '...')
    return result
  }

  const createHeaders = (hasBody: boolean) => {
    const headers: Record<string, string> = {
      'Accept': 'application/json'
    }

    const authHeader = normalizeAuthorization(token)
    if (authHeader) headers['Authorization'] = authHeader
    if (hasBody) headers['Content-Type'] = 'application/json'

    console.log('Created headers:', { ...headers, Authorization: headers.Authorization ? 'Bearer ***' : 'not set' })
    return headers
  }

  return {
    get: (url: string, options = {}) => {
      console.log('Making GET request to:', url)
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'GET',
        headers: createHeaders(false),
        onRequest({ request, options }) {
          console.log('Request details:', {
            url: request,
            headers: options.headers
          })
        },
        onResponseError({ request, response, options }) {
          console.error('API GET Error:', {
            status: response.status,
            statusText: response.statusText,
            url: request,
            response: response._data
          })
        },
        ...options
      })
    },

    post: (url: string, body = {}, options = {}) => {
      console.log('Making POST request to:', url, 'with body:', body)
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'POST',
        body,
        headers: createHeaders(true),
        onRequest({ request, options }) {
          console.log('POST Request details:', {
            url: request,
            headers: options.headers,
            body: options.body
          })
        },
        onResponseError({ request, response, options }) {
          console.error('API POST Error:', {
            status: response.status,
            statusText: response.statusText,
            url: request,
            response: response._data
          })
        },
        ...options
      })
    },

    put: (url: string, body = {}, options = {}) => {
      console.log('Making PUT request to:', url)
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'PUT',
        body,
        headers: createHeaders(true),
        onResponseError({ request, response, options }) {
          console.error('API PUT Error:', response.status, response.statusText)
          console.error('Request URL:', request)
          console.error('Response:', response._data)
        },
        ...options
      })
    },

    patch: (url: string, body = {}, options = {}) => {
      console.log('Making PATCH request to:', url)
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'PATCH',
        body,
        headers: createHeaders(true),
        onResponseError({ request, response, options }) {
          console.error('API PATCH Error:', response.status, response.statusText)
          console.error('Request URL:', request)
          console.error('Response:', response._data)
        },
        ...options
      })
    },

    delete: (url: string, options = {}) => {
      console.log('Making DELETE request to:', url)
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'DELETE',
        headers: createHeaders(false),
        onResponseError({ request, response, options }) {
          console.error('API DELETE Error:', response.status, response.statusText)
          console.error('Request URL:', request)
          console.error('Response:', response._data)
        },
        ...options
      })
    }
  }
}
