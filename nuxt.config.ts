// nuxt.config.ts
export default defineNuxtConfig({
  // Source directory
  srcDir: 'app/',

  // Compatibility date
  compatibilityDate: '2025-08-27',

  // Global CSS
  css: [
    '~/assets/css/main.css'
  ],

  // TypeScript configuration
  typescript: {
    typeCheck: false
  },

  // Enable SSR
  ssr: true,

  // App configuration
  app: {
    head: {
      title: 'سیستم مدیریت پیشرفته',
      titleTemplate: '%s - سیستم مدیریت',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'سیستم مدیریت با احراز هویت OTP و مدیریت کاربران' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Development tools
  devtools: { enabled: true },

  // Runtime configuration
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: process.env.API_SECRET,

    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000',
      appName: 'سیستم مدیریت پیشرفته'
    }
  },

  // Nitro configuration
  nitro: {
    // Development proxy for API calls
    devProxy: {
      '/api': {
        target: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api',
        changeOrigin: true,
        prependPath: true,
      }
    }
  },

  // Development server configuration
  devServer: {
    port: 3000,
    host: '127.0.0.1'
  },

  // Components configuration
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],

  // Auto-imports configuration
  imports: {
    dirs: [
      'composables/**'
    ]
  },

  // Build configuration
  build: {
    transpile: []
  },

  // Experimental features
  experimental: {
    payloadExtraction: false
  },

  // Vite configuration
  vite: {
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/variables.scss" as *;'
        }
      }
    }
  }
})
