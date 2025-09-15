<template>
  <div class="container mx-auto p-4 md:p-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
      کتاب‌های خریداری شده من
    </h1>

    <!-- Debug Section -->
    <div class="bg-gray-100 border-2 border-dashed border-gray-400 p-4 rounded-lg mb-8">
      <h2 class="text-xl font-bold text-gray-700 mb-2">--- بخش دیباگ ---</h2>
      <div class="space-y-2 text-sm font-mono">
        <p><strong>Pending (درحال بارگذاری):</strong> {{ pending }}</p>
        <div>
          <p><strong>Error (خطا):</strong></p>
          <pre class="bg-red-50 p-2 rounded text-red-700 whitespace-pre-wrap">{{ error || 'هیچ خطایی وجود ندارد' }}</pre>
        </div>
        <div>
          <p><strong>Response (پاسخ کامل API):</strong></p>
          <pre class="bg-blue-50 p-2 rounded text-blue-800 whitespace-pre-wrap">{{ response || 'هنوز پاسخی دریافت نشده' }}</pre>
        </div>
      </div>
       <p class="text-xs text-gray-500 mt-4">این بخش فقط برای خطایابی است و بعداً حذف خواهد شد.</p>
    </div>
    <!-- End Debug Section -->

    <!-- 1. Loading State -->
    <div v-if="pending">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <!-- Skeleton Loader Card -->
        <div v-for="i in 4" :key="i" class="border rounded-lg p-4 shadow-md animate-pulse">
          <div class="bg-gray-300 h-48 w-full rounded-md mb-4"></div>
          <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div class="h-10 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    </div>

    <!-- 2. Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
      <strong class="font-bold">خطا!</strong>
      <span class="block sm:inline"> متاسفانه در دریافت اطلاعات مشکلی پیش آمد. لطفا دوباره تلاش کنید.</span>
      <p class="text-sm mt-2 text-gray-600">{{ error.message }}</p>
    </div>

    <!-- 3. Empty State -->
    <div v-else-if="!purchases || purchases.length === 0" class="text-center py-16">
      <p class="text-xl text-gray-600 mb-4">شما هنوز هیچ کتابی خریداری نکرده‌اید.</p>
      <NuxtLink to="/store" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
        رفتن به فروشگاه
      </NuxtLink>
    </div>

    <!-- 4. Success State - Display Books -->
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <PurchasedBookCard
          v-for="purchase in purchases"
          :key="purchase.id"
          :purchase="purchase"
        />
      </div>
      <!-- Pagination can be added here later using the 'meta' and 'links' objects -->
    </div>
  </div>
</template>

<script setup lang="ts">
// Define the structure for a single purchase object for type safety
interface BookPurchase {
  id: number;
  title: string;
  cover_image_url: string | null;
  remaining_downloads: number;
  days_until_expiration: number | null;
  download_url: string;
  book: {
    id: number;
    slug: string;
    // ... other book details
  };
}

// Define the structure for the API response
interface ApiResponse {
  data: BookPurchase[];
  links: Record<string, string | null>;
  meta: Record<string, any>;
}

// Set page title and meta description
useHead({
  title: 'کتاب‌های خریداری شده من',
  meta: [
    { name: 'description', content: 'لیست کتاب‌های خریداری شده و لینک‌های دانلود آن‌ها.' }
  ]
})

// Fetch data from the API using Nuxt's useFetch composable
// It automatically handles server-side rendering, caching, and state management (pending, error, data)
const { data: response, pending, error } = await useFetch<ApiResponse>('/api/v1/downloads', {
  // Assuming authentication is handled globally by a Nuxt plugin (e.g., for Sanctum)
  // If not, you would add headers here:
  // headers: { 'Authorization': `Bearer ${token}` }
  lazy: true, // `lazy: true` means it won't block navigation on the client-side
});

// Computed property to safely access the list of purchases from the response
const purchases = computed(() => response.value?.data || []);

// You can also access pagination info if needed in the future
// const pagination = computed(() => response.value?.meta);

</script>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
