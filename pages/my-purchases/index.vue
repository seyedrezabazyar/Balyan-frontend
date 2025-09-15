<template>
  <div class="container mx-auto p-4 md:p-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
      کتاب‌های خریداری شده من
    </h1>

    <!-- 1. Loading State -->
    <div v-if="loading">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <!-- Skeleton Loader Card -->
        <div v-for="i in 4" :key="i" class="border rounded-lg p-4 shadow-md animate-pulse">
          <div class="bg-gray-300 h-48 w-full rounded-md mb-4"></div>
          <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div class="h-10 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    </div>

    <!-- 2. Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
      <strong class="font-bold">خطا!</strong>
      <span class="block sm:inline"> متاسفانه در دریافت اطلاعات مشکلی پیش آمد. لطفا دوباره تلاش کنید.</span>
      <p class="text-sm mt-2 text-gray-600">{{ error }}</p>
    </div>

    <!-- 3. Empty State -->
    <div v-else-if="!purchasedBooks || purchasedBooks.length === 0" class="text-center py-16">
      <p class="text-xl text-gray-600 mb-4">شما هنوز هیچ کتابی خریداری نکرده‌اید.</p>
      <NuxtLink to="/store" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
        رفتن به فروشگاه
      </NuxtLink>
    </div>

    <!-- 4. Success State - Display Books -->
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <PurchasedBookCard
          v-for="purchase in purchasedBooks"
          :key="purchase.id"
          :purchase="purchase"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePurchaseStore } from '~/app/stores/purchase';

// Set page title and meta description
useHead({
  title: 'کتاب‌های خریداری شده من',
  meta: [
    { name: 'description', content: 'لیست کتاب‌های خریداری شده و لینک‌های دانلود آن‌ها.' }
  ]
});

// Initialize the purchase store
const purchaseStore = usePurchaseStore();

// Get reactive state and getters from the store
// Using storeToRefs maintains reactivity for the state properties
const { purchasedBooks, loading, error } = storeToRefs(purchaseStore);

// Fetch the purchased books when the component is set up.
// The store's logic prevents re-fetching if data is already present.
await purchaseStore.fetchPurchasedBooks();

</script>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
