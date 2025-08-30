// app/middleware/guest.ts - نسخه بهبود یافته
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side
  if (process.server) return

  // Prevent redirect loop
  if (to.path === '/dashboard') return

  const { waitForInitialization, isLoggedIn } = useAuth()

  try {
    // منتظر می‌مانیم تا auth initialization کامل شود
    await waitForInitialization()

    console.log('👤 Guest middleware - isLoggedIn:', isLoggedIn.value)
    console.log('📍 Current path:', to.path)
    console.log('📍 From path:', from?.path)

    // Redirect authenticated users to dashboard
    if (isLoggedIn.value) {
      console.log('✅ User already authenticated, redirecting to /dashboard')
      return navigateTo('/dashboard', { replace: true })
    }

    console.log('👤 User not authenticated, allowing access to guest page')
  } catch (error) {
    console.error('❌ Guest middleware error:', error)
    // در صورت خطا اجازه دسترسی به صفحه guest می‌دهیم
  }
})
