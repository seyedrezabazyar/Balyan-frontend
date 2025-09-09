<!-- app/pages/admin/users/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">مدیریت کاربران</h1>
          <p class="text-gray-600 mt-2">{{ pagination.total || 0 }} کاربر</p>
        </div>
        <NuxtLink to="/admin"
                  class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
          بازگشت به پنل مدیریت
        </NuxtLink>
      </div>

      <!-- Debug Info -->
      <div v-if="showDebug" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 class="font-semibold text-blue-800 mb-2">اطلاعات Debug</h3>
        <div class="text-sm space-y-1">
          <p><strong>Loading:</strong> {{ loading }}</p>
          <p><strong>Users Count:</strong> {{ users.length }}</p>
          <p><strong>Pagination:</strong> {{ JSON.stringify(pagination) }}</p>
          <p><strong>Filters:</strong> {{ JSON.stringify(filters) }}</p>
        </div>
        <button @click="testUsersAPI"
                class="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm">
          تست API کاربران
        </button>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h3 class="font-semibold text-red-800 mb-2">خطا:</h3>
        <p class="text-sm text-red-700">{{ error }}</p>
        <button @click="error = null; loadUsers()"
                class="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm">
          تلاش مجدد
        </button>
      </div>

      <!-- فیلتر و جستجو -->
      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-semibold">فیلتر و جستجو</h2>
          <button @click="showDebug = !showDebug"
                  class="text-sm px-2 py-1 bg-gray-200 rounded">
            {{ showDebug ? 'مخفی کردن' : 'نمایش' }} Debug
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">جستجو</label>
            <input v-model="filters.search"
                   @input="debouncedSearch"
                   type="text"
                   placeholder="نام، ایمیل یا شماره تلفن"
                   class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">وضعیت ایمیل</label>
            <select v-model="filters.email_verified"
                    @change="loadUsers"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
              <option value="">همه</option>
              <option value="true">تایید شده</option>
              <option value="false">تایید نشده</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">وضعیت تلفن</label>
            <select v-model="filters.phone_verified"
                    @change="loadUsers"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
              <option value="">همه</option>
              <option value="true">تایید شده</option>
              <option value="false">تایید نشده</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">مرتب‌سازی</label>
            <select v-model="filters.sort_by"
                    @change="loadUsers"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
              <option value="created_at">تاریخ ثبت‌نام</option>
              <option value="name">نام</option>
              <option value="last_login_at">آخرین ورود</option>
            </select>
          </div>
        </div>
      </div>

      <!-- جدول کاربران -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">در حال بارگذاری...</p>
        </div>

        <div v-else-if="users.length === 0" class="p-8 text-center text-gray-500">
          <p>هیچ کاربری یافت نشد</p>
          <button @click="loadUsers()" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
            تلاش مجدد
          </button>
        </div>

        <div v-else>
          <table class="min-w-full">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">کاربر</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">اطلاعات تماس</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">آخرین ورود</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {{ (user.name || 'ک').charAt(0) }}
                  </div>
                  <div class="mr-3">
                    <div class="text-sm font-medium text-gray-900">{{ user.name || 'نام نامشخص' }}</div>
                    <div class="text-sm text-gray-500">{{ user.username || 'نام کاربری ندارد' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ user.email || 'ایمیل ندارد' }}</div>
                <div class="text-sm text-gray-500">{{ user.phone || 'تلفن ندارد' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col space-y-1">
                    <span v-if="user.email_verified_at"
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      ایمیل تایید شده
                    </span>
                  <span v-if="user.phone_verified_at"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      تلفن تایید شده
                    </span>
                  <span v-if="user.is_admin"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      ادمین
                    </span>
                  <span v-if="user.locked_until"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      قفل شده
                    </span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ user.last_login_at ? new Date(user.last_login_at).toLocaleDateString('fa-IR') : 'هیچوقت' }}
              </td>
              <td class="px-6 py-4">
                <div class="flex space-x-2 space-x-reverse">
                  <button @click="$router.push(`/admin/users/${user.id}`)"
                          class="text-blue-600 hover:text-blue-900 text-sm">
                    مشاهده
                  </button>
                  <button @click="toggleUserLock(user)"
                          class="text-yellow-600 hover:text-yellow-900 text-sm">
                    {{ user.locked_until ? 'باز کردن' : 'قفل کردن' }}
                  </button>
                  <button @click="resetUserPassword(user)"
                          class="text-red-600 hover:text-red-900 text-sm">
                    بازنشانی رمز
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>

          <!-- صفحه‌بندی -->
          <div v-if="pagination.total > pagination.per_page"
               class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                نمایش {{ pagination.from || 1 }} تا {{ pagination.to || users.length }} از {{ pagination.total || users.length }} کاربر
              </div>
              <div class="flex space-x-2 space-x-reverse">
                <button @click="loadUsers(pagination.current_page - 1)"
                        :disabled="pagination.current_page <= 1"
                        class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                  قبلی
                </button>
                <span class="px-3 py-1">
                  صفحه {{ pagination.current_page || 1 }} از {{ pagination.last_page || 1 }}
                </span>
                <button @click="loadUsers(pagination.current_page + 1)"
                        :disabled="pagination.current_page >= pagination.last_page"
                        class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                  بعدی
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const authStore = useAuthStore()
const api = useApi(authStore.token)

