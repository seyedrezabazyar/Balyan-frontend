// app/plugins/api-error-handler.client.ts
export default defineNuxtPlugin(() => {
  // Global error handler for API requests
  const originalFetch = window.fetch
  
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args)
      // Let composables (e.g., useAuth.api) handle 401/refresh logic
      return response
    } catch (error) {
      // Log network errors
      console.error('Network error:', error)
      throw error
    }
  }
})