interface User {
  id: number
  name: string
  email?: string
  phone?: string
  username?: string
  email_verified_at?: string
  phone_verified_at?: string
  created_at: string
  last_login_at?: string
  preferred_method?: 'password' | 'otp'
}

interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  user?: User
  token?: string
  status?: string
}

export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const token = useState<string>('auth.token', () => '')
  const loading = useState<boolean>('auth.loading', () => false)

  const config = useRuntimeConfig()
  const apiUrl = config.public.apiBase

  const isLoggedIn = computed(() => !!(user.value && token.value))

  const api = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    try {
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
        throw new Error(data.message || `HTTP ${response.status}`)
      }

      return data
    } catch (error: any) {
      console.error(`API Error (${endpoint}):`, error)
      throw new Error(error.message || 'خطا در ارتباط با سرور')
    }
  }

  const initialize = () => {
    if (!process.client) return

    try {
      const savedToken = localStorage.getItem('auth_access_token')
      const savedUser = localStorage.getItem('auth_user')

      if (savedToken && savedUser) {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      clearAuth()
    }
  }

  const saveAuth = (userData: User, userToken: string) => {
    user.value = userData
    token.value = userToken

    if (process.client) {
      localStorage.setItem('auth_user', JSON.stringify(userData))
      localStorage.setItem('auth_access_token', userToken)
    }
  }

  const clearAuth = () => {
    user.value = null
    token.value = ''

    if (process.client) {
      ['auth_user', 'auth_access_token', 'auth_refresh_token'].forEach(key =>
        localStorage.removeItem(key)
      )
    }
  }

  const checkUser = async (identifier: string) => {
    loading.value = true
    try {
      return await api<User>('/auth/check-user', {
        method: 'POST',
        body: { identifier } as any
      })
    } finally {
      loading.value = false
    }
  }

  const loginPassword = async (identifier: string, password: string) => {
    loading.value = true
    try {
      const result = await api('/auth/login-password', {
        method: 'POST',
        body: { identifier, password } as any
      })

      if (result.success && result.user && result.token) {
        saveAuth(result.user, result.token)
      }

      return result
    } finally {
      loading.value = false
    }
  }

  const sendOTP = async (identifier: string) => {
    loading.value = true
    try {
      return await api('/auth/send-otp', {
        method: 'POST',
        body: { identifier } as any
      })
    } finally {
      loading.value = false
    }
  }

  const verifyOTP = async (identifier: string, otp: string, name?: string) => {
    loading.value = true
    try {
      const result = await api('/auth/verify-otp', {
        method: 'POST',
        body: { identifier, otp, name } as any
      })

      if (result.success && result.user && result.token) {
        saveAuth(result.user, result.token)
      }

      return result
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    loading.value = true
    try {
      const result = await api<User>('/user/profile', {
        method: 'PUT',
        body: profileData as any
      })

      if (result.success && result.user) {
        user.value = result.user
        saveAuth(result.user, token.value)
      }

      return result
    } finally {
      loading.value = false
    }
  }

  const setPassword = async (password: string) => {
    loading.value = true
    try {
      return await api('/user/set-password', {
        method: 'POST',
        body: { password } as any
      })
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    loading.value = true
    try {
      return await api('/user/change-password', {
        method: 'POST',
        body: {
          current_password: currentPassword,
          new_password: newPassword
        } as any
      })
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await api('/auth/logout', { method: 'POST' })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
    }
  }

  const logoutAll = async () => {
    try {
      if (token.value) {
        await api('/auth/logout-all', { method: 'POST' })
      }
    } catch (error) {
      console.error('Logout all error:', error)
    } finally {
      clearAuth()
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),
    isLoggedIn,
    initialize,
    checkUser,
    loginPassword,
    sendOTP,
    verifyOTP,
    updateProfile,
    setPassword,
    updatePassword,
    logout,
    logoutAll,
    clearAuth
  }
}
