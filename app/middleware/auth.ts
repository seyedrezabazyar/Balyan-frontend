// app/middleware/auth.ts
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('🔐 Auth middleware called for route:', to.path)

  const authStore = useAuthStore()

  console.log('📊 Initial auth state:', {
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token,
    hasUser: !!authStore.user,
    tokenLength: authStore.token?.length
  })

  // بارگذاری اطلاعات از localStorage اگر هنوز بارگذاری نشده
  if (process.client && (!authStore.isAuthenticated || !authStore.token)) {
    console.log('🔄 Auth not initialized on client, calling initAuth...')
    await authStore.initAuth()
  }

  console.log('📊 After initAuth:', {
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token,
    tokenLength: authStore.token?.length,
    hasUser: !!authStore.user
  })

  // اگر هنوز احراز هویت نشده، به صفحه لاگین هدایت کن
  if (!authStore.isAuthenticated || !authStore.token) {
    console.log('❌ User not authenticated, redirecting to /auth')

    // ذخیره مسیر فعلی برای بازگشت بعد از لاگین
    const returnPath = to.fullPath
    if (returnPath !== '/auth' && returnPath !== '/') {
      return navigateTo(`/auth?redirect=${encodeURIComponent(returnPath)}`)
    }

    return navigateTo('/auth')
  }

  // اگر user هنوز null است، سعی کن آن را از سرور دریافت کنی
  if (!authStore.user) {
    console.log('👤 User data not loaded, fetching from server...')
    try {
      const userData = await authStore.fetchUser()
      console.log('✅ User fetched successfully:', userData?.name || userData?.email || 'Unknown')
    } catch (error) {
      console.error('❌ Failed to fetch user:', error)

      // اگر خطای 401 باشد، token نامعتبر است
      if (error.statusCode === 401 || error.status === 401) {
        console.log('🔑 Token appears to be invalid, clearing auth and redirecting')
        authStore.clearAuth()
        return navigateTo('/auth')
      }

      // برای سایر خطاها، اجازه ادامه بده (ممکن است مشکل شبکه باشد)
      console.warn('⚠️ Network error while fetching user, allowing access')
    }
  }

  console.log('✅ Auth middleware passed successfully for user:',
    authStore.user?.name || authStore.user?.email || 'Unknown'
  )

  // برای صفحات خاص، اطلاعات اضافی لاگ کن
  if (to.path.startsWith('/admin')) {
    console.log('🛡️ Admin route accessed, user admin status:', authStore.isAdmin)
  }

  if (to.path === '/profile') {
    console.log('👤 Profile page accessed, user verification status:', {
      emailVerified: !!authStore.user?.email_verified_at,
      phoneVerified: !!authStore.user?.phone_verified_at,
      hasPassword: !!(authStore.user?.password || authStore.user?.has_password)
    })
  }
})
