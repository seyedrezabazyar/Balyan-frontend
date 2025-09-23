<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-green-800 mt-4">پرداخت موفق</h1>
      <p class="text-gray-600 mt-2">پرداخت شما با موفقیت انجام شد. کتاب به کتابخانه شما اضافه شده است.</p>
      <div v-if="orderId" class="text-sm text-gray-500 pt-2">
        شماره سفارش: {{ orderId }}
      </div>
      <div class="mt-6 space-y-3">
        <NuxtLink v-if="bookSlug" :to="`/book/${bookSlug}`" class="block w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
          مشاهده صفحه کتاب
        </NuxtLink>
        <div v-else-if="loadingBookDetails" class="text-center">
          <p class="text-sm text-gray-500">در حال یافتن صفحه کتاب...</p>
        </div>
        <NuxtLink to="/my-purchases" class="block w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          رفتن به کتابخانه
        </NuxtLink>
        <NuxtLink to="/" class="block w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          بازگشت به صفحه اصلی
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from '#app'
import { usePurchaseStore } from '~/stores/purchase'
import { useApiAuth } from '~/composables/useApiAuth'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute();
const purchaseStore = usePurchaseStore();
const apiAuth = useApiAuth();

const orderId = ref(null);
const bookSlug = ref(null);
const loadingBookDetails = ref(false);

async function fetchOrderDetails(id) {
  if (!id) return;

  loadingBookDetails.value = true;
  try {
    // We assume an endpoint exists for regular users to fetch their own order details.
    // The exact structure of the response is also an assumption based on other parts of the app.
    const response = await apiAuth.get(`/orders/${id}`);

    // The book's slug could be in a nested object. We'll check the most likely structure.
    const item = response.data?.items?.[0];
    if (item && item.purchase && item.purchase.book && item.purchase.book.slug) {
        bookSlug.value = item.purchase.book.slug;
    } else if (response.data?.book?.slug) {
        bookSlug.value = response.data.book.slug;
    }
  } catch (error) {
    // Fail silently if the endpoint doesn't exist or there's an error.
    // The user still has the main navigation links.
    console.error('Could not fetch order details to create direct book link:', error);
  } finally {
    loadingBookDetails.value = false;
  }
}

onMounted(() => {
  orderId.value = route.query.order_id || null;

  // Fetch order details to get the book slug for a direct link.
  fetchOrderDetails(orderId.value);

  // Clear the local purchase cache. This is crucial so that when the user
  // navigates to their library, the app is forced to re-fetch the list
  // of purchases, which will now include the book they just bought.
  purchaseStore.clearPurchases();
});
</script>
