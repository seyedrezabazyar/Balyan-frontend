<template>
  <div class="min-h-screen flex items-center justify-center text-center p-4">
    <div>
      <div v-if="status === 'verifying'">
        <h1 class="text-2xl font-bold">در حال تایید پرداخت...</h1>
        <p class="text-gray-600 mt-2">لطفا چند لحظه صبر کنید.</p>
        <!-- You can add a spinner here -->
      </div>
      <div v-else-if="status === 'success'">
        <h1 class="text-2xl font-bold text-green-600">پرداخت موفقیت‌آمیز بود!</h1>
        <p class="text-gray-600 mt-2">از خرید شما متشکریم. به زودی به داشبورد خود منتقل می‌شوید.</p>
        <NuxtLink to="/dashboard" class="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">
          رفتن به داشبورد
        </NuxtLink>
      </div>
      <div v-else-if="status === 'failure'">
        <h1 class="text-2xl font-bold text-red-500">پرداخت ناموفق بود.</h1>
        <p class="text-gray-600 mt-2">{{ errorMessage || 'خطایی در فرآیند پرداخت رخ داد.' }}</p>
        <NuxtLink to="/cart" class="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">
          بازگشت به سبد خرید
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const status = ref('verifying') // 'verifying', 'success', 'failure'
const errorMessage = ref('')

onMounted(async () => {
  const { status: paymentStatus, order_id, authority } = route.query

  if (paymentStatus !== 'OK') {
    status.value = 'failure'
    errorMessage.value = 'پرداخت توسط درگاه تایید نشد یا توسط کاربر لغو شد.'
    return
  }

  try {
    const response = await cartStore.verifyPayment({
      status: paymentStatus,
      order_id,
      authority
    })

    if (response.success) {
      status.value = 'success'
      // Redirect after a few seconds
      setTimeout(() => {
        // Assuming a user dashboard/library page exists
        router.push('/dashboard')
      }, 4000)
    } else {
      throw new Error(response.message || 'خطا در تایید پرداخت در سرور.')
    }
  } catch (err: any) {
    status.value = 'failure'
    errorMessage.value = err.response?._data?.message || err.message || 'یک خطای پیش‌بینی نشده رخ داد.'
  }
})
</script>
