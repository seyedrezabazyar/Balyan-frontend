// app/plugins/sanctum.client.ts
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { useApi } from '~/composables/useApi'

export default defineNuxtPlugin({
  name: 'sanctum-csrf',
  enforce: 'pre', // Run this plugin before others
  async setup (nuxtApp) {
    // This plugin fetches the Laravel Sanctum CSRF cookie.
    // It must run before any API calls that require authentication.
    // It calls /sanctum/csrf-cookie, which is a standard Laravel endpoint.
    // We use useApi but override baseURL to avoid the /api/v1 prefix for this specific route.

    console.log('Sanctum CSRF plugin: Initializing to align with Laravel backend.')

    // We assume the Nuxt dev server is proxying requests to the Laravel backend.
    // Therefore, a relative path to /sanctum/csrf-cookie should be correctly routed.
    const sanctumUrl = '/sanctum/csrf-cookie'

    console.log(`Fetching CSRF cookie from: ${sanctumUrl}`)

    const api = useApi()

    try {
      await api.get(sanctumUrl, {
        baseURL: undefined // Use the proxy by not setting a baseURL
      })
      console.log('Sanctum CSRF cookie fetched successfully via useApi.')
    } catch (error: any) {
      console.error('Fatal error fetching Sanctum CSRF cookie:', error.data || error)
    }
  }
})