export default defineNuxtPlugin(async () => {
  const { fetchUser, token, user } = useAuth()
  
  // If we have a token but no user data or incomplete user data, fetch it
  if (token.value && (!user.value || !user.value.permissions)) {
    console.log('Auth plugin: Fetching user data on app initialization')
    await fetchUser()
  }
})