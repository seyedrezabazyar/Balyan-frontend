// app/composables/useAuth.ts - نسخه ساده و بهینه شده
interface User {
  id: number
  name: string
  email?: string
  phone?: string
  username?: string
  email_verified_at?: string
  phone_verified_at?: string
  preferred_method?: 'password' | 'otp'
  avatar_url?: string
  last_login_at?: string
}

interface Tokens {
  access_token: string
  refresh_token?: string
  token_type?: string
  expires_in?: number
  expires_at?: string
}

interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  user?: User
  tokens?: Tokens
  is_new_user?: boolean
  status?: string
  type?: string
  debug_code?: string
}

export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const token = useState<string>('auth.token', () => '')
  const refreshToken = useState<string>('auth.refreshToken', () => '')
  const expiresAt = useState<string | null>('auth.expiresAt', () => null)
  const loading = useState<boolean>('auth.loading', () => false)
  const initialized = useState<boolean>('auth.initialized', () => false)

  const config = useRuntimeConfig()
  const apiUrl = config.public.apiBase

  const isLoggedIn = computed(() => !!(user.value && token.value))

  // تابع API ساده‌تر
  const api = async <T = any>(
    endpoint: string,
    options: RequestInit & { body?: any } = {}
  ): Promise<T> => {
    const headers: HeadersInit = {
      'Accept': 'application/json',
      ...(token.value && { Authorization: `Bearer ${token.value}` })
    }

    // Only add Content-Type for requests with body
    if (options.body && options.method !== 'GET') {
      headers['Content-Type'] = 'application/json'
    }

    const requestOptions: RequestInit = {
      ...options,
      headers: { ...headers, ...options.headers }
    }

    // Handle body - only stringify if it's an object and not already a string
    if (options.body && typeof options.body === 'object') {
      requestOptions.body = JSON.stringify(options.body)
    } else if (options.body) {
      requestOptions.body = options.body
    }

    const url = endpoint.startsWith('/api/') ? endpoint : `${apiUrl}${endpoint}`
    const response = await fetch(url, requestOptions)

    let data: any
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      // If not JSON, return text as is
      const text = await response.text()
      try {
        data = JSON.parse(text)
      } catch {
        data = { message: text }
      }
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `خطا در درخواست: ${response.status}`)
    }

    return data
  }

  // ذخیره اطلاعات احراز هویت
  const saveAuth = (userData: User, tokens: Tokens) => {
    user.value = userData
    token.value = tokens.access_token
    if (tokens.refresh_token) {
      refreshToken.value = tokens.refresh_token
    }
    expiresAt.value = tokens.expires_at || null

    if (process.client) {
      localStorage.setItem('auth_user', JSON.stringify(userData))
      localStorage.setItem('auth_token', tokens.access_token)
      if (tokens.refresh_token) {
        localStorage.setItem('auth_refresh_token', tokens.refresh_token)
      }
      if (tokens.expires_at) {
        localStorage.setItem('auth_expires_at', tokens.expires_at)
      }
    }
  }

  // به‌روزرسانی فقط توکن‌ها
  const updateTokens = (tokens: Tokens) => {
    token.value = tokens.access_token
    if (tokens.refresh_token) {
      refreshToken.value = tokens.refresh_token
    }
    expiresAt.value = tokens.expires_at || null

    if (process.client) {
      localStorage.setItem('auth_token', tokens.access_token)
      if (tokens.refresh_token) {
        localStorage.setItem('auth_refresh_token', tokens.refresh_token)
      }
      if (tokens.expires_at) {
        localStorage.setItem('auth_expires_at', tokens.expires_at)
      }
    }
  }

  // پاک کردن اطلاعات احراز هویت
  const clearAuth = () => {
    user.value = null
    token.value = ''
    refreshToken.value = ''
    expiresAt.value = null

    if (process.client) {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_refresh_token')
      localStorage.removeItem('auth_expires_at')
    }
  }

  // بازیابی اطلاعات از localStorage
  const restoreAuth = async () => {
    if (!process.client) {
      initialized.value = true
      return
    }

    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    const savedRefresh = localStorage.getItem('auth_refresh_token')
    const savedExpiresAt = localStorage.getItem('auth_expires_at')

    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
        refreshToken.value = savedRefresh || ''
        expiresAt.value = savedExpiresAt || null
      } catch {
        clearAuth()
      }
    }
    
    initialized.value = true
  }
  
  // Initialize function (alias for restoreAuth for compatibility)
  const initialize = async () => {
    if (!initialized.value) {
      await restoreAuth()
    }
  }
  
  // Wait for initialization
  const waitForInitialization = async () => {
    if (initialized.value) return
    
    // Wait up to 2 seconds for initialization
    for (let i = 0; i < 20; i++) {
      if (initialized.value) return
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  // بررسی وجود کاربر و پسورد
  const checkUserIdentifier = async (identifier: string) => {
    try {
      const result = await api<ApiResponse>('/api/auth/check-user', {
        method: 'POST',
        body: { identifier } as any
      })
      return result
    } catch (err) {
      // در صورت خطا، فرض کن کاربر جدید است
      return { success: false, data: null }
    }
  }

  // ورود با رمز عبور
  const loginPassword = async (identifier: string, password: string) => {
    loading.value = true
    try {
      const result = await api<ApiResponse>('/api/auth/login-password', {
        method: 'POST',
        body: { identifier, password } as any
      })

      if (result.success && result.tokens && result.user) {
        saveAuth(result.user, result.tokens)
      }

      return result
    } finally {
      loading.value = false
    }
  }

  // ارسال OTP
  const sendOTP = async (identifier: string) => {
    loading.value = true
    try {
      const result = await api<ApiResponse>('/api/auth/send-otp', {
        method: 'POST',
        body: { identifier } as any
      })
      return result
    } finally {
      loading.value = false
    }
  }

  // تایید OTP
  const verifyOTP = async (identifier: string, otp: string, name: string | null = null) => {
    loading.value = true
    try {
      const result = await api<ApiResponse>('/api/auth/verify-otp', {
        method: 'POST',
        body: { identifier, otp, name } as any
      })

      if (result.success && result.tokens && result.user) {
        saveAuth(result.user, result.tokens)
      }

      return result
    } finally {
      loading.value = false
    }
  }

  // رفرش توکن‌ها
  const refreshTokens = async (): Promise<boolean> => {
    if (!process.client) return false
    const currentRefresh = refreshToken.value || localStorage.getItem('auth_refresh_token') || ''
    if (!currentRefresh) return false

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentRefresh}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      if (response.ok && result.success && result.tokens) {
        updateTokens(result.tokens)
        return true
      }
    } catch {
      // ignore
    }

    clearAuth()
    return false
  }

  // بروزرسانی پروفایل
  const updateProfile = async (payload: { name?: string; phone?: string }) => {
    const result = await api<ApiResponse>('/api/auth/profile/update', {
      method: 'POST',
      body: payload as any
    })
    if (result.success && result.user) {
      user.value = result.user
      if (process.client) localStorage.setItem('auth_user', JSON.stringify(result.user))
    }
    return result
  }

  // ست کردن رمز عبور برای کاربران OTP-only
  const setPassword = async (payload: { password: string; password_confirmation: string }) => {
    return api<ApiResponse>('/api/auth/password/set', {
      method: 'POST',
      body: payload as any
    })
  }

  // تغییر رمز عبور
  const updatePassword = async (payload: { current_password: string; password: string; password_confirmation: string }) => {
    return api<ApiResponse>('/api/auth/password/update', {
      method: 'POST',
      body: payload as any
    })
  }

  // خروج از تمام دستگاه‌ها
  const logoutAll = async () => {
    try {
      if (token.value) {
        await api('/api/auth/logout-all', { method: 'POST' })
      }
    } catch {
      // ignore
    }
  }

  // خروج
  const logout = async () => {
    try {
      if (token.value) {
        await api('/api/auth/logout', { method: 'POST' })
      }
    } catch {
      // ignore errors
    } finally {
      clearAuth()
      await navigateTo('/auth')
    }
  }

  // بازیابی اطلاعات کاربر
  const fetchUser = async () => {
    if (!token.value) return null

    try {
      const result = await api<ApiResponse>('/api/auth/user', {
        method: 'GET'
      })
      
      if (result.user) {
        user.value = result.user
      }
      
      return result.user
    } catch {
      clearAuth()
      return null
    }
  }

  // Initialize on client side
  if (process.client) {
    restoreAuth()
  }

  return {
    user: readonly(user),
    token: readonly(token),
    refreshToken: readonly(refreshToken),
    expiresAt: readonly(expiresAt),
    loading: readonly(loading),
    initialized: readonly(initialized),
    isLoggedIn,
    isAuthenticated: isLoggedIn,
    api,
    checkUserIdentifier,
    loginPassword,
    sendOTP,
    verifyOTP,
    logout,
    fetchUser,
    clearAuth,
    restoreAuth,
    initialize,
    waitForInitialization,
    refreshTokens,
    updateProfile,
    setPassword,
    updatePassword,
    logoutAll
  }
}