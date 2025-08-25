import { defineStore } from 'pinia'
import type { User, LoginCredentials, RegisterData, AuthResponse } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = useCookie('auth-token', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
  const refreshToken = useCookie('refresh-token', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })

  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Login function
  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null
    
    try {
      const { data } = await $fetch<AuthResponse>('/auth/login', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        body: credentials
      })

      // Set user and tokens
      user.value = data.user
      token.value = data.access_token
      if (data.refresh_token) {
        refreshToken.value = data.refresh_token
      }

      // Redirect to dashboard
      await navigateTo('/dashboard')
      
      return { success: true }
    } catch (err: any) {
      error.value = err.data?.message || 'Login failed. Please try again.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Register function
  async function register(data: RegisterData) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await $fetch<AuthResponse>('/auth/register', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        body: data
      })

      // Set user and tokens
      user.value = response.data.user
      token.value = response.data.access_token
      if (response.data.refresh_token) {
        refreshToken.value = response.data.refresh_token
      }

      // Redirect to dashboard
      await navigateTo('/dashboard')
      
      return { success: true }
    } catch (err: any) {
      error.value = err.data?.message || 'Registration failed. Please try again.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Logout function
  async function logout() {
    try {
      // Call logout endpoint if token exists
      if (token.value) {
        await $fetch('/auth/logout', {
          baseURL: useRuntimeConfig().public.apiBase,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        }).catch(() => {
          // Ignore logout errors
        })
      }
    } finally {
      // Clear user data and tokens
      user.value = null
      token.value = null
      refreshToken.value = null
      
      // Redirect to login
      await navigateTo('/login')
    }
  }

  // Fetch current user
  async function fetchUser() {
    if (!token.value) return null

    try {
      const { data } = await $fetch<{ data: User }>('/auth/user', {
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      user.value = data
      return data
    } catch (err) {
      // Token might be invalid
      await logout()
      return null
    }
  }

  // Refresh access token
  async function refreshAccessToken() {
    if (!refreshToken.value) return false

    try {
      const { data } = await $fetch<AuthResponse>('/auth/refresh', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken.value}`
        }
      })

      token.value = data.access_token
      if (data.refresh_token) {
        refreshToken.value = data.refresh_token
      }

      return true
    } catch (err) {
      await logout()
      return false
    }
  }

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    error: readonly(error),
    login,
    register,
    logout,
    fetchUser,
    refreshAccessToken
  }
})