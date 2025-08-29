// plugins/auth.client.ts
export default defineNuxtPlugin(async () => {
  const { initialize, isLoggedIn } = useAuth()

  // Initialize auth from localStorage
  initialize()

  // Optional: Refresh user data if logged in
  if (isLoggedIn.value) {
    try {
      await nextTick()
      // Here you can add logic to refresh user data from server
      // const { refreshUser } = useAuth()
      // await refreshUser()
    } catch (error) {
      console.warn('Failed to refresh user data:', error)
      // Handle token expiration or invalid token
    }
  }
})
