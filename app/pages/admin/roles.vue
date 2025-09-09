<template>
  <div class="p-4 md:p-6">
    <h1 class="text-2xl font-bold mb-4">مدیریت نقش‌ها و دسترسی‌ها</h1>

    <!-- Action Buttons -->
    <div class="mb-4">
      <button @click="openCreateModal" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow">
        ایجاد نقش جدید
      </button>
    </div>

    <!-- Loading and Error States -->
    <div v-if="isLoading" class="text-center py-4">
      <p>در حال بارگذاری اطلاعات...</p>
    </div>
    <div v-if="error" class="text-center py-4 text-red-500">
      <p>خطا در دریافت اطلاعات: {{ error.message }}</p>
    </div>

    <!-- Roles Table -->
    <div v-if="!isLoading && !error" class="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              نام نمایشی
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              توضیحات
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="roles.length === 0">
            <td colspan="3" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
              هیچ نقشی یافت نشد.
            </td>
          </tr>
          <tr v-for="role in roles" :key="role.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ role.display_name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ role.description }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openEditModal(role)" class="text-indigo-600 hover:text-indigo-900">ویرایش</button>
              <button @click="handleDeleteRole(role.id)" class="text-red-600 hover:text-red-900 mr-4">حذف</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <RoleModal
      :show="isModalOpen"
      :role="currentRole"
      :all-permissions="groupedPermissions"
      @close="closeModal"
      @save="handleSaveRole"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthApi } from '~/composables/useAuthApi';
import type { Role, Permission, CreateRolePayload, UpdateRolePayload } from '~/composables/useAuthApi';
import RoleModal from '~/components/admin/RoleModal.vue';

definePageMeta({
  layout: 'admin', // Assuming an admin layout exists
  middleware: ['auth'], // Assuming an auth middleware exists
});

const api = useAuthApi();

const roles = ref<Role[]>([]);
const groupedPermissions = ref<Record<string, Permission[]>>({});
const isLoading = ref(true);
const error = ref<Error | null>(null);

const isModalOpen = ref(false);
const currentRole = ref<Role | null>(null);

async function fetchRoles() {
  try {
    isLoading.value = true;
    // Fetch roles with their assigned permissions
    const response = await api.getRoles(true);
    // Handle both wrapped and direct array responses
    roles.value = Array.isArray(response.data) ? response.data : response;
  } catch (e) {
    error.value = e as Error;
    console.error("Failed to fetch roles:", e);
  } finally {
    isLoading.value = false;
  }
}

async function fetchPermissions() {
  try {
    const response = await api.getPermissions();
    // The API likely returns pre-grouped permissions.
    // Handle both wrapped {data: {...}} and direct {...} object responses.
    const permissionsData = response.data && typeof response.data === 'object' && !Array.isArray(response.data)
      ? response.data
      : response;
    groupedPermissions.value = permissionsData;
  } catch (e) {
    console.error("Failed to fetch permissions:", e);
    error.value = e as Error; // Also set error if permissions fail
  }
}

onMounted(async () => {
  await Promise.all([
    fetchRoles(),
    fetchPermissions()
  ]);
});

function openCreateModal() {
  currentRole.value = null;
  isModalOpen.value = true;
}

function openEditModal(role: Role) {
  currentRole.value = role;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  currentRole.value = null;
}

async function handleSaveRole(formData: CreateRolePayload & { permission_ids: number[] }) {
  try {
    if (currentRole.value) {
      // Edit mode
      const roleId = currentRole.value.id;
      const updatePayload: UpdateRolePayload = {
        display_name: formData.display_name,
        description: formData.description,
      };
      await api.updateRole(roleId, updatePayload);
      await api.updateRolePermissions(roleId, formData.permission_ids);
      alert('نقش با موفقیت به‌روزرسانی شد.');
    } else {
      // Create mode
      const createPayload: CreateRolePayload = {
        name: formData.name,
        display_name: formData.display_name,
        description: formData.description,
        permission_ids: formData.permission_ids,
      };
      await api.createRole(createPayload);
      alert('نقش با موفقیت ایجاد شد.');
    }
    closeModal();
    await fetchRoles(); // Refresh the list
  } catch (e) {
    console.error('Failed to save role:', e);
    alert('خطا در ذخیره‌سازی نقش. لطفاً جزئیات را در کنسول بررسی کنید.');
  }
}

async function handleDeleteRole(roleId: number) {
  if (confirm('آیا از حذف این نقش اطمینان دارید؟ این عمل قابل بازگشت نیست.')) {
    try {
      await api.deleteRole(roleId);
      alert('نقش با موفقیت حذف شد.');
      roles.value = roles.value.filter(r => r.id !== roleId);
    } catch (e) {
      console.error('Failed to delete role:', e);
      alert('خطا در حذف نقش.');
    }
  }
}
</script>
