// app/plugins/sanctum.client.ts
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin({
  name: 'sanctum-csrf',
  enforce: 'pre', // Run this plugin before others
  async setup (nuxtApp) {
    // This plugin fetches the Laravel Sanctum CSRF cookie.
    // It must run before any API calls that require authentication.
    // It calls /sanctum/csrf-cookie, which is a standard Laravel endpoint.
    // We use $fetch directly because useApi adds the /api/v1 prefix, which is incorrect for this specific route.

    console.log('Sanctum CSRF plugin: Initializing to align with Laravel backend.')

    // We assume the Nuxt dev server is proxying requests to the Laravel backend.
    // Therefore, a relative path to /sanctum/csrf-cookie should be correctly routed.
    const sanctumUrl = '/sanctum/csrf-cookie'

    console.log(`Fetching CSRF cookie from: ${sanctumUrl}`)

    try {
      await $fetch(sanctumUrl, {
        method: 'GET',
        credentials: 'include', // Crucial for cookie-based authentication
        onResponse({ response }) {
          console.log('Sanctum CSRF response received. Status:', response.status)
        },
        onResponseError({ response }) {
           console.error('Sanctum CSRF request failed:', {
             status: response.status,
             body: response._data
           })
        }
      })
      console.log('Sanctum CSRF cookie fetched successfully.')
    } catch (error: any) {
      console.error('Fatal error fetching Sanctum CSRF cookie:', error.data || error)
    }
  }
})
