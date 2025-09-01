import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email?: string
  phone?: string
  permissions?: string[]
  roles?: string[]
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
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    async checkUser(identifier: string) {
      const api = useApi()
      try {
        const response = await api.post('/auth/check-user', { identifier })
        return response
      } catch (error) {
        throw error
      }
    },

    async loginWithPassword(identifier: string, password: string) {
      const api = useApi()
      try {
        const response = await api.post('/auth/login-password', {
          identifier,
          password
        })

        this.setAuth(response)
        return response
      } catch (error) {
        throw error
      }
    },

    async sendOtp(identifier: string) {
      const api = useApi()
      try {
        const response = await api.post('/auth/send-otp', { identifier })
        return response
      } catch (error) {
        throw error
      }
    },

    async verifyOtp(identifier: string, otp: string) {
      const api = useApi()
      try {
        const response = await api.post('/auth/verify-otp', {
          identifier,
          otp
        })

        this.setAuth(response)
        return response
      } catch (error) {
        throw error
      }
    },

    setAuth(data: any) {
      this.token = data.access_token
      this.refreshToken = data.refresh_token
      this.user = data.user
      this.isAuthenticated = true

      if (import.meta.client) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('refreshToken', data.refresh_token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
    },

    async fetchUser() {
      const api = useApi()
      try {
        const response = await api.get('/auth/user')
        this.user = response.user
        return response.user
      } catch (error) {
        this.logout()
        throw error
      }
    },

    async logout() {
      const api = useApi()
      try {
        await api.post('/auth/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
        await navigateTo('/login')
      }
    },

    clearAuth() {
      this.token = null
      this.refreshToken = null
      this.user = null
      this.isAuthenticated = false

      if (import.meta.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    },

    initAuth() {
      if (import.meta.client) {
        const token = localStorage.getItem('token')
        const refreshToken = localStorage.getItem('refreshToken')
        const user = localStorage.getItem('user')

        if (token && user) {
          this.token = token
          this.refreshToken = refreshToken
          this.user = JSON.parse(user)
          this.isAuthenticated = true
        }
      }
    }
  }
})
