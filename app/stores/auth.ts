import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

interface User {
  id: number
  name?: string
  email?: string
  phone?: string
  username?: string
  permissions?: string[]
  roles?: Array<{id: number, name: string, display_name: string}>
  is_admin?: boolean
  email_verified_at?: string
  phone_verified_at?: string
  last_login_at?: string
  created_at?: string
  preferred_method?: string
  locked_until?: string
  password?: boolean
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
    isLoggedIn: (state) => state.isAuthenticated && !!state.token,
    isAdmin: (state) => {
      console.log('isAdmin getter called, user:', state.user)
      if (!state.user) return false
      return !!(state.user.is_admin || state.user.roles?.some(role => role.name === 'admin'))
    }
  },

  actions: {
    setAuth(data: any) {
      console.log('Setting auth data:', data)

      // Handle different response structures
      this.token = data.tokens?.access_token || data.access_token
      this.refreshToken = data.tokens?.refresh_token || data.refresh_token
      this.user = data.user
      this.isAuthenticated = true

      console.log('Token set:', this.token ? 'exists' : 'missing')
      console.log('User set:', this.user)

      if (process.client) {
        localStorage.setItem('token', this.token)
        if (this.refreshToken) localStorage.setItem('refreshToken', this.refreshToken)
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('isAuthenticated', 'true')
        console.log('Data saved to localStorage')
      }
    },

    async fetchUser() {
      if (!this.token) {
        console.error('No token available for fetchUser')
        return null
      }

      console.log('Fetching user with token:', this.token.substring(0, 20) + '...')
      const api = useApi(this.token)

      try {
        const response = await api.get('/auth/user')
        console.log('fetchUser response:', response)

        this.user = response.user || response
        this.isAuthenticated = true

        // Update localStorage
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(this.user))
          localStorage.setItem('isAuthenticated', 'true')
        }

        return this.user
      } catch (error) {
        console.error('Error fetching user:', error)
        this.clearAuth()
        return null
      }
    },

    clearAuth() {
      console.log('Clearing auth data')
      this.token = null
      this.refreshToken = null
      this.user = null
      this.isAuthenticated = false

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        localStorage.removeItem('isAuthenticated')
        console.log('Auth data cleared from localStorage')
      }
    },

    initAuth() {
      if (process.client) {
        console.log('Initializing auth from localStorage')

        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        const isAuthenticated = localStorage.getItem('isAuthenticated')

        console.log('Found in localStorage:', {
          hasToken: !!token,
          hasUser: !!user,
          isAuthenticated
        })

        if (token && user && isAuthenticated === 'true') {
          this.token = token
          this.refreshToken = localStorage.getItem('refreshToken')

          try {
            this.user = JSON.parse(user)
            this.isAuthenticated = true
            console.log('Auth initialized successfully:', {
              tokenLength: this.token.length,
              userName: this.user?.name,
              isAdmin: this.isAdmin
            })
          } catch (error) {
            console.error('Error parsing user data from localStorage:', error)
            this.clearAuth()
          }
        } else {
          console.log('Auth data not found or incomplete in localStorage')
        }
      }
    }
  }
})
