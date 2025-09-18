<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">مدیریت ادغام کتاب‌ها</h1>

    <!-- Success & Error Messages -->
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
      {{ successMessage }}
    </div>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      {{ error }}
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <!-- Filter and Search -->
      <div class="p-4 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center gap-4">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="جستجو در کتاب‌های اصلی..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            @keyup.enter="applyFilters"
          />
          <button @click="applyFilters" class="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">
            جستجو
          </button>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="p-4">
        <div v-for="n in 3" :key="n" class="animate-pulse flex space-x-4 border-b py-4">
          <div class="rounded-full bg-gray-300 h-12 w-12"></div>
          <div class="flex-1 space-y-4 py-1">
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-300 rounded"></div>
              <div class="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Master Books List -->
      <div v-else-if="masterBooks.length > 0">
        <div v-for="master in masterBooks" :key="master.id" class="border-b last:border-b-0">
          <!-- Master Book Row -->
          <div class="flex items-center p-4 cursor-pointer hover:bg-gray-50" @click="toggleExpand(master.id)">
            <div class="flex-shrink-0">
              <img class="h-12 w-12 rounded-full object-cover" :src="master.image?.url || '/placeholder.png'" :alt="master.title">
            </div>
            <div class="flex-grow mx-4">
              <div class="font-bold text-gray-900">{{ master.title }}</div>
              <div class="text-sm text-gray-500">{{ master.authors?.map(a => a.name).join(', ') }}</div>
            </div>
            <div class="flex items-center">
              <span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                {{ master.variants.length }} Variants
              </span>
              <button @click.stop="openMergeModal(master)" class="ml-4 px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600">
                افزودن زیرمجموعه
              </button>
              <svg class="w-6 h-6 text-gray-500 transition-transform ml-2" :class="{'rotate-180': expandedMasters.includes(master.id)}">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <!-- Variants List (Collapsible) -->
          <div v-if="expandedMasters.includes(master.id)" class="bg-gray-50 p-4 pl-16">
            <h4 class="font-semibold mb-2 text-gray-700">کتاب‌های زیرمجموعه:</h4>
            <ul v-if="master.variants.length > 0" class="divide-y divide-gray-200">
              <li v-for="variant in master.variants" :key="variant.id" class="py-3 flex items-center justify-between">
                <div class="flex items-center">
                  <img class="h-10 w-10 rounded-full object-cover" :src="variant.image?.url || '/placeholder.png'" :alt="variant.title">
                  <div class="mx-4">
                    <div class="font-medium text-gray-800">{{ variant.title }}</div>
                    <div class="text-sm text-gray-500">ID: {{ variant.id }}</div>
                  </div>
                </div>
                <button @click.stop="unmergeVariant(master, variant)" class="px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition">
                  لغو ادغام
                </button>
              </li>
            </ul>
            <p v-else class="text-sm text-gray-500">هیچ کتاب زیرمجموعه‌ای برای این مورد وجود ندارد.</p>
          </div>
        </div>
      </div>
      <div v-else class="p-6 text-center text-gray-500">
        هیچ کتاب ادغام شده‌ای یافت نشد.
      </div>

      <!-- Pagination -->
      <div v-if="pagination.lastPage > 1" class="p-4 bg-gray-50 border-t">
        <div class="flex justify-center items-center gap-2">
          <button @click="fetchMasters(pagination.currentPage - 1)" :disabled="pagination.currentPage === 1" class="px-3 py-1 bg-white border rounded disabled:opacity-50">
            قبلی
          </button>
          <span>صفحه {{ pagination.currentPage }} از {{ pagination.lastPage }}</span>
          <button @click="fetchMasters(pagination.currentPage + 1)" :disabled="pagination.currentPage === pagination.lastPage" class="px-3 py-1 bg-white border rounded disabled:opacity-50">
            بعدی
          </button>
        </div>
      </div>
    </div>

    <!-- Merge Modal -->
    <MergeModal
      v-if="currentMasterBook"
      :isOpen="isMergeModalOpen"
      :masterBook="currentMasterBook"
      :confirmLoading="mergeConfirmLoading"
      @close="closeMergeModal"
      @confirm-merge="handleConfirmMerge"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useApiAuth } from '~/composables/useApiAuth';
import MergeModal from '~/components/admin/MergeModal.vue';

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
});

const api = useApiAuth();
const masterBooks = ref([]);
const loading = ref(true);
const error = ref(null);
const successMessage = ref('');
const searchQuery = ref('');

const pagination = ref({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  perPage: 20,
});

const expandedMasters = ref([]);

// Modal State
const isMergeModalOpen = ref(false);
const currentMasterBook = ref(null);
const mergeConfirmLoading = ref(false);

const fetchMasters = async (page = 1) => {
  loading.value = true;
  error.value = null;
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('per_page', pagination.value.perPage.toString());
    if (searchQuery.value) {
      params.append('search', searchQuery.value);
    }

    const response = await api.get(`/admin/books/masters?${params.toString()}`);
    const responseData = response.data;

    masterBooks.value = responseData.data || [];
    pagination.value = {
      currentPage: responseData.current_page,
      lastPage: responseData.last_page,
      total: responseData.total,
      perPage: responseData.per_page,
    };
  } catch (err) {
    console.error("Failed to fetch master books:", err);
    error.value = 'دریافت لیست کتاب‌های ادغام شده با خطا مواجه شد.';
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  fetchMasters(1);
};

const toggleExpand = (masterId) => {
  const index = expandedMasters.value.indexOf(masterId);
  if (index > -1) {
    expandedMasters.value.splice(index, 1);
  } else {
    expandedMasters.value.push(masterId);
  }
};

const unmergeVariant = async (master, variant) => {
  if (!confirm(`آیا از لغو ادغام کتاب "${variant.title}" از کتاب اصلی "${master.title}" اطمینان دارید؟`)) {
    return;
  }

  error.value = null;
  successMessage.value = '';

  try {
    await api.post(`/admin/books/${master.id}/unmerge`, {
      variant_ids: [variant.id]
    });
    successMessage.value = 'کتاب با موفقیت از حالت ادغام خارج شد.';
    await fetchMasters(pagination.value.currentPage);
  } catch (err) {
    console.error("Failed to unmerge variant:", err);
    error.value = err.data?.message || 'لغو ادغام با خطا مواجه شد.';
  }
};

const openMergeModal = (master) => {
  currentMasterBook.value = master;
  isMergeModalOpen.value = true;
};

const closeMergeModal = () => {
  isMergeModalOpen.value = false;
  currentMasterBook.value = null;
};

const handleConfirmMerge = async ({ masterId, slaveIds }) => {
  mergeConfirmLoading.value = true;
  error.value = null;
  successMessage.value = '';

  try {
    await api.post(`/admin/books/${masterId}/merge`, {
      slave_ids: slaveIds
    });
    successMessage.value = `${slaveIds.length} کتاب با موفقیت ادغام شدند.`;
    closeMergeModal();
    await fetchMasters(pagination.value.currentPage);
  } catch (err) {
    console.error("Failed to merge books:", err);
    error.value = err.data?.message || 'ادغام کتاب‌ها با خطا مواجه شد.';
  } finally {
    mergeConfirmLoading.value = false;
  }
};

onMounted(() => {
  fetchMasters();
});
</script>
