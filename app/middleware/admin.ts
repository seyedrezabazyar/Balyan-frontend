export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side after auth is initialized
  if (process.server) return

  const { isLoggedIn, isAdmin, hasRole, waitForInitialization, fetchUser } = useAuth()
  const { showToast } = useToast()

  // Ensure auth initialization completes before checks
  await waitForInitialization()

  // Check if user is authenticated
  if (!isLoggedIn.value) {
    showToast('لطفا ابتدا وارد شوید', 'error')
    return navigateTo('/auth', { replace: true })
  }

  // If admin status/roles may be stale, fetch latest profile once before deciding
  if (!isAdmin.value && !hasRole(['admin', 'super-admin', 'super_admin'])) {
    try {
      await fetchUser()
    } catch {
      // ignore
    }
  }

  // Re-evaluate after fetching
  if (!isAdmin.value && !hasRole(['admin', 'super-admin', 'super_admin'])) {
    showToast('شما دسترسی به این بخش را ندارید', 'error')
    return navigateTo('/access-denied', { replace: true })
  }
})
