export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2024-11-01',

  css: ['~/assets/css/main.css'],

  typescript: {
    typeCheck: false,
    strict: true
  },

  ssr: false,  // 👈 غیرفعال کردن SSR برای debugging

  app: {
    head: {
      title: 'سیستم مدیریت پیشرفته',
      titleTemplate: '%s - سیستم مدیریت',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'سیستم مدیریت با احراز هویت امن' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000',
      appName: 'سیستم مدیریت پیشرفته'
    }
  },

  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api',
        changeOrigin: true
      }
    }
  },

  devServer: {
    port: 3000,
    host: '127.0.0.1'
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  imports: {
    dirs: ['composables/**', 'utils/**']
  }
})
