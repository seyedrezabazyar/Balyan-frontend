import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // بارگذاری اطلاعات از localStorage
  authStore.initAuth()

  if (!authStore.isAuthenticated) {
    return navigateTo('/auth')
  }

  // اگر user هنوز null است، fetchUser اجرا شود و تا اتمام صبر شود
  if (!authStore.user) {
    try {
      await authStore.fetchUser()
    } catch {
      authStore.clearAuth()
      return navigateTo('/auth')
    }
  }
})
