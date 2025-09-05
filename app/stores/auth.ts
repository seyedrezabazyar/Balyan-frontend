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

      // Normalize response: handle strings with non-JSON prefixes and wrapped payloads
      let payload: any = data
      if (typeof payload === 'string') {
        try {
          const sanitized = payload.replace(/^\uFEFF/, '').trim()
          const firstBrace = sanitized.indexOf('{')
          const firstBracket = sanitized.indexOf('[')
          const start = firstBrace === -1
            ? firstBracket
            : (firstBracket === -1 ? firstBrace : Math.min(firstBrace, firstBracket))
          if (start !== -1) {
            payload = JSON.parse(sanitized.slice(start))
          } else {
            console.warn('Auth response string did not contain JSON; defaulting to empty object')
            payload = {}
          }
        } catch (e) {
          console.error('Failed to parse auth response JSON:', e)
          payload = {}
        }
      } else if (payload && typeof payload === 'object' && 'data' in payload && (payload as any).data && typeof (payload as any).data === 'object') {
        payload = (payload as any).data
      }

      // Handle different response structures
      this.token = payload?.tokens?.access_token || payload?.access_token || payload?.token || null
      this.refreshToken = payload?.tokens?.refresh_token || payload?.refresh_token || null
      this.user = (payload && typeof payload === 'object') ? (payload.user ?? null) : null
      this.isAuthenticated = !!this.token

      console.log('Token set:', this.token ? 'exists' : 'missing')
      console.log('User set:', this.user)

      if (process.client) {
        if (this.token) localStorage.setItem('token', this.token)
        if (this.refreshToken) localStorage.setItem('refreshToken', this.refreshToken)
        // Persist user as JSON even if null to avoid "undefined" string in storage
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('isAuthenticated', this.isAuthenticated ? 'true' : 'false')
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
        let response: any = await api.get('/auth/user')
        console.log('fetchUser raw response:', response)

        // Normalize potential string response with preface text
        if (typeof response === 'string') {
          try {
            const sanitized = response.replace(/^\uFEFF/, '').trim()
            const firstBrace = sanitized.indexOf('{')
            const firstBracket = sanitized.indexOf('[')
            const start = firstBrace === -1
              ? firstBracket
              : (firstBracket === -1 ? firstBrace : Math.min(firstBrace, firstBracket))
            if (start !== -1) {
              response = JSON.parse(sanitized.slice(start))
            }
          } catch (e) {
            console.error('Failed to parse user response JSON:', e)
          }
        }

        this.user = (response && typeof response === 'object') ? (response.user || response) : null
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
        const userStr = localStorage.getItem('user')
        const isAuthenticated = localStorage.getItem('isAuthenticated')

        console.log('Found in localStorage:', {
          hasToken: !!token,
          hasUser: !!userStr,
          isAuthenticated
        })

        if (token && isAuthenticated === 'true') {
          this.token = token
          this.refreshToken = localStorage.getItem('refreshToken')

          try {
            let parsedUser: any = null
            if (userStr && userStr !== 'undefined') {
              parsedUser = JSON.parse(userStr)
            }
            this.user = parsedUser
            this.isAuthenticated = true
            console.log('Auth initialized successfully:', {
              tokenLength: this.token.length,
              userName: this.user?.name,
              isAdmin: this.isAdmin
            })
          } catch (error) {
            console.warn('Error parsing user data from localStorage, defaulting to null user:', error)
            this.user = null
            this.isAuthenticated = true
          }
        } else {
          console.log('Auth data not found or incomplete in localStorage')
        }
      }
    }
  }
})
