<!-- app/pages/debug-auth.vue -->
<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Debug Authentication</h1>

      <!-- Auth Store Status -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">وضعیت Auth Store</h2>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>isAuthenticated:</strong> {{ authStore.isAuthenticated }}
          </div>
          <div>
            <strong>hasToken:</strong> {{ !!authStore.token }}
          </div>
          <div>
            <strong>Token Length:</strong> {{ authStore.token?.length || 0 }}
          </div>
          <div>
            <strong>hasUser:</strong> {{ !!authStore.user }}
          </div>
          <div>
            <strong>User Name:</strong> {{ authStore.user?.name || 'ندارد' }}
          </div>
          <div>
            <strong>Is Admin:</strong> {{ authStore.isAdmin }}
          </div>
        </div>

        <div class="mt-4 p-3 bg-gray-100 rounded">
          <strong>Token (first 50 chars):</strong><br>
          <code class="text-xs">{{ authStore.token ? authStore.token.substring(0, 50) + '...' : 'ندارد' }}</code>
        </div>

        <div class="mt-4 p-3 bg-gray-100 rounded">
          <strong>User Object:</strong><br>
          <pre class="text-xs">{{ JSON.stringify(authStore.user, null, 2) }}</pre>
        </div>
      </div>

      <!-- localStorage Status -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">وضعیت LocalStorage</h2>
        <div class="space-y-2 text-sm">
          <div>
            <strong>token:</strong> {{ localStorageStatus.token }}
          </div>
          <div>
            <strong>user:</strong> {{ localStorageStatus.user }}
          </div>
          <div>
            <strong>isAuthenticated:</strong> {{ localStorageStatus.isAuthenticated }}
          </div>
        </div>
      </div>

      <!-- Manual Tests -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">تست‌های دستی</h2>
        <div class="space-y-4">
          <button @click="testTokenValidation" class="px-4 py-2 bg-blue-600 text-white rounded">
            تست اعتبار Token
          </button>
          <button @click="testUserFetch" class="px-4 py-2 bg-green-600 text-white rounded">
            تست دریافت User
          </button>
          <button @click="testAdminAPI" class="px-4 py-2 bg-purple-600 text-white rounded">
            تست Admin API
          </button>
          <button @click="refreshAuth" class="px-4 py-2 bg-yellow-600 text-white rounded">
            بارگذاری مجدد Auth
          </button>
        </div>
      </div>

      <!-- Test Results -->
      <div v-if="testResults.length > 0" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">نتایج تست‌ها</h2>
        <div class="space-y-3">
          <div v-for="(result, index) in testResults" :key="index"
               class="p-3 rounded border-l-4"
               :class="result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'">
            <div class="font-medium">{{ result.title }}</div>
            <div class="text-sm mt-1">{{ result.message }}</div>
            <pre v-if="result.data" class="text-xs mt-2 bg-gray-100 p-2 rounded">{{ JSON.stringify(result.data, null, 2) }}</pre>
          </div>
        </div>
        <button @click="testResults = []" class="mt-4 px-3 py-1 bg-gray-600 text-white rounded text-sm">
          پاک کردن نتایج
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const testResults = ref([])

const localStorageStatus = ref({
  token: 'در حال بررسی...',
  user: 'در حال بررسی...',
  isAuthenticated: 'در حال بررسی...'
})

const addResult = (title, success, message, data = null) => {
  testResults.value.push({
    title,
    success,
    message,
    data,
    timestamp: new Date().toLocaleTimeString()
  })
}

const testTokenValidation = async () => {
  try {
    if (!authStore.token) {
      addResult('تست Token', false, 'Token موجود نیست')
      return
    }

    const response = await fetch('http://localhost:8000/api/auth/user', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      addResult('تست Token', true, 'Token معتبر است', data)
    } else {
      const errorText = await response.text()
      addResult('تست Token', false, `Token نامعتبر: ${response.status}`, errorText)
    }
  } catch (error) {
    addResult('تست Token', false, `خطا: ${error.message}`)
  }
}

const testUserFetch = async () => {
  try {
    const result = await authStore.fetchUser()
    if (result) {
      addResult('تست User Fetch', true, 'کاربر با موفقیت دریافت شد', result)
    } else {
      addResult('تست User Fetch', false, 'خطا در دریافت کاربر')
    }
  } catch (error) {
    addResult('تست User Fetch', false, `خطا: ${error.message}`)
  }
}

const testAdminAPI = async () => {
  try {
    if (!authStore.token) {
      addResult('تست Admin API', false, 'Token موجود نیست')
      return
    }

    const api = useApi()
    const response = await api.get('/dashboard') // Changed to a valid new endpoint
    addResult('تست Admin API', true, 'API ادمین کار می‌کند', response)
  } catch (error) {
    addResult('تست Admin API', false, `خطا: ${error.message}`, error)
  }
}

const refreshAuth = () => {
  authStore.initAuth()
  updateLocalStorageStatus()
  addResult('بارگذاری Auth', true, 'Auth مجدداً بارگذاری شد')
}

const updateLocalStorageStatus = () => {
  if (process.client) {
    localStorageStatus.value = {
      token: localStorage.getItem('token') ? 'موجود' : 'ندارد',
      user: localStorage.getItem('user') ? 'موجود' : 'ندارد',
      isAuthenticated: localStorage.getItem('isAuthenticated') || 'ندارد'
    }
  }
}

onMounted(() => {
  updateLocalStorageStatus()

  // Auto-refresh auth if needed
  if (!authStore.isAuthenticated && process.client) {
    authStore.initAuth()
    updateLocalStorageStatus()
  }
})
</script>
