<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">دانلودر عکس کتاب</h1>
      <p class="text-gray-600 mb-6">
        در این بخش می‌توانید برای کتاب‌هایی که عکس ندارند، به صورت خودکار عکس دانلود کنید. تعداد کتاب‌های مورد نظر برای پردازش را وارد کرده و روی دکمه "شروع عملیات" کلیک کنید.
      </p>

      <div v-if="message" :class="messageType === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'" class="border px-4 py-3 rounded relative mb-4" role="alert">
        <span class="block sm:inline">{{ message }}</span>
        <span class="absolute top-0 bottom-0 left-0 px-4 py-3" @click="message = ''">
          <svg class="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </span>
      </div>

      <form @submit.prevent="startImageDownloader">
        <div class="mb-4">
          <label for="limit" class="block text-gray-700 text-sm font-bold mb-2">تعداد کتاب برای پردازش:</label>
          <input
            id="limit"
            v-model.number="limit"
            type="number"
            min="1"
            max="1000"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="مثلا: 50"
          >
          <p class="text-xs text-gray-500 mt-1">
            عدد باید بین ۱ تا ۱۰۰۰ باشد.
          </p>
        </div>

        <div class="flex items-center justify-between">
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
          >
            <span v-if="loading">در حال ارسال...</span>
            <span v-else>شروع عملیات</span>
          </button>
        </div>
      </form>
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
const limit = ref(50)
const loading = ref(false)
const message = ref('')
const messageType = ref('') // 'success' or 'error'

const startImageDownloader = async () => {
  loading.value = true
  message.value = ''
  messageType.value = ''

  if (limit.value < 1 || limit.value > 1000) {
    message.value = 'تعداد کتاب باید بین ۱ تا ۱۰۰۰ باشد.'
    messageType.value = 'error'
    loading.value = false
    return
  }

  try {
    const response = await api.post('/image-downloader/start', { limit: limit.value })
    message.value = response.message || 'عملیات با موفقیت شروع شد.'
    messageType.value = 'success'
  } catch (error) {
    const errorData = error.data || {}
    if (errorData.errors) {
      const firstErrorKey = Object.keys(errorData.errors)[0]
      message.value = errorData.errors[firstErrorKey][0]
    } else if (errorData.message) {
      message.value = errorData.message
    } else {
      message.value = 'یک خطای ناشناخته رخ داد.'
    }
    messageType.value = 'error'
    console.error('Error starting image downloader:', errorData)
  } finally {
    loading.value = false
  }
}
</script>
