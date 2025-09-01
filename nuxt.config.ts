export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2024-11-01',

  css: ['~/assets/css/main.css'],

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

  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000',
      appName: 'سیستم مدیریت پیشرفته'
    }
  },

  nitro: {
    preset: process.env.VERCEL ? 'vercel' : undefined,
    routeRules: {
      '/**': { cors: true },
      '/api/**': { cache: false }
    },
    devProxy: process.env.NODE_ENV !== 'production' ? {
      '/api/auth': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        // @ts-expect-error runtime support
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      } as any
    } : undefined
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
  },

  experimental: {
    renderJsonPayloads: true
  },

  vite: {
    build: {
      cssMinify: true
    },
    optimizeDeps: {
      include: []
    }
  }
})
