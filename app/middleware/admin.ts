export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side after auth is initialized
  if (process.server) return

  const { isLoggedIn, isAdmin, hasRole, waitForInitialization, user } = useAuth()
  const { showToast } = useToast()

  // Ensure auth initialization completes before checks
  await waitForInitialization()

  // Check if user is authenticated
  if (!isLoggedIn.value) {
    showToast('لطفا ابتدا وارد شوید', 'error')
    return navigateTo('/auth', { replace: true })
  }

  // Check if user has admin privileges
  // Check both is_admin field and roles
  const hasAdminAccess = user.value?.is_admin === true || 
                         isAdmin.value || 
                         hasRole(['admin', 'super-admin', 'super_admin'])
  
  if (!hasAdminAccess) {
    showToast('شما دسترسی به این بخش را ندارید', 'error')
    return navigateTo('/access-denied', { replace: true })
  }
})
