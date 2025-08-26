<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UNotifications />
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

// Set default color mode
const colorMode = useColorMode()

// Initialize auth on app mount
const authStore = useAuthStore()

onMounted(async () => {
  // Try to fetch user if token exists
  if (useCookie('auth-token').value) {
    await authStore.fetchUser()
  }
})

// SEO defaults
useHead({
  htmlAttrs: {
    lang: 'fa',
    dir: 'rtl'
  },
  bodyAttrs: {
    class: 'antialiased'
  }
})
</script>