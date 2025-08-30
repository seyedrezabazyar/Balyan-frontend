// app/middleware/auth.ts - نسخه بهبود یافته
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware on server side
  if (process.server) return

  // Prevent redirect loop
  if (to.path === '/auth') return

  const { waitForInitialization, isLoggedIn, user, token } = useAuth()

  try {
    // منتظر می‌مانیم تا auth initialization کامل شود
    await waitForInitialization()

    console.log('🔐 Auth middleware - isLoggedIn:', isLoggedIn.value)
    console.log('👤 Auth middleware - user:', user.value)
    console.log('🔑 Auth middleware - token exists:', !!token.value)
    console.log('📍 Current path:', to.path)
    console.log('📍 From path:', from?.path)

    // Check if user is authenticated
    if (!isLoggedIn.value) {
      console.log('❌ User not authenticated, redirecting to /auth')
      return navigateTo('/auth', { replace: true })
    }

    console.log('✅ User authenticated, allowing access')
  } catch (error) {
    console.error('❌ Auth middleware error:', error)
    return navigateTo('/auth', { replace: true })
  }
})
