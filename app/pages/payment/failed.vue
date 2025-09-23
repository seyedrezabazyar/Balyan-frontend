<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
        <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-red-800 mt-4">پرداخت ناموفق</h1>
      <p class="text-gray-600 mt-2">متاسفانه تراکنش شما ناموفق بود. هیچ هزینه‌ای از حساب شما کسر نشده است.</p>
      <div v-if="orderId" class="text-sm text-gray-500 pt-2">
        شماره سفارش: {{ orderId }}
      </div>
      <div class="mt-6 space-y-3">
        <button @click="goBack" class="block w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          تلاش مجدد
        </button>
        <NuxtLink to="/" class="block w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          بازگشت به صفحه اصلی
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from '#app'

const route = useRoute();
const router = useRouter();

const orderId = ref(null);

onMounted(() => {
  // Extract order_id from query params for user reference
  orderId.value = route.query.order_id || null;
});

function goBack() {
  // Takes the user back to the previous page (likely the book page)
  router.back();
}
</script>
