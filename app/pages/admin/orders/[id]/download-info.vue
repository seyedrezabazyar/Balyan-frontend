<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500">در حال دریافت اطلاعات سفارش...</p>
    </div>
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">خطا!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
    <div v-else-if="downloadInfo" class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <header class="text-center mb-6 border-b pb-4">
        <h1 class="text-3xl font-bold text-gray-800">اطلاعات دانلود سفارش #{{ orderId }}</h1>
      </header>

      <div v-if="downloadInfo.book" class="mb-6">
        <h2 class="text-xl font-semibold text-gray-700">اطلاعات کتاب</h2>
        <p><span class="font-medium">عنوان:</span> {{ downloadInfo.book.title }}</p>
        <p><span class="font-medium">نویسنده:</span> {{ downloadInfo.book.author }}</p>
      </div>

      <div v-if="downloadInfo.purchase" class="mb-6">
        <h2 class="text-xl font-semibold text-gray-700">اطلاعات خرید</h2>
        <p><span class="font-medium">وضعیت:</span> {{ downloadInfo.purchase.status }}</p>
        <p><span class="font-medium">تعداد دانلود:</span> {{ downloadInfo.purchase.total_downloads }} / {{ downloadInfo.purchase.max_downloads }}</p>
        <p v-if="downloadInfo.purchase.expires_at"><span class="font-medium">تاریخ انقضا:</span> {{ new Date(downloadInfo.purchase.expires_at).toLocaleString('fa-IR') }}</p>
      </div>

      <div v-if="downloadInfo.can_download && downloadInfo.download_link">
        <a :href="downloadInfo.download_link" target="_blank" class="w-full text-center block bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed">
          دانلود کتاب
        </a>
      </div>
      <div v-else class="text-center p-4 bg-yellow-50 text-yellow-800 rounded-lg">
        <p>{{ downloadInfo.message || 'لینک دانلودی برای این سفارش وجود ندارد.' }}</p>
      </div>

      <div class="mt-8 text-center">
        <NuxtLink to="/admin/orders" class="text-blue-600 hover:text-blue-800">بازگشت به لیست سفارشات</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApiAuth } from '~/composables/useApiAuth';

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
});

const route = useRoute();
const api = useApiAuth();

const orderId = route.params.id;
const downloadInfo = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchDownloadInfo = async () => {
  loading.value = true;
  error.value = null;
  try {
    // First, get the order details to find the download_info_url
    // NOTE: This assumes an endpoint /api/v1/admin/orders/:id exists.
    // This is a reasonable assumption based on REST principles and the user's guide,
    // but was not explicitly confirmed. If this fails, this is the place to debug.
    const orderResponse = await api.get(`/admin/orders/${orderId}`);

    const downloadInfoUrl = orderResponse?.actions?.download_info_url;

    if (!downloadInfoUrl) {
      throw new Error('URL اطلاعات دانلود در این سفارش یافت نشد.');
    }

    // The URL from the backend is absolute, but useApiAuth should handle it.
    const infoResponse = await api.get(downloadInfoUrl);
    downloadInfo.value = infoResponse;

  } catch (err) {
    console.error(`Failed to fetch download info for order ${orderId}:`, err);
    error.value = err.response?._data?.message || err.message || 'دریافت اطلاعات دانلود با خطا مواجه شد.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDownloadInfo);
</script>
