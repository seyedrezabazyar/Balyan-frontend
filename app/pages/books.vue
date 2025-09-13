<template>
  <div>
    <NuxtPage v-if="route.params.slug" />
    <div v-else class="container mx-auto p-4">
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import BookCard from '~/components/BookCard.vue'

// Page title
useHead({
  title: 'کتاب‌ها',
})

const route = useRoute()

const books = ref([])
const pagination = ref(null)
const currentPage = ref(1)
const loading = ref(false)
const debugResponse = ref(null)

const api = useApi()

const fetchBooks = async (page) => {
  loading.value = true
  try {
    const response = await api.get('/books', {
      params: {
        per_page: 10,
        sort: 'newest',
        page: page
      }
    })
    debugResponse.value = response; // Store raw response for debugging

    // Based on the provided API response, the book list is in `response.data`
    // and pagination details are in `response.meta`.
    if (response && response.data && Array.isArray(response.data)) {
      books.value = response.data;
      if (response.meta) {
        pagination.value = response.meta;
      }
    } else {
      console.error("Unexpected API response structure. Expected 'data' property with an array.", response);
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