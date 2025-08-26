import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  email: string
  role?: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        // Simulate API call
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials
        })
        
        // Store token and user data
        this.token = response.token
        this.user = response.user
        this.isAuthenticated = true
        
        // Save to localStorage
        if (process.client) {
          localStorage.setItem('token', this.token)
        }
        
        return response
      } catch (error) {
        throw error
      }
    },

    async register(data: { name: string; email: string; password: string }) {
      try {
        // Simulate API call
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: data
        })
        
        // Store token and user data
        this.token = response.token
        this.user = response.user
        this.isAuthenticated = true
        
        // Save to localStorage
        if (process.client) {
          localStorage.setItem('token', this.token)
        }
        
        return response
      } catch (error) {
        throw error
      }
    },

    async fetchUser() {
      try {
        if (!this.token) {
          // Try to get token from localStorage
          if (process.client) {
            const storedToken = localStorage.getItem('token')
            if (storedToken) {
              this.token = storedToken
            } else {
              return null
            }
          }
        }
        
        // Simulate API call to get user data
        const response = await $fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        
        this.user = response.user
        this.isAuthenticated = true
        
        return response
      } catch (error) {
        // If fetch fails, clear auth state
        this.logout()
        throw error
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      // Clear localStorage
      if (process.client) {
        localStorage.removeItem('token')
      }
      
      // Navigate to login
      navigateTo('/login')
    },

    setUser(user: User) {
      this.user = user
      this.isAuthenticated = true
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
    }
  }
})