import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

// Matches the User Object from the new documentation
interface User {
  id: number
  name: string
  username: string
  email: string | null
  phone: string | null
  email_verified_at: string | null
  phone_verified_at: string | null
  has_password: boolean
  avatar_url: string | null
  last_login_at: string | null
  is_admin: boolean
  province_id: number | null
  city_id: number | null
  address: string | null
  username_last_changed_at: string | null
  days_until_username_change: number | null
  roles?: Array<{id: number, name:string, display_name: string}>
  permissions?: string[]
}

// For API responses that include tokens and user
interface AuthResponse {
  tokens: {
    access_token: string
    refresh_token: string
  }
  user: User
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    refreshToken: null as string | null,
    isAuthenticated: false,
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated && !!state.token,
    isAdmin: (state) => !!state.user?.is_admin,
  },

  actions: {
    // Simplified setAuth action
    setAuth(data: AuthResponse) {
      this.token = data.tokens.access_token
      this.refreshToken = data.tokens.refresh_token
      this.user = data.user
      this.isAuthenticated = true

      if (process.client) {
        localStorage.setItem('token', this.token)
        localStorage.setItem('refreshToken', this.refreshToken)
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },

    setUser(newUser: User | null) {
      this.user = newUser
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },

    // Action to clear auth state from store and localStorage
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

    // Full logout process
    async logout() {
      const api = useApi(this.token)
      try {
        await api.post('/auth/logout')
      } catch (error) {
        console.error('Logout API call failed, clearing local state anyway.', error)
      } finally {
        this.clearAuth()
      }
    },

    // --- New Authentication Flow Actions ---

    async checkUser(identifier: string) {
      const api = useApi()
      return await api.post('/auth/check-user', { identifier })
    },

    async sendOtp(identifier: string) {
      const api = useApi()
      return await api.post('/auth/send-otp', { identifier })
    },

    async verifyOtp(identifier: string, otp: string, name?: string) {
      const api = useApi()
      const response: AuthResponse = await api.post('/auth/verify-otp', { identifier, otp, name })
      this.setAuth(response)
      return response
    },

    async loginWithPassword(identifier: string, password: string) {
      const api = useApi()
      const response: AuthResponse = await api.post('/auth/login-password', { identifier, password })
      this.setAuth(response)
      return response
    },

    // --- User and Profile Actions ---

    async fetchUser() {
      if (!this.token) return null
      const api = useApi(this.token)
      try {
        const response = await api.get('/auth/user')
        this.setUser(response.user)
        return response.user
      } catch (error) {
        console.error('Error fetching user:', error)
        // If user fetch fails, token is likely invalid/expired
        this.clearAuth()
        return null
      }
    },

    async updateProfile(data: { name: string, username: string, province_id: number, city_id: number, address: string }) {
        const api = useApi(this.token)
        const response = await api.post('/auth/profile/update', data)
        this.setUser(response.user)
        return response
    },

    async setPassword(password: string) {
        const api = useApi(this.token)
        return await api.post('/auth/password/set', { password, password_confirmation: password })
    },

    async updatePassword(current_password: string, password: string) {
        const api = useApi(this.token)
        return await api.post('/auth/password/update', { current_password, password, password_confirmation: password })
    },

    // --- Token Management ---

    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.clearAuth()
        throw new Error('No refresh token available.')
      }
      const api = useApi()
      try {
        const response = await api.post('/auth/refresh', { refresh_token: this.refreshToken })
        this.token = response.access_token
        if(response.refresh_token) {
            this.refreshToken = response.refresh_token
        }
        this.isAuthenticated = true
        if (process.client) {
            localStorage.setItem('token', this.token)
            if(response.refresh_token) {
                localStorage.setItem('refreshToken', this.refreshToken)
            }
        }
        return this.token
      } catch (error) {
        console.error('Failed to refresh token:', error)
        this.clearAuth() // Force logout if refresh fails
        throw error
      }
    },

    // --- Initialization ---

    async initAuth() {
      if (process.client) {
        const token = localStorage.getItem('token')
        if (!token) {
          this.clearAuth()
          return
        }

        this.token = token
        this.refreshToken = localStorage.getItem('refreshToken')

        // Optimistically set user from localStorage
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            this.user = JSON.parse(storedUser)
        }
        this.isAuthenticated = true

        // Verify token by fetching user data
        try {
            await this.fetchUser()
        } catch (e) {
            // fetchUser handles clearing auth on failure
        }
      }
    },
  },
})
