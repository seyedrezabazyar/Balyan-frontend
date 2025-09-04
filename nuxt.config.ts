// nuxt.config.ts
export default defineNuxtConfig({
  srcDir: 'app/',

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  css: [
    '~/assets/css/main.css',
    '~/assets/css/profile.css'  // اضافه کردن CSS پروفایل
  ],

  runtimeConfig: {
    public: {
      // Use Nitro dev proxy by default to avoid CORS during development
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'کتابخانه دیجیتال',
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION || '1.0.0'
    }
  },

  ssr: false,

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8000/api',
        changeOrigin: true,
        cookieDomainRewrite: {
          '*': ''
        }
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

  // بهبود Performance
  experimental: {
    payloadExtraction: false
  },

  // تنظیمات SEO
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

  // تنظیمات Build
  build: {
    transpile: ['@headlessui/vue']
  },

  // تنظیمات Router
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  compatibilityDate: '2025-01-27'
})
