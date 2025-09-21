<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">همگام‌سازی کتاب‌ها از API</h1>

    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-xl font-bold mb-4 text-gray-700">شروع همگام‌سازی</h2>
      <p class="text-gray-600 mb-4">
        با کلیک بر روی دکمه زیر، فرآیند دریافت اطلاعات کتاب‌ها از API خارجی (بالیان) و وارد کردن آن‌ها به پایگاه داده سایت آغاز می‌شود.
        این فرآیند در پس‌زمینه اجرا خواهد شد و ممکن است بسته به تعداد کتاب‌های جدید، زمان‌بر باشد.
      </p>
      <p class="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md mb-6">
        توجه: لطفاً تا زمانی که یک فرآیند همگام‌سازی در حال اجرا است، فرآیند جدیدی را شروع نکنید. وضعیت فعلی در لاگ‌های سرور قابل مشاهده است.
      </p>

      <div class="flex items-center gap-4">
        <button
          @click="startSync"
          :disabled="isLoading"
          class="bg-blue-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          <span v-if="isLoading">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            در حال ارسال درخواست...
          </span>
          <span v-else>شروع فرآیند همگام‌سازی</span>
        </button>
      </div>

      <div v-if="message" class="mt-4 p-4 rounded-md" :class="{
        'bg-green-100 border border-green-400 text-green-700': messageType === 'success',
        'bg-red-100 border border-red-400 text-red-700': messageType === 'error'
      }">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useApiAuth } from '~/composables/useApiAuth';

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
});

const api = useApiAuth();
const isLoading = ref(false);
const message = ref('');
const messageType = ref(''); // 'success' or 'error'

const startSync = async () => {
  if (!confirm('آیا از شروع فرآیند همگام‌سازی کتاب‌ها اطمینان دارید؟ این عملیات ممکن است منابع زیادی از سرور را مصرف کند.')) {
    return;
  }

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
    // Hide the message after 8 seconds
    setTimeout(() => {
      message.value = '';
    }, 8000);
  }
};
</script>
