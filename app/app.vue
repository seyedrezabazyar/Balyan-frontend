<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

// Initialize stores on app mount
onMounted(() => {
  const authStore = useAuthStore()
  authStore.initAuth()
})
</script>
