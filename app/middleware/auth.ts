// app/middleware/auth.ts - نسخه بهبود یافته
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware on server side
  if (process.server) return

  const { waitForInitialization, isLoggedIn } = useAuth()

  try {
    // منتظر می‌مانیم تا auth initialization کامل شود
    await waitForInitialization()

    console.log('🔐 Auth middleware - isLoggedIn:', isLoggedIn.value)

    // Check if user is authenticated
    if (!isLoggedIn.value) {
      console.log('❌ User not authenticated, redirecting to /auth')
      return navigateTo('/auth')
    }

    console.log('✅ User authenticated, allowing access')
  } catch (error) {
    console.error('❌ Auth middleware error:', error)
    return navigateTo('/auth')
  }
})
