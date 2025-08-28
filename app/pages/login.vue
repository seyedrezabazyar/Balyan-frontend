<template>
  <div class="redirect-container">
    <div class="redirect-content">
      <div class="spinner">
        <div class="loader"></div>
      </div>
      <h2>در حال انتقال...</h2>
      <p>شما به صفحه احراز هویت منتقل می‌شوید</p>
    </div>
  </div>
</template>

<script setup>
// Immediate redirect to unified auth page
definePageMeta({
  middleware: 'guest',
  layout: false
})

// Redirect immediately on mount
onMounted(() => {
  navigateTo('/auth')
})

// Also redirect on server side
await navigateTo('/auth')
</script>

<style scoped>
.redirect-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
}

.redirect-content {
  text-align: center;
  color: white;
}

.spinner {
  margin-bottom: 30px;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

p {
  opacity: 0.9;
  font-size: 1rem;
}
</style>
