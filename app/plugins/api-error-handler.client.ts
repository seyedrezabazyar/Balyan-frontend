// app/plugins/api-error-handler.client.ts
export default defineNuxtPlugin(() => {
  // Global error handler for API requests
  const originalFetch = window.fetch
  
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args)
      
      // Handle 401 errors globally
      if (response.status === 401 && !args[0].toString().includes('/auth/login')) {
        const { clearAuth } = useAuth()
        clearAuth()
        await navigateTo('/auth')
      }
      
      return response
    } catch (error) {
      // Log network errors
      console.error('Network error:', error)
      throw error
    }
  }
})