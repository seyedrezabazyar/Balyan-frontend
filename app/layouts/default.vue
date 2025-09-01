<!-- app/layouts/default.vue - نسخه بهبود یافته -->
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

    <!-- Toast Container -->
    <AppToast />
  </div>
</template>

<script setup>
const { initialize, initialized } = useAuth()

// اطمینان از initialize شدن auth
onMounted(async () => {
  if (!initialized.value) {
    await initialize()
  }
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: var(--font-family);
  direction: rtl;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
  background: var(--light);
}

.container {
  max-width: 1400px;
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
