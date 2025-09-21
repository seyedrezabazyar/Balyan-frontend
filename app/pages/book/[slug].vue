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
        <!-- Main Image Display -->
        <div class="mb-4">
          <img v-if="displayedImage" :src="displayedImage.url || displayedImage.image_url" :alt="book.title" class="w-full rounded-lg shadow-lg aspect-[3/4] object-cover">
          <div v-else class="w-full rounded-lg shadow-lg aspect-[3/4] bg-gray-200 flex items-center justify-center">
            <span class="text-gray-500">بدون تصویر</span>
          </div>
        </div>

        <!-- Thumbnail Gallery -->
        <div v-if="bookImages && bookImages.length > 1" class="grid grid-cols-4 gap-2">
          <button
            v-for="image in bookImages"
            :key="image.id"
            @click="displayedImage = { url: image.image_url, alt: image.alt_text }"
            class="rounded-lg overflow-hidden border-2 transition"
            :class="(displayedImage?.url || displayedImage?.image_url) === image.image_url ? 'border-blue-500' : 'border-transparent hover:border-blue-300'"
          >
            <img :src="image.thumbnail_url" :alt="image.alt_text || book.title" class="w-full h-full object-cover aspect-[3/4]">
          </button>
        </div>
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

        <div class="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 class="font-semibold text-lg mb-2">مشخصات کتاب</h3>
          <ul class="grid grid-cols-2 gap-4 text-sm">
            <li v-if="book.language"><strong>زبان:</strong> {{ book.language === 'fa' ? 'فارسی' : 'انگلیسی' }}</li>
            <li v-if="displayPublicationYears"><strong>سال انتشار:</strong> {{ displayPublicationYears }}</li>
            <li v-if="book.pages_count"><strong>تعداد صفحات:</strong> {{ book.pages_count }}</li>
            <li v-if="book.isbn"><strong>شابک (ISBN):</strong> {{ book.isbn }}</li>
            <li v-if="availableFormats && availableFormats.length" class="col-span-2">
              <strong>فرمت‌های موجود:</strong>
              <span v-for="(format, index) in availableFormats" :key="format" class="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2">
                {{ format.toUpperCase() }}
              </span>
            </li>
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
              <!-- Sub-scenario: Just purchased -->
              <div v-if="justPurchased" class="text-center p-4 bg-green-50 rounded-lg">
                  <h3 class="text-xl font-bold text-green-800 mb-3">خرید شما با موفقیت انجام شد</h3>
                  <p class="text-gray-700 mb-6">اکنون می‌توانید به فایل‌های کتاب در کتابخانه خود دسترسی داشته باشید.</p>
                  <NuxtLink to="/my-purchases" class="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                      رفتن به کتابخانه
                  </NuxtLink>
              </div>
              <!-- Sub-scenario: Already owns the book (e.g., on page refresh) -->
              <div v-else class="text-center p-4 bg-blue-50 rounded-lg">
                  <h3 class="text-lg font-semibold mb-3 text-blue-800">شما این کتاب را قبلا خریداری کرده‌اید</h3>
                  <p class="text-gray-600 mb-6">برای مشاهده و دانلود فایل‌های کتاب، به کتابخانه خود مراجعه کنید.</p>
                  <NuxtLink to="/my-purchases" class="inline-block bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                      مشاهده در کتابخانه
                  </NuxtLink>
              </div>
            </div>

            <!-- Scenario 2: Purchase has expired, user needs to repurchase -->
            <div v-else-if="purchaseStatus && purchaseStatus.is_purchased && purchaseStatus.is_expired">
              <p class="mb-4 text-center text-gray-700">
                مهلت دسترسی شما به این کتاب تمام شده است. برای دسترسی مجدد، لطفاً آن را دوباره خریداری کنید.
              </p>
              <button @click="handlePurchaseClick" :disabled="purchaseInProgress" class="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition disabled:opacity-50">
                <span v-if="purchaseInProgress">در حال پردازش خرید...</span>
                <span v-else>خرید مجدد</span>
              </button>
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
import { usePurchaseStore } from '~/stores/purchase';
import { useApiAuth } from '~/composables/useApiAuth';
import { useApi } from '~/composables/useApi';

