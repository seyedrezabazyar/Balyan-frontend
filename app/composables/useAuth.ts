// app/composables/useAuth.ts - نسخه بهبود یافته
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
  // استفاده از مقادیر پیش‌فرض که از localStorage می‌خوانیم
  const user = useState<User | null>('auth.user', () => {
    if (process.client) {
      try {
        const savedUser = localStorage.getItem('auth_user')
        return savedUser ? JSON.parse(savedUser) : null
      } catch {
        return null
      }
    }
    return null
  })

  const token = useState<string>('auth.token', () => {
    if (process.client) {
      try {
        return localStorage.getItem('auth_access_token') || ''
      } catch {
        return ''
      }
    }
    return ''
  })

  const loading = useState<boolean>('auth.loading', () => false)
  const initialized = useState<boolean>('auth.initialized', () => false)

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

  // تابع initialize بهبود یافته
  const initialize = async () => {
    if (!process.client || initialized.value) return

    try {
      console.log('🔄 Initializing auth...')

      const savedToken = localStorage.getItem('auth_access_token')
      const savedUser = localStorage.getItem('auth_user')

      console.log('📦 Saved token exists:', !!savedToken)
      console.log('👤 Saved user exists:', !!savedUser)

      if (savedToken && savedUser) {
        const userData = JSON.parse(savedUser)

        // بررسی اعتبار token با تست API call
        try {
          const response = await fetch(`${apiUrl}/user/profile`, {
            headers: {
              'Authorization': `Bearer ${savedToken}`,
              'Accept': 'application/json'
            }
          })

          if (response.ok) {
            // Token معتبر است
            token.value = savedToken
            user.value = userData
            console.log('✅ Auth restored successfully')
          } else {
            // Token نامعتبر است
            console.log('❌ Token invalid, clearing auth')
            clearAuth()
          }
        } catch (error) {
          // خطا در درخواست API - احتمالاً مشکل شبکه
          console.log('⚠️ Network error, using cached auth')
          token.value = savedToken
          user.value = userData
        }
      } else {
        console.log('❌ No saved auth data found')
      }

      initialized.value = true
    } catch (error) {
      console.error('❌ Auth initialization error:', error)
      clearAuth()
      initialized.value = true
    }
  }

  const saveAuth = (userData: User, userToken: string) => {
    if (process.client) {
      try {
        // Save to localStorage first
        localStorage.setItem('auth_user', JSON.stringify(userData))
        localStorage.setItem('auth_access_token', userToken)
        console.log('💾 Auth data saved to localStorage')
        
        // Then update reactive state
        user.value = userData
        token.value = userToken
        initialized.value = true
        
        console.log('✅ Auth state updated - user:', userData)
        console.log('✅ Auth state updated - token exists:', !!userToken)
      } catch (error) {
        console.error('❌ Failed to save auth data:', error)
      }
    }
  }

  const clearAuth = () => {
    user.value = null
    token.value = ''
    initialized.value = false

    if (process.client) {
      try {
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_access_token')
        localStorage.removeItem('auth_refresh_token')
        console.log('🗑️ Auth data cleared from localStorage')
      } catch (error) {
        console.error('❌ Failed to clear auth data:', error)
      }
    }
  }

  // منتظر ماندن تا initialize کامل شود
  const waitForInitialization = async () => {
    if (initialized.value) return

    await initialize()

    // اگر هنوز initialize نشده، کمی صبر می‌کنیم
    let attempts = 0
    while (!initialized.value && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 50))
      attempts++
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
    initialized: readonly(initialized),
    isLoggedIn,
    initialize,
    waitForInitialization,
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
