<script setup>
definePageMeta({
  middleware: 'auth'
})
if (process.client) {
  navigateTo('/dashboard/profile', { replace: true })
}
</script>

<template>
  <div />
</template>

