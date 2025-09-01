// app/middleware/auth.ts - ساده شده
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware on server side
  if (process.server) return

  const { isLoggedIn, waitForInitialization } = useAuth()

  // Wait for auth to initialize to avoid false negatives
  await waitForInitialization()

  // Check if user is authenticated
  if (!isLoggedIn.value) {
    return navigateTo('/auth', { replace: true })
  }
})