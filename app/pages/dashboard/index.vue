<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">داشبورد</h1>

    <!-- User Info -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-800">{{ user?.name || 'کاربر' }}</h2>
          <p class="text-gray-600">{{ user?.email || user?.phone }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">کتاب‌های خریداری شده</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.purchased_books || 0 }}</p>
          </div>
          <svg class="w-12 h-12 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">دانلودهای باقیمانده</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.remaining_downloads || 0 }}</p>
          </div>
          <svg class="w-12 h-12 text-green-100" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">مجموع خریدها</p>
            <p class="text-2xl font-bold text-gray-800">{{ formatPrice(stats.total_spent || 0) }}</p>
          </div>
          <svg class="w-12 h-12 text-yellow-100" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Recent Books -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">کتاب‌های اخیر</h3>
      <div v-if="recentBooks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="book in recentBooks" :key="book.id"
             class="border rounded-lg p-4 hover:shadow-md transition">
          <img :src="book.thumbnail || '/placeholder-book.jpg'"
               :alt="book.title"
               class="w-full h-32 object-cover rounded mb-2">
          <h4 class="font-semibold text-gray-800 text-sm">{{ book.title }}</h4>
          <p class="text-xs text-gray-500 mt-1">{{ book.author }}</p>
          <div class="mt-2 flex gap-2">
            <button @click="downloadBook(book.id)"
                    class="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
              دانلود
            </button>
            <NuxtLink :to="`/books/${book.slug}`"
                      class="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              مشاهده
            </NuxtLink>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        هنوز کتابی خریداری نکرده‌اید
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink to="/books"
                class="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
        <svg class="w-12 h-12 text-blue-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p class="text-gray-800 font-semibold">مشاهده کتاب‌ها</p>
      </NuxtLink>

      <NuxtLink to="/my-books"
                class="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
        <svg class="w-12 h-12 text-green-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-800 font-semibold">کتاب‌های من</p>
      </NuxtLink>

      <NuxtLink to="/profile"
                class="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
        <svg class="w-12 h-12 text-purple-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <p class="text-gray-800 font-semibold">پروفایل</p>
      </NuxtLink>

      <NuxtLink to="/cart"
                class="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
        <svg class="w-12 h-12 text-orange-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-gray-800 font-semibold">سبد خرید</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const stats = ref({})
const recentBooks = ref([])

onMounted(async () => {
  await fetchDashboardData()
})

const fetchDashboardData = async () => {
  try {
    // Fetch user stats
    const statsResponse = await $api.get('/api/v1/books/statistics')
    stats.value = statsResponse.data

    // Fetch recent purchased books
    const booksResponse = await $api.get('/api/v1/books/my-purchases', {
      params: { limit: 4 }
    })
    recentBooks.value = booksResponse.data.data
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

const downloadBook = async (bookId) => {
  // TODO: Implement download functionality
  console.log('Download book:', bookId)
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
    minimumFractionDigits: 0
  }).format(price)
}
</script>
