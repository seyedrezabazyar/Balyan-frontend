export default defineNuxtRouteMiddleware(async () => {
  if (process.server) return

  const { isLoggedIn, isAdmin, user, initialized } = useAuth()
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

  // Debug: Log user information
  console.log('Admin Middleware Debug:', {
    user: user.value,
    is_admin: user.value?.is_admin,
    isAdmin: isAdmin.value,
    roles: user.value?.roles,
    permissions: user.value?.permissions
  })

  // Check if user has admin access or users.view permission
  const hasAdminAccess = user.value?.is_admin || 
                        isAdmin.value || 
                        user.value?.permissions?.includes('users.view')

  if (!hasAdminAccess) {
    showToast('شما دسترسی به این بخش را ندارید', 'error')
    console.error('Access denied. User does not have admin access or users.view permission')
    return navigateTo('/access-denied', { replace: true })
  }
})