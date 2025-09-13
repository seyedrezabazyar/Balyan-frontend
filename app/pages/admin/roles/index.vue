<!-- app/pages/admin/roles/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">مدیریت نقش‌ها</h1>
          <p class="text-gray-600 mt-2">تنظیم نقش‌ها و دسترسی‌های کاربران</p>
        </div>
        <NuxtLink to="/admin"
                  class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
          بازگشت به پنل مدیریت
        </NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">در حال بارگذاری...</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- لیست نقش‌ها -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold">نقش‌های موجود</h2>
            </div>
            <div class="divide-y divide-gray-200">
              <div v-for="role in roles" :key="role.id"
                   class="p-6 hover:bg-gray-50 cursor-pointer"
                   @click="selectRole(role)">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">{{ role.display_name }}</h3>
                    <p class="text-sm text-gray-600">{{ role.description }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ role.users_count }} کاربر</p>
                  </div>
                  <div class="text-sm text-blue-600">
                    {{ role.name === selectedRole?.name ? 'انتخاب شده' : 'انتخاب' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- تنظیمات نقش انتخاب شده -->
        <div>
          <div v-if="selectedRole" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">{{ selectedRole.display_name }}</h3>

            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-3">دسترسی‌های فعلی:</h4>
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <div v-for="permission in rolePermissions" :key="permission.id"
                     class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-900">{{ permission.display_name }}</span>
                  <button @click="removePermission(permission.id)"
                          class="text-red-600 hover:text-red-800 text-xs">
                    حذف
                  </button>
                </div>
                <div v-if="rolePermissions.length === 0" class="text-sm text-gray-500 p-2">
                  هیچ دسترسی خاصی تعریف نشده
                </div>
              </div>
            </div>

            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-700 mb-3">افزودن دسترسی:</h4>
              <select v-model="selectedPermission"
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 mb-2">
                <option value="">انتخاب دسترسی</option>
                <option v-for="permission in availablePermissions"
                        :key="permission.id"
                        :value="permission.id">
                  {{ permission.display_name }}
                </option>
              </select>
              <button @click="addPermission"
                      :disabled="!selectedPermission"
                      class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                افزودن دسترسی
              </button>
            </div>

            <div class="border-t pt-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">کاربران دارای این نقش:</h4>
              <p class="text-sm text-gray-600">{{ selectedRole.users_count }} کاربر</p>
            </div>
          </div>

          <div v-else class="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            نقشی را انتخاب کنید
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'admin'
})

const { $api } = useApi()

const roles = ref([])
const permissions = ref([])
const selectedRole = ref(null)
const rolePermissions = ref([])
const selectedPermission = ref('')
const loading = ref(true)

const availablePermissions = computed(() => {
  if (!selectedRole.value) return []
  const currentPermissionIds = rolePermissions.value.map(p => p.id)
  return permissions.value.filter(p => !currentPermissionIds.includes(p.id))
})

const loadRoles = async () => {
  try {
    const response = await $api.get('/auth/roles')
    roles.value = response.data || []
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

const loadPermissions = async () => {
  try {
    const response = await $api.get('/auth/permissions')
    // Assuming permissions are not grouped in this view
    const permissionsData = response.data || {}
    permissions.value = Object.values(permissionsData).flat()
  } catch (error) {
    console.error('Error fetching permissions:', error)
  }
}

const selectRole = async (role) => {
  selectedRole.value = role
  try {
    const response = await $api.get(`/auth/roles/${role.id}/permissions`)
    rolePermissions.value = response.data || []
  } catch (error) {
    console.error('Error fetching role permissions:', error)
    rolePermissions.value = [] // Reset on error
  }
}

const addPermission = async () => {
  if (!selectedPermission.value || !selectedRole.value) return

  try {
    const currentPermissionIds = rolePermissions.value.map(p => p.id)
    const newPermissions = [...currentPermissionIds, selectedPermission.value]

    await $api.put(`/auth/permissions/role/${selectedRole.value.id}`, { permission_ids: newPermissions })

    selectedPermission.value = ''
    await selectRole(selectedRole.value) // Refresh permissions for the role
    alert('Permission added successfully')
  } catch (error) {
    alert('Failed to add permission')
  }
}

const removePermission = async (permissionId) => {
  if (!selectedRole.value) return
  try {
    const currentPermissionIds = rolePermissions.value.map(p => p.id)
    const newPermissions = currentPermissionIds.filter(id => id !== permissionId)

    await $api.put(`/auth/permissions/role/${selectedRole.value.id}`, { permission_ids: newPermissions })

    await selectRole(selectedRole.value) // Refresh
    alert('Permission removed successfully')
  } catch (error) {
    alert('Failed to remove permission')
  }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([loadRoles(), loadPermissions()])
  loading.value = false
})
</script>
