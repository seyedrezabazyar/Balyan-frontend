// app/middleware/role.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.server) return

  const { user, isLoggedIn } = useAuth()
  const { showToast } = useToast()

  // Check if user is authenticated
  if (!isLoggedIn.value) {
    showToast('لطفا ابتدا وارد شوید', 'error')
    return navigateTo('/auth', { replace: true })
  }

  // Get required role from route meta
  const requiredRole = to.meta.role as string | string[] | undefined
  
  if (!requiredRole) return // No specific role required

  // Check if user has required role
  const userRoles = user.value?.roles?.map(r => r.name) || []
  
  const hasRequiredRole = Array.isArray(requiredRole)
    ? requiredRole.some(role => userRoles.includes(role))
    : userRoles.includes(requiredRole)

  if (!hasRequiredRole) {
    showToast('شما دسترسی به این بخش را ندارید', 'error')
    return navigateTo('/access-denied', { replace: true })
  }
})