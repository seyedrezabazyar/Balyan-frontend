// app/middleware/admin.ts
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  console.log('Admin middleware called')
  console.log('Initial auth state:', {
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token,
    hasUser: !!authStore.user,
    isAdmin: authStore.isAdmin
  })

  // بارگذاری اطلاعات از localStorage
  authStore.initAuth()

  console.log('After initAuth:', {
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token,
    hasUser: !!authStore.user
  })

  if (!authStore.isAuthenticated) {
    console.log('User not authenticated, redirecting to /auth')
    return navigateTo('/auth')
  }

  // اگر user هنوز null است، fetchUser اجرا شود
  if (!authStore.user) {
    console.log('User data not loaded, fetching...')
    try {
      await authStore.fetchUser()
      console.log('User fetched successfully:', authStore.user)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      authStore.clearAuth()
      return navigateTo('/auth')
    }
  }

  console.log('Final admin check - isAdmin:', authStore.isAdmin)
  console.log('User object:', authStore.user)

  // بررسی دسترسی ادمین
  if (!authStore.isAdmin) {
    console.error('User is not admin')
    throw createError({
      statusCode: 403,
      statusMessage: 'شما دسترسی به این بخش را ندارید'
    })
  }

  console.log('Admin middleware passed successfully')
})
