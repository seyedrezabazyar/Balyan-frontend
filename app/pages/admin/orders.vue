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
              آیتم خریداری شده
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
                  <p class="font-semibold text-gray-800">{{ item.book.title }}</p>
                  <div v-if="item.purchase" class="mt-1">
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
                    - (خرید ناموفق)
                  </div>
                </div>
              </div>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
              <div class="flex items-center justify-center gap-2">
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
                  <svg v-else class="animate-spin h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </button>

                <!-- Renew Button -->
                <button
                  v-if="isRenewable(order)"
                  @click="renewOrder(order)"
                  :disabled="processingOrders[order.id]"
                  class="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                  title="تمدید کردن"
                >
                  <svg v-if="!processingOrders[order.id]" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h5M20 20v-5h-5" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 9a9 9 0 0114.13-4.13M20 15a9 9 0 01-14.13 4.13" />
                  </svg>
                  <svg v-else class="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </button>

                <!-- Download Info Button -->
                <button
                  @click="getDownloadInfo(order)"
                  class="p-1 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
                  title="مشاهده اطلاعات دانلود"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

    <!-- Download Info Modal -->
    <div v-if="isDownloadInfoModalVisible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" @click.self="isDownloadInfoModalVisible = false">
      <div class="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">اطلاعات دانلود</h3>

          <div v-if="selectedOrderForDownloadInfo?.loading" class="py-4">
            <svg class="animate-spin h-8 w-8 text-gray-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm text-gray-500 mt-2">در حال بارگذاری...</p>
          </div>

          <div v-else-if="selectedOrderForDownloadInfo?.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">خطا!</strong>
            <span class="block sm:inline">{{ selectedOrderForDownloadInfo.error }}</span>
          </div>

          <div v-else-if="selectedOrderForDownloadInfo?.data" class="text-right space-y-4">
            <!-- Book Info -->
            <div>
              <h4 class="font-semibold text-gray-700">اطلاعات کتاب</h4>
              <p><span class="font-medium">عنوان:</span> {{ selectedOrderForDownloadInfo.data.book.title }}</p>
              <p><span class="font-medium">نویسنده:</span> {{ selectedOrderForDownloadInfo.data.book.author.name }}</p>
            </div>
            <hr/>

            <!-- Purchase Info -->
            <div v-if="selectedOrderForDownloadInfo.data.purchase">
              <h4 class="font-semibold text-gray-700">اطلاعات خرید</h4>
              <p><span class="font-medium">وضعیت:</span> {{ selectedOrderForDownloadInfo.data.purchase.status }}</p>
              <p><span class="font-medium">تعداد دانلود:</span> {{ selectedOrderForDownloadInfo.data.purchase.total_downloads }} / {{ selectedOrderForDownloadInfo.data.purchase.max_downloads }}</p>
              <p v-if="selectedOrderForDownloadInfo.data.purchase.expires_at"><span class="font-medium">تاریخ انقضا:</span> {{ new Date(selectedOrderForDownloadInfo.data.purchase.expires_at).toLocaleDateString('fa-IR') }}</p>
            </div>
            <div v-else class="text-gray-500">
              <p>{{ selectedOrderForDownloadInfo.data.message || 'خریدی برای این سفارش ثبت نشده است.' }}</p>
            </div>
            <hr/>

            <!-- Download Link -->
            <div>
              <h4 class="font-semibold text-gray-700">لینک دانلود</h4>
              <div v-if="selectedOrderForDownloadInfo.data.can_download && selectedOrderForDownloadInfo.data.download_link">
                <a :href="selectedOrderForDownloadInfo.data.download_link" target="_blank" class="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                  دانلود کتاب
                </a>
              </div>
              <div v-else class="text-gray-500">
                <p>لینک دانلودی در دسترس نیست.</p>
                <p v-if="selectedOrderForDownloadInfo.data.file_status !== 'available'" class="text-xs text-red-600">وضعیت فایل: {{ selectedOrderForDownloadInfo.data.file_status }}</p>
              </div>
            </div>
          </div>

          <div class="items-center px-4 py-3 mt-6">
            <button @click="isDownloadInfoModalVisible = false" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 w-full">
              بستن
            </button>
          </div>
        </div>
      </div>
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

// State for modals and processing
const processingOrders = ref({});
const selectedOrderForDownloadInfo = ref(null);
const isDownloadInfoModalVisible = ref(false);

const updateOrderStatus = async (order, action) => {
  const actionMessages = {
    expire: {
      confirm: `آیا از منقضی کردن سفارش شماره ${order.order_number} اطمینان دارید؟`,
      error: `Failed to expire order ${order.id}:`,
      alert: 'عملیات منقضی کردن سفارش با خطا مواجه شد.'
    },
    renew: {
      confirm: `آیا از تمدید سفارش شماره ${order.order_number} اطمینان دارید؟ این کار مهلت دانلود را به 90 روز و تعداد دانلود را به 50 بازنشانی می‌کند.`,
      error: `Failed to renew order ${order.id}:`,
      alert: 'عملیات تمدید سفارش با خطا مواجه شد.'
    }
  };

  const messages = actionMessages[action];
  if (!confirm(messages.confirm)) {
    return;
  }

  processingOrders.value[order.id] = true;
  try {
    const response = await api.post(`/admin/orders/${order.id}/${action}`);
    const updatedOrder = response.order;

    const index = orders.value.findIndex(o => o.id === order.id);
    if (index !== -1 && updatedOrder) {
      orders.value[index] = updatedOrder;
    }
  } catch (err) {
    console.error(messages.error, err);
    alert(messages.alert);
  } finally {
    processingOrders.value[order.id] = false;
  }
};

const expireOrder = (order) => updateOrderStatus(order, 'expire');
const renewOrder = (order) => updateOrderStatus(order, 'renew');

const isExpirable = (order) => {
  if (!order || !order.items) return false;
  return order.items.some(item => item.purchase && item.purchase.status === 'active');
};

const isRenewable = (order) => {
  if (!order || !order.items) return false;
  return order.status === 'paid' && order.items.some(item => item.purchase && item.purchase.status !== 'active');
};

const getDownloadInfo = async (order) => {
  selectedOrderForDownloadInfo.value = { loading: true, data: null, error: null };
  isDownloadInfoModalVisible.value = true;

  try {
    const response = await api.get(`/admin/orders/${order.id}/download-link`);
    selectedOrderForDownloadInfo.value = { loading: false, data: response, error: null };
  } catch (err) {
    console.error(`Failed to fetch download info for order ${order.id}:`, err);
    const errorMessage = err.response?._data?.message || 'یک خطای ناشناخته رخ داد.';
    selectedOrderForDownloadInfo.value = { loading: false, data: null, error: errorMessage };
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
