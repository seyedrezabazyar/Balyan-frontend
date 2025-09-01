export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const createHeaders = () => {
    return {
      'Authorization': authStore.token ? `Bearer ${authStore.token}` : '',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  return {
    get: (url: string, options = {}) => {
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'GET',
        headers: createHeaders(),
        ...options
      })
    },

    post: (url: string, body = {}, options = {}) => {
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'POST',
        body,
        headers: createHeaders(),
        ...options
      })
    },

    put: (url: string, body = {}, options = {}) => {
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'PUT',
        body,
        headers: createHeaders(),
        ...options
      })
    },

    patch: (url: string, body = {}, options = {}) => {
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'PATCH',
        body,
        headers: createHeaders(),
        ...options
      })
    },

    delete: (url: string, options = {}) => {
      return $fetch(url, {
        baseURL: config.public.apiBase,
        method: 'DELETE',
        headers: createHeaders(),
        ...options
      })
    }
  }
}
