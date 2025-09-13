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
  has_password?: boolean
  username_last_changed_at?: string | null
  days_until_username_change?: number | null
  province_id?: number | null
  city_id?: number | null
  address?: string | null
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
      if (!state.user) return false
      return !!(state.user.is_admin || state.user.roles?.some(role => role.name === 'admin'))
    }
  },

  actions: {
    async checkUser(identifier: string) {
      const api = useApi();
      // Using a more RESTful endpoint
      return await api.post('/auth/check-user', { identifier });
    },

    async loginWithPassword(identifier: string, password: string) {
      const api = useApi();
      // This endpoint seems correct as login is an auth action
      const response = await api.post('/auth/login-password', { identifier, password });
      this.setAuth(response);
      return response;
    },

    async sendOtp(identifier: string) {
      const api = useApi();
      return await api.post('/auth/otp/send', { identifier });
    },

    async verifyOtp(identifier: string, otp: string, name?: string) {
      const api = useApi();
      const payload: { identifier: string; otp: string; name?: string } = { identifier, otp };
      if (name) {
        payload.name = name;
      }
      const response = await api.post('/auth/otp/verify', payload);
      this.setAuth(response);
      return response;
    },

    async logout() {
      const api = useApi();
      try {
        await api.post('/logout');
      } catch (error) {
        console.error('Logout failed, but clearing auth state anyway.', error);
      } finally {
        this.clearAuth();
      }
    },

    setAuth(data: any) {
      // ... (rest of the existing setAuth function)
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
            payload = {}
          }
        } catch (e) {
          payload = {}
        }
      } else if (payload && typeof payload === 'object' && 'data' in payload && (payload as any).data && typeof (payload as any).data === 'object') {
        payload = (payload as any).data
      }

      this.token = payload?.tokens?.access_token || payload?.access_token || payload?.token || null
      this.refreshToken = payload?.tokens?.refresh_token || payload?.refresh_token || null
      this.user = (payload && typeof payload === 'object') ? (payload.user ?? null) : null
      this.isAuthenticated = !!this.token

      if (process.client) {
        if (this.token) localStorage.setItem('token', this.token)
        if (this.refreshToken) localStorage.setItem('refreshToken', this.refreshToken)
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('isAuthenticated', this.isAuthenticated ? 'true' : 'false')
      }
    },

    setUser(newUser: User | null) {
      this.user = newUser
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },

    async fetchUser() {
      if (!this.token) {
        return null
      }
      const api = useApi()
      try {
        // Using the new /user endpoint
        const response = await api.get('/user')
        this.user = (response && typeof response === 'object') ? (response.user || response) : null
        this.isAuthenticated = true
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(this.user))
          localStorage.setItem('isAuthenticated', 'true')
        }
        return this.user
      } catch (error) {
        console.error('Failed to fetch user, clearing auth state.', error)
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
        localStorage.removeItem('isAuthenticated')
      }
    },

    async initAuth() {
      if (process.client) {
        const token = localStorage.getItem('token');
        if (!token) {
          this.clearAuth();
          return;
        }
        this.token = token;
        this.isAuthenticated = true;
        this.refreshToken = localStorage.getItem('refreshToken');
        const user = await this.fetchUser();
        if (!user) {
          // Token is invalid/expired
        }
      }
    }
  }
})
