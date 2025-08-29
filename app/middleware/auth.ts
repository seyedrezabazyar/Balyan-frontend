// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.client) {
    const { initialize, isLoggedIn } = useAuth()

    // Initialize auth state
    initialize()

    // Check if user is authenticated
    if (!isLoggedIn.value) {
      return navigateTo('/auth')
    }
  }
})
