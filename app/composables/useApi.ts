// app/composables/useApi.ts
interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  meta?: any
  errors?: Record<string, string[]>
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'

interface ApiOptions extends Omit<RequestInit, 'headers' | 'body' | 'method'> {
  headers?: HeadersInit | Record<string, string>
  body?: any
  method?: HttpMethod
  requireAuth?: boolean
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiBase
  const router = useRouter()
  const { showToast } = useToast()

  // Token management
  const getAccessToken = () => {
    if (process.client) {
      return (
        localStorage.getItem('access_token') ||
        localStorage.getItem('auth_token') ||
        null
      )
    }
    return null
  }

  const getRefreshToken = () => {
    if (process.client) {
      return (
        localStorage.getItem('refresh_token') ||
        localStorage.getItem('auth_refresh_token') ||
        null
      )
    }
    return null
  }

  const setTokens = (accessToken: string, refreshToken?: string) => {
    if (process.client) {
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('auth_token', accessToken)
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken)
        localStorage.setItem('auth_refresh_token', refreshToken)
      }
    }
  }

  const clearTokens = () => {
    if (process.client) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('auth_refresh_token')
    }
  }

  // Refresh token
  const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return null

    try {
      const response = await $fetch<ApiResponse>(`${apiUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Accept': 'application/json'
        }
      })

      if (response.success && response.data?.tokens) {
        const { access_token, refresh_token } = response.data.tokens
        setTokens(access_token, refresh_token)
        return access_token
      }
    } catch (error) {
      console.error('Failed to refresh token:', error)
      clearTokens()
    }

    return null
  }

  // Main API function
  const api = async <T = any>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    const { 
      body, 
      requireAuth = true,
      headers = {},
      ...fetchOptions 
    } = options

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>)
    }

    // Add auth token if required
    if (requireAuth) {
      const token = getAccessToken()
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`
      }
    }

    // Prepare body
    let requestBody = undefined
    if (body) {
      if (body instanceof FormData) {
        requestBody = body
        delete requestHeaders['Content-Type'] // Let browser set it for FormData
      } else {
        requestBody = JSON.stringify(body)
      }
    }

    // Full URL
    const url = endpoint.startsWith('http') ? endpoint : `${apiUrl}${endpoint}`

    try {
      const response = await $fetch<ApiResponse<T>>(url, {
        ...fetchOptions,
        method: (fetchOptions.method as HttpMethod) || 'GET',
        headers: requestHeaders,
        body: requestBody
      })

      return response
    } catch (error: any) {
      // Handle 401 Unauthorized
      if (error.statusCode === 401 && requireAuth) {
        const newToken = await refreshAccessToken()
        
        if (newToken) {
          // Retry with new token
          requestHeaders.Authorization = `Bearer ${newToken}`
          
          try {
            const retryResponse = await $fetch<ApiResponse<T>>(url, {
              ...fetchOptions,
              method: (fetchOptions.method as HttpMethod) || 'GET',
              headers: requestHeaders,
              body: requestBody
            })
            
            return retryResponse
          } catch (retryError: any) {
            handleApiError(retryError)
            throw retryError
          }
        } else {
          // Refresh failed, redirect to login
          clearTokens()
          await router.push('/auth')
          showToast('نشست شما منقضی شده است. لطفا دوباره وارد شوید', 'error')
        }
      }

      handleApiError(error)
      throw error
    }
  }

  // Error handler
  const handleApiError = (error: any) => {
    console.error('API Error:', error)

    if (error.statusCode === 403) {
      showToast('شما دسترسی به این بخش را ندارید', 'error')
    } else if (error.statusCode === 404) {
      showToast('صفحه مورد نظر یافت نشد', 'error')
    } else if (error.statusCode === 422) {
      const errors = error.data?.errors
      if (errors) {
        const firstError = Object.values(errors)[0]
        if (Array.isArray(firstError) && firstError.length > 0) {
          showToast(firstError[0], 'error')
        }
      } else {
        showToast('خطا در اعتبارسنجی داده‌ها', 'error')
      }
    } else if (error.statusCode === 500) {
      showToast('خطای سرور. لطفا بعدا تلاش کنید', 'error')
    } else if (error.statusCode === 429) {
      showToast('تعداد درخواست‌ها بیش از حد مجاز است. لطفا کمی صبر کنید', 'error')
    }
  }

  // Convenience methods
  const get = <T = any>(endpoint: string, options?: ApiOptions) => {
    return api<T>(endpoint, { ...options, method: 'GET' })
  }

  const post = <T = any>(endpoint: string, body?: any, options?: ApiOptions) => {
    return api<T>(endpoint, { ...options, method: 'POST', body })
  }

  const put = <T = any>(endpoint: string, body?: any, options?: ApiOptions) => {
    return api<T>(endpoint, { ...options, method: 'PUT', body })
  }

  const patch = <T = any>(endpoint: string, body?: any, options?: ApiOptions) => {
    return api<T>(endpoint, { ...options, method: 'PATCH', body })
  }

  const del = <T = any>(endpoint: string, options?: ApiOptions) => {
    return api<T>(endpoint, { ...options, method: 'DELETE' })
  }

  return {
    api,
    get,
    post,
    put,
    patch,
    delete: del,
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
    refreshAccessToken
  }
}