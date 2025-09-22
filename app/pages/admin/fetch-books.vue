<!-- app/pages/admin/fetch-books.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">همگام‌سازی کتاب‌ها از API</h1>
        <p class="text-gray-600 mt-2">کتاب‌ها را از API بالیان به سایت اضافه کنید.</p>
      </div>

      <!-- Sync Control Panel -->
      <div class="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <h2 class="text-lg font-medium text-gray-900">شروع همگام‌سازی</h2>
          <p class="text-sm text-gray-500 mt-1">
            فرآیند دریافت و همگام‌سازی کتاب‌ها از منبع خارجی را آغاز کنید. می‌توانید همه کتاب‌ها را همگام‌سازی کنید یا محدوده مشخصی را تعیین کنید.
          </p>
        </div>

        <!-- Pagination Options -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 pt-6">
          <!-- Sync Single Page -->
          <div>
            <label for="page" class="block text-sm font-medium text-gray-700">همگام‌سازی یک صفحه خاص</label>
            <input type="number" id="page" v-model.number="page"
                   class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   placeholder="مثال: 5">
          </div>

          <!-- Sync Page Range -->
          <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="start_page" class="block text-sm font-medium text-gray-700">صفحه شروع</label>
              <input type="number" id="start_page" v-model.number="start_page"
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     placeholder="مثال: 1">
            </div>
            <div>
              <label for="end_page" class="block text-sm font-medium text-gray-700">صفحه پایان</label>
              <input type="number" id="end_page" v-model.number="end_page"
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     placeholder="مثال: 10">
            </div>
          </div>
        </div>
        <p class="text-xs text-gray-500">
          <strong>توجه:</strong> اگر "صفحه خاص" پر شود، گزینه‌های "صفحه شروع" و "صفحه پایان" نادیده گرفته می‌شوند. اگر همه فیلدها خالی باشند، تمام کتاب‌ها همگام‌سازی خواهند شد.
        </p>

        <!-- Action Button -->
        <div class="flex items-center justify-end border-t border-gray-200 pt-6">
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

const page = ref(null)
const start_page = ref(null)
const end_page = ref(null)

const syncBooks = async () => {
  isSyncing.value = true
  message.value = ''
  messageType.value = ''

  let requestBody = {}
  if (page.value) {
    requestBody = { page: page.value }
  } else if (start_page.value || end_page.value) {
    requestBody = {
      start_page: start_page.value,
      end_page: end_page.value
    }
  }

  try {
    const response = await api.post('/admin/importer/sync', requestBody)
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
