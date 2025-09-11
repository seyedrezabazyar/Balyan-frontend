<template>
  <div class="container mx-auto p-4 md:p-8">
    <h1 class="text-2xl font-bold mb-6">سبد خرید شما</h1>

    <div v-if="cartStore.loading" class="text-center py-12">
      <p>در حال بارگذاری سبد خرید...</p>
    </div>

    <div v-else-if="!cartStore.items || cartStore.items.length === 0" class="text-center py-12 text-gray-500">
      <p>سبد خرید شما خالی است.</p>
      <NuxtLink to="/books" class="text-blue-600 hover:underline mt-4 inline-block">مشاهده کتاب‌ها</NuxtLink>
    </div>

    <div v-else>
      <!-- Cart Items Table -->
      <div class="border rounded-lg overflow-hidden shadow-sm">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کتاب</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">قیمت</th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">حذف</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in cartStore.items" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-16 w-12">
                    <img class="h-16 w-12 rounded object-cover" :src="item.product.thumbnail_url" :alt="item.product.title">
                  </div>
                  <div class="mr-4">
                    <NuxtLink :to="`/books/${item.product.slug}`" class="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {{ item.product.title }}
                    </NuxtLink>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatPrice(item.price) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="removeFromCart(item.id)" class="text-red-600 hover:text-red-900">حذف</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Cart Summary & Actions -->
      <div class="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <button @click="clearCart" class="text-sm text-red-500 hover:underline order-2 md:order-1">
          خالی کردن سبد خرید
        </button>
        <div class="bg-gray-100 p-4 rounded-lg w-full md:w-auto order-1 md:order-2">
            <div class="text-lg font-bold text-center">
              <span>جمع کل: </span>
              <span class="text-green-600">{{ formatPrice(cartStore.finalTotal) }}</span>
            </div>
            <button @click="proceedToPayment"
                    :disabled="cartStore.paymentLoading"
                    class="mt-4 w-full bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition"
                    :class="{ 'opacity-50 cursor-not-allowed': cartStore.paymentLoading }">
              <span v-if="cartStore.paymentLoading">در حال انتقال...</span>
              <span v-else>ادامه و پرداخت</span>
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '#app'

useHead({
  title: 'سبد خرید',
})

const cartStore = useCartStore()
const router = useRouter()

const formatPrice = (price) => {
  if (price === null || price === undefined) return ''
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
}

const removeFromCart = async (itemId) => {
  await cartStore.removeFromCart(itemId)
}

const clearCart = async () => {
  if (confirm('آیا از خالی کردن سبد خرید خود مطمئن هستید؟')) {
    await cartStore.clearCart()
  }
}

const proceedToPayment = async () => {
  try {
    const response = await cartStore.initiatePayment()
    if (response && response.success) {
      alert(response.data?.message || 'خرید شما با موفقیت انجام شد!')
      router.push('/dashboard')
    } else {
      // Handle cases where the API returns success: false or other non-crashing errors
      throw new Error(response?.message || 'سرور با خطا مواجه شد.')
    }
  } catch (error) {
    // Handle crashes or errors thrown from the block above
    console.error('Payment initiation failed:', error)
    alert(error.response?._data?.message || error.message || 'خطا در شروع فرآیند پرداخت. لطفاً دوباره تلاش کنید.')
  }
}

onMounted(() => {
  cartStore.fetchCart()
})
</script>
