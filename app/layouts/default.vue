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
  </div>
</template>

<script setup>
// Import the new header component
import TheHeader from '~/components/layout/TheHeader.vue'

// Since all logic has been moved to TheHeader, this script block might be empty
// or could be used for other layout-specific logic in the future.
</script>

<style scoped>
/* Scoped styles for the layout if needed */
</style>