const route = useRoute();
const slug = route.params.slug;
const authStore = useAuthStore();
const purchaseStore = usePurchaseStore();
const apiAuth = useApiAuth();
const apiPublic = useApi();

// State for the component
const book = ref(null);
const bookImages = ref([]);
const displayedImage = ref(null);
const purchaseStatus = ref(null); // Will hold the user_purchase_status object
const loading = ref(true);
const error = ref(null);
const purchaseInProgress = ref(false);
const showLoginPrompt = ref(false);
const notification = ref({ show: false, message: '', type: 'success' });
const justPurchased = ref(false);
const debugInfo = ref(null);

const isLoggedIn = computed(() => !!authStore.token);

const isMasterBook = computed(() => book.value && book.value.is_master);

const displayPublicationYears = computed(() => {
  if (!book.value) return '';
  if (isMasterBook.value && book.value.variants_data?.publication_years?.length) {
    const years = [...new Set(book.value.variants_data.publication_years)].sort();
    return years.join(', ');
  }
  return book.value.publication_year;
});

const availableFormats = computed(() => {
  if (isMasterBook.value && book.value.variants_data?.formats?.length) {
    return [...new Set(book.value.variants_data.formats)];
  }
  // Even for non-master books, we might have a format in downloads
  if (book.value?.downloads?.length) {
      return [...new Set(book.value.downloads.map(d => d.format))]
  }
  return [];
});

const allDownloads = computed(() => {
    if (!book.value) return [];

    let downloads = [];

    // If it's a master book, collect downloads from itself and its variants
    if (isMasterBook.value) {
        // Add master book's own downloads
        if (Array.isArray(book.value.downloads)) {
            downloads.push(...book.value.downloads);
        }
        // Add downloads from variants
        if (Array.isArray(book.value.variants)) {
            book.value.variants.forEach(variant => {
                if (Array.isArray(variant.downloads)) {
                    downloads.push(...variant.downloads);
                }
            });
        }
    } else {
        // If it's a regular book, just use its own downloads
        if (Array.isArray(book.value.downloads)) {
            downloads.push(...book.value.downloads);
        }
    }

    // Ensure unique downloads, for example by format, if needed. For now, returning all.
    return downloads;
});

async function fetchBookImages() {
  try {
    const response = await apiPublic.get(`/book/${slug}/images`);
    if (response.success && Array.isArray(response.data)) {
      bookImages.value = response.data;
      // If there are gallery images, add the main book image to the start of the list
      // if it's not already there. This makes the gallery complete.
      if (book.value?.image?.url) {
        const mainImageInGallery = bookImages.value.find(img => img.image_url === book.value.image.url);
        if (!mainImageInGallery) {
          bookImages.value.unshift({
            id: `book-${book.value.id}-main-image`, // A more stable, unique key
            image_url: book.value.image.url,
            thumbnail_url: book.value.image.thumbnail_url || book.value.image.url,
            alt_text: book.value.title
          });
        }
      }
    }
  } catch (err) {
    // Fail silently, as the main book data is more important.
    console.warn('Could not fetch additional book images:', err);
  }
}

async function fetchBook() {
  loading.value = true;
  error.value = null;
  debugInfo.value = null;
  bookImages.value = []; // Reset images on each fetch
  try {
    const response = await apiAuth.get(`/book/${slug}`);

    debugInfo.value = {
      timestamp: new Date().toISOString(),
      tokenUsed: authStore.token ? `Bearer ${authStore.token.substring(0, 10)}...` : 'No Token',
      apiResponse: response
    };

    if (response.success && response.data?.book) {
      book.value = response.data.book;
      purchaseStatus.value = response.data.user_purchase_status;
      useHead({ title: response.data.book.title });

      // Set the initial displayed image
      displayedImage.value = book.value.image;

      // Fetch additional images for the gallery
      await fetchBookImages();

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
    const response = await apiAuth.post(`/book/${slug}/buy`);

    // On success, set the flag and refetch data.
    // The success message is now handled in the template.
    justPurchased.value = true;
    notification.value.show = false; // Ensure any previous notifications are hidden

    purchaseStore.clearPurchases(); // Invalidate the purchases list
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
