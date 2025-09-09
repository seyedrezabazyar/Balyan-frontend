<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" @click.self="close">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg leading-6 font-medium text-gray-900 text-center">
          مدیریت نقش‌های کاربر: <span class="font-bold">{{ user?.name }}</span>
        </h3>
        <div class="mt-4 px-7 py-3">
          <form @submit.prevent="submitForm" class="text-right">
            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-800 mb-2">نقش‌های موجود</h4>
              <p class="text-sm text-gray-500 mb-3">نقش‌های مورد نظر برای این کاربر را انتخاب کنید.</p>
              <div class="grid grid-cols-2 gap-3">
                <div v-for="role in allRoles" :key="role.id">
                  <label class="inline-flex items-center">
                    <input type="checkbox" class="form-checkbox h-5 w-5 text-indigo-600" :value="role.id" v-model="selectedRoleIds">
                    <span class="mr-2 text-gray-700">{{ role.display_name }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="items-center px-4 py-3 text-center">
              <button type="submit" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">
                ذخیره تغییرات
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

// Assuming User and Role types are defined elsewhere and imported
// For now, let's define them locally for clarity.
interface User {
  id: number;
  name: string;
  roles?: Role[];
}
interface Role {
  id: number;
  name: string;
  display_name: string;
}

const props = defineProps<{
  show: boolean;
  user: User | null;
  allRoles: Role[];
}>();

const emit = defineEmits(['close', 'save']);

const selectedRoleIds = ref<number[]>([]);

// Watch for changes in the user prop to initialize the selected roles
watch(() => props.user, (currentUser) => {
  if (currentUser && currentUser.roles) {
    selectedRoleIds.value = currentUser.roles.map(role => role.id);
  } else {
    selectedRoleIds.value = [];
  }
}, { immediate: true, deep: true });

function close() {
  emit('close');
}

function submitForm() {
  // Emit the array of selected role IDs to the parent component
  emit('save', selectedRoleIds.value);
}
</script>

<style scoped>
.form-checkbox {
  border-radius: 0.25rem;
}
</style>
