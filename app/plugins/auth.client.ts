// app/plugins/auth.client.ts - فقط plugin
export default defineNuxtPlugin(async () => {
  const { initialize, isLoggedIn } = useAuth()

  console.log('🚀 Auth plugin initializing...')

  try {
    // Initialize auth from localStorage
    await initialize()

    console.log('📱 Auth plugin - isLoggedIn:', isLoggedIn.value)

    // اگر کاربر لاگین است، می‌توانیم اطلاعات اضافی fetch کنیم
    if (isLoggedIn.value) {
      console.log('✅ User is logged in, auth plugin completed successfully')
    } else {
      console.log('❌ User is not logged in')
    }
  } catch (error) {
    console.error('❌ Auth plugin initialization failed:', error)
  }
})
