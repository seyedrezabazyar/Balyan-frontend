export default defineNuxtRouteMiddleware(async () => {
  if (process.server) return

  const { isLoggedIn, isAdmin, user, initialized, fetchUser, hasRole, hasPermission } = useAuth()
  const { showToast } = useToast()

  // Wait for initialization
  if (!initialized.value) {
    let attempts = 0
    while (!initialized.value && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }
  }

  if (!isLoggedIn.value) {
    showToast('لطفا ابتدا وارد شوید', 'error')
    return navigateTo('/auth', { replace: true })
  }

  // Fetch fresh user data if needed
  if (!user.value?.permissions && !user.value?.is_admin) {
    await fetchUser()
  }

  // Debug: Log user information
  console.log('Admin Middleware Debug:', {
    user: user.value,
    is_admin: user.value?.is_admin,
    isAdmin: isAdmin.value,
    roles: user.value?.roles,
    permissions: user.value?.permissions
  })

  // Check if user has admin access
  const hasAdminAccess = user.value?.is_admin === true || 
                        isAdmin.value || 
                        hasRole(['admin', 'super-admin']) ||
                        hasPermission(['users.view', 'users.manage', 'admin.access'])

  if (!hasAdminAccess) {
    showToast('شما دسترسی به این بخش را ندارید', 'error')
    console.error('Access denied. User does not have admin access')
    return navigateTo('/dashboard', { replace: true })
  }
})