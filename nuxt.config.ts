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
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/auth'
    }
  },

  ssr: false,

  nitro: {
    devProxy: {
      '/auth': {
        target: 'http://127.0.0.1:8000/auth',
        changeOrigin: true
      },
      '/provinces': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/cities': {
        target: 'http://127.0.0.1:8000',
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
