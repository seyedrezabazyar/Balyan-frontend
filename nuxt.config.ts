export default defineNuxtConfig({
  srcDir: 'app/',

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // Use Nitro dev proxy by default to avoid CORS during development
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },

  ssr: false,

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8000/api',
        changeOrigin: true
      }
    }
  },

  pinia: {
    storesDirs: ['./stores/**']
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config',
    viewer: true
  },

  compatibilityDate: '2025-01-27'
})
