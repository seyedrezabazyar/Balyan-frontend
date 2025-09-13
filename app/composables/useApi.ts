// composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || '/api/v1'  // Prefix ثابت: /api/v1

  const $api = $fetch.create({
    baseURL,
    credentials: 'include',  // برای cookies/sessions (مثل Sanctum)
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return {
    $api,
    get: (url: string, opts?: any) => $api(url, { method: 'GET', ...opts }),
    post: (url: string, body?: any, opts?: any) => $api(url, { method: 'POST', body, ...opts }),
    // ...add put, delete اگر لازم
  }
}
