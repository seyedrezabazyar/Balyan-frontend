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
