<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">مدیریت سفارشات</h1>
    <div v-if="loading && orders.length === 0" class="space-y-4">
      <div class="bg-white shadow rounded-lg p-4 animate-pulse" v-for="n in 5" :key="n">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">خطا!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">شماره سفارش</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">کاربر</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">وضعیت</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">مبلغ کل</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">روش پرداخت</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">تاریخ ثبت</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">جزئیات خرید</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p class="text-gray-900 whitespace-no-wrap">{{ order.order_number }}</p></td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{{ order.user?.name }}</p>
              <p class="text-gray-600 whitespace-no-wrap text-xs">{{ order.user?.email }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="statusClass(order.status)">{{ order.status }}</span>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p class="text-gray-900 whitespace-no-wrap">{{ order.total_amount }} {{ order.currency }}</p></td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p class="text-gray-900 whitespace-no-wrap">{{ order.payment_method }}</p></td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p class="text-gray-900 whitespace-no-wrap">{{ new Date(order.created_at).toLocaleDateString('fa-IR') }}</p></td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <div v-if="order.items && order.items.length > 0" class="space-y-1">
                <div v-for="item in order.items" :key="item.id" class="text-xs">
                  <p class="font-semibold text-gray-800">{{ item.title }}</p>
                </div>
              </div>
              <div v-else class="text-gray-400">-</div>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
              <div class="flex items-center justify-center gap-x-3">
                <NuxtLink
                  v-if="order.actions && order.actions.download_info_url"
                  :to="`/admin/orders/${order.id}/download-info`"
                  class="text-xs text-blue-600 hover:text-blue-900"
                  title="مشاهده اطلاعات دانلود"
                >
                  [مشاهده لینک]
                </NuxtLink>
                <button v-if="order.actions && order.actions.expire_url" @click="expireOrder(order)" :disabled="processingOrders[order.id]" class="text-xs text-yellow-600 hover:text-yellow-900 disabled:opacity-50" title="منقضی کردن">
                  <span v-if="processingOrders[order.id] === 'expire'">...</span>
                  <span v-else>[منقضی کردن]</span>
                </button>
                <button v-if="order.actions && order.actions.renew_url" @click="renewOrder(order)" :disabled="processingOrders[order.id]" class="text-xs text-green-600 hover:text-green-900 disabled:opacity-50" title="فعال سازی مجدد">
                  <span v-if="processingOrders[order.id] === 'renew'">...</span>
                  <span v-else>[تمدید کردن]</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="pagination.lastPage > 1" class="mt-6 flex justify-center items-center">
      <button @click="fetchOrders(pagination.currentPage - 1)" :disabled="pagination.currentPage === 1" class="px-4 py-2 mx-1 bg-white border rounded-md disabled:opacity-50">قبلی</button>
      <span class="text-sm text-gray-700">صفحه {{ pagination.currentPage }} از {{ pagination.lastPage }}</span>
      <button @click="fetchOrders(pagination.currentPage + 1)" :disabled="pagination.currentPage === pagination.lastPage" class="px-4 py-2 mx-1 bg-white border rounded-md disabled:opacity-50">بعدی</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useApiAuth } from '~/composables/useApiAuth';

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
});

const api = useApiAuth();
const router = useRouter();
const orders = ref([]);
const loading = ref(true);
const error = ref(null);
const pagination = ref({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  perPage: 20,
});

const processingOrders = ref({});

const performOrderAction = async (order, url, actionName, confirmMessage) => {
  if (!url) return;
  if (!confirm(confirmMessage)) return;

  processingOrders.value[order.id] = actionName;
  try {
    const updatedOrder = await api.post(url);
    const index = orders.value.findIndex(o => o.id === order.id);
    if (index !== -1) {
      orders.value[index] = updatedOrder;
    }
  } catch (err) {
    console.error(`Failed to ${actionName} order ${order.id}:`, err);
    alert(`عملیات ${actionName} سفارش با خطا مواجه شد.`);
  } finally {
    processingOrders.value[order.id] = false;
  }
};

const expireOrder = (order) => {
  performOrderAction(
    order,
    order.actions.expire_url,
    'expire',
    `آیا از منقضی کردن سفارش شماره ${order.order_number} اطمینان دارید؟`
  );
};

const renewOrder = (order) => {
  performOrderAction(
    order,
    order.actions.renew_url,
    'renew',
    `آیا از فعال سازی مجدد سفارش شماره ${order.order_number} اطمینان دارید؟`
  );
};

const authorName = (author) => {
  if (!author) return 'نامشخص';
  if (typeof author === 'object' && author.name) return author.name;
  return author;
};

const statusClass = (status) => {
  const classes = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-200 text-gray-800',
    processing: 'bg-blue-100 text-blue-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const fetchOrders = async (page = 1) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get(`/admin/orders?page=${page}`);
    orders.value = response.data || [];
    pagination.value = {
      currentPage: response.meta.current_page,
      lastPage: response.meta.last_page,
      total: response.meta.total,
      perPage: response.meta.per_page,
    };
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    error.value = 'دریافت لیست سفارشات با خطا مواجه شد.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchOrders(1));
</script>
