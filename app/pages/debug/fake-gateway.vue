<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-4">درگاه پرداخت تستی</h1>
      <p class="text-center text-gray-600 mb-6">این یک صفحه شبیه‌سازی شده برای تست فرآیند پرداخت است.</p>

      <div class="bg-gray-50 p-4 rounded-md mb-6">
        <h2 class="text-lg font-semibold mb-2">اطلاعات دریافت شده:</h2>
        <div v-if="Object.keys(route.query).length > 0" class="text-sm font-mono break-all">
          <ul>
            <li v-for="(value, key) in route.query" :key="key">
              <strong>{{ key }}:</strong> {{ value }}
            </li>
          </ul>
        </div>
        <div v-else class="text-sm text-gray-500">
          هیچ پارامتری دریافت نشد.
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <button @click="simulateSuccess" class="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition w-full">
          شبیه‌سازی پرداخت موفق
        </button>
        <button @click="simulateFailure" class="bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition w-full">
          شبیه‌سازی پرداخت ناموفق
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

// Let's assume a blank layout might not exist, so we'll just use the default.
// If a blank layout is needed, it can be created separately.
// definePageMeta({
//   layout: 'blank'
// })

const route = useRoute()

const simulateSuccess = () => {
  const callbackUrl = route.query.callback_url || '/payment/verify';
  const orderId = route.query.order_id || 'UNKNOWN_ORDER';

  // Mimic a real gateway's success callback with a fake authority token
  const successUrl = new URL(callbackUrl, window.location.origin);
  successUrl.searchParams.set('status', 'OK');
  successUrl.searchParams.set('order_id', orderId);
  successUrl.searchParams.set('authority', `FAKE_AUTH_${Date.now()}`);

  window.location.href = successUrl.toString();
}

const simulateFailure = () => {
  const callbackUrl = route.query.callback_url || '/payment/verify';
  const orderId = route.query.order_id || 'UNKNOWN_ORDER';

  // Mimic a real gateway's failure callback
  const failureUrl = new URL(callbackUrl, window.location.origin);
  failureUrl.searchParams.set('status', 'NOK');
  failureUrl.searchParams.set('order_id', orderId);

  window.location.href = failureUrl.toString();
}
</script>
