// app/middleware/auth.ts - ساده شده
export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server side
  if (process.server) return

  const { isLoggedIn } = useAuth()

  // Check if user is authenticated
  if (!isLoggedIn.value) {
    return navigateTo('/auth', { replace: true })
  }
})