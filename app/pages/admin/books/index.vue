<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
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
      <!-- Filter and Search Controls -->
      <div class="p-4 bg-gray-50 border-b border-gray-200">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-grow">
            <label for="search" class="sr-only">جستجو</label>
            <input
              type="text"
              id="search"
              v-model="searchQuery"
              placeholder="جستجو در عنوان، شابک، نویسندگان..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              @keyup.enter="applyFilters"
            />
          </div>
          <div>
            <label for="status" class="sr-only">وضعیت</label>
            <select
              id="status"
              v-model="statusFilter"
              class="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="published">منتشر شده</option>
              <option value="draft">پیش‌نویس</option>
              <option value="archived">بایگانی شده</option>
            </select>
          </div>
          <div>
            <button
              @click="applyFilters"
              class="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors"
            >
              اعمال فیلتر
            </button>
            <button
              @click="clearFilters"
              class="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              پاک کردن
            </button>
          </div>
        </div>
      </div>

      <!-- <div class="p-4 flex justify-between items-center">
        <button
          @click="openMergeModal"
          :disabled="!canMerge"
          class="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
          ادغام انتخاب شده ها ({{ selectedBooks.length }})
        </button>
      </div> -->
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
                {{ book.authors?.map(a => a.name).join(', ') }}
              </p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
              <div class="flex flex-col items-center justify-center gap-1">
                <div class="flex items-center gap-2">
                  <span v-if="book.is_master" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Master</span>
                  <span v-else-if="book.master_book_id" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Variant (Master: {{ book.master_book_id }})</span>
                  <!-- Lock Icon for Manual Override -->
                  <span v-if="book.override"
                    class="inline-flex items-center text-gray-500"
                    title="وضعیت این کتاب توسط مدیر تثبیت شده و تحت تاثیر فیلتر خودکار قرار نمی‌گیرد.">
                    <span>🔒</span>
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span v-if="book.hidden_level > 0" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">مخفی (سطح: {{ book.hidden_level }})</span>
                  <span v-if="book.content_filter_status === 'auto_blocked'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-200 text-purple-800">بلاک خودکار</span>
                </div>
              </div>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <div class="flex items-center justify-center gap-2 flex-wrap">
                <button @click="editBook(book.id)" class="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                  ویرایش
                </button>
                <button @click="deleteBook(book.id)" class="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition">
                  حذف
                </button>
                <button @click="toggleVisibility(book)" class="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition">
                  {{ book.hidden_level > 0 ? 'نمایش' : 'مخفی' }}
                </button>
                <button v-if="book.hidden_level > 0" @click="setHiddenLevel(book)" class="px-3 py-1 text-sm font-medium text-white bg-teal-500 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition">
                  تغییر سطح
                </button>
                <button v-if="!book.is_master && book.master_book_id" @click="unmergeBook(book)" class="px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition">
                  لغو ادغام
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- <MergeBooksModal
      :isOpen="isModalOpen"
      :selectedBookDetails="selectedBookDetails"
      :isLoading="mergeLoading"
      :error="mergeError"
      @close="closeMergeModal"
      @confirm-merge="handleMerge"
    /> -->

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
// import MergeBooksModal from '~/components/admin/MergeBooksModal.vue';

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
});

const api = useApiAuth();
const router = useRouter();
const books = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedBooks = ref([]);
const searchQuery = ref('');
const statusFilter = ref('');
const pagination = ref({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  perPage: 20,
});

// Modal state
// const isModalOpen = ref(false);
// const mergeLoading = ref(false);
// const mergeError = ref(null);
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

// const selectedBookDetails = computed(() => {
//   return selectedBooks.value.map(id => books.value.find(b => b.id === id)).filter(Boolean);
// });

// const openMergeModal = () => {
//   mergeError.value = null;
//   successMessage.value = '';
//   isModalOpen.value = true;
// };

// const closeMergeModal = () => {
//   isModalOpen.value = false;
// };

// const handleMerge = async ({ master_id, slave_ids }) => {
//   mergeLoading.value = true;
//   mergeError.value = null;
//   try {
//     await api.post('/admin/merge', {
//       master_id,
//       slave_ids,
//       type: 'book'
//     });
//     successMessage.value = 'کتاب‌ها با موفقیت ادغام شدند.';
//     closeMergeModal();
//     await fetchBooks(); // Refresh the list
//   } catch (err) {
//     console.error("Merge failed:", err);
//     mergeError.value = err.data?.message || 'یک خطای غیرمنتظره رخ داد.';
//   } finally {
//     mergeLoading.value = false;
//   }
// };

