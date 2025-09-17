// composables/useApiAuth.ts
import { useAuthStore } from '~/stores/auth'
import { useApiDebugger } from '~/composables/useApiDebugger'

export const useApiAuth = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || '/api/v1'
  const { addLog, updateLog } = useApiDebugger()

  const $api = $fetch.create({
    baseURL,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    onRequest({ request, options }) {
      // Debugger logic
      const newLog = addLog({
        method: options.method || 'GET',
        url: request.toString(),
        request: options.body,
      })
      options.headers = options.headers || {}
      options.headers['X-Request-ID'] = newLog.id

      // Original auth logic
      const authStore = useAuthStore()
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.token}`,
        }
      }
    },
    onResponse({ request, response, options }) {
      const logId = options.headers['X-Request-ID']
      if (logId) {
        updateLog(logId, {
          response: response._data,
          status: response.status,
          statusText: response.statusText,
          endTime: Date.now(),
        })
      }
    },
    onRequestError({ request, error, options }) {
      const logId = options.headers['X-Request-ID']
      if (logId) {
        updateLog(logId, {
          error: error,
          endTime: Date.now(),
        })
      }
    },
    onResponseError({ request, response, options }) {
      // Debugger logic
      const logId = options.headers['X-Request-ID']
      if (logId) {
        updateLog(logId, {
          response: response._data,
          status: response.status,
          statusText: response.statusText,
          endTime: Date.now(),
        })
      }

      // Original auth logic
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
