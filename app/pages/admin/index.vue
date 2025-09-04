<!-- app/pages/admin/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">پنل مدیریت</h1>
        <p class="text-gray-600 mt-2">مدیریت کاربران و سیستم</p>
      </div>

      <!-- Debug Section -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h2 class="text-lg font-semibold text-yellow-800 mb-3">اطلاعات Debug</h2>
        <div class="space-y-2 text-sm">
          <p><strong>Token:</strong> {{ authStore.token ? 'موجود' : 'ندارد' }}</p>
          <p><strong>User:</strong> {{ authStore.user?.name || 'نامشخص' }}</p>
          <p><strong>Is Admin:</strong> {{ authStore.isAdmin ? 'بله' : 'خیر' }}</p>
          <p><strong>API Base:</strong> {{ apiBase }}</p>
          <p><strong>API Connection:</strong> {{ apiStatus }}</p>
        </div>
        <div class="mt-3 flex gap-2">
          <button @click="runDebugTests"
                  class="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700">
            اجرای تست‌های Debug
          </button>
          <button @click="testDirectAPI"
                  class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
            تست مستقیم API
          </button>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="errors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-red-800 mb-2">خطاها:</h3>
        <div class="space-y-1 text-sm text-red-700">
          <div v-for="(error, index) in errors" :key="index">
            {{ error }}
          </div>
        </div>
        <button @click="errors = []" class="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm">
          پاک کردن خطاها
        </button>
      </div>

      <!-- آمار سریع -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">کل کاربران</h3>
          <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.total_users || '-' }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">کاربران فعال</h3>
          <p class="text-2xl font-bold text-green-600 mt-2">{{ stats.verified_emails || '-' }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">ثبت نام هفته گذشته</h3>
          <p class="text-2xl font-bold text-blue-600 mt-2">{{ stats.recent_registrations || '-' }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">حساب‌های قفل شده</h3>
          <p class="text-2xl font-bold text-red-600 mt-2">{{ stats.locked_accounts || '-' }}</p>
        </div>
      </div>

      <!-- منوی دسترسی سریع -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
             @click="$router.push('/admin/users')">
          <div class="flex items-center">
            <div class="bg-blue-500 p-3 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div class="mr-4">
              <h3 class="text-lg font-medium text-gray-900">مدیریت کاربران</h3>
              <p class="text-sm text-gray-500">مشاهده و ویرایش کاربران</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
             @click="$router.push('/admin/roles')">
          <div class="flex items-center">
            <div class="bg-green-500 p-3 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div class="mr-4">
              <h3 class="text-lg font-medium text-gray-900">مدیریت نقش‌ها</h3>
              <p class="text-sm text-gray-500">تنظیم نقش‌ها و دسترسی‌ها</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="bg-purple-500 p-3 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="mr-4">
              <h3 class="text-lg font-medium text-gray-900">گزارشات</h3>
              <p class="text-sm text-gray-500">آمار و گزارش‌های سیستم</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApi } from '~/composables/useApi'
import { useApiTest } from '~/composables/useApiTest'
import { useAuthStore } from '~/stores/auth'
import { useRuntimeConfig } from '#app'

definePageMeta({
  middleware: 'admin',
  layout: 'default'
})

const authStore = useAuthStore()
const config = useRuntimeConfig()
const api = useApi(authStore.token)
const { testApiConnection, testAuthEndpoint, testAdminEndpoint } = useApiTest()

const stats = ref({})
const errors = ref([])
const apiStatus = ref('نامشخص')
const apiBase = ref(config.public.apiBase)

const addError = (error) => {
  errors.value.push(new Date().toLocaleTimeString() + ': ' + error)
}

const loadStats = async () => {
  try {
    console.log('Loading stats...')
    const response = await api.get('/auth/users/statistics')
    stats.value = response.data || response
    console.log('Stats loaded:', stats.value)
  } catch (error) {
    console.error('خطا در دریافت آمار:', error)
    addError(`خطا در دریافت آمار: ${error.message}`)
  }
}

const runDebugTests = async () => {
  errors.value = []
  console.log('=== شروع تست‌های Debug ===')

  // Test 1: API Connection
  const connectionOk = await testApiConnection()
  apiStatus.value = connectionOk ? 'متصل' : 'قطع'

  if (!connectionOk) {
    addError('اتصال به API برقرار نیست')
    return
  }

  // Test 2: Authentication
  if (!authStore.token) {
    addError('Token موجود نیست')
    return
  }

  const authResult = await testAuthEndpoint(authStore.token)
  if (!authResult) {
    addError('Authentication ناموفق')
    return
  }

  // Test 3: Admin Access
  const adminResult = await testAdminEndpoint(authStore.token)
  if (!adminResult) {
    addError('دسترسی ادمین ندارید یا خطا در API')
    return
  }

  console.log('=== همه تست‌ها موفق ===')
  stats.value = adminResult.data || adminResult
}

const testDirectAPI = async () => {
  try {
    const response = await $fetch('/auth/users/statistics', {
      baseURL: 'http://localhost:8000/api',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    })
    console.log('Direct API test success:', response)

    // Handle nested response structure
    if (response.success && response.data) {
      if (response.data.success && response.data.data) {
        stats.value = response.data.data
      } else {
        stats.value = response.data
      }
    } else {
      stats.value = response
    }
  } catch (error) {
    console.error('Direct API test failed:', error)
    addError(`تست مستقیم API ناموفق: ${error.message}`)
  }
}

onMounted(async () => {
  console.log('Admin panel mounted')
  console.log('Auth store state:', {
    token: !!authStore.token,
    user: authStore.user,
    isAdmin: authStore.isAdmin
  })

  await loadStats()
})
</script>
