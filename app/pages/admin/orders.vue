<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">مدیریت سفارشات</h1>

    <!-- Loading Skeleton -->
    <div v-if="loading && orders.length === 0">
      <div class="bg-white shadow rounded-lg p-4 animate-pulse" v-for="n in 5" :key="n">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">خطا!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <!-- Orders Table -->
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              شماره سفارش
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              کاربر
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              وضعیت
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              مبلغ کل
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              روش پرداخت
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              تاریخ ثبت
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              جزئیات خرید
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{{ order.order_number }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{{ order.user?.name }}</p>
              <p class="text-gray-600 whitespace-no-wrap text-xs">{{ order.user?.email }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': order.status === 'paid',
                  'bg-yellow-100 text-yellow-800': order.status === 'pending',
                  'bg-red-100 text-red-800': order.status === 'failed',
                }"
              >
                {{ order.status }}
              </span>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{{ order.total_amount }} {{ order.currency }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{{ order.payment_method }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{{ new Date(order.created_at).toLocaleDateString('fa-IR') }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <div class="space-y-2">
                <div v-for="item in order.items" :key="item.id" class="text-xs">
                  <div v-if="item.purchase">
                    <div class="flex items-center justify-between gap-2">
                      <span
                        class="px-2 inline-flex leading-5 font-semibold rounded-full text-xs"
                        :class="{
                          'bg-green-100 text-green-800': item.purchase.status === 'active',
                          'bg-yellow-100 text-yellow-800': item.purchase.status === 'expired',
                          'bg-red-100 text-red-800': item.purchase.status === 'revoked',
                          'bg-gray-100 text-gray-800': !['active', 'expired', 'revoked'].includes(item.purchase.status)
                        }"
                      >
                        {{ item.purchase.status }}
                      </span>
                      <span class="text-gray-600 whitespace-no-wrap">
                        {{ item.purchase.download_count }} / {{ item.purchase.max_downloads }} دانلود
                      </span>
                    </div>
                    <div v-if="item.purchase.expires_at" class="text-gray-500 mt-1 text-left">
                      انقضا: {{ new Date(item.purchase.expires_at).toLocaleDateString('fa-IR') }}
                    </div>
                  </div>
                  <div v-else class="text-gray-400">
                    -
                  </div>
                </div>
              </div>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
              <div class="flex items-center justify-center gap-2">
                <!-- Download Links -->
                <template v-for="item in order.items" :key="item.id">
                  <NuxtLink
                    v-if="item.purchase && item.purchase.download_token"
                    :to="`/book/download/${item.purchase.download_token}`"
                    target="_blank"
                    class="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-gray-200 transition-colors"
                    title="دانلود فایل"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </NuxtLink>
                </template>

                <!-- Expire Button -->
                <button
                  v-if="isExpirable(order)"
                  @click="expireOrder(order)"
                  :disabled="processingOrders[order.id]"
                  class="p-1 text-yellow-600 hover:text-yellow-800 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                  title="منقضی کردن"
                >
                  <svg v-if="!processingOrders[order.id]" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <!-- Spinner Icon -->
                  <svg v-else class="animate-spin h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </button>

                <!-- Reactivate Button -->
                <button
                  v-if="isReactivatable(order)"
                  @click="reactivateOrder(order)"
                  :disabled="processingOrders[order.id]"
                  class="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                  title="بازسازی"
                >
                  <svg v-if="!processingOrders[order.id]" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l5 5M20 20l-5-5" />
                  </svg>
                  <!-- Spinner Icon -->
                  <svg v-else class="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.lastPage > 1" class="mt-6 flex justify-center items-center">
      <button
        @click="fetchOrders(pagination.currentPage - 1)"
        :disabled="pagination.currentPage === 1"
        class="px-4 py-2 mx-1 bg-white border rounded-md disabled:opacity-50"
      >
        قبلی
      </button>
      <span class="text-sm text-gray-700">
        صفحه {{ pagination.currentPage }} از {{ pagination.lastPage }}
      </span>
      <button
        @click="fetchOrders(pagination.currentPage + 1)"
        :disabled="pagination.currentPage === pagination.lastPage"
        class="px-4 py-2 mx-1 bg-white border rounded-md disabled:opacity-50"
      >
        بعدی
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useApiAuth } from '~/composables/useApiAuth';

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
});

const api = useApiAuth();
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

const expireOrder = async (order) => {
  if (!confirm(`آیا از منقضی کردن سفارش شماره ${order.order_number} اطمینان دارید؟`)) {
    return;
  }

  processingOrders.value[order.id] = true;
  try {
    await api.post(`/admin/orders/${order.id}/expire`);

    // Find the order in the local array and update its items' purchase status
    const orderToUpdate = orders.value.find(o => o.id === order.id);
    if (orderToUpdate) {
      orderToUpdate.items.forEach(item => {
        if (item.purchase) {
          item.purchase.status = 'expired';
        }
      });
    }
  } catch (err) {
    console.error(`Failed to expire order ${order.id}:`, err);
    // A more user-friendly error message would be good, maybe via a toast library
    alert('عملیات با خطا مواجه شد. لطفاً دوباره تلاش کنید.');
  } finally {
    processingOrders.value[order.id] = false;
  }
};

const isExpirable = (order) => {
  if (!order || !order.items) return false;
  return order.items.some(item => item.purchase && item.purchase.status === 'active');
};

const isReactivatable = (order) => {
  if (!order || !order.items) return false;
  const hasExpired = order.items.some(item => item.purchase && item.purchase.status === 'expired');
  const hasActive = order.items.some(item => item.purchase && item.purchase.status === 'active');
  return hasExpired && !hasActive;
};

const reactivateOrder = async (order) => {
  if (!confirm(`آیا از بازسازی سفارش شماره ${order.order_number} اطمینان دارید؟`)) {
    return;
  }

  processingOrders.value[order.id] = true;
  try {
    await api.post(`/admin/orders/${order.id}/reactivate`);
    await fetchOrders(pagination.value.currentPage);
  } catch (err) {
    console.error(`Failed to reactivate order ${order.id}:`, err);
    alert('بازسازی سفارش با خطا مواجه شد.');
  } finally {
    processingOrders.value[order.id] = false;
  }
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
