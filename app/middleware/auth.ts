export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  const { isLoggedIn, initialized } = useAuth()

  // Wait for auth initialization
  if (!initialized.value) {
    let attempts = 0
    while (!initialized.value && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }
  }

  if (!isLoggedIn.value) {
    return navigateTo('/auth', { replace: true })
  }
})

// app/middleware/guest.ts
export default defineNuxtRouteMiddleware(() => {
  if (process.server) return

  const { isLoggedIn } = useAuth()

  if (isLoggedIn.value) {
    return navigateTo('/dashboard', { replace: true })
  }
})

// app/middleware/admin.ts
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

  const hasAdminAccess = user.value?.is_admin || isAdmin.value

  if (!hasAdminAccess) {
    showToast('شما دسترسی به این بخش را ندارید', 'error')
    return navigateTo('/access-denied', { replace: true })
  }
})
