// app/plugins/auth.client.ts
export default defineNuxtPlugin(async () => {
  const { restoreAuth, fetchUser, token, initialized } = useAuth()

  // Restore auth from localStorage
  if (!initialized.value) {
    restoreAuth()
  }

  // Fetch fresh user data if token exists
  if (token.value) {
    try {
      await fetchUser()
    } catch (error) {
      console.warn('Failed to fetch user data on startup:', error)
      // Don't clear auth here, let user continue with cached data
    }
  }

  // Global error handler for 401s
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args)

      // Handle 401 errors globally (except for login endpoints)
      if (response.status === 401 && !args[0].toString().includes('/auth/login')) {
        const { clearAuth } = useAuth()
        clearAuth()
        await navigateTo('/auth')
      }

      return response
    } catch (error) {
      console.error('Network error:', error)
      throw error
    }
  }
})
