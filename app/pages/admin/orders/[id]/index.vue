<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500">در حال دریافت اطلاعات سفارش...</p>
    </div>
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">خطا!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
    <div v-else-if="order" class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <header class="flex justify-between items-center mb-6 border-b pb-4">
        <h1 class="text-3xl font-bold text-gray-800">جزئیات سفارش #{{ order.order_number }}</h1>
        <NuxtLink to="/admin/orders" class="text-blue-600 hover:text-blue-800">بازگشت</NuxtLink>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 class="text-xl font-semibold text-gray-700 mb-4">اطلاعات کاربر</h2>
          <p><span class="font-medium">نام:</span> {{ order.user.name }}</p>
          <p><span class="font-medium">ایمیل:</span> {{ order.user.email }}</p>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-700 mb-4">اطلاعات سفارش</h2>
          <p><span class="font-medium">وضعیت:</span> <span :class="statusClass(order.status)">{{ order.status }}</span></p>
          <p><span class="font-medium">مبلغ کل:</span> {{ order.total_amount }} {{ order.currency }}</p>
          <p><span class="font-medium">روش پرداخت:</span> {{ order.payment_method }}</p>
          <p><span class="font-medium">تاریخ ثبت:</span> {{ new Date(order.created_at).toLocaleString('fa-IR') }}</p>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">آیتم‌های سفارش</h2>
        <div class="space-y-4">
          <div v-for="item in order.items" :key="item.id" class="p-4 border rounded-lg">
            <p class="font-semibold">{{ item.title }}</p>
            <p class="text-sm text-gray-600">قیمت: {{ item.price }} {{ order.currency }}</p>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">عملیات‌ها</h2>
        <div class="flex items-center gap-4">
          <button
            v-if="order.actions && order.actions.renew_url"
            @click="performAction('renew', order.actions.renew_url)"
            :disabled="isProcessing"
            class="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
          >
            تمدید سفارش
          </button>
          <button
            v-if="order.actions && order.actions.expire_url"
            @click="performAction('expire', order.actions.expire_url)"
            :disabled="isProcessing"
            class="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
          >
            منقضی کردن سفارش
          </button>
          <button
            v-if="order.actions && order.actions.download_url"
            @click="goToDownloadPage"
            :disabled="isProcessing"
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            مشاهده صفحه دانلود کاربر
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApiAuth } from '~/composables/useApiAuth';

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
});

const route = useRoute();
const router = useRouter();
const api = useApiAuth();

const orderId = route.params.id;
const order = ref(null);
const loading = ref(true);
const error = ref(null);
const isProcessing = ref(false);

const fetchOrder = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get(`/admin/orders/${orderId}`);
    order.value = response;
  } catch (err) {
    console.error(`Failed to fetch order ${orderId}:`, err);
    error.value = 'دریافت اطلاعات سفارش با خطا مواجه شد.';
  } finally {
    loading.value = false;
  }
};

const goToDownloadPage = async () => {
  if (!order.value.actions.download_url) return;

  isProcessing.value = true;
  try {
    const response = await api.get(order.value.actions.download_url);
    const token = response.download_token;

    if (token) {
      const route = router.resolve(`/book/download/${token}`);
      window.open(route.href, '_blank');
    } else {
      throw new Error('Download token not found in API response.');
    }
  } catch (err) {
    console.error('Failed to get download link:', err);
    alert('دریافت لینک دانلود با خطا مواجه شد.');
  } finally {
    isProcessing.value = false;
  }
};

const performAction = async (actionType, url) => {
  const confirmMessage = actionType === 'renew'
    ? 'آیا از تمدید این سفارش اطمینان دارید؟'
    : 'آیا از منقضی کردن این سفارش اطمینان دارید؟';

  if (!confirm(confirmMessage)) return;

  isProcessing.value = true;
  try {
    const response = await api.post(url);
    order.value = response.order; // API returns the updated order nested under 'order' key
    alert(`سفارش با موفقیت ${actionType === 'renew' ? 'تمدید' : 'منقضی'} شد.`);
  } catch (err) {
    console.error(`Failed to ${actionType} order:`, err);
    alert('انجام عملیات با خطا مواجه شد.');
  } finally {
    isProcessing.value = false;
  }
};

const statusClass = (status) => {
  const classes = {
    paid: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    pending: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    failed: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800',
    expired: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

onMounted(fetchOrder);
</script>
