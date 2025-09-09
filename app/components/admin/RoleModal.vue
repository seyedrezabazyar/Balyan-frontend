<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" @click.self="close">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">{{ isEditMode ? 'ویرایش نقش' : 'ایجاد نقش جدید' }}</h3>
        <div class="mt-2 px-7 py-3">
          <form @submit.prevent="submitForm" class="text-right">
            <div class="mb-4">
              <label for="display_name" class="block text-sm font-medium text-gray-700">نام نمایشی</label>
              <input type="text" v-model="formData.display_name" id="display_name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
            </div>
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-gray-700">نام سیستمی (انگلیسی، بدون فاصله)</label>
              <input type="text" v-model="formData.name" id="name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" :disabled="isEditMode" required>
            </div>
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700">توضیحات</label>
              <textarea v-model="formData.description" id="description" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>

            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-800 mb-2">دسترسی‌ها</h4>
              <div v-for="(group, groupName) in allPermissions" :key="groupName" class="mb-3">
                <h5 class="font-bold text-gray-700">{{ groupName }}</h5>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  <div v-for="permission in group" :key="permission.id">
                    <label class="inline-flex items-center">
                      <input type="checkbox" class="form-checkbox h-5 w-5 text-indigo-600" :value="permission.id" v-model="formData.permission_ids">
                      <span class="mr-2 text-gray-700">{{ permission.display_name }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="items-center px-4 py-3">
              <button type="submit" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">
                ذخیره
              </button>
              <button type="button" @click="close" class="ml-2 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300">
                انصراف
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import type { Role, Permission, CreateRolePayload } from '~/composables/useAuthApi';

const props = defineProps<{
  show: boolean;
  role: Role | null;
  allPermissions: Record<string, Permission[]>;
}>();

const emit = defineEmits(['close', 'save']);

const isEditMode = ref(false);

const initialFormData: CreateRolePayload & { permission_ids: number[] } = {
  name: '',
  display_name: '',
  description: '',
  permission_ids: [],
};
const formData = ref({ ...initialFormData });

watch(() => props.role, (newRole) => {
  if (newRole) {
    isEditMode.value = true;
    formData.value = {
      name: newRole.name,
      display_name: newRole.display_name,
      description: newRole.description || '',
      permission_ids: newRole.permissions?.map(p => p.id) || [],
    };
  } else {
    isEditMode.value = false;
    formData.value = { ...initialFormData };
  }
}, { immediate: true });


function close() {
  emit('close');
}

function submitForm() {
  emit('save', formData.value);
}
</script>

<style scoped>
.form-checkbox {
  border-radius: 0.25rem;
}
</style>
