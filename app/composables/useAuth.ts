// composables/useAuth.ts
interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  username?: string;
  email_verified_at?: string;
  phone_verified_at?: string;
  created_at: string;
  last_login_at?: string;
  preferred_method?: 'password' | 'otp';
}

interface ApiResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
  status?: string;
  data?: any;
}

export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const token = useState<string>('auth.token', () => '')
  const loading = useState<boolean>('auth.loading', () => false)

  const config = useRuntimeConfig()
  const apiUrl = config.public.apiBase || 'http://127.0.0.1:8000/api'

  // Computed properties
  const isLoggedIn = computed(() => !!(user.value && token.value))

  // API helper with better error handling
  const api = async (endpoint: string, options: RequestInit = {}): Promise<ApiResponse> => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }

      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
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

  // Initialize auth from localStorage
  const initialize = () => {
    if (process.client) {
      try {
        // Check new auth system first
        const savedToken = localStorage.getItem('auth_access_token')
        const savedUser = localStorage.getItem('auth_user')

        if (savedToken && savedUser) {
          token.value = savedToken
          user.value = JSON.parse(savedUser)
          return
        }

        // Fallback to old system
        const legacyToken = localStorage.getItem('token')
        const legacyUser = localStorage.getItem('user')

        if (legacyToken && legacyUser) {
          token.value = legacyToken
          user.value = JSON.parse(legacyUser)
          // Migrate to new system
          saveAuth(user.value, legacyToken)
          // Clean old keys
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        clearAuth()
      }
    }
  }

  // Save auth data
  const saveAuth = (userData: User, userToken: string) => {
    user.value = userData
    token.value = userToken

    if (process.client) {
      try {
        localStorage.setItem('auth_user', JSON.stringify(userData))
        localStorage.setItem('auth_access_token', userToken)

        // Also save legacy format for compatibility
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', userToken)
        localStorage.setItem('isLoggedIn', 'true')
      } catch (error) {
        console.error('Error saving auth data:', error)
      }
    }
  }

  // Clear auth data
  const clearAuth = () => {
    user.value = null
    token.value = ''

    if (process.client) {
      try {
        // Clear all possible auth keys
        const authKeys = [
          'auth_user', 'auth_access_token', 'auth_refresh_token',
          'user', 'token', 'isLoggedIn', 'username'
        ]
        authKeys.forEach(key => localStorage.removeItem(key))
      } catch (error) {
        console.error('Error clearing auth data:', error)
      }
    }
  }

  // Auth methods
  const checkUser = async (identifier: string): Promise<ApiResponse> => {
    loading.value = true
    try {
      return await api('/auth/check-user', {
        method: 'POST',
        body: { identifier }
      })
    } finally {
      loading.value = false
    }
  }

  const loginPassword = async (identifier: string, password: string): Promise<ApiResponse> => {
    loading.value = true
    try {
      const result = await api('/auth/login-password', {
        method: 'POST',
        body: { identifier, password }
      })

      if (result.success && result.user && result.token) {
        saveAuth(result.user, result.token)
      }

      return result
    } finally {
      loading.value = false
    }
  }

  const sendOTP = async (identifier: string): Promise<ApiResponse> => {
    loading.value = true
    try {
      return await api('/auth/send-otp', {
        method: 'POST',
        body: { identifier }
      })
    } finally {
      loading.value = false
    }
  }

  const verifyOTP = async (identifier: string, otp: string, name?: string): Promise<ApiResponse> => {
    loading.value = true
    try {
      const result = await api('/auth/verify-otp', {
        method: 'POST',
        body: { identifier, otp, name }
      })

      if (result.success && result.user && result.token) {
        saveAuth(result.user, result.token)
      }

      return result
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData: Partial<User>): Promise<ApiResponse> => {
    loading.value = true
    try {
      const result = await api('/user/profile', {
        method: 'PUT',
        body: profileData
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

  const setPassword = async (password: string): Promise<ApiResponse> => {
    loading.value = true
    try {
      return await api('/user/set-password', {
        method: 'POST',
        body: { password }
      })
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<ApiResponse> => {
    loading.value = true
    try {
      return await api('/user/change-password', {
        method: 'POST',
        body: { current_password: currentPassword, new_password: newPassword }
      })
    } finally {
      loading.value = false
    }
  }

  const logoutAll = async (): Promise<void> => {
    try {
      if (token.value) {
        await api('/auth/logout-all', { method: 'POST' })
      }
    } catch (error) {
      console.error('Error during logout all:', error)
    } finally {
      clearAuth()
    }
  }

  const logout = async (): Promise<void> => {
    try {
      if (token.value) {
        await api('/auth/logout', { method: 'POST' })
      }
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      clearAuth()
    }
  }

  return {
    // State
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),
    isLoggedIn,

    // Methods
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
