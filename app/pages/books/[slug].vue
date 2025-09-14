<template>
  <div class="container mx-auto p-4 md:p-8">
    <div v-if="loading" class="text-center">
      <p>در حال بارگذاری اطلاعات کتاب...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>خطا در دریافت اطلاعات کتاب: {{ error.message }}</p>
    </div>
    <article v-else-if="book" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="md:col-span-1">
        <img v-if="book.image?.url" :src="book.image.url" :alt="book.title" class="w-full rounded-lg shadow-lg">
      </div>
      <div class="md:col-span-2">
        <h1 v-if="book.title" class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{{ book.title }}</h1>
        <div class="flex items-center mb-4">
          <p v-if="book.authors && Array.isArray(book.authors) && book.authors.length" class="text-lg text-gray-600 ml-4">
            {{ book.authors.map(a => a.name).join(', ') }}
          </p>
          <span v-if="book.category?.name" class="text-sm text-gray-500">{{ book.category.name }}</span>
        </div>
        <p v-if="book.excerpt" class="text-gray-700 leading-relaxed mb-6">{{ book.excerpt }}</p>

        <div v-if="book.language || book.publication_year || book.pages_count || book.isbn" class="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 class="font-semibold text-lg mb-2">مشخصات کتاب</h3>
          <ul class="grid grid-cols-2 gap-4 text-sm">
            <li v-if="book.language"><strong>زبان:</strong> {{ book.language === 'fa' ? 'فارسی' : 'انگلیسی' }}</li>
            <li v-if="book.publication_year"><strong>سال انتشار:</strong> {{ book.publication_year }}</li>
            <li v-if="book.pages_count"><strong>تعداد صفحات:</strong> {{ book.pages_count }}</li>
            <li v-if="book.isbn"><strong>شابک (ISBN):</strong> {{ book.isbn }}</li>
          </ul>
        </div>

        <div class="mt-6 pt-6 border-t">
          <!-- Purchase Message Area -->
          <div v-if="purchaseMessage"
               :class="purchaseMessageType === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'"
               class="border text-center p-4 rounded-lg mb-4"
               role="alert">
            <p>{{ purchaseMessage }}</p>
          </div>

          <!-- Guest Prompt -->
          <div v-if="showLoginPrompt" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg mb-4" role="alert">
            <p class="font-bold">لطفا وارد شوید</p>
            <p>برای تکمیل خرید، ابتدا باید وارد حساب کاربری خود شوید یا یک حساب جدید بسازید.</p>
            <div class="mt-4">
              <button @click="router.push('/auth')" class="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600">
                ورود یا ثبت‌نام
              </button>
            </div>
          </div>

          <!-- Purchased State -->
          <div v-if="book.is_purchased" class="text-center">
            <p class="font-semibold text-lg text-green-600">شما این کتاب را خریداری کرده‌اید.</p>
            <button @click="router.push('/profile')" class="mt-2 bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600">
              مشاهده در پروفایل
            </button>
          </div>

          <!-- Purchase Button -->
          <div v-else>
            <button @click="handleBuyClick" :disabled="purchaseInProgress"
                    class="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center">
              <svg v-if="purchaseInProgress" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ purchaseInProgress ? 'در حال پردازش...' : 'خرید کتاب' }}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from '#app'
import { useApi } from '~/composables/useApi'
import { useApiAuth } from '~/composables/useApiAuth'
import { useAuthStore } from '~/stores/auth'

useHead({
  title: 'جزئیات کتاب',
})

const route = useRoute()
const router = useRouter()
const api = useApi()
const apiAuth = useApiAuth()
const authStore = useAuthStore()

const book = ref(null)
const loading = ref(true)
const error = ref(null)
const slug = route.params.slug

// New state for purchase flow
const purchaseInProgress = ref(false)
const purchaseMessage = ref('')
const purchaseMessageType = ref('') // 'success' or 'error'
const showLoginPrompt = ref(false)

const fetchBook = async () => {
  try {
    const response = await api.get(`/books/${slug}`)
    // Handle the wrapped response structure
    if (response?.success && response.data?.book) {
      book.value = response.data.book
      useHead({
        title: response.data.book.title,
      })
    } else {
      throw new Error('Invalid book data received from API.')
    }
  } catch (err) {
    error.value = err
    console.error('Failed to fetch book details:', err)
  } finally {
    loading.value = false
  }
}

const handleBuyClick = async () => {
  // Reset previous messages
  purchaseMessage.value = ''
  showLoginPrompt.value = false

  if (!authStore.isLoggedIn) {
    // Guest user logic
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]')
    if (!guestCart.includes(book.value.slug)) {
      guestCart.push(book.value.slug)
      localStorage.setItem('guestCart', JSON.stringify(guestCart))
    }
    showLoginPrompt.value = true
  } else {
    // Authenticated user logic
    purchaseInProgress.value = true
    try {
      const response = await apiAuth.post(`/books/${book.value.slug}/buy`)

      // As per docs, a 200 OK is success
      purchaseMessage.value = response.message || 'خرید شما با موفقیت انجام شد.'
      purchaseMessageType.value = 'success'

      // Update book state and redirect
      if (book.value) {
        book.value.is_purchased = true
      }
      setTimeout(() => {
        router.push('/profile') // Or wherever "My Books" is
      }, 2000)

    } catch (err) {
      if (err.statusCode === 401) {
        // The useApiAuth composable already handles logout and redirect
        // but we can show a message here if we want.
        purchaseMessage.value = 'نشست شما منقضی شده. در حال انتقال به صفحه ورود...'
      } else {
        // Handle other errors, e.g., 500
        purchaseMessage.value = err.data?.message || 'خطا در پردازش خرید شما. لطفاً دوباره تلاش کنید.'
      }
      purchaseMessageType.value = 'error'
    } finally {
      purchaseInProgress.value = false
    }
  }
}

onMounted(fetchBook)
</script>
