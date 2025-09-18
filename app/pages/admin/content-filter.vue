<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">مدیریت فیلتر محتوا</h1>
      <button @click="openAddModal" class="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700">
        افزودن کلمه جدید
      </button>
    </div>

    <!-- Success & Error Messages -->
    <div v-if="successMessage" class="bg-green-100 border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
      {{ successMessage }}
    </div>
    <div v-if="error" class="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      {{ error }}
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <!-- Filter and Search -->
      <div class="p-4 bg-gray-50 border-b border-gray-200">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="جستجو در کلمات..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          @keyup.enter="applyFilters"
        />
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="p-4 text-center">در حال بارگذاری...</div>

      <!-- Forbidden Words Table -->
      <table v-else-if="words.length > 0" class="min-w-full leading-normal">
        <thead>
          <tr>
            <th class="px-5 py-3 border-b-2 text-right text-xs font-semibold uppercase">کلمه</th>
            <th class="px-5 py-3 border-b-2 text-center text-xs font-semibold uppercase">شدت</th>
            <th class="px-5 py-3 border-b-2 text-center text-xs font-semibold uppercase">Regex</th>
            <th class="px-5 py-3 border-b-2 text-center text-xs font-semibold uppercase">وضعیت</th>
            <th class="px-5 py-3 border-b-2 text-center text-xs font-semibold uppercase">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="word in words" :key="word.id">
            <td class="px-5 py-5 border-b text-sm">{{ word.word }}</td>
            <td class="px-5 py-5 border-b text-sm text-center">{{ word.severity }}</td>
            <td class="px-5 py-5 border-b text-sm text-center">{{ word.is_regex ? '✓' : '✗' }}</td>
            <td class="px-5 py-5 border-b text-sm text-center">
              <span :class="word.is_active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'" class="px-2 py-1 rounded-full text-xs">
                {{ word.is_active ? 'فعال' : 'غیرفعال' }}
              </span>
            </td>
            <td class="px-5 py-5 border-b text-sm text-center">
              <button @click="openEditModal(word)" class="text-indigo-600 hover:text-indigo-900">ویرایش</button>
              <button @click="deleteWord(word)" class="text-red-600 hover:text-red-900 ml-4">حذف</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="p-6 text-center text-gray-500">هیچ کلمه‌ای یافت نشد.</div>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="p-4 bg-gray-50 border-t flex justify-center items-center gap-2">
         <button @click="fetchWords(pagination.current_page - 1)" :disabled="pagination.current_page === 1" class="px-3 py-1 bg-white border rounded">قبلی</button>
         <span>صفحه {{ pagination.current_page }} از {{ pagination.last_page }}</span>
         <button @click="fetchWords(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page" class="px-3 py-1 bg-white border rounded">بعدی</button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <ForbiddenWordModal
      :isOpen="isModalOpen"
      :wordData="editingWord"
      :loading="modalLoading"
      :error="modalError"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useApiAuth } from '~/composables/useApiAuth';
import ForbiddenWordModal from '~/components/admin/ForbiddenWordModal.vue';

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
});

const api = useApiAuth();
const words = ref([]);
const loading = ref(true);
const error = ref(null);
const successMessage = ref('');
const searchQuery = ref('');
const pagination = ref({});

// Modal state
const isModalOpen = ref(false);
const editingWord = ref(null);
const modalLoading = ref(false);
const modalError = ref('');

const fetchWords = async (page = 1) => {
  loading.value = true;
  error.value = null;
  try {
    const params = new URLSearchParams({ page });
    if (searchQuery.value) params.append('search', searchQuery.value);

    const response = await api.get(`/admin/content-filter/forbidden-words?${params.toString()}`);
    words.value = response.data.data;
    pagination.value = response.data;
  } catch (err) {
    error.value = 'خطا در دریافت لیست کلمات.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  fetchWords(1);
};

const deleteWord = async (word) => {
  if (!confirm(`آیا از حذف کلمه "${word.word}" اطمینان دارید؟`)) return;

  try {
    await api.delete(`/admin/content-filter/forbidden-words/${word.id}`);
    successMessage.value = 'کلمه با موفقیت حذف شد.';
    fetchWords(pagination.value.current_page);
  } catch (err) {
    error.value = 'خطا در حذف کلمه.';
    console.error(err);
  }
};

const openAddModal = () => {
  editingWord.value = null;
  isModalOpen.value = true;
};

const openEditModal = (word) => {
  editingWord.value = { ...word };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingWord.value = null;
  modalError.value = '';
};

const handleSubmit = async (formData) => {
  modalLoading.value = true;
  modalError.value = '';
  successMessage.value = '';

  try {
    if (editingWord.value) {
      // Update
      await api.put(`/admin/content-filter/forbidden-words/${editingWord.value.id}`, formData);
      successMessage.value = 'کلمه با موفقیت ویرایش شد.';
    } else {
      // Create
      await api.post('/admin/content-filter/forbidden-words', formData);
      successMessage.value = 'کلمه با موفقیت افزوده شد.';
    }
    closeModal();
    fetchWords(pagination.value.current_page);
  } catch (err) {
    modalError.value = err.data?.message || 'یک خطای غیرمنتظره رخ داد.';
    console.error(err);
  } finally {
    modalLoading.value = false;
  }
};

onMounted(fetchWords);
</script>
