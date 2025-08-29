// middleware/guest.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.client) {
    const { initialize, isLoggedIn } = useAuth()

    // Initialize auth state
    initialize()

    // Redirect authenticated users to dashboard
    if (isLoggedIn.value) {
      return navigateTo('/dashboard')
    }
  }
})
