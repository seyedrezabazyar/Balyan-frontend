<template>
  <div class="container mx-auto p-4 md:p-8">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">کتاب‌های خریداری شده</h1>
      <p class="text-gray-600 mt-2">لیست کتاب‌هایی که خریداری کرده‌اید به همراه وضعیت آن‌ها.</p>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-500 py-10">
      <p>در حال بارگذاری خریدها...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-500 p-4 bg-red-100 rounded-lg">
      <p>خطا در دریافت اطلاعات: {{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!purchaseStore.hasPurchases" class="text-center text-gray-500 p-8 border-2 border-dashed rounded-lg">
      <h2 class="text-xl font-semibold">کتابی یافت نشد</h2>
      <p class="mt-2">شما هنوز هیچ کتابی خریداری نکرده‌اید.</p>
      <NuxtLink to="/books" class="mt-4 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
        مشاهده فروشگاه کتاب
      </NuxtLink>
    </div>

    <!-- Data Table -->
    <div v-else class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ردیف</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شماره سفارش</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کتاب</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">تاریخ خرید</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">مبلغ</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">دانلود باقی‌مانده</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(purchase, index) in purchases"
            :key="purchase.id"
            :class="{
              'bg-red-50 hover:bg-red-100': purchase.is_expired,
              'bg-green-50 hover:bg-green-100': !purchase.is_expired
            }"
            class="transition-colors duration-200"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ purchase.order_number }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img class="h-10 w-10 rounded-full object-cover" :src="purchase.cover_image_url || '/placeholder.png'" :alt="purchase.title">
                </div>
                <div class="mr-4">
                  <NuxtLink :to="purchase.book && purchase.book.slug ? `/book/${purchase.book.slug}` : '#'" class="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors" :class="{'pointer-events-none': !purchase.book || !purchase.book.slug}">
                    {{ purchase.title }}
                  </NuxtLink>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{{ formatters.formatDate(purchase.purchase_date) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{{ formatters.formatCurrency(purchase.amount_paid) }} تومان</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                :class="purchase.is_expired ? 'text-red-800' : 'text-green-800'"
                class="font-semibold"
              >
                {{ purchase.is_expired ? 'منقضی شده' : `${Math.floor(purchase.days_until_expiration)} روز باقی‌مانده` }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{{ purchase.remaining_downloads }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div v-if="!purchase.is_expired">
                <div v-if="getAvailableDownloads(purchase).length > 0" class="flex flex-col gap-2 items-start">
                  <NuxtLink
                    v-for="download in getAvailableDownloads(purchase)"
                    :key="download.id || download.format"
                    :to="`/book/download/${download.token}`"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    دانلود {{ download.format.toUpperCase() }}
                  </NuxtLink>
                </div>
                <div v-else>
                  <span class="text-gray-400">ناموجود</span>
                </div>
              </div>
              <NuxtLink v-else :to="`/book/${purchase.book.slug}`" class="text-orange-600 hover:text-orange-800 font-semibold">
                خرید مجدد
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Debug View -->
    <div v-if="purchases.length > 0" class="mt-12 p-4 bg-gray-800 text-white rounded-lg" dir="ltr">
      <h3 class="text-lg font-bold mb-2 text-right">Debug View: Raw API Data</h3>
      <pre class="text-xs whitespace-pre-wrap break-all">{{ JSON.stringify(purchases, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { usePurchaseStore } from '~/stores/purchase'
import { useFormatters } from '~/composables/useFormatters'
import { useApiAuth } from '~/composables/useApiAuth'

definePageMeta({
  middleware: 'auth',
  alias: ['/downloads', '/library']
})

const authStore = useAuthStore()
const purchaseStore = usePurchaseStore()
const formatters = useFormatters()

const getAvailableDownloads = (purchase) => {
  if (!purchase || !purchase.book) return [];

  let allDownloads = [];

  // Check if the book is a master book and has variants with downloads
  if (purchase.book.is_master && Array.isArray(purchase.book.variants)) {
    // Add the master book's own downloads first
    if(Array.isArray(purchase.book.downloads)) {
        allDownloads.push(...purchase.book.downloads);
    }

    // Add downloads from all variants
    purchase.book.variants.forEach(variant => {
      if (Array.isArray(variant.downloads)) {
        allDownloads.push(...variant.downloads);
      }
    });
  } else if (Array.isArray(purchase.book.downloads)) {
    // It's a regular book, just add its downloads
    allDownloads.push(...purchase.book.downloads);
  }

  // Fallback for legacy structure with a single download_url
  if (allDownloads.length === 0 && purchase.download_url) {
    try {
      const urlObject = new URL(purchase.download_url);
      const pathSegments = urlObject.pathname.split('/');
      const token = pathSegments.pop() || '';
      if(token) {
          allDownloads.push({
              id: 'legacy-' + purchase.id,
              format: 'فایل', // Generic format name
              token: token
          });
      }
    } catch(e) {
        console.error('Invalid legacy download URL:', purchase.download_url, e);
    }
  }

  // Making sure downloads are unique by token
  const uniqueDownloads = [];
  const seenTokens = new Set();
  for (const download of allDownloads) {
    if (download.token && !seenTokens.has(download.token)) {
      uniqueDownloads.push(download);
      seenTokens.add(download.token);
    }
  }

  return uniqueDownloads;
};


// Computed properties to reactively get data from the store
const purchases = computed(() => purchaseStore.purchases)
const loading = computed(() => purchaseStore.loading)
const error = computed(() => purchaseStore.error)

// Fetch user data and purchased books when the component mounts
onMounted(async () => {
  if (authStore.isLoggedIn && !authStore.currentUser) {
    await authStore.fetchUser()
  }
  await purchaseStore.fetchPurchases()
})
</script>
