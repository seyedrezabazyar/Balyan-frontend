<!-- app/pages/admin/fetch-books.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">همگام‌سازی کتاب‌ها از API</h1>
        <p class="text-gray-600 mt-2">کتاب‌ها را از API بالیان به سایت اضافه کنید.</p>
      </div>

      <!-- Sync Control Panel -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-medium text-gray-900">شروع همگام‌سازی</h2>
            <p class="text-sm text-gray-500 mt-1">با کلیک بر روی دکمه، فرآیند دریافت و همگام‌سازی کتاب‌ها از منبع خارجی آغاز می‌شود. این فرآیند ممکن است زمان‌بر باشد.</p>
          </div>
          <button @click="syncBooks"
                  :disabled="isSyncing"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white"
                  :class="isSyncing ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'">
            <span v-if="isSyncing">در حال همگام‌سازی...</span>
            <span v-else>شروع همگام‌سازی</span>
          </button>
        </div>
      </div>

      <!-- Sync Status Message -->
      <div v-if="message" class="mt-6 p-4 rounded-md" :class="messageType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApiAuth } from '~/composables/useApiAuth'

definePageMeta({
  middleware: 'admin',
  layout: 'default'
})

const api = useApiAuth()
const isSyncing = ref(false)
const message = ref('')
const messageType = ref('') // 'success' or 'error'

const syncBooks = async () => {
  isSyncing.value = true
  message.value = ''
  messageType.value = ''

  try {
    const response = await api.post('/admin/books/sync-from-api')
    if (response.success) {
      message.value = response.message || 'فرآیند همگام‌سازی کتاب‌ها با موفقیت آغاز شد.'
      messageType.value = 'success'
    } else {
      throw new Error(response.message || 'خطای ناشناخته در شروع همگام‌سازی.')
    }
  } catch (error) {
    console.error('Error starting book sync:', error)
    message.value = error.data?.message || error.message || 'خطا در شروع فرآیند همگام‌سازی کتاب‌ها.'
    messageType.value = 'error'
  } finally {
    isSyncing.value = false
  }
}
</script>
