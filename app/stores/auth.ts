import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

interface User {
  id: number
  name?: string
  email?: string
  phone?: string
  permissions?: string[]
  roles?: string[]
  is_admin?: boolean
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    refreshToken: null as string | null,
    isAuthenticated: false
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    isAdmin: (state) => !!state.user?.is_admin // درست و reactive
  },

  actions: {
    setAuth(data: any) {
      this.token = data.access_token
      this.refreshToken = data.refresh_token
      this.user = data.user
      this.isAuthenticated = true

      if (process.client) {
        localStorage.setItem('token', data.access_token)
        if (data.refresh_token) localStorage.setItem('refreshToken', data.refresh_token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
    },

    async fetchUser() {
      if (!this.token) return null
      const api = useApi(this.token)
      try {
        const response = await api.get('/auth/user')
        this.user = response.user || response
        this.isAuthenticated = true
        return this.user
      } catch (error) {
        console.error('Error fetching user:', error)
        this.clearAuth()
        return null
      }
    },

    clearAuth() {
      this.token = null
      this.refreshToken = null
      this.user = null
      this.isAuthenticated = false

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    },

    initAuth() {
      if (process.client) {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')

        if (token && user) {
          this.token = token
          this.refreshToken = localStorage.getItem('refreshToken')
          try {
            this.user = JSON.parse(user)
            this.isAuthenticated = true
          } catch {
            this.clearAuth()
          }
        } else {
          // Set mock authentication for development
          const mockToken = 'mock-jwt-token-for-testing'
          const mockUser = {
            id: 1,
            name: 'کاربر تست',
            email: 'test@example.com',
            phone: '09123456789',
            is_admin: false
          }
          
          this.token = mockToken
          this.user = mockUser
          this.isAuthenticated = true
          
          // Save to localStorage
          localStorage.setItem('token', mockToken)
          localStorage.setItem('user', JSON.stringify(mockUser))
        }
      }
    }
  }
})
