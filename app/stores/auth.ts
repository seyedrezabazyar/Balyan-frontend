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
    isAdmin: (state) => {
      console.log('isAdmin getter called, user:', state.user)
      return !!(state.user?.is_admin || state.user?.roles?.some(role => role.name === 'admin'))
    }
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
        }
      }
    }
  }
})
