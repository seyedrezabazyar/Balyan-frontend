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

    <!-- Expired Link State -->
    <div v-else-if="isExpired && expiredBookDetails" class="max-w-2xl mx-auto text-center bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-2xl font-bold text-red-600 mb-4">لینک دانلود منقضی شده است</h1>
      <img
        v-if="expiredBookDetails.book.image"
        :src="expiredBookDetails.book.image.url"
        :alt="expiredBookDetails.book.title"
        class="w-48 h-auto mx-auto mb-4 rounded-lg shadow-md"
      />
      <h2 class="text-xl font-semibold text-gray-800">{{ expiredBookDetails.book.title }}</h2>
      <p class="text-gray-600 my-4">{{ expiredBookDetails.message }}</p>
      <NuxtLink
        :to="`/book/${expiredBookDetails.book.slug}`"
        class="inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
      >
        خرید مجدد کتاب
      </NuxtLink>
    </div>

    <!-- Main Content -->
    <div v-else-if="downloadInfo" class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <header class="text-center mb-6 border-b pb-4">
        <h1 class="text-3xl font-bold text-gray-800">دریافت کتاب: {{ downloadInfo.book.title }}</h1>
        <p v-if="downloadInfo.book.author" class="text-gray-600 mt-2">اثر: {{ downloadInfo.book.author }}</p>
      </header>

      <!-- Global Processing State -->
      <div v-if="isProcessing" class="text-center p-6 bg-blue-50 rounded-lg">
          <p class="text-lg font-medium text-blue-800">
              یک یا چند فایل در حال آماده‌سازی است. این صفحه به صورت خودکار به‌روزرسانی می‌شود.
          </p>
      </div>

      <!-- Merged Book View -->
      <div v-if="downloadInfo.book.is_master && downloadInfo.variants" class="space-y-6">
        <div v-for="variant in downloadInfo.variants" :key="variant.id" class="border rounded-lg p-4">
          <h2 class="text-xl font-semibold mb-3">
            نسخه: {{ variant.format }} <span v-if="variant.publication_year">({{ variant.publication_year }})</span>
          </h2>

          <!-- Variant Available -->
          <div v-if="variant.file_status === 'available' && canDownload">
            <button @click="handleDownload(variant.download_link, `${downloadInfo.book.slug}-${variant.format}`, variant.id)" :disabled="isDownloading === variant.id" class="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 mb-4 disabled:bg-green-300 disabled:cursor-not-allowed">
              {{ isDownloading === variant.id ? 'در حال دانلود...' : `دانلود مستقیم (${variant.format})` }}
            </button>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button v-for="i in 4" :key="i" class="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 px-3 rounded">
                لینک کمکی {{ i }}
              </button>
            </div>
          </div>

          <!-- Variant Processing -->
          <div v-else-if="variant.file_status === 'processing' || variant.file_status === 'unavailable'" class="text-center p-3 bg-blue-50 rounded-lg text-blue-700">
            در حال آماده‌سازی فایل...
          </div>

          <!-- Variant Failed -->
          <div v-else-if="variant.file_status === 'failed'" class="text-center p-3 bg-red-50 rounded-lg text-red-700">
            مشکلی در ساخت فایل این نسخه رخ داده است.
          </div>

          <!-- Cannot Download (Expired, etc) -->
          <div v-else-if="!canDownload" class="text-center p-3 bg-yellow-50 rounded-lg text-yellow-700">
            مهلت دانلود شما به پایان رسیده است.
          </div>
        </div>
      </div>

      <!-- Single Book View (Legacy) -->
      <div v-else>
        <!-- Available State -->
        <div v-if="canDownload && isFileAvailable" class="text-center">
            <button @click="handleDownload(downloadLink, downloadInfo.book.slug, 'main')" :disabled="isDownloading === 'main'" class="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed">
                {{ isDownloading === 'main' ? 'در حال دانلود...' : 'دانلود کتاب با لینک مستقیم' }}
            </button>
        </div>
        <!-- Unavailable/Failed State -->
        <div v-else class="text-center p-6 bg-red-50 text-red-800 rounded-lg">
            <p class="text-lg font-medium">در حال حاضر امکان دانلود این کتاب وجود ندارد.</p>
             <p v-if="!canDownload" class="mt-2 text-sm">
                شاید تاریخ انقضای لینک شما به پایان رسیده یا از تمام فرصت‌های دانلود خود استفاده کرده‌اید.
            </p>
        </div>
      </div>

      <!-- Common Footer Info -->
      <div class="text-sm text-gray-600 mt-6 border-t pt-4">
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
const isDownloading = ref(null); // Will store the ID of the item being downloaded
const isExpired = ref(false);
const expiredBookDetails = ref(null);
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
      error.value = null;

      const info = downloadInfo.value;
      // For merged books, stop polling if no variants are in a processing state.
      if (info.book?.is_master && Array.isArray(info.variants)) {
        const isAnyVariantProcessing = info.variants.some(
          v => v.file_status === 'processing' || v.file_status === 'unavailable'
        );
        if (!isAnyVariantProcessing) {
          stopPolling();
        }
      }
      // For single books, use the original logic.
      else if (['available', 'failed'].includes(info.file_status)) {
        stopPolling();
      }

    } else {
      throw new Error(response.message || 'Failed to get download info.');
    }
  } catch (err) {
    // Check if the error is a 403 with the specific 'expired' status
    if (err.response?.status === 403 && err.response?._data?.status === 'expired') {
      expiredBookDetails.value = err.response._data;
      isExpired.value = true;
      error.value = null; // Clear any generic error
    } else {
      // Handle all other errors as before
      error.value = err.response?._data?.message || err.message || 'An unknown error occurred.';
    }
    stopPolling();
  } finally {
    loading.value = false;
  }
};

const handleDownload = async (url, fileName, downloadId) => {
  if (!url || url === '#') return;
  isDownloading.value = downloadId;
  error.value = null;

  try {
    const response = await api.$api(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;

    const fileExtension = blob.type.split('/')[1] || 'pdf';
    link.setAttribute('download', `${fileName}.${fileExtension}`);

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    // After a successful download, re-fetch status to update remaining download count.
    await fetchStatus();

  } catch (err) {
    error.value = 'خطا در دانلود فایل. لطفا دوباره تلاش کنید.';
    console.error('Download error:', err);
  } finally {
    isDownloading.value = null;
  }
};

const startPolling = () => {
  pollingInterval = setInterval(fetchStatus, 5000);
};

onMounted(async () => {
  await fetchStatus();
  if (isProcessing.value) {
    startPolling();
  }
});

onUnmounted(() => {
  stopPolling();
});

const isProcessing = computed(() => {
  const info = downloadInfo.value;
  if (info?.book?.is_master && Array.isArray(info.variants)) {
    // For master books, check if any variant is still processing/unavailable.
    return info.variants.some(
      (variant) => variant.file_status === 'processing' || variant.file_status === 'unavailable'
    );
  }
  // For single books, use the existing logic.
  const status = info?.file_status;
  return status === 'processing' || status === 'unavailable';
});
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
