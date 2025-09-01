<template>
  <div class="debug-container">
    <h1>Debug Information</h1>
    
    <div class="debug-section">
      <h2>User Information</h2>
      <pre>{{ userInfo }}</pre>
    </div>

    <div class="debug-section">
      <h2>Auth Tokens</h2>
      <pre>{{ tokens }}</pre>
    </div>

    <div class="debug-section">
      <h2>Local Storage</h2>
      <pre>{{ localStorage }}</pre>
    </div>

    <div class="debug-section">
      <h2>Actions</h2>
      <button @click="fetchUserData" class="btn">Fetch User Data</button>
      <button @click="testUsersAPI" class="btn">Test Users API</button>
      <button @click="clearAll" class="btn btn-danger">Clear All Auth</button>
    </div>

    <div v-if="apiResponse" class="debug-section">
      <h2>API Response</h2>
      <pre>{{ apiResponse }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
})

const { user, token, isAdmin, hasPermission, fetchUser, clearAuth, api } = useAuth()

const userInfo = computed(() => ({
  user: user.value,
  isAdmin: isAdmin.value,
  hasUsersViewPermission: hasPermission('users.view'),
  permissions: user.value?.permissions,
  roles: user.value?.roles
}))

const tokens = computed(() => ({
  authToken: token.value,
  accessToken: process.client ? localStorage.getItem('access_token') : null,
  refreshToken: process.client ? localStorage.getItem('refresh_token') : null
}))

const localStorage = ref({})
const apiResponse = ref(null)

const updateLocalStorage = () => {
  if (process.client) {
    const storage: any = {}
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key) {
        storage[key] = window.localStorage.getItem(key)
      }
    }
    localStorage.value = storage
  }
}

const fetchUserData = async () => {
  try {
    const userData = await fetchUser()
    apiResponse.value = { success: true, data: userData }
  } catch (error: any) {
    apiResponse.value = { success: false, error: error.message }
  }
}

const testUsersAPI = async () => {
  try {
    const response = await api('/api/auth/users/')
    apiResponse.value = response
  } catch (error: any) {
    apiResponse.value = { 
      success: false, 
      error: error.message,
      data: error.data,
      statusCode: error.statusCode
    }
  }
}

const clearAll = () => {
  if (confirm('Are you sure you want to clear all authentication data?')) {
    clearAuth()
    navigateTo('/auth')
  }
}

onMounted(() => {
  updateLocalStorage()
})
</script>

<style scoped>
.debug-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.debug-section {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

h2 {
  color: #666;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 0.25rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.5;
}

.btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: background 0.2s;
}

.btn:hover {
  background: #5a67d8;
}

.btn-danger {
  background: #f56565;
}

.btn-danger:hover {
  background: #e53e3e;
}
</style>