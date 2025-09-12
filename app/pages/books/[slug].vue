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
        <img v-if="book.image" :src="book.image.url" :alt="book.title" class="w-full rounded-lg shadow-lg">
      </div>
      <div class="md:col-span-2">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{{ book.title }}</h1>
        <div class="flex items-center mb-4">
          <p class="text-lg text-gray-600 ml-4">{{ book.authors.map(a => a.name).join(', ') }}</p>
          <span class="text-sm text-gray-500">{{ book.category.name }}</span>
        </div>
        <p class="text-gray-700 leading-relaxed mb-6">{{ book.excerpt }}</p>

        <div class="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 class="font-semibold text-lg mb-2">مشخصات کتاب</h3>
          <ul class="grid grid-cols-2 gap-4 text-sm">
            <li><strong>زبان:</strong> {{ book.language === 'fa' ? 'فارسی' : 'انگلیسی' }}</li>
            <li><strong>سال انتشار:</strong> {{ book.publication_year }}</li>
            <li><strong>تعداد صفحات:</strong> {{ book.pages_count }}</li>
            <li><strong>شابک (ISBN):</strong> {{ book.isbn }}</li>
          </ul>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-2xl font-bold text-green-600">
            <span v-if="book.sale_price" class="text-base text-gray-400 line-through mr-2">{{ formatPrice(book.price) }}</span>
            <span>{{ formatPrice(book.sale_price || book.price) }}</span>
          </div>

          <!-- 1. Purchased State -->
          <button v-if="book.is_purchased"
                  disabled
                  class="bg-gray-400 text-white font-bold py-2 px-6 rounded-lg w-48 text-center cursor-not-allowed">
            خریداری شده
          </button>

          <!-- 2. In Cart State -->
          <button v-else-if="isInCart"
                  disabled
                  class="bg-green-500 text-white font-bold py-2 px-6 rounded-lg w-48 text-center cursor-not-allowed">
            رفته به سبد خرید
          </button>

          <!-- 3. Add to Cart State -->
          <button v-else
                  @click="addToCartHandler"
                  :disabled="isAddingToCart"
                  class="text-white font-bold py-2 px-6 rounded-lg transition w-48 text-center"
                  :class="{
                    'bg-blue-600 hover:bg-blue-700': !isAddingToCart,
                    'bg-blue-400 cursor-wait': isAddingToCart
                  }">
            <span v-if="isAddingToCart">در حال افزودن...</span>
            <span v-else>افزودن به سبد خرید</span>
          </button>

        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useCartStore } from '~/stores/cart'

useHead({
  title: 'جزئیات کتاب',
})

const route = useRoute()
const api = useApi()
const cartStore = useCartStore()

const book = ref(null)
const loading = ref(true)
const error = ref(null)
const isAddingToCart = ref(false)

const slug = route.params.slug

const isInCart = computed(() => {
  return cartStore.items.some(item => item.product.id === book.value?.id)
})

const fetchBook = async () => {
  try {
    const response = await api.get(`/v1/books/${slug}`)
    if (response.success && response.data && response.data.book) {
      book.value = response.data.book
      useHead({
        title: response.data.book.title,
      })
    } else {
      throw new Error(response.error || 'کتاب مورد نظر یافت نشد.')
    }
  } catch (err) {
    error.value = err
    console.error('Failed to fetch book details:', err)
  } finally {
    loading.value = false
  }
}

const formatPrice = (price) => {
  if (!price) return ''
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
}

const addToCartHandler = async () => {
  if (book.value?.is_purchased || isInCart.value || isAddingToCart.value || !book.value) return

  isAddingToCart.value = true
  try {
    await cartStore.addToCart({
      product_id: book.value.id,
      product_type: 'book',
      price: book.value.sale_price || book.value.price
    })
  } catch (err) {
    console.error('Failed to add to cart:', err)
  } finally {
    isAddingToCart.value = false
  }
}

onMounted(fetchBook)
</script>
