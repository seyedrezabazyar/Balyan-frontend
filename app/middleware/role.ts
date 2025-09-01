// app/middleware/role.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side
  if (process.server) return

  const { isLoggedIn, hasRole, waitForInitialization } = useAuth()
  const { showToast } = useToast()

  // Ensure auth initialization completes before checks
  await waitForInitialization()

  // Check if user is authenticated
  if (!isLoggedIn.value) {
    showToast('لطفا ابتدا وارد شوید', 'error')
    return navigateTo('/auth', { replace: true })
  }

  // Get required role from route meta
  const requiredRole = to.meta.role as string | string[] | undefined
  
  if (!requiredRole) return // No specific role required

  // Check if user has required role
  const hasRequiredRole = hasRole(requiredRole as any)

  if (!hasRequiredRole) {
    showToast('شما دسترسی به این بخش را ندارید', 'error')
    return navigateTo('/access-denied', { replace: true })
  }
})