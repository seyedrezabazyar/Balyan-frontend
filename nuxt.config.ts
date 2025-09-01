export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2024-11-01',

  css: ['@/assets/css/main.css'],

  typescript: {
    typeCheck: false,
    strict: true
  },

  ssr: true,

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
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000',
      appName: 'سیستم مدیریت پیشرفته'
    }
  },

  nitro: {
    devProxy: {
      '/api/auth': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        // @ts-expect-error: rewrite is supported at runtime but not typed in Nuxt 3
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      } as any
    }
  },

  devServer: {
    port: 3000,
    host: '127.0.0.1'
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
      global: false
    }
  ],

  imports: {
    dirs: ['composables/**', 'utils/**', 'types/**']
  },

  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true
  },

  vite: {
    optimizeDeps: {
      include: ['vue', 'vue-router']
    }
  }
})
