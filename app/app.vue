<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Ensure auth is initialized on client side
if (process.client) {
  const { restoreAuth } = useAuth()
  restoreAuth()
}
</script>
