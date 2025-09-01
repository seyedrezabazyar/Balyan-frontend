export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.server) return

  const { isLoggedIn } = useAuth()

  // Redirect authenticated users to dashboard
  if (isLoggedIn.value) {
    return navigateTo('/dashboard', { replace: true })
  }
})