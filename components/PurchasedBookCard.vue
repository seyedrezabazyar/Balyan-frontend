<template>
  <div class="border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col h-full bg-white transition-shadow hover:shadow-xl">
    <!-- Book Cover Image -->
    <div class="relative h-56 w-full bg-gray-100">
      <img
        :src="purchase.cover_image_url || '/images/default-book-cover.png'"
        :alt="`جلد کتاب ${purchase.title}`"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Card Content -->
    <div class="p-4 flex flex-col flex-grow">
      <h3 class="text-lg font-bold text-gray-800 mb-2 flex-grow">
        {{ purchase.title }}
      </h3>

      <div class="space-y-2 text-sm text-gray-600 mt-2 mb-4">
        <!-- Remaining Downloads -->
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          <span>تعداد دانلود باقی‌مانده: <strong>{{ purchase.remaining_downloads }}</strong></span>
        </div>

        <!-- Expiration Info -->
        <div v-if="expirationText" class="flex items-center" :class="expirationClass">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{{ expirationText }}</span>
        </div>
      </div>

      <!-- Download Button -->
      <a
        :href="isExpired ? undefined : purchase.download_url"
        :target="isExpired ? undefined : '_blank'"
        rel="noopener noreferrer"
        :class="[
          'w-full text-center font-bold py-2 px-4 rounded-lg mt-auto transition-colors',
          {
            'bg-blue-600 hover:bg-blue-700 text-white': !isExpired,
            'bg-gray-300 text-gray-500 cursor-not-allowed': isExpired
          }
        ]"
        :aria-disabled="isExpired"
      >
        {{ isExpired ? 'لینک منقضی شده' : 'دانلود کتاب' }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Define the structure for the prop for type safety
interface BookPurchase {
  id: number;
  title: string;
  cover_image_url: string | null;
  remaining_downloads: number;
  days_until_expiration: number | null;
  download_url: string;
}

// Define the props this component accepts
const props = defineProps({
  purchase: {
    type: Object as () => BookPurchase,
    required: true
  }
});

// Computed property to check if the download link is expired
const isExpired = computed(() => {
  return props.purchase.days_until_expiration !== null && props.purchase.days_until_expiration < 0;
});

// Computed property to generate the expiration text
const expirationText = computed(() => {
  const days = props.purchase.days_until_expiration;
  if (days === null) {
    // If null, the link is permanent and we show nothing.
    return 'لینک دانلود دائمی است';
  }
  if (days < 0) {
    return 'لینک منقضی شده است';
  }
  if (days === 0) {
    return 'امروز آخرین فرصت دانلود است';
  }
  return `زمان باقی‌مانده: ${days} روز`;
});

// Computed property to apply different text colors based on expiration status
const expirationClass = computed(() => {
  const days = props.purchase.days_until_expiration;
  if (days !== null && days < 0) {
    return 'text-red-600 font-semibold'; // Expired
  }
  if (days !== null && days < 7) {
    return 'text-yellow-700'; // Expiring soon
  }
  return 'text-gray-600'; // Normal
});
</script>

<style scoped>
/* Using Tailwind utility classes, so minimal custom CSS is needed. */
/* You can add custom styles here if required. */
.cursor-not-allowed {
  cursor: not-allowed;
}
</style>
