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
  const loading = useState<boolean>('auth.loading', () => false)

  const config = useRuntimeConfig()
  const apiUrl = config.public.apiBase

  const isLoggedIn = computed(() => !!(user.value && token.value))

  // تابع API ساده‌تر
  const api = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token.value && { Authorization: `Bearer ${token.value}` })
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers },
      body: options.body ? JSON.stringify(options.body) : undefined
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `خطا در درخواست`)
    }

    return data
  }

  // ذخیره اطلاعات احراز هویت
  const saveAuth = (userData: User, tokens: Tokens) => {
    user.value = userData
    token.value = tokens.access_token

    if (process.client) {
      localStorage.setItem('auth_user', JSON.stringify(userData))
      localStorage.setItem('auth_token', tokens.access_token)
      if (tokens.refresh_token) {
        localStorage.setItem('auth_refresh_token', tokens.refresh_token)
      }
    }
  }

  // پاک کردن اطلاعات احراز هویت
  const clearAuth = () => {
    user.value = null
    token.value = ''

    if (process.client) {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_refresh_token')
    }
  }

  // بازیابی اطلاعات از localStorage
  const restoreAuth = () => {
    if (!process.client) return

    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')

    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      } catch {
        clearAuth()
      }
    }
  }

  // بررسی وجود کاربر و پسورد
  const checkUserIdentifier = async (identifier: string) => {
    try {
      const result = await api<ApiResponse>('/auth/check-identifier', {
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
      const result = await api<ApiResponse>('/auth/login-password', {
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
      const result = await api<ApiResponse>('/auth/send-otp', {
        method: 'POST',
        body: { identifier } as any
      })
      return result
    } finally {
      loading.value = false
    }
  }

  // تایید OTP
  const verifyOTP = async (identifier: string, otp: string) => {
    loading.value = true
    try {
      const result = await api<ApiResponse>('/auth/verify-otp', {
        method: 'POST',
        body: { identifier, otp } as any
      })

      if (result.success && result.tokens && result.user) {
        saveAuth(result.user, result.tokens)
      }

      return result
    } finally {
      loading.value = false
    }
  }

  // خروج
  const logout = async () => {
    try {
      if (token.value) {
        await api('/auth/logout', { method: 'POST' })
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
      const result = await api<ApiResponse>('/auth/user', {
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
    loading: readonly(loading),
    isLoggedIn,
    checkUserIdentifier,
    loginPassword,
    sendOTP,
    verifyOTP,
    logout,
    fetchUser,
    clearAuth,
    restoreAuth
  }
}