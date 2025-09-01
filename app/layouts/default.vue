<template>
  <div class="layout">
    <AppHeader />

    <main class="main-content">
      <div class="container">
        <NuxtPage />
      </div>
    </main>

    <AppFooter />
    <AppToast />
  </div>
</template>

<script setup>
const { restoreAuth, initialized } = useAuth()

// Initialize auth on client
onMounted(() => {
  if (!initialized.value) {
    restoreAuth()
  }
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
