import type { User, Tokens, ApiResponse } from '~/types'

export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const token = useState<string>('auth.token', () => '')
  const loading = useState<boolean>('auth.loading', () => false)
  const initialized = useState<boolean>('auth.initialized', () => false)
  
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiBase

  const isLoggedIn = computed(() => !!(user.value && token.value))
  const isAdmin = computed(() => Boolean(user.value?.is_admin))

  // Storage helpers
  const storage = {
    get: (key: string) => process.client ? localStorage.getItem(key) : null,
    set: (key: string, value: string) => process.client && localStorage.setItem(key, value),
    remove: (key: string) => process.client && localStorage.removeItem(key),
    clear: () => process.client && localStorage.clear()
  }

  // API helper
  const api = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const headers: HeadersInit = {
      'Accept': 'application/json',
      ...(token.value && { Authorization: `Bearer ${token.value}` }),
      ...(options.body && !(options.body instanceof FormData) && { 'Content-Type': 'application/json' })
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers },
      ...(options.body && typeof options.body === 'object' && !(options.body instanceof FormData) && {
        body: JSON.stringify(options.body)
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'خطای سرور' }))
      throw new Error(error.message || `خطا ${response.status}`)
    }

    return response.json()
  }

  // Auth methods
  const saveAuth = (userData: User, tokens: Tokens) => {
    user.value = userData
    token.value = tokens.access_token
    storage.set('auth_user', JSON.stringify(userData))
    storage.set('auth_token', tokens.access_token)
    if (tokens.refresh_token) {
      storage.set('refresh_token', tokens.refresh_token)
    }
  }

  const clearAuth = () => {
    user.value = null
    token.value = ''
    storage.clear()
  }

  const restoreAuth = () => {
    if (!process.client) return

    const savedToken = storage.get('auth_token')
    const savedUser = storage.get('auth_user')

    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      } catch {
        clearAuth()
      }
    }
    initialized.value = true
  }

  // Auth API calls
  const checkUserIdentifier = async (identifier: string) => {
    return api<ApiResponse>('/api/auth/check-user', {
      method: 'POST',
      body: { identifier }
    }).catch(() => ({ success: false, data: null }))
  }

  const loginPassword = async (identifier: string, password: string) => {
    loading.value = true
    try {
      const result = await api<ApiResponse>('/api/auth/login-password', {
        method: 'POST',
        body: { identifier, password }
      })

      if (result.success && result.tokens && result.user) {
        saveAuth(result.user, result.tokens)
      }
      return result
    } finally {
      loading.value = false
    }
  }

  const sendOTP = async (identifier: string) => {
    loading.value = true
    try {
      return await api<ApiResponse>('/api/auth/send-otp', {
        method: 'POST',
        body: { identifier }
      })
    } finally {
      loading.value = false
    }
  }

  const verifyOTP = async (identifier: string, otp: string, name?: string) => {
    loading.value = true
    try {
      const result = await api<ApiResponse>('/api/auth/verify-otp', {
        method: 'POST',
        body: { identifier, otp, ...(name && { name }) }
      })

      if (result.success && result.tokens && result.user) {
        saveAuth(result.user, result.tokens)
      }
      return result
    } finally {
      loading.value = false
    }
  }

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

  const fetchUser = async () => {
    if (!token.value) return null

    try {
      const result = await api<ApiResponse>('/api/auth/user')
      if (result.user) {
        user.value = result.user
        storage.set('auth_user', JSON.stringify(result.user))
      }
      return result.user
    } catch {
      clearAuth()
      return null
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    loading.value = true
    try {
      const result = await api<ApiResponse>('/api/auth/profile/update', {
        method: 'POST',
        body: data
      })

      if (result.success && result.user) {
        user.value = result.user
        storage.set('auth_user', JSON.stringify(result.user))
      }
      return result
    } finally {
      loading.value = false
    }
  }

  // Initialize on client
  if (process.client && !initialized.value) {
    restoreAuth()
  }

  return {
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),
    initialized: readonly(initialized),
    isLoggedIn,
    isAdmin,
    api,
    checkUserIdentifier,
    loginPassword,
    sendOTP,
    verifyOTP,
    logout,
    fetchUser,
    updateProfile,
    clearAuth,
    restoreAuth
  }
}
