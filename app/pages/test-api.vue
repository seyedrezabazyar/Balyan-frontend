<!-- app/pages/test-api.vue -->
<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">تست API</h1>

      <div class="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 class="text-lg font-semibold mb-2">1. تست اتصال به API</h2>
          <button @click="testConnection" class="px-4 py-2 bg-blue-600 text-white rounded">
            تست اتصال
          </button>
          <div v-if="connectionResult" class="mt-2 p-2 rounded"
               :class="connectionResult.success ? 'bg-green-100' : 'bg-red-100'">
            {{ connectionResult.message }}
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold mb-2">2. ورود با ایمیل و پسورد</h2>
          <div class="space-y-2">
            <input v-model="loginData.email" type="email" placeholder="ایمیل"
                   class="w-full px-3 py-2 border rounded">
            <input v-model="loginData.password" type="password" placeholder="رمز عبور"
                   class="w-full px-3 py-2 border rounded">
            <button @click="testLogin" class="px-4 py-2 bg-green-600 text-white rounded">
              ورود
            </button>
          </div>
          <div v-if="loginResult" class="mt-2 p-2 rounded"
               :class="loginResult.success ? 'bg-green-100' : 'bg-red-100'">
            {{ loginResult.message }}
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold mb-2">3. تست دریافت کاربر فعلی</h2>
          <button @click="testGetUser" :disabled="!token"
                  class="px-4 py-2 bg-yellow-600 text-white rounded disabled:opacity-50">
            دریافت اطلاعات کاربر
          </button>
          <div v-if="userResult" class="mt-2 p-2 bg-gray-100 rounded">
            <pre class="text-sm">{{ JSON.stringify(userResult, null, 2) }}</pre>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold mb-2">4. تست API آمار کاربران (ادمین)</h2>
          <button @click="testAdminStats" :disabled="!token"
                  class="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50">
            آمار کاربران
          </button>
          <div v-if="statsResult" class="mt-2 p-2 rounded"
               :class="statsResult.success ? 'bg-green-100' : 'bg-red-100'">
            <pre class="text-sm">{{ JSON.stringify(statsResult, null, 2) }}</pre>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold mb-2">5. تست API لیست کاربران</h2>
          <button @click="testUsersList" :disabled="!token"
                  class="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">
            لیست کاربران
          </button>
          <div v-if="usersResult" class="mt-2 p-2 rounded"
               :class="usersResult.success ? 'bg-green-100' : 'bg-red-100'">
            <pre class="text-sm">{{ JSON.stringify(usersResult, null, 2) }}</pre>
          </div>
        </div>

        <div class="border-t pt-4">
          <h3 class="font-semibold">Token:</h3>
          <div class="text-xs bg-gray-100 p-2 rounded break-all">
            {{ token || 'ندارد' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const connectionResult = ref(null)
const loginResult = ref(null)
const userResult = ref(null)
const statsResult = ref(null)
const usersResult = ref(null)
const token = ref(null)

const loginData = ref({
  email: 'admin@test.com',
  password: '123456'
})

const testConnection = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/health')
    if (response.ok) {
      const data = await response.json()
      connectionResult.value = {
        success: true,
        message: 'اتصال موفق: ' + JSON.stringify(data)
      }
    } else {
      connectionResult.value = {
        success: false,
        message: 'خطا: ' + response.status + ' ' + response.statusText
      }
    }
  } catch (error) {
    connectionResult.value = {
      success: false,
      message: 'خطا در اتصال: ' + error.message
    }
  }
}

const testLogin = async () => {
  try {
    // ابتدا check user
    const checkResponse = await fetch('http://localhost:8000/api/auth/check-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        identifier: loginData.value.email
      })
    })

    if (!checkResponse.ok) {
      throw new Error('خطا در check-user')
    }

    const checkData = await checkResponse.json()
    console.log('Check user result:', checkData)

    // سپس login
    const loginResponse = await fetch('http://localhost:8000/api/auth/login-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        identifier: loginData.value.email,
        password: loginData.value.password
      })
    })

    if (loginResponse.ok) {
      const data = await loginResponse.json()
      token.value = data.tokens?.access_token || data.access_token
      loginResult.value = {
        success: true,
        message: 'ورود موفق',
        data
      }
    } else {
      const error = await loginResponse.text()
      loginResult.value = {
        success: false,
        message: 'خطا در ورود: ' + error
      }
    }
  } catch (error) {
    loginResult.value = {
      success: false,
      message: 'خطا: ' + error.message
    }
  }
}

const testGetUser = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/user', {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      userResult.value = data
    } else {
      const error = await response.text()
      userResult.value = { error }
    }
  } catch (error) {
    userResult.value = { error: error.message }
  }
}

const testAdminStats = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/users/statistics', {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      statsResult.value = { success: true, data }
    } else {
      const error = await response.text()
      statsResult.value = { success: false, error }
    }
  } catch (error) {
    statsResult.value = { success: false, error: error.message }
  }
}

const testUsersList = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/users?per_page=5', {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      usersResult.value = { success: true, data }
    } else {
      const error = await response.text()
      usersResult.value = { success: false, error }
    }
  } catch (error) {
    usersResult.value = { success: false, error: error.message }
  }
}
</script>
