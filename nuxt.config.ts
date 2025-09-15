// nuxt.config.ts
export default defineNuxtConfig({
  srcDir: 'app/',

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  css: [
    '~/assets/css/main.css',
    '~/assets/css/profile.css'
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api/v1',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'کتابخانه دیجیتال',
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION || '1.0.0'
    }
  },

  nitro: {
    routeRules: {
      '/api/v1/**': { cors: true },
    },
  },

  ssr: false,

  devServer: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/sanctum': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },

  pinia: {
    storesDirs: ['./stores/**']
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config',
    viewer: true
  },

  experimental: {
    payloadExtraction: false
  },

  app: {
    head: {
      title: 'کتابخانه دیجیتال',
      titleTemplate: '%s - کتابخانه دیجیتال',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'کتابخانه دیجیتال - هزاران کتاب در دسترس شما' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  build: {
    transpile: ['@headlessui/vue']
  },

  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  compatibilityDate: '2025-01-27'
})
