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
    const hasScheme = /^(Bearer|Token)\s+/.test(rawToken)
    const result = hasScheme ? rawToken : `Bearer ${rawToken}`
    console.log('Authorization header:', result.substring(0, 30) + '...')
    return result
  }

  const createHeaders = (hasBody: boolean) => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }

    const authHeader = normalizeAuthorization(token)
    if (authHeader) headers['Authorization'] = authHeader
    if (hasBody) headers['Content-Type'] = 'application/json; charset=utf-8'

    console.log('Created headers:', { ...headers, Authorization: headers.Authorization ? 'Bearer ***' : 'not set' })
    return headers
  }

  // تابع پردازش response برای تمیز کردن و parse کردن
  const processResponse = (response: any): any => {
    console.log('Processing response:', {
      type: typeof response,
      isString: typeof response === 'string',
      preview: typeof response === 'string' ? response.substring(0, 300) : response
    })

    // اگر response یک string است
    if (typeof response === 'string') {
      try {
        // حذف BOM و کاراکترهای اضافی از ابتدا
        let cleanResponse = response.replace(/^\uFEFF/, '').trim()

        // حذف کامنت‌ها و متن اضافی از ابتدای response
        const lines = cleanResponse.split('\n')
        let jsonStartIndex = -1

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (line.startsWith('{') || line.startsWith('[')) {
            jsonStartIndex = i
            break
          }
        }

        if (jsonStartIndex !== -1) {
          cleanResponse = lines.slice(jsonStartIndex).join('\n')
        }

        // پیدا کردن شروع JSON با regex
        const jsonMatch = cleanResponse.match(/[{\[].*[}\]]/s)
        if (jsonMatch) {
          cleanResponse = jsonMatch[0]
        }

        console.log('Clean response before parsing:', cleanResponse.substring(0, 200))

        const parsed = JSON.parse(cleanResponse)
        console.log('Successfully parsed response:', parsed)
        return parsed

      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError)
        console.error('Original response:', response)

        // اگر parse نشد، response اصلی را برگردان
        return response
      }
    }

    // اگر response یک object است
    return response
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
        onRequestError({ request, error }) {
          console.error('Request Error:', {
            url: request,
            error: error.message
          })
        },
        onResponse({ response }) {
          console.log('Raw response received:', {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            bodyType: typeof response._data
          })
        },
        onResponseError({ request, response }) {
          console.error('API GET Error:', {
            status: response.status,
            statusText: response.statusText,
            url: request,
            response: response._data
          })
        },
        ...options
      }).then(response => {
        return processResponse(response)
      })
    },

    post: (url: string, body = {}, options = {}) => {
      console.log('Making POST request to:', url, 'with body:', body)

      // پردازش body
      let processedBody
      try {
        if (typeof body === 'object' && body !== null) {
          processedBody = JSON.parse(JSON.stringify(body))
        } else {
          processedBody = body
        }
      } catch (error) {
        console.error('Error processing body:', error)
        processedBody = body
      }

      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: processedBody,
        headers: createHeaders(true),
        onRequest({ request, options }) {
          console.log('POST Request details:', {
            url: request,
            headers: options.headers,
            bodyType: typeof options.body,
            bodyKeys: options.body && typeof options.body === 'object' ? Object.keys(options.body) : 'not object'
          })
        },
        onRequestError({ request, error }) {
          console.error('POST Request Error:', {
            url: request,
            error: error.message
          })
        },
        onResponse({ response }) {
          console.log('Raw POST response received:', {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            bodyType: typeof response._data,
            bodyPreview: typeof response._data === 'string' ? response._data.substring(0, 200) : response._data
          })
        },
        onResponseError({ request, response }) {
          console.error('API POST Error:', {
            status: response.status,
            statusText: response.statusText,
            url: request,
            response: response._data
          })
        },
        ...options
      }).then(response => {
        return processResponse(response)
      })
    },

    put: (url: string, body = {}, options = {}) => {
      console.log('Making PUT request to:', url)
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'PUT',
        body,
        headers: createHeaders(true),
        onResponseError({ request, response }) {
          console.error('API PUT Error:', response.status, response.statusText)
          console.error('Request URL:', request)
          console.error('Response:', response._data)
        },
        ...options
      }).then(response => {
        return processResponse(response)
      })
    },

    patch: (url: string, body = {}, options = {}) => {
      console.log('Making PATCH request to:', url)
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'PATCH',
        body,
        headers: createHeaders(true),
        onResponseError({ request, response }) {
          console.error('API PATCH Error:', response.status, response.statusText)
          console.error('Request URL:', request)
          console.error('Response:', response._data)
        },
        ...options
      }).then(response => {
        return processResponse(response)
      })
    },

    delete: (url: string, options = {}) => {
      console.log('Making DELETE request to:', url)
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'DELETE',
        headers: createHeaders(false),
        onResponseError({ request, response }) {
          console.error('API DELETE Error:', response.status, response.statusText)
          console.error('Request URL:', request)
          console.error('Response:', response._data)
        },
        ...options
      }).then(response => {
        return processResponse(response)
      })
    }
  }
}
