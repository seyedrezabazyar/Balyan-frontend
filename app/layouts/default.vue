<!-- layouts/default.vue -->
<template>
  <div class="layout">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="main-content">
      <div class="container">
        <NuxtPage />
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- Toast Notifications -->
    <AppToast />
  </div>
</template>

<script setup>
const { initialize } = useAuth()

// Initialize auth on layout mount
onMounted(() => {
  initialize()
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0;
  }

  .container {
    padding: 0 0.75rem;
  }
}
</style>
