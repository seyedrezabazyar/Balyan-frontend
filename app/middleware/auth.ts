// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server side
  if (process.server) return

  const { initialize, isLoggedIn } = useAuth()

  // Initialize auth state
  initialize()

  // Check if user is authenticated
  if (!isLoggedIn.value) {
    return navigateTo('/auth')
  }
})
