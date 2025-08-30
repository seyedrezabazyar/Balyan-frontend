<!-- pages/test.vue -->
<template>
  <div>
    <h1>Test Page - No Layout</h1>
    <p>اگر این صفحه کار میکنه، مشکل در layout است</p>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false  // 👈 غیرفعال کردن layout
})
</script>

<style scoped>
div {
  padding: 2rem;
  text-align: center;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
}

p {
  color: #666;
}
</style>
