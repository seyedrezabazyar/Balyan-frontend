<template>
  <div class="bg-white shadow-md rounded-lg p-4 mb-6">
    <h2 class="text-xl font-bold mb-4 text-gray-700">همگام‌سازی کتاب‌ها از API</h2>
    <div class="flex items-center gap-4">
      <button
        @click="startSync"
        :disabled="isLoading"
        class="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="isLoading">در حال همگام‌سازی...</span>
        <span v-else>شروع فرآیند همگام‌سازی</span>
      </button>
      <div v-if="message" :class="messageType === 'success' ? 'text-green-600' : 'text-red-600'">
        {{ message }}
      </div>
    </div>
    <p class="text-sm text-gray-500 mt-2">
      این فرآیند کتاب‌ها را از API بالیان دریافت و در پایگاه داده ذخیره می‌کند. این کار ممکن است زمان‌بر باشد و در پس‌زمینه اجرا می‌شود.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useApiAuth } from '~/composables/useApiAuth';

const api = useApiAuth();
const isLoading = ref(false);
const message = ref('');
const messageType = ref(''); // 'success' or 'error'

const startSync = async () => {
  isLoading.value = true;
  message.value = '';
  messageType.value = '';

  try {
    const response = await api.post('/admin/books/sync-from-api');
    message.value = response.message || 'فرآیند همگام‌سازی کتاب با موفقیت شروع شد.';
    messageType.value = 'success';
  } catch (err) {
    console.error('Failed to start sync:', err);
    message.value = err.data?.message || 'شروع فرآیند همگام‌سازی با خطا مواجه شد.';
    messageType.value = 'error';
  } finally {
    isLoading.value = false;
    // Hide the message after 5 seconds
    setTimeout(() => {
      message.value = '';
    }, 5000);
  }
};
</script>
