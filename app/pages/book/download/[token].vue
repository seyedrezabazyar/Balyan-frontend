<template>
  <div class="container mx-auto p-4 md:p-8">
    <header class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-gray-800">دریافت کتاب</h1>
      <p class="text-gray-600 mt-2">لینک دانلود شما در این صفحه مدیریت می‌شود.</p>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-500 py-10">
      <p>در حال بارگذاری اطلاعات دانلود...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-500 p-4 bg-red-100 rounded-lg">
      <p>خطا در دریافت اطلاعات: {{ error }}</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="downloadInfo" class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800">وضعیت دانلود شما</h2>
      </div>

      <!-- Download Status Section -->
      <div class="mb-8 p-4 rounded-lg" :class="statusClass">
        <div v-if="isPending" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-lg font-medium text-gray-800">در حال آماده سازی لینک دانلود هستیم...</p>
        </div>
        <div v-else-if="canDownload" class="text-center">
          <p class="text-lg font-medium text-green-800">لینک دانلود شما آماده است!</p>
        </div>
        <div v-else class="text-center">
           <p class="text-lg font-medium text-red-800">متاسفانه امکان دانلود وجود ندارد. (لینک منقضی شده یا تعداد دانلود به پایان رسیده)</p>
        </div>
      </div>

      <!-- Direct Download Button -->
      <div class="text-center mb-8">
        <a
          :href="downloadLink"
          :disabled="!canDownload"
          :class="{
            'bg-blue-600 hover:bg-blue-700 text-white': canDownload,
            'bg-gray-300 text-gray-500 cursor-not-allowed': !canDownload
          }"
          class="inline-block w-full font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-lg"
        >
          دانلود کتاب با لینک مستقیم
        </a>
      </div>

      <!-- Download Details -->
      <div class="text-sm text-gray-600 border-t pt-4">
          <div class="flex justify-between mb-2">
              <span>تعداد دانلود باقی‌مانده:</span>
              <span class="font-mono">{{ remainingDownloads }}</span>
          </div>
          <div class="flex justify-between">
              <span>تاریخ انقضای لینک:</span>
              <span class="font-mono">{{ formattedExpiresAt }}</span>
          </div>
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

const fetchStatus = async () => {
  try {
    const response = await api.get(`/books/download/${token}/status`);
    if (response) {
      downloadInfo.value = response;
      // If the link is available or can no longer be downloaded, stop polling
      if (response.status === 'available' || !response.can_download) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
    } else {
      throw new Error('پاسخ نامعتبر از سرور');
    }
  } catch (err) {
    error.value = err.response?._data?.message || err.message || 'یک خطای ناشناخته رخ داد.';
    clearInterval(pollingInterval); // Stop polling on error
    pollingInterval = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchStatus(); // Fetch immediately on mount
  // Poll every 5 seconds
  pollingInterval = setInterval(fetchStatus, 5000);
});

onUnmounted(() => {
  // Clear the interval when the component is destroyed
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});

const status = computed(() => downloadInfo.value?.status);
const canDownload = computed(() => downloadInfo.value?.can_download === true);
const isPending = computed(() => status.value === 'pending_download');

const downloadLink = computed(() => {
    return canDownload.value ? `/api/v1/books/download/${token}` : '#';
});

const remainingDownloads = computed(() => {
    if (!downloadInfo.value) return '...';
    return downloadInfo.value.max_downloads - downloadInfo.value.total_downloads;
});

const formattedExpiresAt = computed(() => {
    if (!downloadInfo.value?.expires_at) return '...';
    return formatters.formatDate(downloadInfo.value.expires_at, { dateStyle: 'full', timeStyle: 'short' });
});

const statusClass = computed(() => {
    if (isPending.value) return 'bg-yellow-100 border-yellow-400';
    if (canDownload.value) return 'bg-green-100 border-green-400';
    return 'bg-red-100 border-red-400';
})
</script>
