<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Site Header -->
    <TheHeader />

    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Optional: Site Footer -->
    <!--
    <TheFooter />
    -->
    <ApiDebugger v-if="devMode" />
  </div>
</template>

<script setup>
// Import the new header component
import TheHeader from '~/components/layout/TheHeader.vue'
import ApiDebugger from '~/components/ApiDebugger.vue'
import { computed } from 'vue'

// Show debugger only in development mode
const devMode = process.dev
</script>

<style scoped>
/* Scoped styles for the layout if needed */
</style>
