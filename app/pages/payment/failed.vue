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
        <NuxtLink v-if="bookSlug" :to="`/book/${bookSlug}`" class="block w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          تلاش مجدد
        </NuxtLink>
        <div v-else-if="loadingBookDetails" class="text-center">
          <p class="text-sm text-gray-500">در حال آماده‌سازی تلاش مجدد...</p>
        </div>
        <NuxtLink to="/" class="block w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          بازگشت به صفحه اصلی
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from '#app'
import { useApiAuth } from '~/composables/useApiAuth'
import { useAuthStore } from '~/stores/auth'

const route = useRoute();
const apiAuth = useApiAuth();
const authStore = useAuthStore();

const orderId = ref(null);
const bookSlug = ref(null);
const loadingBookDetails = ref(false);

async function fetchOrderDetails(id) {
  if (!id) return;

  loadingBookDetails.value = true;
  try {
    const response = await apiAuth.get(`/orders/${id}`);
    const item = response.data?.items?.[0];
    if (item && item.purchase && item.purchase.book && item.purchase.book.slug) {
        bookSlug.value = item.purchase.book.slug;
    } else if (response.data?.book?.slug) {
        bookSlug.value = response.data.book.slug;
    }
  } catch (error) {
    console.error('Could not fetch order details for failed payment page:', error);
  } finally {
    loadingBookDetails.value = false;
  }
}

onMounted(() => {
  orderId.value = route.query.order_id || null;
});

// Watch for the user to be logged in before fetching order details.
// This prevents a race condition on page load where the API call is made
// before the auth token is initialized.
watch(
  () => authStore.currentUser,
  (currentUser) => {
    // We watch for the user object to be populated, which happens after
    // the /auth/user call is complete. This is a more reliable signal
    // for full authentication than just isLoggedIn.
    if (currentUser && orderId.value) {
      fetchOrderDetails(orderId.value);
    }
  },
  { immediate: true }
);
</script>