const fetchBooks = async (page = 1) => {
  loading.value = true;
  error.value = null;
  selectedBooks.value = []; // Reset selection on fetch
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (searchQuery.value) {
      params.append('search', searchQuery.value);
    }
    if (statusFilter.value) {
      params.append('status', statusFilter.value);
    }

    const response = await api.get(`/admin/books?${params.toString()}`);
    // The pagination object is at response.data
    const paginationData = response.data;

    const fetchedBooks = paginationData.data || [];
    books.value = fetchedBooks;

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

const applyFilters = () => {
  fetchBooks(1);
};

const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = '';
  fetchBooks(1);
};

onMounted(() => fetchBooks(1));

// --- Action Implementations ---

const editBook = (id) => {
  router.push(`/admin/books/${id}/edit`);
};

// TODO: Implement the following functions once the backend APIs are available.
const deleteBook = async (id) => {
  if (confirm(`آیا از حذف کتاب با شناسه ${id} اطمینان دارید؟`)) {
    try {
      await api.delete(`/admin/books/${id}`);
      successMessage.value = 'کتاب با موفقیت حذف شد.';
      await fetchBooks(); // Refresh list
    } catch (err) {
      console.error(`Failed to delete book ${id}:`, err);
      error.value = err.data?.message || 'حذف کتاب با خطا مواجه شد.';
    }
  }
};

const toggleVisibility = async (book) => {
  const actionText = book.hidden_level > 0 ? 'نمایش دادن' : 'مخفی کردن';
  if (confirm(`آیا از ${actionText} کتاب "${book.title}" اطمینان دارید؟`)) {
    try {
      // Call the API with NO request body, as per backend developer instructions
      await api.post(`/admin/books/${book.id}/toggle-visibility`);
      successMessage.value = 'وضعیت نمایش کتاب با موفقیت تغییر کرد.';

      // Refresh the list to get the new state from the server
      await fetchBooks();
    } catch (err) {
      console.error(`Failed to toggle visibility for book ${book.id}:`, err);
      error.value = err.data?.message || 'تغییر وضعیت نمایش با خطا مواجه شد.';
    }
  }
};

const setBookHiddenLevel = async (book, level) => {
  try {
    // Correct endpoint for setting a specific level
    await api.post(`/admin/books/${book.id}/update-hidden-level`, { level });
    successMessage.value = 'وضعیت نمایش کتاب تغییر کرد.';

    await fetchBooks(); // Refresh list
  } catch (err) {
    console.error(`Failed to set hidden level for book ${book.id}:`, err);
    const errorMessage = err.data?.message || 'تغییر وضعیت نمایش با خطا مواجه شد.';
    error.value = errorMessage;
    // Keep the error message on screen for a few seconds
    setTimeout(() => {
      if (error.value === errorMessage) {
        error.value = null;
      }
    }, 5000);
  }
}

const setHiddenLevel = async (book) => {
  const newLevelStr = prompt(`سطح مخفی جدید را برای کتاب "${book.title}" وارد کنید. سطح فعلی ${book.hidden_level} است.`, book.hidden_level);
  if (newLevelStr !== null) {
    const newLevel = parseInt(newLevelStr, 10);
    if (!isNaN(newLevel) && newLevel >= 0) {
      await setBookHiddenLevel(book, newLevel);
    } else {
      alert('لطفاً یک عدد معتبر وارد کنید.');
    }
  }
};

const unmergeBook = async (book) => {
  if (confirm(`آیا از لغو ادغام کتاب "${book.title}" از کتاب اصلی اطمینان دارید؟`)) {
    try {
      await api.post(`/admin/books/${book.master_book_id}/unmerge`, {
        variant_ids: [book.id]
      });
      successMessage.value = 'ادغام کتاب با موفقیت لغو شد.';
      await fetchBooks(); // Refresh list
    } catch (err)      {
      console.error(`Failed to unmerge book ${book.id}:`, err);
      error.value = err.data?.message || 'لغو ادغام کتاب با خطا مواجه شد.';
    }
  }
};
</script>
