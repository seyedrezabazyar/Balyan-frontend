<template>
  <div class="container mx-auto p-4 md:p-8">
    <div v-if="pending" class="text-center">
      <p>در حال بارگذاری اطلاعات کتاب...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>خطا در دریافت اطلاعات کتاب: {{ error.message }}</p>
    </div>
    <article v-else-if="bookDetails && bookDetails.data && bookDetails.data.book" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="md:col-span-1">
        <img v-if="bookDetails.data.book.image?.url" :src="bookDetails.data.book.image.url" :alt="bookDetails.data.book.title" class="w-full rounded-lg shadow-lg">
      </div>
      <div class="md:col-span-2">
        <h1 v-if="bookDetails.data.book.title" class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{{ bookDetails.data.book.title }}</h1>
        <div class="flex items-center mb-4">
          <p v-if="bookDetails.data.book.authors && Array.isArray(bookDetails.data.book.authors) && bookDetails.data.book.authors.length" class="text-lg text-gray-600 ml-4">
            {{ bookDetails.data.book.authors.map(a => a.name).join(', ') }}
          </p>
          <span v-if="bookDetails.data.book.category?.name" class="text-sm text-gray-500">{{ bookDetails.data.book.category.name }}</span>
        </div>
        <p v-if="bookDetails.data.book.excerpt" class="text-gray-700 leading-relaxed mb-6">{{ bookDetails.data.book.excerpt }}</p>

        <div v-if="bookDetails.data.book.language || bookDetails.data.book.publication_year || bookDetails.data.book.pages_count || bookDetails.data.book.isbn" class="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 class="font-semibold text-lg mb-2">مشخصات کتاب</h3>
          <ul class="grid grid-cols-2 gap-4 text-sm">
            <li v-if="bookDetails.data.book.language"><strong>زبان:</strong> {{ bookDetails.data.book.language === 'fa' ? 'فارسی' : 'انگلیسی' }}</li>
            <li v-if="bookDetails.data.book.publication_year"><strong>سال انتشار:</strong> {{ bookDetails.data.book.publication_year }}</li>
            <li v-if="bookDetails.data.book.pages_count"><strong>تعداد صفحات:</strong> {{ bookDetails.data.book.pages_count }}</li>
            <li v-if="bookDetails.data.book.isbn"><strong>شابک (ISBN):</strong> {{ bookDetails.data.book.isbn }}</li>
          </ul>
        </div>

        <div class="mt-6 pt-6 border-t">
          <!-- Notification Area -->
          <div v-if="notification.show" class="p-4 mb-4 rounded-lg text-center" :class="{ 'bg-green-100 text-green-700': notification.type === 'success', 'bg-red-100 text-red-700': notification.type === 'error' }">
            {{ notification.message }}
          </div>

          <!-- Case 1: Book has been purchased -->
          <div v-if="isPurchased" class="text-center">
            <NuxtLink to="/dashboard" class="inline-block bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition">
              رفتن به صفحه دانلود
            </NuxtLink>
          </div>

          <!-- Case 2: Guest clicked "Buy" -->
          <div v-else-if="showLoginPrompt" class="text-center p-4 bg-gray-100 rounded-lg">
            <p class="font-semibold mb-3">برای خرید این کتاب، لطفاً ابتدا وارد حساب کاربری خود شوید.</p>
            <NuxtLink to="/auth" class="inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
              ورود یا ثبت‌نام
            </NuxtLink>
          </div>

          <!-- Case 3: Book not purchased, initial state -> Show the Buy button -->
          <div v-else>
            <button @click="handlePurchaseClick" :disabled="purchaseInProgress" class="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              <span v-if="purchaseInProgress">در حال پردازش خرید...</span>
              <span v-else>خرید آنی کتاب</span>
            </button>
          </div>
        </div>
      </div>
    </article>
     <div v-else class="text-center text-gray-500">
      <p>اطلاعات کتاب یافت نشد.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const slug = route.params.slug;
const authStore = useAuthStore();
const purchaseInProgress = ref(false);
const showLoginPrompt = ref(false);
const notification = ref({ show: false, message: '', type: 'success' });

const isLoggedIn = computed(() => !!authStore.token);

// The `useFetch` is kept for the initial data load.
const { data: bookDetails, pending, error } = await useFetch(
  () => `/api/v1/books/${slug}`,
  {
    baseURL: 'http://localhost:8000',
    headers: { 'Authorization': `Bearer ${authStore.token}`, 'Accept': 'application/json' }
  }
);

const isPurchased = ref(bookDetails.value?.data?.book?.is_purchased || false);

watch(bookDetails, (newDetails) => {
  isPurchased.value = newDetails?.data?.book?.is_purchased || false;
  if (newDetails?.data?.book?.title) {
    useHead({ title: newDetails.data.book.title });
  }
}, { immediate: true });

function handlePurchaseClick() {
  if (isLoggedIn.value) {
    processPurchase();
  } else {
    showLoginPrompt.value = true;
  }
}

async function processPurchase() {
  purchaseInProgress.value = true;
  notification.value = { show: false, message: '', type: 'success' };

  // This is the optimistic update. We immediately set the state to purchased.
  const originalPurchaseStatus = isPurchased.value;
  isPurchased.value = true;

  try {
    const response = await $fetch(`http://localhost:8000/api/v1/books/${slug}/buy`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authStore.token}`, 'Accept': 'application/json' }
    });
    // On success, show a nice notification. We don't need to do anything else.
    notification.value = { show: true, message: response.message || 'خرید با موفقیت انجام شد!', type: 'success' };
  } catch (err) {
    // If the purchase fails, we revert the optimistic update.
    isPurchased.value = originalPurchaseStatus;
    notification.value = { show: true, message: err.response?._data?.message || 'خطایی در هنگام خرید رخ داد.', type: 'error' };
  } finally {
    purchaseInProgress.value = false;
  }
}
</script>
