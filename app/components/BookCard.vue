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

        <!-- 3-State Button Logic -->
        <div class="relative">
          <!-- Purchased State -->
          <button v-if="book.is_purchased"
                  disabled
                  class="bg-gray-400 text-white text-xs font-bold py-2 px-3 rounded cursor-not-allowed">
            خریداری شده
          </button>

          <!-- In Cart State -->
          <NuxtLink v-else-if="isInCart"
                    :to="'/cart'"
                    @click.stop
                    class="bg-green-500 text-white text-xs font-bold py-2 px-3 rounded hover:bg-green-600 transition">
            مشاهده سبد
          </NuxtLink>

          <!-- Add to Cart State -->
          <button v-else
                  @click.prevent="addToCartHandler"
                  :disabled="isAddingToCart"
                  class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                  :class="{ 'bg-blue-400 cursor-wait': isAddingToCart }">
            <svg v-if="!isAddingToCart" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <!-- A simple spinner for loading state -->
            <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '~/stores/cart';

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();
const isAddingToCart = ref(false);

const isInCart = computed(() => {
  return cartStore.items.some(item => item.product.id === props.book.id);
});

const addToCartHandler = async () => {
  if (props.book.is_purchased || isInCart.value || isAddingToCart.value) return;

  isAddingToCart.value = true;
  try {
    await cartStore.addToCart({
      product_id: props.book.id,
      product_type: 'book',
      price: props.book.sale_price || props.book.price
    });
  } catch (error) {
    console.error('Error adding to cart from BookCard:', error);
  } finally {
    isAddingToCart.value = false;
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};
</script>
