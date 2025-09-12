import { useApi } from '~/composables/useApi'

export default defineNuxtPlugin(async () => {
  // We don't need a token for the initial CSRF cookie request
  const api = useApi()

  try {
    // We use the 'get' method from our useApi composable.
    // This ensures that all necessary headers (like Accept: application/json)
    // and options (like credentials: 'include') are automatically included.
    // This request will be proxied by the dev server to the Laravel backend.
    await api.get('/sanctum/csrf-cookie', {
      baseURL: undefined // Use the proxy by not setting a baseURL
    })
    console.log('Sanctum CSRF cookie requested successfully via useApi.')
  } catch (error) {
    // The error is already logged by the useApi composable, but we can log it here too if needed.
    console.error('Plugin failed to fetch Sanctum CSRF cookie:', error)
  }
})
