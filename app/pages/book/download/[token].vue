<template>
  <div class="container mx-auto p-4 md:p-8">
    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-500 py-10">
      <p>در حال دریافت اطلاعات...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-500 p-4 bg-red-100 rounded-lg">
      <p>خطا در دریافت اطلاعات: {{ error }}</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="downloadInfo" class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <header class="text-center mb-6 border-b pb-4">
        <h1 class="text-3xl font-bold text-gray-800">دریافت کتاب: {{ downloadInfo.book.title }}</h1>
        <p v-if="downloadInfo.book.author" class="text-gray-600 mt-2">اثر: {{ downloadInfo.book.author }}</p>
      </header>

      <!-- Processing State -->
      <div v-if="isProcessing" class="text-center p-6 bg-blue-50 rounded-lg">
        <div class="flex items-center justify-center text-blue-800">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-lg font-medium">
            لینک دانلود شما در حال آماده‌سازی است. لطفاً چند لحظه صبر کنید...
          </p>
        </div>
        <p class="text-sm text-blue-600 mt-2">این صفحه به صورت خودکار به‌روزرسانی می‌شود.</p>
      </div>

      <!-- Available State -->
      <div v-else-if="canDownload && isFileAvailable" class="text-center">
        <a
          :href="downloadLink"
          class="inline-block w-full font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-lg bg-green-600 hover:bg-green-700 text-white"
        >
          دانلود کتاب با لینک مستقیم
        </a>
        <div class="text-sm text-gray-600 mt-4 border-t pt-4">
          <div class="flex justify-between mb-2">
            <span>تعداد دانلود باقی‌مانده:</span>
            <span class="font-mono">{{ remainingDownloads }}</span>
          </div>
          <div class="flex justify-between">
            <span>تاریخ انقضای لینک:</span>
            <span class="font-mono">{{ formattedExpiresAt }}</span>
          </div>
        </div>
      </div>

      <!-- Unavailable/Failed State -->
      <div v-else class="text-center p-6 bg-red-50 text-red-800 rounded-lg">
        <p class="text-lg font-medium">در حال حاضر امکان دانلود این کتاب وجود ندارد.</p>
        <p v-if="!canDownload" class="mt-2 text-sm">
          شاید تاریخ انقضای لینک شما به پایان رسیده یا از تمام فرصت‌های دانلود خود استفاده کرده‌اید.
        </p>
        <p v-else-if="downloadInfo.file_status === 'failed'" class="mt-2 text-sm">
          مشکلی در پردازش فایل کتاب رخ داده است. لطفاً با پشتیبانی تماس بگیرید.
        </p>
        <p v-else-if="downloadInfo.file_status === 'unavailable'" class="mt-2 text-sm">
          فایل کتاب در سرور موجود نیست. لطفاً با پشتیبانی تماس بگیرید.
        </p>
      </div>

      <!-- Auxiliary Links -->
      <div class="mt-10 border-t pt-6">
        <h3 class="text-center text-lg font-semibold text-gray-700 mb-4">لینک‌های کمکی</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button v-for="i in 4" :key="i" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            لینک کمکی {{ i }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useApiAuth } from '~/composables/useApiAuth';
import { useFormatters } from '~/composables/useFormatters';

definePageMeta({
  middleware: 'auth',
});

const route = useRoute();
const api = useApiAuth();
const formatters = useFormatters();

const token = route.params.token;
const downloadInfo = ref(null);
const loading = ref(true);
const error = ref(null);
let pollingInterval = null;

const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

const fetchStatus = async () => {
  try {
    const response = await api.get(`/books/download/${token}/status`);
    if (response && response.success) {
      downloadInfo.value = response.data;
      error.value = null; // Clear previous errors

      // If the file is not in a processing state, stop polling
      if (downloadInfo.value.file_status !== 'processing') {
        stopPolling();
      }
    } else {
      throw new Error(response.message || 'Failed to get download info.');
    }
  } catch (err) {
    error.value = err.response?._data?.message || err.message || 'An unknown error occurred.';
    stopPolling(); // Stop polling on any error
  } finally {
    loading.value = false;
  }
};

const startPolling = () => {
  // Poll every 5 seconds
  pollingInterval = setInterval(fetchStatus, 5000);
};

onMounted(async () => {
  await fetchStatus();
  // If the initial status is 'processing', start polling
  if (downloadInfo.value?.file_status === 'processing') {
    startPolling();
  }
});

onUnmounted(() => {
  stopPolling();
});

// Computed Properties based on the new API structure
const isProcessing = computed(() => downloadInfo.value?.file_status === 'processing');
const isFileAvailable = computed(() => downloadInfo.value?.file_status === 'available');
const canDownload = computed(() => downloadInfo.value?.purchase?.can_download === true);
const downloadLink = computed(() => isFileAvailable.value && canDownload.value ? downloadInfo.value.download_link : '#');

const remainingDownloads = computed(() => {
  if (!downloadInfo.value?.purchase) return '...';
  return downloadInfo.value.purchase.max_downloads - downloadInfo.value.purchase.total_downloads;
});

const formattedExpiresAt = computed(() => {
  if (!downloadInfo.value?.purchase?.expires_at) return '...';
  return formatters.formatDate(downloadInfo.value.purchase.expires_at, { dateStyle: 'full', timeStyle: 'short' });
});
</script>
