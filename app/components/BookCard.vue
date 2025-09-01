<template>
  <div class="bg-white rounded-lg shadow hover:shadow-lg transition">
    <div class="relative">
      <img :src="book.thumbnail || '/placeholder-book.jpg'"
           :alt="book.title"
           class="w-full h-48 object-cover rounded-t-lg">
      <div v-if="book.discount_percentage"
           class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
        {{ book.discount_percentage }}% تخفیف
      </div>
    </div>
    <div class="p-4">
      <h3 class="font-semibold text-gray-800 mb-1 line-clamp-1">{{ book.title }}</h3>
      <p class="text-sm text-gray-600 mb-2">{{ book.author }}</p>
      <div class="flex items-center justify-between">
        <div>
          <p v-if="book.discount_price" class="text-xs text-gray-400 line-through">
            {{ formatPrice(book.price) }}
          </p>
          <p class="text-lg font-bold text-green-600">
            {{ formatPrice(book.discount_price || book.price) }}
          </p>
        </div>
        <button @click="addToCart"
                class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
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
