// app/composables/useAuth.ts
import type { User, Role, Permission, Tokens, ApiResponse } from '~/types'

export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const token = useState<string>('auth.token', () => '')
  const loading = useState<boolean>('auth.loading', () => false)
  const initialized = useState<boolean>('auth.initialized', () => false)

  const config = useRuntimeConfig()
  const apiUrl = config.public.apiBase

  const isLoggedIn = computed(() => !!(user.value && token.value))
  
  // Check if user has specific role
  const hasRole = (roleName: string | string[]): boolean => {
    if (!user.value?.roles) return false
    
    const normalize = (name: string) =>
      (name || '').toLowerCase().replace(/_/g, '-')
    
    const userRoles = user.value.roles.map(r => normalize(r.name))
    
    if (Array.isArray(roleName)) {
      const required = roleName.map(normalize)
      return required.some(role => userRoles.includes(role))
    }
    
    return userRoles.includes(normalize(roleName))
  }
  
  // Check if user has specific permission
  const hasPermission = (permissionName: string | string[]): boolean => {
    if (!user.value?.roles) return false
    
    const userPermissions: string[] = []
    user.value.roles.forEach(role => {
      role.permissions?.forEach(permission => {
        if (!userPermissions.includes(permission.name)) {
          userPermissions.push(permission.name)
        }
      })
    })
    
    if (Array.isArray(permissionName)) {
      return permissionName.some(perm => userPermissions.includes(perm))
    }
    
    return userPermissions.includes(permissionName)
  }
  
  // Check if user is admin
  const isAdmin = computed(() => {
    const isAdminField = Boolean(user.value?.is_admin)
    const hasAdminRole = hasRole(['admin', 'super-admin', 'super_admin'])
    
    return isAdminField || hasAdminRole
  })
  
  // Get all user permissions
  const userPermissions = computed(() => {
    const permissions: Permission[] = []
    const addedIds = new Set<number>()
    
    user.value?.roles?.forEach(role => {
      role.permissions?.forEach(permission => {
        if (!addedIds.has(permission.id)) {
          permissions.push(permission)
          addedIds.add(permission.id)
        }
      })
    })
    
    return permissions
  })
  
  // Get all user roles
  const userRoles = computed(() => {
    return user.value?.roles || []
  })

  // تابع API ساده‌تر
  type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'
  interface ApiRequestOptions extends Omit<RequestInit, 'headers' | 'body' | 'method'> {
    headers?: HeadersInit | Record<string, string>
    body?: any
    method?: HttpMethod
  }

  const api = async <T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
    }

    // Only add Content-Type for requests with body
    if (options.body && options.method && options.method !== 'GET') {
      headers['Content-Type'] = 'application/json'
    }

    const requestOptions: RequestInit = {
      ...options,
      method: (options.method as HttpMethod) || 'GET',
      headers: { ...headers, ...(options.headers as Record<string, string>) }
    }

    // Handle body - only stringify if it's an object and not already a string
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      requestOptions.body = JSON.stringify(options.body)
    } else if (options.body) {
      requestOptions.body = options.body as BodyInit
    }

    const response = await fetch(`${apiUrl}${endpoint}`, requestOptions)

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

    if (process.client) {
      localStorage.setItem('auth_user', JSON.stringify(userData))
      // Save with both names for compatibility
      localStorage.setItem('auth_token', tokens.access_token)
      localStorage.setItem('access_token', tokens.access_token)
      if (tokens.refresh_token) {
        localStorage.setItem('auth_refresh_token', tokens.refresh_token)
        localStorage.setItem('refresh_token', tokens.refresh_token)
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
      localStorage.removeItem('access_token')
      localStorage.removeItem('auth_refresh_token')
      localStorage.removeItem('refresh_token')
    }
  }

  // بازیابی اطلاعات از localStorage
  const restoreAuth = async () => {
    if (!process.client) {
      initialized.value = true
      return
    }

    // Try both naming conventions
    const savedToken = localStorage.getItem('auth_token') || localStorage.getItem('access_token')
    const savedUser = localStorage.getItem('auth_user')

    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        const parsedUser = JSON.parse(savedUser)
        user.value = parsedUser
      } catch (error) {
        console.error('[Auth] Error restoring auth:', error)
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
  const verifyOTP = async (identifier: string, otp: string, name?: string) => {
    loading.value = true
    try {
      const result = await api<ApiResponse>('/api/auth/verify-otp', {
        method: 'POST',
        body: { identifier, otp, ...(name && { name }) } as any
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
        // Save updated user data
        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(result.user))
        }
      }
      
      return result.user
    } catch {
      clearAuth()
      return null
    }
  }

  // Update profile
  const updateProfile = async (data: Partial<User>) => {
    loading.value = true
    try {
      const result = await api<ApiResponse>('/api/auth/profile/update', {
        method: 'POST',
        body: data as any
      })
      
      if (result.success && result.user) {
        user.value = result.user
        // Save updated user data
        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(result.user))
        }
      }
      
      return result
    } finally {
      loading.value = false
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
    initialized: readonly(initialized),
    isLoggedIn,
    isAdmin,
    userRoles,
    userPermissions,
    hasRole,
    hasPermission,
    api,
    checkUserIdentifier,
    loginPassword,
    sendOTP,
    verifyOTP,
    logout,
    fetchUser,
    updateProfile,
    clearAuth,
    restoreAuth,
    initialize,
    waitForInitialization
  }
}