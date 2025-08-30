// app/plugins/auth.client.ts - فقط plugin
export default defineNuxtPlugin(async (nuxtApp) => {
  const { initialize, isLoggedIn, user, token } = useAuth()

  console.log('🚀 Auth plugin initializing...')

  try {
    // Initialize auth from localStorage
    await initialize()

    console.log('📱 Auth plugin - isLoggedIn:', isLoggedIn.value)
    console.log('👤 Auth plugin - user:', user.value)
    console.log('🔑 Auth plugin - token exists:', !!token.value)

    // اگر کاربر لاگین است، می‌توانیم اطلاعات اضافی fetch کنیم
    if (isLoggedIn.value) {
      console.log('✅ User is logged in, auth plugin completed successfully')
      
      // If we're on the auth page and user is logged in, redirect to dashboard
      const route = useRoute()
      if (route.path === '/auth') {
        console.log('🔄 User is on auth page but logged in, redirecting to dashboard')
        await navigateTo('/dashboard', { replace: true })
      }
    } else {
      console.log('❌ User is not logged in')
    }
  } catch (error) {
    console.error('❌ Auth plugin initialization failed:', error)
  }
})
