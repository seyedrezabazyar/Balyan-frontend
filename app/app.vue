<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

// Initialize stores on app mount
onMounted(async () => {
  console.log('App.vue mounted, initializing auth...')
  const authStore = useAuthStore()
  await authStore.initAuth()

  console.log('Auth initialized:', {
    hasToken: !!authStore.token,
    hasUser: !!authStore.user,
    isAuthenticated: authStore.isAuthenticated
  })
})
</script>
