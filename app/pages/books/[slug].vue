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
          <!-- Purchase Status: Active -->
          <div v-if="purchaseStatus === 'active'" class="text-center">
            <p class="font-semibold text-lg text-green-600 mb-2">شما این کتاب را در کتابخانه خود دارید.</p>
            <NuxtLink to="/my-books" class="inline-block bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition">
              مشاهده در کتابخانه
            </NuxtLink>
          </div>

          <!-- Purchase Status: Expired -->
          <div v-else-if="purchaseStatus === 'expired'" class="p-4 bg-yellow-100 border-r-4 border-yellow-500 text-yellow-700 rounded-lg text-center">
            <h3 class="font-bold text-lg mb-2">دسترسی شما منقضی شده</h3>
            <p class="mb-4">دسترسی شما به این کتاب به پایان رسیده است. برای دریافت مجدد، می‌توانید آن را دوباره تهیه کنید.</p>
            <button @click="handlePurchase" :disabled="purchaseInProgress" class="w-full bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-700 transition disabled:opacity-50">
              <span v-if="purchaseInProgress">در حال فعال‌سازی...</span>
              <span v-else>خرید مجدد و فعال‌سازی</span>
            </button>
          </div>

          <!-- Purchase Status: None -->
          <div v-else class="space-y-4">
            <h3 class="font-semibold text-lg">خرید مستقیم</h3>
            <button @click="handlePurchase" :disabled="purchaseInProgress" class="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              <span v-if="purchaseInProgress">در حال پردازش خرید...</span>
              <span v-else>خرید آنی کتاب</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from '#app'
import { useApiAuth } from '~/composables/useApiAuth'

useHead({
  title: 'جزئیات کتاب',
})

const route = useRoute()
const apiAuth = useApiAuth()

const book = ref(null)
const loading = ref(true)
const error = ref(null)
const purchaseInProgress = ref(false)
const slug = route.params.slug

const purchaseStatus = computed(() => book.value?.purchase_status || 'none')

const fetchBook = async () => {
  if (!book.value) {
    loading.value = true
  }

  try {
    const response = await apiAuth.get(`/books/${slug}`)
    if (response.success && response.data?.book) {
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

const handlePurchase = async () => {
  if (!book.value) return
  purchaseInProgress.value = true

  try {
    const response = await apiAuth.post(`/books/${slug}/buy`)
    alert(response.message || 'عملیات با موفقیت انجام شد.');
    await fetchBook();

  } catch (err) {
    console.error('Purchase failed:', err)
    const errorMessage = err.data?.message || 'خطا در پردازش درخواست شما. لطفاً دوباره تلاش کنید.'
    alert(errorMessage)
  } finally {
    purchaseInProgress.value = false
  }
}

onMounted(fetchBook)
</script>
