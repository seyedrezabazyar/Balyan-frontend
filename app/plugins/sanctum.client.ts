import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin({
  name: 'sanctum-csrf',
  parallel: true, // Run in parallel to avoid blocking, after core plugins like Pinia
  async setup(nuxtApp) {
    console.log('Sanctum CSRF plugin: Initializing to align with Laravel backend.')

    // Use direct $fetch instead of useApi to avoid Pinia dependency (useApi calls useAuthStore)
    // This fetches CSRF cookie before any auth calls, using proxy in dev
    const sanctumUrl = '/sanctum/csrf-cookie'

    console.log(`Fetching CSRF cookie from: ${sanctumUrl}`)

    try {
      // Direct fetch with credentials for cookies, no baseURL to use proxy
      await $fetch(sanctumUrl, {
        method: 'GET',
        credentials: 'include',
        baseURL: undefined // Rely on Nuxt proxy for /sanctum
      })
      console.log('Sanctum CSRF cookie fetched successfully.')
    } catch (error: any) {
      console.error('Fatal error fetching Sanctum CSRF cookie:', error.data || error)
      // Don't throw; continue without CSRF if failed (fallback to token auth)
    }
  }
})
