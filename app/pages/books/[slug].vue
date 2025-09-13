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
          <!-- Purchased State -->
          <div v-if="book.is_purchased" class="text-center">
            <p class="font-semibold text-lg text-green-600">شما این کتاب را خریداری کرده‌اید.</p>
            <button class="mt-2 bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600">
              مشاهده کتاب
            </button>
          </div>

          <!-- Direct Purchase Flow -->
          <div v-else class="space-y-4">
            <h3 class="font-semibold text-lg">خرید مستقیم</h3>

            <!-- Coupon Section -->
            <div class="flex items-center gap-2">
              <input type="text" v-model="couponCode" placeholder="کد تخفیف (اختیاری)"
                     class="flex-grow p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <button @click="validateCoupon" :disabled="validatingCoupon"
                      class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50">
                <span v-if="validatingCoupon">...</span>
                <span v-else>اعتبارسنجی</span>
              </button>
            </div>
            <p v-if="couponMessage" :class="couponMessageClass" class="text-sm">
              {{ couponMessage }}
            </p>

            <!-- Purchase Button -->
            <button @click="handlePurchase" :disabled="purchaseInProgress"
                    class="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              <span v-if="purchaseInProgress">در حال انتقال به درگاه...</span>
              <span v-else>خرید و پرداخت</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, navigateTo } from '#app'
import { useApi } from '~/composables/useApi'

useHead({
  title: 'جزئیات کتاب',
})

const route = useRoute()
const api = useApi()

const book = ref(null)
const loading = ref(true)
const error = ref(null)
const slug = route.params.slug

// State for new purchase flow
const couponCode = ref('')
const validatingCoupon = ref(false)
const couponMessage = ref('')
const couponMessageClass = ref('')
const purchaseInProgress = ref(false)

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

const validateCoupon = async () => {
  if (!couponCode.value) {
    couponMessage.value = 'لطفاً کد تخفیف را وارد کنید.'
    couponMessageClass.value = 'text-red-500'
    return
  }
  validatingCoupon.value = true
  couponMessage.value = ''
  try {
    const response = await api.post('/purchase/coupon/validate', { code: couponCode.value })
    if (response.success) {
      couponMessage.value = `کد تخفیف معتبر است: ${response.data.percentage}%`
      couponMessageClass.value = 'text-green-600'
    }
  } catch (err) {
    couponMessage.value = err.data?.data?.message || 'کد تخفیف نامعتبر است.'
    couponMessageClass.value = 'text-red-500'
  } finally {
    validatingCoupon.value = false
  }
}

const handlePurchase = async () => {
  if (!book.value) return;
  purchaseInProgress.value = true
  try {
    // Fixed: Send without body if not needed (matches curl success); add body only if coupon valid
    const body = couponCode.value && couponMessageClass.value === 'text-green-600'
      ? { payment_method: 'zarinpal', coupon_code: couponCode.value }
      : undefined // No body if no coupon, to match backend expectation

    const response = await api.post(`/books/${book.value.id}/buy`, body)
    if (response.success && response.data.payment_url) {
      await navigateTo(response.data.payment_url, { external: true })
    } else {
      alert('خطا در ایجاد لینک پرداخت. لطفاً دوباره تلاش کنید.')
    }
  } catch (err) {
    console.error('Purchase failed:', err)
    // Improved error handling: Check for 401 specifically
    if (err.statusCode === 401 || err.status === 401) {
      alert('احراز هویت نشده. لطفاً وارد شوید.')
      await navigateTo('/auth')
    } else {
      alert(err.data?.message || 'فرآیند خرید با خطا مواجه شد.')
    }
  } finally {
    purchaseInProgress.value = false
  }
}

const formatPrice = (price) => {
  if (!price) return ''
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
}

onMounted(fetchBook)
</script>
