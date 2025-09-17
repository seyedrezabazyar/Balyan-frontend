// composables/useApi.ts
import { useApiDebugger } from '~/composables/useApiDebugger'

// This is the public API client. It does not send authentication headers.
// For authenticated requests, use useApiAuth.ts

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || '/api/v1'
  const { addLog, updateLog } = useApiDebugger()

  const $api = $fetch.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    onRequest({ request, options }) {
      const newLog = addLog({
        method: options.method || 'GET',
        url: request.toString(),
        request: options.body,
      })
      options.headers = options.headers || {}
      options.headers['X-Request-ID'] = newLog.id
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
      const logId = options.headers['X-Request-ID']
      if (logId) {
        updateLog(logId, {
          response: response._data,
          status: response.status,
          statusText: response.statusText,
          endTime: Date.now(),
        })
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
