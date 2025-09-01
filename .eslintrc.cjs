module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022,
    sourceType: 'module',
    extraFileExtensions: ['.vue']
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:nuxt/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'vue'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-undef': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'vue/html-self-closing': 'off',
    'vue/multi-word-component-names': 'off'
  },
  globals: {
    definePageMeta: 'readonly',
    defineNuxtPlugin: 'readonly',
    defineNuxtRouteMiddleware: 'readonly',
    useNuxtApp: 'readonly',
    useRoute: 'readonly',
    useRouter: 'readonly',
    navigateTo: 'readonly',
    useRuntimeConfig: 'readonly',
    useHead: 'readonly',
    useFetch: 'readonly',
    useAsyncData: 'readonly',
    NitroFetchRequest: 'readonly',
    NuxtLink: 'readonly',
    NuxtLayout: 'readonly',
    NuxtPage: 'readonly',
    ref: 'readonly',
    computed: 'readonly',
    reactive: 'readonly',
    watch: 'readonly',
    watchEffect: 'readonly',
    onMounted: 'readonly',
    onUnmounted: 'readonly',
    provide: 'readonly',
    inject: 'readonly',
    defineAsyncComponent: 'readonly',
    useAuth: 'readonly',
    useToast: 'readonly',
    useApi: 'readonly',
    useUsers: 'readonly',
    usePermissions: 'readonly'
  },
  overrides: [
    {
      files: ['app/middleware/**/*.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ],
  ignorePatterns: ['.nuxt/**', '.output/**', 'dist/**']
}
