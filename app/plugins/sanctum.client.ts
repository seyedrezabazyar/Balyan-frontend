// import { useApi } from '~/composables/useApi'

export default defineNuxtPlugin(async () => {
  // NOTE: This was disabled by Jules because the project uses an internal Nuxt server API,
  // not an external Laravel Sanctum backend. This call was failing and causing
  // subsequent API calls to behave unexpectedly.
  /*
  const api = useApi()

  try {
    await api.get('/sanctum/csrf-cookie', {
      baseURL: '/'
    })
    console.log('Sanctum CSRF cookie requested successfully via useApi.')
  } catch (error) {
    console.error('Plugin failed to fetch Sanctum CSRF cookie:', error)
  }
  */
})
