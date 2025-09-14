<template>
  <div class="container mx-auto p-4 md:p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">کتاب‌های من</h1>

    <div v-if="loading" class="text-center">
      <p>در حال بارگذاری کتابخانه شما...</p>
    </div>

    <div v-else-if="error" class="text-center text-red-500">
      <p>خطا در دریافت اطلاعات: {{ error.message }}</p>
    </div>

    <div v-else-if="purchases && purchases.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="purchase in purchases" :key="purchase.purchase_id" class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        <img :src="purchase.book.cover_image_url" :alt="purchase.book.title" class="w-full h-64 object-cover">
        <div class="p-4">
          <h2 class="text-lg font-semibold text-gray-800">{{ purchase.book.title }}</h2>
          <p class="text-sm text-gray-600 mb-4">خریداری شده</p>
          <a :href="`/api/v1/downloads/${purchase.download_token}`"
             class="w-full text-center block bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
            دانلود
          </a>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500">
      <p>شما هنوز هیچ کتابی خریداری نکرده‌اید.</p>
      <NuxtLink to="/" class="mt-4 inline-block text-blue-600 hover:underline">مشاهده فروشگاه</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApiAuth } from '~/composables/useApiAuth'

// Page metadata, including protecting the route with auth middleware
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'کتاب‌های من'
})

const apiAuth = useApiAuth()
const purchases = ref([])
const loading = ref(true)
const error = ref(null)

const fetchMyPurchases = async () => {
  try {
    const response = await apiAuth.get('/books/my-purchases')
    if (response.success) {
      purchases.value = response.data
    } else {
      throw new Error('Failed to fetch purchased books.')
    }
  } catch (err) {
    console.error('Failed to fetch purchases:', err)
    error.value = err.data || err
  } finally {
    loading.value = false
  }
}

onMounted(fetchMyPurchases)
</script>
