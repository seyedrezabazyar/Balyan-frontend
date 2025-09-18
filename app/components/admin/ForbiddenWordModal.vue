<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="close">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg">
      <div class="p-6 border-b">
        <h2 class="text-xl font-bold text-gray-800">{{ isEditMode ? 'ویرایش کلمه' : 'افزودن کلمه جدید' }}</h2>
      </div>

      <div class="p-6">
        <div class="mb-4">
          <label for="word" class="block text-sm font-medium text-gray-700 mb-1">کلمه</label>
          <input type="text" id="word" v-model="form.word" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div class="mb-4">
          <label for="severity" class="block text-sm font-medium text-gray-700 mb-1">شدت</label>
          <select id="severity" v-model="form.severity" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="low">کم</option>
            <option value="medium">متوسط</option>
            <option value="high">زیاد</option>
          </select>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input type="checkbox" id="is_regex" v-model="form.is_regex" class="h-4 w-4" />
            <label for="is_regex" class="ml-2 text-sm text-gray-700">عبارت باقاعده (Regex)</label>
          </div>
          <div class="flex items-center">
            <input type="checkbox" id="is_active" v-model="form.is_active" class="h-4 w-4" />
            <label for="is_active" class="ml-2 text-sm text-gray-700">فعال</label>
          </div>
        </div>
         <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
      </div>

      <div class="p-6 border-t bg-gray-50 flex justify-end gap-4">
        <button @click="close" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">انصراف</button>
        <button @click="submit" :disabled="loading" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300">
          <span v-if="loading">در حال ذخیره...</span>
          <span v-else>ذخیره</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  wordData: {
    type: Object,
    default: null,
  },
  loading: Boolean,
  error: String,
});

const emit = defineEmits(['close', 'submit']);

const form = ref({
  word: '',
  severity: 'medium',
  is_regex: false,
  is_active: true,
});

const isEditMode = computed(() => !!props.wordData);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.wordData) {
      // Edit mode
      form.value = { ...props.wordData };
    } else {
      // Add mode - reset form
      form.value = {
        word: '',
        severity: 'medium',
        is_regex: false,
        is_active: true,
      };
    }
  }
});

const close = () => {
  emit('close');
};

const submit = () => {
  emit('submit', form.value);
};
</script>
