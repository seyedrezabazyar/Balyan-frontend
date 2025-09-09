<template>
  <div class="container mx-auto p-8 font-sans">
    <h1 class="text-3xl font-bold mb-4">دیباگر سبد خرید</h1>
    <p class="mb-6 text-gray-600">
      این صفحه به شما کمک می‌کند تا به صورت مجزا عملکردهای سبد خرید را تست کرده و پاسخ‌های API را مشاهده کنید.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Actions Column -->
      <div class="border p-4 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">۱. اقدامات</h2>
        <div class="space-y-4">
          <button @click="handleAddToCart" :disabled="loading" class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50">
            افزودن آیتم تستی به سبد
          </button>
          <button @click="handleFetchCart" :disabled="loading" class="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50">
            دریافت محتوای سبد خرید
          </button>
        </div>
      </div>

      <!-- Store State Column -->
      <div class="border p-4 rounded-lg bg-gray-50">
        <h2 class="text-xl font-semibold mb-4">۲. وضعیت فعلی استور (Pinia)</h2>
        <pre class="text-xs bg-white p-2 rounded whitespace-pre-wrap dir-ltr">{{ JSON.stringify(cartStore.$state, null, 2) }}</pre>
      </div>
    </div>

    <!-- API Responses -->
    <div class="mt-8 border p-4 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">۳. لاگ پاسخ‌های API</h2>
      <div v-if="!apiResponses.length" class="text-gray-500">
        هنوز درخواستی ارسال نشده است.
      </div>
      <div v-else class="space-y-4">
        <div v-for="(log, index) in apiResponses" :key="index" class="p-2 border rounded bg-gray-50">
          <h3 class="font-bold text-lg mb-2">{{ log.name }}</h3>
          <p class="text-sm text-gray-600">زمان: {{ new Date(log.timestamp).toLocaleTimeString() }}</p>
          <h4 class="font-semibold mt-2">پاسخ:</h4>
          <pre class="text-xs bg-white p-2 rounded whitespace-pre-wrap dir-ltr">{{ JSON.stringify(log.response, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '~/stores/cart'

useHead({
  title: 'دیباگر سبد خرید',
})

const cartStore = useCartStore()
const loading = ref(false)
const apiResponses = ref([])

// Override fetchCart to intercept the response for logging
const originalFetchCart = cartStore.fetchCart
cartStore.fetchCart = async () => {
  const response = await originalFetchCart()
  logApiResponse('GET /v1/cart', response)
  return response
}

const handleAddToCart = async () => {
  loading.value = true
  try {
    const testItem = {
      product_id: 1, // Using a hardcoded test product
      product_type: 'book',
      quantity: 1,
      price: 450000.00
    }
    // We can't easily get the response from addToCart because it calls fetchCart internally
    // But since we've wrapped fetchCart, we will see the result of the subsequent fetch
    await cartStore.addToCart(testItem)
    logApiResponse('POST /v1/cart/add', { success: true, message: 'Request sent. See the following GET /v1/cart for result.' })
  } catch (error) {
    logApiResponse('POST /v1/cart/add', { success: false, error: error.message, data: error.data })
  } finally {
    loading.value = false
  }
}

const handleFetchCart = async () => {
  loading.value = true
  try {
    await cartStore.fetchCart()
  } catch (error) {
    logApiResponse('GET /v1/cart', { success: false, error: error.message, data: error.data })
  } finally {
    loading.value = false
  }
}

const logApiResponse = (name, response) => {
  apiResponses.value.unshift({
    name,
    response,
    timestamp: Date.now()
  })
}
</script>
