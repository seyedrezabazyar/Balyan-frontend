export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side after auth is initialized
  if (process.server) return

  const { user, isLoggedIn, initialized, waitForInitialization } = useAuth()
  const { showToast } = useToast()

  // Wait for auth initialization if not ready
  if (!initialized.value) {
    return navigateTo('/auth', { replace: true })
  }

  // Check if user is authenticated
  if (!isLoggedIn.value) {
    showToast('لطفا ابتدا وارد شوید', 'error')
    return navigateTo('/auth', { replace: true })
  }

  // Check if user has admin privileges
  const hasAdminRole = Array.isArray((user.value as any)?.roles) && (user.value as any).roles.some((r: any) => r.name === 'admin')
  const isAdmin = !!user.value?.is_admin || hasAdminRole

  if (!isAdmin) {
    showToast('شما دسترسی به این بخش را ندارید', 'error')
    return navigateTo('/access-denied', { replace: true })
  }
})
