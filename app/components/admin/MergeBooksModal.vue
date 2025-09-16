<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4" @click.stop>
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4 text-gray-800">ادغام کتاب‌ها</h2>
        <p class="text-sm text-gray-600 mb-6">
          یک کتاب را به عنوان کتاب "اصلی" (Master) انتخاب کنید. تمام اطلاعات و روابط کتاب‌های دیگر (Slave) به این کتاب منتقل شده و سپس حذف خواهند شد.
        </p>

        <div v-if="isLoading" class="text-center py-8">
          <p class="text-gray-700">در حال ادغام...</p>
        </div>

        <div v-if="error" class="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
          {{ error }}
        </div>

        <form @submit.prevent="handleConfirm">
          <div class="space-y-4 max-h-80 overflow-y-auto pr-2">
            <div v-for="book in selectedBookDetails" :key="book.id" class="p-4 border rounded-md" :class="{'bg-blue-50 border-blue-300': masterId === book.id}">
              <label class="flex items-center cursor-pointer">
                <input type="radio" name="master_book" :value="book.id" v-model="masterId" class="ml-3">
                <div>
                  <p class="font-semibold text-gray-900">{{ book.title }}</p>
                  <p class="text-xs text-gray-500">شناسه: {{ book.id }}</p>
                </div>
              </label>
            </div>
          </div>

          <div class="mt-8 flex justify-end space-x-3 space-x-reverse">
            <button type="button" @click="$emit('close')" :disabled="isLoading" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50">
              انصراف
            </button>
            <button type="submit" :disabled="!masterId || isLoading" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              <span v-if="isLoading">در حال پردازش...</span>
              <span v-else>تایید و ادغام</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  selectedBookDetails: {
    type: Array,
    default: () => []
  },
  isLoading: Boolean,
  error: String
});

const emit = defineEmits(['close', 'confirm-merge']);

const masterId = ref(null);

watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    masterId.value = null; // Reset masterId when modal closes
  }
});

const handleConfirm = () => {
  if (masterId.value) {
    const slaveIds = props.selectedBookDetails
      .map(b => b.id)
      .filter(id => id !== masterId.value);

    emit('confirm-merge', {
      master_id: masterId.value,
      slave_ids: slaveIds,
    });
  }
};
</script>
