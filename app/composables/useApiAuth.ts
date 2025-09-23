// composables/useApiAuth.ts
import { useAuthStore } from '~/stores/auth'
import { useApiDebugger } from '~/composables/useApiDebugger'
import { useDebugStore } from '~/stores/debug'

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

      // --- TEMPORARY DEBUG LOGGING to store ---
      const debugStore = useDebugStore()
      // ----------------------------------------

      // Original auth logic
      const authStore = useAuthStore()
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.token}`,
        }
      }

      // --- Log headers after potential modification ---
      debugStore.addRequestLog(request.toString(), options.headers)
      // ----------------------------------------------
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
        // Only clear auth if we are sure the user was actually authenticated
        // before this call. If `currentUser` is null, it means we are likely
        // in the middle of the initAuth process. A 401 here is probably
        // a race condition, not an invalid session.
        if (authStore.currentUser) {
          authStore.clearAuth()
        }
        // Do not clear auth if currentUser is not set, to prevent logging out
        // during the initial auth race condition.
      }
    }
  })

  return {
    get: (url: string, opts?: any) => $api(url, { method: 'GET', ...opts }),
    post: (url: string, body?: any, opts?: any) => $api(url, { method: 'POST', body, ...opts }),
    put: (url: string, body?: any, opts?: any) => $api(url, { method: 'PUT', body, ...opts }),
    patch: (url: string, body?: any, opts?: any) => $api(url, { method: 'PATCH', body, ...opts }),
    delete: (url: string, opts?: any) => $api(url, { method: 'DELETE', ...opts }),
    $api,
  }
}
