export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2024-11-01',

  // CSS و Assets
  css: ['@/assets/css/main.css'],

  // TypeScript
  typescript: {
    typeCheck: false,
    strict: true
  },

  // SSR
  ssr: true,

  // App config
  app: {
    head: {
      title: 'سیستم مدیریت پیشرفته',
      titleTemplate: '%s | سیستم مدیریت',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'سیستم مدیریت مدرن با احراز هویت امن' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Development
  devtools: { enabled: true },
  devServer: {
    port: 3000,
    host: '127.0.0.1'
  },

  // Runtime config
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000'
    }
  },

  // Components
  components: [
    { path: '~/components', pathPrefix: false }
  ],

  // Auto imports
  imports: {
    dirs: ['composables/**', 'utils/**', 'types/**']
  },

  // Performance optimizations
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true
  },

  // Build optimizations
  vite: {
    optimizeDeps: {
      include: ['vue']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'auth': ['./app/composables/useAuth.ts'],
            'dashboard': ['./app/components/dashboard/index.ts']
          }
        }
      }
    }
  }
})
