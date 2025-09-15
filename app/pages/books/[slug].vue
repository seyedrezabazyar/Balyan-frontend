<template>
  <div class="container mx-auto p-4 md:p-8">
    <div v-if="loading" class="text-center">
      <p>در حال بارگذاری اطلاعات کتاب...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>خطا در دریافت اطلاعات کتاب: {{ error }}</p>
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
          <!-- Notification Area -->
          <div v-if="notification.show" class="p-4 mb-4 rounded-lg text-center" :class="{ 'bg-green-100 text-green-700': notification.type === 'success', 'bg-red-100 text-red-700': notification.type === 'error' }">
            {{ notification.message }}
          </div>

          <!-- Purchase Status Logic -->
          <div class="actions text-center">
            <!-- Scenario 1: Purchase is valid and active -->
            <div v-if="purchaseStatus && purchaseStatus.is_purchased && !purchaseStatus.is_expired">
              <NuxtLink to="/dashboard" class="btn-primary inline-block bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition">
                مشاهده در کتابخانه
              </NuxtLink>
              <p class="purchase-info mt-2 text-sm text-gray-600">
                شما این کتاب را خریده‌اید و به آن دسترسی دارید.
              </p>
            </div>

            <!-- Scenario 2: Purchase has expired -->
            <div v-else-if="purchaseStatus && purchaseStatus.is_purchased && purchaseStatus.is_expired" class="p-4 bg-yellow-100 rounded-lg">
              <p class="font-semibold mb-3">مهلت دسترسی شما به این کتاب تمام شده است.</p>
              <button v-if="purchaseStatus.renewal_offer" class="btn-renew w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition">
                تمدید با {{ purchaseStatus.renewal_offer.discount_percentage }}٪ تخفیف
              </button>
              <p v-if="purchaseStatus.renewal_offer" class="price-info mt-2 text-sm text-gray-600">
                قیمت جدید: {{ purchaseStatus.renewal_offer.new_price }} تومان
              </p>
            </div>

            <!-- Scenario 3: Not purchased or not logged in -->
            <div v-else>
              <!-- Sub-case: Guest clicked "Buy", show login prompt -->
              <div v-if="showLoginPrompt" class="text-center p-4 bg-gray-100 rounded-lg">
                <p class="font-semibold mb-3">برای خرید این کتاب، لطفاً ابتدا وارد حساب کاربری خود شوید.</p>
                <NuxtLink to="/auth" class="inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                  ورود یا ثبت‌نام
                </NuxtLink>
              </div>
              <!-- Sub-case: Initial state, show buy button -->
              <div v-else>
                <button @click="handlePurchaseClick" :disabled="purchaseInProgress" class="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                  <span v-if="purchaseInProgress">در حال پردازش خرید...</span>
                  <span v-else>خرید آنی کتاب</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
     <div v-else class="text-center text-gray-500">
      <p>اطلاعات کتاب یافت نشد.</p>
    </div>

    <!-- Temporary Debugging Block -->
    <div v-if="debugInfo" class="mt-8 p-4 bg-gray-800 text-white rounded-lg font-mono text-left text-sm" dir="ltr">
      <h3 class="font-bold text-lg mb-2">DEBUG INFORMATION</h3>
      <pre>{{ JSON.stringify(debugInfo, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const slug = route.params.slug;
const authStore = useAuthStore();

// State for the component
const book = ref(null);
const purchaseStatus = ref(null); // Will hold the user_purchase_status object
const loading = ref(true);
const error = ref(null);
const purchaseInProgress = ref(false);
const showLoginPrompt = ref(false);
const notification = ref({ show: false, message: '', type: 'success' });
const debugInfo = ref(null);

const isLoggedIn = computed(() => !!authStore.token);

async function fetchBook() {
  loading.value = true;
  error.value = null;
  debugInfo.value = null;
  try {
    const response = await $fetch(`http://localhost:8000/api/v1/books/${slug}`, {
      headers: { 'Authorization': `Bearer ${authStore.token}`, 'Accept': 'application/json' }
    });

    debugInfo.value = {
      timestamp: new Date().toISOString(),
      tokenUsed: authStore.token ? `Bearer ${authStore.token.substring(0, 10)}...` : 'No Token',
      apiResponse: response
    };

    if (response.success && response.data?.book) {
      book.value = response.data.book;
      purchaseStatus.value = response.data.user_purchase_status;
      useHead({ title: response.data.book.title });
    } else {
      throw new Error('Invalid book data received from API.');
    }
  } catch (err) {
    error.value = err.data?.message || 'Failed to fetch book details.';
    debugInfo.value = {
      timestamp: new Date().toISOString(),
      tokenUsed: authStore.token ? `Bearer ${authStore.token.substring(0, 10)}...` : 'No Token',
      errorResponse: err.response?._data || err
    };
    console.error('Failed to fetch book details:', err);
  } finally {
    loading.value = false;
  }
}

// Watch the token from the auth store.
// When it's available (or changes), re-fetch the book data.
// `immediate: true` runs this on component load, ensuring the fetch happens
// as soon as the initial auth state is known.
watch(
  () => authStore.token,
  () => {
    fetchBook();
  },
  { immediate: true }
);


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

  try {
    const response = await $fetch(`http://localhost:8000/api/v1/books/${slug}/buy`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authStore.token}`, 'Accept': 'application/json' }
    });
    // On success, show a notification and refetch the book data to update the state.
    notification.value = { show: true, message: response.message || 'خرید با موفقیت انجام شد!', type: 'success' };
    await fetchBook(); // Refetch data to get the new purchase status
  } catch (err) {
    notification.value = { show: true, message: err.response?._data?.message || 'خطایی در هنگام خرید رخ داد.', type: 'error' };
  } finally {
    purchaseInProgress.value = false;
  }
}
</script>

<style scoped>
/* Styles from the task description for consistency */
.btn-primary {
  display: inline-block;
  padding: 10px 20px;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
}

.btn-renew {
  /* The template uses Tailwind classes, but we add this for completeness */
  color: white;
}

.purchase-info, .price-info {
  margin-top: 10px;
  font-size: 0.9em;
  color: #555;
}

/* Overriding Tailwind if needed, but the template uses utility classes directly */
.bg-blue-600 { background-color: #2563eb; }
.bg-green-500 { background-color: #22c55e; }
.bg-orange-500 { background-color: #f97316; }
</style>
