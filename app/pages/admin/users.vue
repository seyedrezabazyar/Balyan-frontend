<template>
  <div class="p-4 md:p-6">
    <h1 class="text-2xl font-bold mb-4">مدیریت کاربران</h1>

    <!-- Search and Filter -->
    <div class="mb-4">
      <input
        type="text"
        placeholder="جستجو بر اساس نام، ایمیل و..."
        class="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md"
        @input="handleSearch"
      />
    </div>

    <!-- Loading and Error States -->
    <div v-if="isLoading" class="text-center py-4">
      <p>در حال بارگذاری اطلاعات...</p>
    </div>
    <div v-if="error" class="text-center py-4 text-red-500">
      <p>خطا در دریافت اطلاعات: {{ error.message }}</p>
    </div>

    <!-- Users Table -->
    <div v-if="!isLoading" class="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ایمیل</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نقش‌ها</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="users.length === 0">
            <td colspan="4" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
              کاربری یافت نشد.
            </td>
          </tr>
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span v-for="role in user.roles" :key="role.id" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 mr-1">
                {{ role.display_name }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openRoleModal(user)" class="text-indigo-600 hover:text-indigo-900">مدیریت نقش‌ها</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- User Role Modal -->
    <UserRoleModal
      :show="isModalOpen"
      :user="currentUser"
      :all-roles="allRoles"
      @close="closeModal"
      @save="handleRoleSave"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthApi, type Role } from '~/composables/useAuthApi';
import UserRoleModal from '~/components/admin/UserRoleModal.vue';

// Define a placeholder user type that includes roles
interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
});

const api = useAuthApi();

// State
const users = ref<User[]>([]);
const allRoles = ref<Role[]>([]);
const isLoading = ref(true);
const error = ref<Error | null>(null);

const isModalOpen = ref(false);
const currentUser = ref<User | null>(null);

// Fetch all available roles for the modal
async function fetchAllRoles() {
  try {
    const response = await api.getRoles();
    allRoles.value = response.data;
  } catch (e) {
    console.error("Failed to fetch roles for modal:", e);
  }
}

// Fetch users
async function fetchUsers() {
  isLoading.value = true;
  error.value = null;

  try {
    // We use useFetch to call our local mock API
    const { data: response, error: fetchError } = await useFetch('/api/admin/users');

    if (fetchError.value) {
      throw fetchError.value;
    }

    if (response.value && response.value.data) {
      // Assign roles to users based on the allRoles list
      const usersData = response.value.data.map(user => ({
        ...user,
        roles: user.roles.map(role => allRoles.value.find(r => r.id === role.id)).filter(Boolean)
      }));
      users.value = usersData;
    } else {
      users.value = [];
    }
  } catch (e) {
    console.error("Failed to fetch users:", e);
    error.value = new Error(e.message || "یک خطای ناشناخته رخ داد.");
    users.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  isLoading.value = true;
  await fetchAllRoles();
  await fetchUsers(); // This will run after roles are fetched
});

function handleSearch(event: Event) {
  const target = event.target as HTMLInputElement;
  console.log('Searching for:', target.value);
  // Search logic will be implemented here
}

function openRoleModal(user: User) {
  currentUser.value = user;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  currentUser.value = null;
}

async function handleRoleSave(selectedRoleIds: number[]) {
  if (!currentUser.value) return;

  const userId = currentUser.value.id;
  const originalRoleIds = new Set(currentUser.value.roles.map(r => r.id));
  const newRoleIds = new Set(selectedRoleIds);

  const rolesToAssign = selectedRoleIds.filter(id => !originalRoleIds.has(id));
  const rolesToRemove = Array.from(originalRoleIds).filter(id => !newRoleIds.has(id));

  try {
    // Perform all API calls concurrently
    await Promise.all([
      ...rolesToAssign.map(roleId => api.assignRoleToUser(userId, roleId)),
      ...rolesToRemove.map(roleId => api.removeRoleFromUser(userId, roleId))
    ]);

    alert(`نقش‌های کاربر ${currentUser.value.name} با موفقیت به‌روزرسانی شد.`);

    // Update local data to reflect changes immediately
    const updatedUser = users.value.find(u => u.id === userId);
    if(updatedUser) {
        updatedUser.roles = allRoles.value.filter(r => newRoleIds.has(r.id));
    }

  } catch (e) {
    console.error('Failed to update user roles:', e);
    alert('خطا در به‌روزرسانی نقش‌های کاربر.');
  } finally {
    closeModal();
  }
}
</script>
