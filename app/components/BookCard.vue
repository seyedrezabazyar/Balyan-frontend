<template>
  <NuxtLink :to="`/books/${book.slug}`" class="block">
    <div class="bg-white rounded-lg shadow hover:shadow-lg transition h-full flex flex-col">
      <div class="relative">
        <img :src="book.image && book.image.thumbnail_url ? book.image.thumbnail_url : '/placeholder-book.jpg'"
             :alt="book.title"
             class="w-full h-48 object-cover rounded-t-lg">
        <div v-if="book.discount_percent"
             class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
          {{ book.discount_percent }}% تخفیف
        </div>
      </div>
      <div class="p-4 flex flex-col flex-grow">
        <h3 class="font-semibold text-gray-800 mb-1 line-clamp-1">{{ book.title }}</h3>
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
          <button @click.prevent="addToCart"
                  class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition z-10 relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { useCartStore } from '~/stores/cart';

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()

const addToCart = async () => {
  try {
    await cartStore.addToCart(props.book.id)
    // Show success message
    console.log('Added to cart')
  } catch (error) {
    console.error('Error adding to cart:', error)
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
}
</script>