const users = ref([])
const loading = ref(false)
const error = ref(null)
const showDebug = ref(false)
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 1,
  to: 0
})

const filters = ref({
  search: '',
  email_verified: '',
  phone_verified: '',
  sort_by: 'created_at',
  sort_order: 'desc'
})

let searchTimeout = null

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadUsers()
  }, 500)
}

const testUsersAPI = async () => {
  try {
    console.log('Testing users API...')
    const response = await $fetch('/auth/users?per_page=5', {
      baseURL: 'http://localhost:8000/api',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    })
    console.log('Users API test success:', response)
    alert('API کاربران کار می‌کند!')
  } catch (err) {
    console.error('Users API test failed:', err)
    alert('API کاربران کار نمی‌کند: ' + err.message)
  }
}

const loadUsers = async (page = 1) => {
  loading.value = true
  error.value = null

  try {
    console.log('Loading users, page:', page)
    console.log('Filters:', filters.value)

    const params = {
      page,
      per_page: 15,
      ...filters.value
    }

    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })

    console.log('Final params:', params)

    const response = await api.get('/auth/users', { query: params })
    console.log('Users response:', response)

    // Handle different response structures
    if (response.data && response.meta) {
      users.value = response.data
      pagination.value = response.meta
    } else if (Array.isArray(response)) {
      users.value = response
      pagination.value = {
        current_page: 1,
        last_page: 1,
        per_page: response.length,
        total: response.length,
        from: 1,
        to: response.length
      }
    } else if (response.users) {
      users.value = response.users
      pagination.value = response.pagination || pagination.value
    } else {
      users.value = []
    }

    console.log('Users loaded:', users.value.length)
    console.log('Pagination:', pagination.value)

  } catch (err) {
    console.error('خطا در دریافت کاربران:', err)
    error.value = `خطا در دریافت کاربران: ${err.message}`
    users.value = []
  } finally {
    loading.value = false
  }
}

const toggleUserLock = async (user) => {
  try {
    await api.post(`/auth/users/${user.id}/toggle-lock`)
    await loadUsers(pagination.value.current_page)
    alert('عملیات با موفقیت انجام شد')
  } catch (err) {
    console.error('خطا در تغییر وضعیت قفل:', err)
    alert('خطا در انجام عملیات: ' + err.message)
  }
}

const resetUserPassword = async (user) => {
  const newPassword = prompt('رمز عبور جدید را وارد کنید:')
  if (!newPassword) return

  try {
    await api.post(`/auth/users/${user.id}/reset-password`, {
      password: newPassword,
      password_confirmation: newPassword
    })
    alert('رمز عبور با موفقیت تغییر کرد')
  } catch (err) {
    console.error('خطا در تغییر رمز عبور:', err)
    alert('خطا در تغییر رمز عبور: ' + err.message)
  }
}

onMounted(async () => {
  console.log('Users page mounted')
  console.log('Auth state:', {
    token: !!authStore.token,
    user: authStore.user?.name,
    isAdmin: authStore.isAdmin
  })

  await loadUsers()
})
</script>
