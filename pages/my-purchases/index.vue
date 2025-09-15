<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
      کتاب‌های خریداری شده من
    </h1>

    <!-- Loading State -->
    <div v-if="loading">
      <p>در حال بارگذاری لیست خریدها...</p>
      <!-- A more sophisticated skeleton loader for a table could be added here -->
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
      <strong class="font-bold">خطا!</strong>
      <span class="block sm:inline"> متاسفانه در دریافت اطلاعات مشکلی پیش آمد: {{ error }}</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="!purchasedBooks || purchasedBooks.length === 0" class="text-center py-16">
      <p class="text-xl text-gray-600 mb-4">شما هنوز هیچ کتابی خریداری نکرده‌اید.</p>
      <NuxtLink to="/store" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
        رفتن به فروشگاه
      </NuxtLink>
    </div>

    <!-- Success State - Display Table -->
    <div v-else class="overflow-x-auto">
      <div class="min-w-full bg-white rounded-lg shadow-md">
        <table class="min-w-full leading-normal">
          <thead>
            <tr class="border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th class="px-5 py-3">ردیف</th>
              <th class="px-5 py-3">شماره سفارش</th>
              <th class="px-5 py-3">کتاب</th>
              <th class="px-5 py-3">تاریخ خرید</th>
              <th class="px-5 py-3">مبلغ</th>
              <th class="px-5 py-3">وضعیت</th>
              <th class="px-5 py-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(purchase, index) in purchasedBooks"
              :key="purchase.id"
              class="border-b border-gray-200 hover:bg-gray-50"
              :class="{
                'bg-red-50 text-red-900': purchase.is_expired,
                'bg-green-50 text-green-900': !purchase.is_expired
              }"
            >
              <td class="px-5 py-5 text-sm">{{ index + 1 }}</td>
              <td class="px-5 py-5 text-sm">{{ purchase.order_id }}</td>
              <td class="px-5 py-5 text-sm">
                <div class="flex items-center">
                  <div class="flex-shrink-0 w-12 h-16">
                    <img class="w-full h-full object-cover rounded" :src="purchase.cover_image_url || '/images/default-book-cover.png'" alt="Book Cover" />
                  </div>
                  <div class="mr-3">
                    <p class="font-semibold whitespace-no-wrap">{{ purchase.title }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-5 text-sm">{{ formatPersianDate(purchase.purchase_date) }}</td>
              <td class="px-5 py-5 text-sm">{{ formatCurrency(purchase.amount_paid) }} تومان</td>
              <td class="px-5 py-5 text-sm">
                <p v-if="purchase.is_expired" class="font-semibold">منقضی شده</p>
                <div v-else>
                  <p>{{ purchase.days_until_expiration }} روز باقی‌مانده</p>
                  <p class="text-xs text-gray-500">({{ purchase.remaining_downloads }} دانلود باقی‌مانده)</p>
                </div>
              </td>
              <td class="px-5 py-5 text-sm">
                <!-- Download button for active links -->
                <a
                  v-if="!purchase.is_expired"
                  :href="purchase.download_url"
                  target="_blank"
                  class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  دانلود
                </a>
                <!-- Repurchase button for expired links -->
                <NuxtLink
                  v-else
                  :to="`/book/${purchase.slug}`"
                  class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  خرید مجدد
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Trivial change to force a re-sync.
import { storeToRefs } from 'pinia';
import { usePurchaseStore } from '~/app/stores/purchase';

// Set page title
useHead({
  title: 'کتاب‌های خریداری شده من'
});

// Initialize the purchase store
const purchaseStore = usePurchaseStore();
const { purchasedBooks, loading, error } = storeToRefs(purchaseStore);

// Fetch data on component setup
await purchaseStore.fetchPurchasedBooks();

// --- Utility Functions for Formatting ---

/**
 * Formats an ISO date string to a readable Persian date.
 * Example: "2025-09-15T07:00:49.000000Z" -> "۱۴۰۴/۶/۲۴"
 */
function formatPersianDate(isoDate: string): string {
  if (!isoDate) return '-';
  try {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).format(date);
  } catch (e) {
    console.error('Invalid date for formatting:', isoDate);
    return '-';
  }
}

/**
 * Formats a number string as currency with thousand separators.
 * Example: "145000.00" -> "145,000"
 */
function formatCurrency(amount: string): string {
  if (!amount) return '0';
  const number = parseInt(amount, 10);
  return new Intl.NumberFormat('fa-IR').format(number);
}
</script>

<style scoped>
/* Minor adjustments for table layout */
tbody tr:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity));
}
</style>
