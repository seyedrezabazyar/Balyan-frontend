<template>
  <div class="bg-white rounded-lg shadow hover:shadow-lg transition h-full flex flex-col">
    <NuxtLink :to="`/book/${book.slug}`" class="block">
      <div class="relative">
        <img :src="imageUrl"
             :alt="book.title"
             class="w-full h-48 object-cover rounded-t-lg">
        <div v-if="book.discount_percent"
             class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
          {{ book.discount_percent }}% تخفیف
        </div>
      </div>
    </NuxtLink>
    <div class="p-4 flex flex-col flex-grow">
      <NuxtLink :to="`/book/${book.slug}`" class="block">
        <h3 class="font-semibold text-gray-800 mb-1 line-clamp-1 hover:text-blue-600">{{ book.title }}</h3>
      </NuxtLink>
      <p class="text-sm text-gray-600 mb-2">{{ book.authors && book.authors.length > 0 ? book.authors[0].name : 'ناشناس' }}</p>

      <!-- Master Book Formats -->
      <div v-if="book.is_master && book.variants_data && book.variants_data.formats" class="mb-2">
        <span v-for="format in book.variants_data.formats" :key="format" class="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1">
          {{ format.toUpperCase() }}
        </span>
      </div>

      <div class="mt-auto">
        <!-- Download Links Section -->
        <div v-if="showDownloadLinks" class="pt-4 border-t mt-4">
          <h4 class="font-semibold text-sm mb-2 text-gray-700">دانلود کتاب:</h4>
          <div v-if="book.downloads && book.downloads.length > 0" class="flex flex-wrap gap-2">
            <a v-for="download in book.downloads"
               :key="download.format"
               :href="`/api/v1/downloads/${download.token}`"
               download
               class="bg-blue-600 text-white text-xs font-bold py-2 px-3 rounded hover:bg-blue-700 transition-colors">
              {{ download.format.toUpperCase() }}
            </a>
          </div>
          <div v-else>
            <p class="text-xs text-gray-500">لینک‌های دانلود به زودی در دسترس خواهند بود.</p>
          </div>
        </div>

        <!-- Price/Purchase Section -->
        <div v-else class="flex items-center justify-between pt-4">
          <div>
            <p v-if="book.sale_price" class="text-xs text-gray-400 line-through">
              {{ formatPrice(book.price) }}
            </p>
            <p class="text-lg font-bold text-green-600">
              {{ formatPrice(book.sale_price || book.price) }}
            </p>
          </div>
          <div class="relative">
            <button v-if="book.is_purchased"
                    disabled
                    class="bg-gray-400 text-white text-xs font-bold py-2 px-3 rounded cursor-not-allowed">
              خریداری شده
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  book: {
    type: Object,
    required: true
  },
  showDownloadLinks: {
    type: Boolean,
    default: false
  }
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};

const imageUrl = computed(() => {
  if (props.book.image && props.book.image.thumbnail_url && props.book.image.status === 'approved') {
    return props.book.image.thumbnail_url;
  }
  return '/images/placeholders/book-placeholder-thumb.jpg';
});
</script>
