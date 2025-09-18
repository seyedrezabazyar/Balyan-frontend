<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="close">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
      <div class="p-6 border-b">
        <h2 class="text-xl font-bold text-gray-800">
          افزودن زیرمجموعه به: <span class="text-indigo-600">{{ masterBook.title }}</span>
        </h2>
      </div>

      <div class="p-6 flex-grow overflow-y-auto">
        <!-- Search Input -->
        <div class="mb-4">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="کتاب مورد نظر برای افزودن را جستجو کنید..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            @input="debouncedSearch"
          />
        </div>

        <!-- Loading & Results -->
        <div v-if="searchLoading" class="text-center text-gray-500">
          در حال جستجو...
        </div>
        <ul v-else-if="searchResults.length > 0" class="space-y-2">
          <li v-for="book in searchResults" :key="book.id" class="p-3 border rounded-md flex items-center">
            <input
              type="checkbox"
              :id="`book-${book.id}`"
              :value="book.id"
              v-model="selectedBookIds"
              class="ml-3 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label :for="`book-${book.id}`" class="flex-grow cursor-pointer">
              <span class="font-medium">{{ book.title }}</span>
              <span class="text-sm text-gray-500 block">{{ book.authors?.map(a => a.name).join(', ') }}</span>
            </label>
          </li>
        </ul>
        <div v-else-if="searchQuery && !searchLoading" class="text-center text-gray-500">
          هیچ نتیجه‌ای یافت نشد.
        </div>
      </div>

      <div class="p-6 border-t bg-gray-50 flex justify-end gap-4">
        <button @click="close" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          انصراف
        </button>
        <button
          @click="confirm"
          :disabled="selectedBookIds.length === 0 || confirmLoading"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300"
        >
          <span v-if="confirmLoading">در حال ادغام...</span>
          <span v-else>ادغام {{ selectedBookIds.length }} کتاب</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useApiAuth } from '~/composables/useApiAuth';

const props = defineProps({
  isOpen: Boolean,
  masterBook: {
    type: Object,
    required: true,
  },
  confirmLoading: Boolean,
});

const emit = defineEmits(['close', 'confirm-merge']);

const api = useApiAuth();
const searchQuery = ref('');
const searchResults = ref([]);
const selectedBookIds = ref([]);
const searchLoading = ref(false);
let debounceTimer = null;

const searchBooks = async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }
  searchLoading.value = true;
  try {
    const response = await api.get(`/admin/books?search=${searchQuery.value}`);
    // Filter out the master book itself and any books that are already variants or masters
    searchResults.value = response.data.data.filter(book =>
      book.id !== props.masterBook.id && !book.master_book_id && !book.is_master
    );
  } catch (error) {
    console.error('Failed to search books:', error);
    searchResults.value = [];
  } finally {
    searchLoading.value = false;
  }
};

const debouncedSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchBooks();
  }, 500); // 500ms delay
};

const close = () => {
  emit('close');
};

const confirm = () => {
  emit('confirm-merge', {
    masterId: props.masterBook.id,
    slaveIds: selectedBookIds.value,
  });
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Reset state when modal opens
    searchQuery.value = '';
    searchResults.value = [];
    selectedBookIds.value = [];
  }
});
</script>
