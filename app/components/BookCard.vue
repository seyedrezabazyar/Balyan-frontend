<template>
  <div class="bg-white rounded-lg shadow hover:shadow-lg transition h-full flex flex-col">
    <NuxtLink :to="`/books/${book.slug}`" class="block">
      <div class="relative">
        <img :src="book.image && book.image.thumbnail_url ? book.image.thumbnail_url : '/placeholder-book.jpg'"
             :alt="book.title"
             class="w-full h-48 object-cover rounded-t-lg">
        <div v-if="book.discount_percent"
             class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
          {{ book.discount_percent }}% تخفیف
        </div>
      </div>
    </NuxtLink>
    <div class="p-4 flex flex-col flex-grow">
      <NuxtLink :to="`/books/${book.slug}`" class="block">
        <h3 class="font-semibold text-gray-800 mb-1 line-clamp-1 hover:text-blue-600">{{ book.title }}</h3>
      </NuxtLink>
      <p class="text-sm text-gray-600 mb-2">{{ book.authors && book.authors.length > 0 ? book.authors[0].name : 'ناشناس' }}</p>
      <div class="mt-auto flex items-center justify-between">
        <div>
          <p v-if="book.sale_price" class="text-xs text-gray-400 line-through">
            {{ formatPrice(book.price) }}
          </p>
          <p class="text-lg font-bold text-green-600">
            {{ formatPrice(book.sale_price || book.price) }}
          </p>
        </div>

        <!-- Button Logic (to be replaced with Direct Purchase on book page) -->
        <div class="relative">
          <button v-if="book.is_purchased"
                  disabled
                  class="bg-gray-400 text-white text-xs font-bold py-2 px-3 rounded cursor-not-allowed">
            خریداری شده
          </button>
          <!-- The "Add to cart" and "View cart" states have been removed. -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  book: {
    type: Object,
    required: true
  }
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};
</script>
