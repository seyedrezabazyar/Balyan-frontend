<!-- app/pages/purchase/callback.vue -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">

      <!-- Loading State -->
      <div v-if="status === 'verifying'">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h1 class="text-2xl font-bold text-gray-800 mt-4">در حال تایید پرداخت</h1>
        <p class="text-gray-600 mt-2">لطفاً چند لحظه صبر کنید...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="status === 'success'">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-green-800 mt-4">پرداخت موفق</h1>
        <p class="text-gray-600 mt-2">{{ message }}</p>
        <div class="mt-6 space-y-3">
          <NuxtLink to="/dashboard" class="block w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            رفتن به داشبورد
          </NuxtLink>
          <NuxtLink v-if="bookSlug" :to="`/book/${bookSlug}`" class="block w-full px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200">
            بازگشت به صفحه کتاب
          </NuxtLink>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="status === 'error'">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-red-800 mt-4">پرداخت ناموفق</h1>
        <p class="text-gray-600 mt-2">{{ message }}</p>
        <div class="mt-6">
          <NuxtLink to="/dashboard" class="block w-full px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700">
            بازگشت به داشبورد
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from '#app'
import { useApiAuth } from '~/composables/useApiAuth'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const apiAuth = useApiAuth()

const status = ref('verifying') // 'verifying', 'success', 'error'
const message = ref('')
const bookSlug = ref(null)

onMounted(async () => {
  const query = route.query

  // Zibal returns success, trackId, and orderId.
  // We check for them here.
  if (!query.success || !query.trackId || !query.orderId) {
    status.value = 'error'
    message.value = 'اطلاعات بازگشتی از درگاه پرداخت ناقص یا نادرست است.'
    return
  }

  // If the payment was not successful according to Zibal, show an error.
  if (query.success !== '1') {
    status.value = 'error'
    message.value = 'تراکنش توسط درگاه پرداخت موفق اعلام نشده است.'
    return
  }

  try {
    // Send the verification data to our backend.
    // The backend will perform a server-to-server check with Zibal.
    const response = await apiAuth.post('/purchase/verify', {
      gateway: 'zibal',
      trackId: query.trackId,
      orderId: query.orderId,
      success: query.success,
    })

    if (response.success) {
      status.value = 'success'
      message.value = response.message || 'پرداخت شما با موفقیت تایید شد.'
      if (response.data?.book?.slug) {
        bookSlug.value = response.data.book.slug
      }
    } else {
      // This case happens if our backend fails to verify the payment.
      status.value = 'error'
      message.value = response.message || 'تایید پرداخت با خطا مواجه شد. لطفا با پشتیبانی تماس بگیرید.'
    }
  } catch (err) {
    status.value = 'error'
    message.value = err.data?.message || 'یک خطای غیرمنتظره در هنگام تایید پرداخت رخ داد.'
  }
});
</script>
