import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // بارگذاری اطلاعات از localStorage
  authStore.initAuth()

  // بررسی وجود توکن
  if (!authStore.token || !authStore.isAuthenticated) {
    console.log('No token or not authenticated, redirecting to auth')
    return navigateTo('/auth')
  }

  // اگر user هنوز null است، fetchUser اجرا شود و تا اتمام صبر شود
  if (!authStore.user) {
    try {
      console.log('Fetching user data...')
      await authStore.fetchUser()
      
      // اگر بعد از fetch هنوز user نداریم
      if (!authStore.user) {
        console.log('Failed to fetch user, clearing auth')
        authStore.clearAuth()
        return navigateTo('/auth')
      }
    } catch (error) {
      console.error('Error in auth middleware:', error)
      authStore.clearAuth()
      return navigateTo('/auth')
    }
  }
})
