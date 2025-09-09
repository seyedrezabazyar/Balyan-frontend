<template>
  <div class="container mx-auto p-4">
    <header class="mb-8 text-center">
      <h1 class="text-4xl font-bold text-gray-800">آخرین کتاب‌ها</h1>
      <p class="text-gray-600">جدیدترین کتاب‌های اضافه شده را کشف کنید</p>
    </header>

    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center">
      <p>در حال بارگذاری کتاب‌ها...</p>
    </div>

    <!-- Error Message -->
    <div v-else-if="!books.length && !loading" class="text-center">
      <p>کتابی برای نمایش وجود ندارد.</p>
    </div>

    <!-- Books Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <BookCard v-for="book in books" :key="book.id" :book="book" />
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.last_page > 1" class="flex justify-center items-center mt-8">
      <button @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 mx-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
        قبلی
      </button>

      <span class="px-4 py-2 mx-1">
        صفحه {{ pagination.current_page }} از {{ pagination.last_page }}
      </span>

      <button @click="changePage(currentPage + 1)"
              :disabled="currentPage === pagination.last_page"
              class="px-4 py-2 mx-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
        بعدی
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import BookCard from '~/components/BookCard.vue'

// Page title
useHead({
  title: 'کتاب‌ها',
})

const books = ref([])
const pagination = ref(null)
const currentPage = ref(1)
const loading = ref(false)

const api = useApi()

const fetchBooks = async (page) => {
  loading.value = true
  try {
    const response = await api.get('/api/v1/books', {
      params: {
        per_page: 10,
        sort: 'newest',
        page: page
      }
    })
    // Per code review, handle a potentially nested data structure
    if (response && response.data && response.data.data) {
      books.value = response.data.data
      pagination.value = response.data.meta
    } else if (response && response.data) {
      // Fallback for a flatter structure
      books.value = response.data
      pagination.value = response.meta
    }
     else {
      console.error("Unexpected API response structure:", response);
    }
  } catch (error) {
    console.error('Failed to fetch books:', error)
    // You might want to show an error message to the user
  } finally {
    loading.value = false
  }
}

// Fetch books when the component is mounted
onMounted(() => {
  fetchBooks(currentPage.value)
})

// Watch for changes in currentPage to fetch new data
watch(currentPage, (newPage) => {
  fetchBooks(newPage)
})

const changePage = (page) => {
  if (pagination.value && page > 0 && page <= pagination.value.last_page) {
    currentPage.value = page
  }
}
</script>