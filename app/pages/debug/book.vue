<template>
  <div class="container mx-auto p-8">
    <h1 class="text-2xl font-bold mb-4">صفحه دیباگ کتاب</h1>
    <p class="mb-4">
      این صفحه برای تست مستقیم اندپوینت دریافت اطلاعات یک کتاب (`/api/v1/books/{slug}`) استفاده می‌شود.
      اسلاگ 'kelidar' برای تست در کد هاردکد شده است.
    </p>
    <button @click="fetchBook" :disabled="loading" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {{ loading ? 'در حال دریافت...' : 'دریافت اطلاعات کتاب' }}
    </button>

    <div v-if="error" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <h3 class="font-bold">خطا!</h3>
      <pre class="whitespace-pre-wrap">{{ error }}</pre>
    </div>

    <div v-if="rawData" class="mt-4">
      <h2 class="text-xl font-semibold mb-2">پاسخ خام از API</h2>
      <p>این دقیقا همان چیزی است که از سرور دریافت شده است.</p>
      <pre class="bg-gray-100 p-4 rounded text-left dir-ltr whitespace-pre-wrap">{{ rawData }}</pre>
    </div>

    <div v-if="parsedData" class="mt-4">
      <h2 class="text-xl font-semibold mb-2">دیتای Parse شده (JSON)</h2>
      <p>این نتیجه بعد از پردازش و `JSON.parse` است.</p>
      <pre class="bg-gray-100 p-4 rounded text-left dir-ltr whitespace-pre-wrap">{{ JSON.stringify(parsedData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'

const api = useApi()
const loading = ref(false)
const rawData = ref(null)
const parsedData = ref(null)
const error = ref(null)

const fetchBook = async () => {
  loading.value = true
  error.value = null
  rawData.value = null
  parsedData.value = null
  try {
    // We need to get the raw response, so we can't use the processed one from useApi directly
    // Let's use $fetch directly for now to get the raw response
    const response = await $fetch.raw('/v1/books/kelidar', {
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
            'Accept': 'application/json',
        }
    })
    rawData.value = response._data

    // Try to parse it
    if (typeof response._data === 'string') {
        try {
            parsedData.value = JSON.parse(response._data)
        } catch (e) {
            error.value = 'Failed to parse the response as JSON. See the raw response above.'
            parsedData.value = null
        }
    } else {
        parsedData.value = response._data
    }

  } catch (err) {
    console.error('Error fetching book data:', err)
    error.value = err.data ? err.data : err.message
    rawData.value = err.data
  } finally {
    loading.value = false
  }
}
</script>
