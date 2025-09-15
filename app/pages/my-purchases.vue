<template>
  <div class="container mx-auto p-4 md:p-8">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">کتاب‌های خریداری شده</h1>
      <p class="text-gray-600 mt-2">کتاب‌هایی که خریداری کرده‌اید در اینجا نمایش داده می‌شوند.</p>
    </header>

    <div v-if="loading" class="text-center text-gray-500">
      <p>در حال بارگذاری کتاب‌ها...</p>
    </div>

    <div v-else-if="error" class="text-center text-red-500 p-4 bg-red-100 rounded-lg">
      <p>خطا در دریافت اطلاعات: {{ error }}</p>
    </div>

    <div v-else-if="!purchaseStore.hasPurchases" class="text-center text-gray-500 p-8 border-2 border-dashed rounded-lg">
      <h2 class="text-xl font-semibold">کتابی یافت نشد</h2>
      <p class="mt-2">شما هنوز هیچ کتابی خریداری نکرده‌اید.</p>
      <NuxtLink to="/books" class="mt-4 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
        مشاهده فروشگاه کتاب
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <BookCard
        v-for="book in purchasedBooks"
        :key="book.id"
        :book="book"
        :show-download-links="true"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { usePurchaseStore } from '~/stores/purchase'
import BookCard from '~/components/BookCard.vue'

definePageMeta({
  middleware: 'auth',
  alias: ['/downloads', '/library']
})

const authStore = useAuthStore()
const purchaseStore = usePurchaseStore()

// Computed properties to reactively get data from the store
const purchasedBooks = computed(() => purchaseStore.purchasedBooks)
const loading = computed(() => purchaseStore.loading)
const error = computed(() => purchaseStore.error)

// Fetch user data and purchased books when the component mounts
onMounted(async () => {
  // Ensure user is fetched first, as their auth state is needed for the next call
  if (authStore.isLoggedIn && !authStore.currentUser) {
    await authStore.fetchUser()
  }
  // Now fetch the purchased books
  await purchaseStore.fetchPurchasedBooks()
})
</script>
