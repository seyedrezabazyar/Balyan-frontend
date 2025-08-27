export default defineNuxtConfig({
  srcDir: 'app/',
  modules: [],
  compatibilityDate: '2025-08-27',
  css: [
    '../assets/css/main.css'
  ],

  // TypeScript configuration
  typescript: {
    typeCheck: false
  },

  // SSR configuration
  ssr: true,

  // App configuration
  app: {
    head: {
      title: 'سیستم مدیریت پیشرفته',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'سیستم مدیریت پیشرفته با احراز هویت OTP' }
      ]
    }
  },

  // Development configuration
  devtools: { enabled: true },

  // Nitro configuration for better development
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://127.0.0.1:8000/api',
        changeOrigin: true,
        prependPath: true
      }
    }
  },

  // Runtime configuration
  runtimeConfig: {
    public: {
      apiBase: 'http://127.0.0.1:8000/api'
    }
  }
})
