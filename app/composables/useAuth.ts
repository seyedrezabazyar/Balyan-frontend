export const useAuth = () => {
  const user = useState<any>('auth.user', () => null)
  const token = useState<string>('auth.token', () => '')
  const loading = useState('auth.loading', () => false)

  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl

  // Initialize auth from localStorage
  const init = () => {
    if (process.client) {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (savedToken && savedUser) {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      }
    }
  }

  const isLoggedIn = computed(() => !!(user.value && token.value))

  // API helper
  const api = async (endpoint: string, options: any = {}) => {
    try {
      const headers: any = { 'Content-Type': 'application/json' }
      if (token.value) headers.Authorization = `Bearer ${token.value}`

      const response = await fetch(`${apiUrl}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers },
        body: options.body ? JSON.stringify(options.body) : undefined
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'خطا در ارتباط با سرور')
      }

      return data
    } catch (error: any) {
      throw new Error(error.message || 'خطا در شبکه')
    }
  }

  // Save auth data
  const saveAuth = (userData: any, userToken: string) => {
    user.value = userData
    token.value = userToken

    if (process.client) {
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', userToken)
    }
  }

  // Clear auth data
  const clearAuth = () => {
    user.value = null
    token.value = ''

    if (process.client) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }

  // Auth methods
  const checkUser = async (identifier: string) => {
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

  const loginPassword = async (identifier: string, password: string) => {
    loading.value = true
    try {
      const result = await api('/auth/login-password', {
        method: 'POST',
        body: { identifier, password }
      })

      if (result.success) {
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
        body: { identifier }
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
        body: { identifier, otp, name }
      })

      if (result.success) {
        saveAuth(result.user, result.token)
      }

      return result
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await api('/auth/logout', { method: 'POST' })
      }
    } finally {
      clearAuth()
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),
    isLoggedIn,
    init,
    checkUser,
    loginPassword,
    sendOTP,
    verifyOTP,
    logout
  }
}
