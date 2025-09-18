<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="close">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
      <div class="p-6 border-b">
        <h2 class="text-xl font-bold text-gray-800">ایجاد ادغام جدید</h2>
      </div>

      <div class="p-6 flex-grow overflow-y-auto">
        <!-- Step 1: Select Master -->
        <div v-if="step === 1">
          <h3 class="font-semibold text-lg mb-4">مرحله ۱: انتخاب کتاب اصلی (Master)</h3>
          <input
            type="text"
            v-model="masterSearchQuery"
            placeholder="کتاب اصلی را جستجو کنید..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4"
            @input="debouncedMasterSearch"
          />
          <div v-if="masterSearchLoading" class="text-center">در حال جستجو...</div>
          <ul v-else class="space-y-2 max-h-60 overflow-y-auto">
            <li
              v-for="book in masterSearchResults"
              :key="book.id"
              @click="selectMaster(book)"
              class="p-3 border rounded-md cursor-pointer hover:bg-indigo-50"
            >
              {{ book.title }} - <span class="text-sm text-gray-500">{{ book.authors?.map(a => a.name).join(', ') }}</span>
            </li>
          </ul>
        </div>

        <!-- Step 2: Select Variants -->
        <div v-if="step === 2">
          <div class="mb-4 p-3 bg-indigo-50 rounded-md">
            <p><strong>کتاب اصلی انتخاب شده:</strong> {{ selectedMaster.title }}</p>
            <button @click="resetStep" class="text-sm text-indigo-600 hover:underline">تغییر کتاب اصلی</button>
          </div>
          <h3 class="font-semibold text-lg mb-4">مرحله ۲: انتخاب کتاب‌های زیرمجموعه (Variants)</h3>
          <input
            type="text"
            v-model="variantSearchQuery"
            placeholder="کتاب‌های زیرمجموعه را جستجو کنید..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4"
            @input="debouncedVariantSearch"
          />
          <div v-if="variantSearchLoading" class="text-center">در حال جستجو...</div>
          <ul v-else class="space-y-2 max-h-60 overflow-y-auto">
            <li v-for="book in variantSearchResults" :key="book.id" class="p-3 border rounded-md flex items-center">
              <input
                type="checkbox"
                :id="`variant-${book.id}`"
                :value="book.id"
                v-model="selectedVariantIds"
                class="ml-3 h-4 w-4"
              />
              <label :for="`variant-${book.id}`" class="flex-grow">{{ book.title }}</label>
            </li>
          </ul>
        </div>
      </div>

      <div class="p-6 border-t bg-gray-50 flex justify-end gap-4">
        <button @click="close" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">انصراف</button>
        <button
          @click="confirm"
          :disabled="!selectedMaster || selectedVariantIds.length === 0 || confirmLoading"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300"
        >
          <span v-if="confirmLoading">در حال ایجاد ادغام...</span>
          <span v-else>ایجاد ادغام</span>
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
  confirmLoading: Boolean,
});

const emit = defineEmits(['close', 'confirm-create-merge']);

const api = useApiAuth();
const step = ref(1);

// Master search state
const masterSearchQuery = ref('');
const masterSearchResults = ref([]);
const masterSearchLoading = ref(false);
const selectedMaster = ref(null);
let masterDebounceTimer = null;

// Variant search state
const variantSearchQuery = ref('');
const variantSearchResults = ref([]);
const variantSearchLoading = ref(false);
const selectedVariantIds = ref([]);
let variantDebounceTimer = null;

const search = async (query, resultsRef, loadingRef, filterFn = () => true) => {
  if (!query || query.length < 2) {
    resultsRef.value = [];
    return;
  }
  loadingRef.value = true;
  try {
    const response = await api.get(`/admin/books?search=${query}`);
    resultsRef.value = response.data.data.filter(book => !book.master_book_id && !book.is_master).filter(filterFn);
  } catch (error) {
    console.error('Failed to search books:', error);
    resultsRef.value = [];
  } finally {
    loadingRef.value = false;
  }
};

const debouncedMasterSearch = () => {
  clearTimeout(masterDebounceTimer);
  masterDebounceTimer = setTimeout(() => search(masterSearchQuery.value, masterSearchResults, masterSearchLoading), 500);
};

const debouncedVariantSearch = () => {
  clearTimeout(variantDebounceTimer);
  variantDebounceTimer = setTimeout(() => {
    const filterFn = book => book.id !== selectedMaster.value.id;
    search(variantSearchQuery.value, variantSearchResults, variantSearchLoading, filterFn);
  }, 500);
};

const selectMaster = (book) => {
  selectedMaster.value = book;
  step.value = 2;
};

const resetStep = () => {
  step.value = 1;
  selectedMaster.value = null;
  selectedVariantIds.value = [];
  variantSearchQuery.value = '';
  variantSearchResults.value = [];
};

const close = () => {
  emit('close');
};

const confirm = () => {
  emit('confirm-create-merge', {
    masterId: selectedMaster.value.id,
    slaveIds: selectedVariantIds.value,
  });
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Reset state when modal opens
    step.value = 1;
    masterSearchQuery.value = '';
    masterSearchResults.value = [];
    selectedMaster.value = null;
    variantSearchQuery.value = '';
    variantSearchResults.value = [];
    selectedVariantIds.value = [];
  }
});
</script>
