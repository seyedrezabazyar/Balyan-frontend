<template>
  <div class="test-container">
    <h1>تست مستقیم API</h1>
    
    <div class="section">
      <h2>توکن‌های ذخیره شده:</h2>
      <ul>
        <li>access_token: {{ accessToken ? 'موجود' : 'موجود نیست' }}</li>
        <li>auth_token: {{ authToken ? 'موجود' : 'موجود نیست' }}</li>
      </ul>
      
      <div v-if="accessToken" class="token-preview">
        <strong>Token Preview:</strong>
        <code>{{ accessToken.substring(0, 30) }}...</code>
      </div>
    </div>

    <div class="section">
      <h2>تست درخواست به API:</h2>
      <button @click="testDirectAPI" class="btn">تست مستقیم با fetch</button>
      <button @click="testWithUseApi" class="btn">تست با useApi</button>
      <button @click="testWithUseAuth" class="btn">تست با useAuth</button>
    </div>

    <div v-if="response" class="section">
      <h2>پاسخ API:</h2>
      <pre>{{ JSON.stringify(response, null, 2) }}</pre>
    </div>

    <div v-if="error" class="section error">
      <h2>خطا:</h2>
      <pre>{{ error }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const accessToken = ref('')
const authToken = ref('')
const response = ref(null)
const error = ref('')

const config = useRuntimeConfig()
const apiUrl = config.public.apiBase

onMounted(() => {
  // Read tokens from localStorage
  if (process.client) {
    accessToken.value = localStorage.getItem('access_token') || ''
    authToken.value = localStorage.getItem('auth_token') || ''
    
    console.log('Tokens in localStorage:')
    console.log('access_token:', accessToken.value)
    console.log('auth_token:', authToken.value)
  }
})

// Test direct API call with fetch
const testDirectAPI = async () => {
  error.value = ''
  response.value = null
  
  const token = accessToken.value || authToken.value
  
  if (!token) {
    error.value = 'توکن یافت نشد. لطفا ابتدا لاگین کنید.'
    return
  }
  
  try {
    console.log('Testing with token:', token)
    
    const res = await fetch(`${apiUrl}/api/auth/users`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    const data = await res.json()
    
    console.log('Response status:', res.status)
    console.log('Response data:', data)
    
    if (res.ok) {
      response.value = data
    } else {
      error.value = `Status: ${res.status}\n${JSON.stringify(data, null, 2)}`
    }
  } catch (err: any) {
    error.value = err.message || 'خطا در ارتباط با سرور'
    console.error('Error:', err)
  }
}

// Test with useApi composable
const testWithUseApi = async () => {
  error.value = ''
  response.value = null
  
  try {
    const { api } = useApi()
    const data = await api('/api/auth/users')
    
    console.log('useApi response:', data)
    response.value = data
  } catch (err: any) {
    error.value = err.message || 'خطا در ارتباط با سرور'
    console.error('Error:', err)
  }
}

// Test with useAuth composable
const testWithUseAuth = async () => {
  error.value = ''
  response.value = null
  
  try {
    const { api, user, isAdmin } = useAuth()
    
    console.log('Current user:', user.value)
    console.log('Is admin:', isAdmin.value)
    
    const data = await api('/api/auth/users')
    
    console.log('useAuth api response:', data)
    response.value = data
  } catch (err: any) {
    error.value = err.message || 'خطا در ارتباط با سرور'
    console.error('Error:', err)
  }
}
</script>

<style scoped>
.test-container {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

h2 {
  color: #666;
  margin-bottom: 1rem;
}

.section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section.error {
  background: #fee;
  border: 1px solid #fcc;
}

ul {
  list-style: disc;
  padding-left: 2rem;
}

li {
  margin: 0.5rem 0;
}

.token-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 0.25rem;
}

code {
  font-family: monospace;
  background: #e5e5e5;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  white-space: pre-wrap;
}

.btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  margin: 0.5rem;
  transition: background 0.3s;
}

.btn:hover {
  background: #5a67d8;
}
</style>
</template>