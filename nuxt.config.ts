// nuxt.config.ts
export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2025-08-27',

  css: ['../assets/css/main.css'],

  typescript: { typeCheck: false },

  ssr: true,

  app: {
    head: {
      title: 'سیستم مدیریت پیشرفته',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'سیستم مدیریت با احراز هویت OTP' }
      ]
    }
  },

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:8000/api'
        : 'https://your-api.com/api'
    }
  },

  // Add nitro config for better API handling
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://127.0.0.1:8000/api',
        changeOrigin: true,
        prependPath: true,
      }
    }
  },

  devServer: {
    port: 3000,
    host: '127.0.0.1'
  }
});
