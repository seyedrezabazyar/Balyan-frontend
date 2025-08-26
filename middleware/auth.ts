export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    // Save the intended route
    const redirectTo = to.fullPath
    
    // Redirect to login with return URL
    return navigateTo({
      path: '/login',
      query: redirectTo !== '/dashboard' ? { redirect: redirectTo } : {}
    })
  }
})