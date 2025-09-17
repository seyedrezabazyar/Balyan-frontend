<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <!-- Temporary Debug Block -->
    <div v-if="debugInfo" class="mt-4 p-2 bg-gray-800 text-white rounded-lg font-mono text-left text-xs" dir="ltr">
      <h4 class="font-bold text-lg mb-2">DEBUG INFORMATION</h4>
      <pre class="whitespace-pre-wrap break-all">{{ JSON.stringify(debugInfo, null, 2) }}</pre>
    </div>

    <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">مدیریت کتاب‌ها</h1>

    <!-- Success Message -->
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
      <span class="block sm:inline">{{ successMessage }}</span>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading && books.length === 0">
      <div class="bg-white shadow rounded-lg p-4 animate-pulse" v-for="n in 5" :key="n">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">خطا!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <!-- Books Table -->
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="p-4 flex justify-between items-center">
        <button
          @click="openMergeModal"
          :disabled="!canMerge"
          class="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
          ادغام انتخاب شده ها ({{ selectedBooks.length }})
        </button>
      </div>
      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <input type="checkbox" @change="toggleSelectAll" :checked="allSelected" />
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              شناسه
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              عنوان
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              نویسندگان
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              وضعیت
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              سطح مخفی
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id" class="hover:bg-gray-50">
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
              <input type="checkbox" :value="book.id" v-model="selectedBooks" />
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{{ book.id }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{{ book.title }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ book.authors.map(a => a.name).join(', ') }}
              </p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
              <span v-if="book.is_master" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Master
              </span>
              <span v-else-if="book.master_book_id" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                Variant (Master: {{ book.master_book_id }})
              </span>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
              <input type="number" class="w-16 text-center border rounded bg-gray-100 cursor-not-allowed" v-model="book.hidden_level" disabled title="API for this action is not implemented yet." />
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
              <button @click="editBook(book.id)" class="text-indigo-600 hover:text-indigo-900 mr-2">ویرایش</button>
              <button @click="deleteBook(book.id)" class="text-red-600 hover:text-red-900 mr-2 disabled:text-gray-400 disabled:cursor-not-allowed" disabled title="API for this action is not implemented yet.">حذف</button>
              <button @click="toggleVisibility(book.id)" class="text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed" disabled title="API for this action is not implemented yet.">
                {{ book.status === 'hidden' ? 'نمایش' : 'مخفی' }}
              </button>
              <button v-if="book.master_book_id" @click="unmergeBook(book.id)" class="text-yellow-600 hover:text-yellow-900 ml-2 disabled:text-gray-400 disabled:cursor-not-allowed" disabled title="API for this action is not implemented yet.">
                لغو ادغام
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <MergeBooksModal
      :isOpen="isModalOpen"
      :selectedBookDetails="selectedBookDetails"
      :isLoading="mergeLoading"
      :error="mergeError"
      @close="closeMergeModal"
      @confirm-merge="handleMerge"
    />

    <!-- Pagination -->
    <div v-if="pagination.lastPage > 1" class="mt-6 flex justify-center items-center">
      <button
        @click="fetchBooks(pagination.currentPage - 1)"
        :disabled="pagination.currentPage === 1"
        class="px-4 py-2 mx-1 bg-white border rounded-md disabled:opacity-50"
      >
        قبلی
      </button>
      <span class="text-sm text-gray-700">
        صفحه {{ pagination.currentPage }} از {{ pagination.lastPage }}
      </span>
      <button
        @click="fetchBooks(pagination.currentPage + 1)"
        :disabled="pagination.currentPage === pagination.lastPage"
        class="px-4 py-2 mx-1 bg-white border rounded-md disabled:opacity-50"
      >
        بعدی
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useApiAuth } from '~/composables/useApiAuth';
import MergeBooksModal from '~/components/admin/MergeBooksModal.vue';

definePageMeta({
  middleware: 'admin',
  layout: 'default'
});

const api = useApiAuth();
const router = useRouter();
const books = ref([]);
const loading = ref(true);
const error = ref(null);
const debugInfo = ref(null);
const selectedBooks = ref([]);
const pagination = ref({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  perPage: 20,
});

// Modal state
const isModalOpen = ref(false);
const mergeLoading = ref(false);
const mergeError = ref(null);
const successMessage = ref('');

const canMerge = computed(() => selectedBooks.value.length >= 2);

const allSelected = computed({
  get: () => {
    return books.value.length > 0 && selectedBooks.value.length === books.value.length;
  },
  set: (value) => {
    if (value) {
      selectedBooks.value = books.value.map(book => book.id);
    } else {
      selectedBooks.value = [];
    }
  }
});

const toggleSelectAll = (event) => {
  allSelected.value = event.target.checked;
};

const selectedBookDetails = computed(() => {
  return selectedBooks.value.map(id => books.value.find(b => b.id === id)).filter(Boolean);
});

const openMergeModal = () => {
  mergeError.value = null;
  successMessage.value = '';
  isModalOpen.value = true;
};

const closeMergeModal = () => {
  isModalOpen.value = false;
};

const handleMerge = async ({ master_id, slave_ids }) => {
  mergeLoading.value = true;
  mergeError.value = null;
  try {
    await api.post('/admin/merge', {
      master_id,
      slave_ids,
      type: 'book'
    });
    successMessage.value = 'کتاب‌ها با موفقیت ادغام شدند.';
    closeMergeModal();
    await fetchBooks(); // Refresh the list
  } catch (err) {
    console.error("Merge failed:", err);
    mergeError.value = err.data?.message || 'یک خطای غیرمنتظره رخ داد.';
  } finally {
    mergeLoading.value = false;
  }
};

const fetchBooks = async (page = 1) => {
  loading.value = true;
  error.value = null;
  selectedBooks.value = []; // Reset selection on fetch
  try {
    const response = await api.get(`/admin/books?page=${page}`);
    debugInfo.value = response; // Store raw response for debugging

    // Based on the logs, the response is nested: response.data.data contains the pagination object
    const paginationData = response.data.data;

    const fetchedBooks = paginationData.data || [];
    books.value = fetchedBooks.map(book => ({
      ...book,
      hidden_level: book.hidden_level ?? 1 // Default to 1
    }));

    pagination.value = {
      currentPage: paginationData.current_page,
      lastPage: paginationData.last_page,
      total: paginationData.total,
      perPage: paginationData.per_page,
    };

  } catch (err) {
    console.error("Failed to fetch books:", err);
    error.value = 'دریافت لیست کتاب‌ها با خطا مواجه شد.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchBooks(1));

// --- Action Implementations ---

const editBook = (id) => {
  router.push(`/admin/books/${id}/edit`);
};

// TODO: Implement the following functions once the backend APIs are available.
const deleteBook = async (id) => {
  alert(`(Feature not implemented) Deleting book ${id}`);
};
const toggleVisibility = async (id) => {
  alert(`(Feature not implemented) Toggling visibility for book ${id}`);
};
const unmergeBook = async (id) => {
  alert(`(Feature not implemented) Unmerging book ${id}`);
};
const updateHiddenLevel = async (id, level) => {
  alert(`(Feature not implemented) Updating hidden level for book ${id} to ${level}`);
};
</script>
