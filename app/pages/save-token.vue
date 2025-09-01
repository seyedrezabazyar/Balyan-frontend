<template>
  <div class="container">
    <h1>ذخیره اطلاعات احراز هویت</h1>
    
    <div class="info">
      <h2>مرحله 1: توکن خود را وارد کنید</h2>
      <input 
        v-model="tokenInput" 
        type="text" 
        placeholder="توکن دریافتی از API را اینجا وارد کنید"
        class="input"
      />
      <small>مثال: 3|aefftjK4E20n7CM14FaBP74glEAtt3mQKiaxgKek40541ef3</small>
    </div>
    
    <div class="info">
      <h2>مرحله 2: Refresh Token (اختیاری)</h2>
      <input 
        v-model="refreshTokenInput" 
        type="text" 
        placeholder="Refresh token را اینجا وارد کنید"
        class="input"
      />
    </div>
    
    <button @click="saveTokens" class="btn" :disabled="!tokenInput">
      ذخیره اطلاعات و ورود به سیستم
    </button>
    
    <button @click="useDefaultAdmin" class="btn secondary">
      استفاده از اطلاعات پیش‌فرض ادمین
    </button>
    
    <div v-if="saved" class="success">
      <h3>✅ اطلاعات با موفقیت ذخیره شد!</h3>
      <p>اطلاعات کاربر:</p>
      <pre>{{ JSON.stringify(savedUser, null, 2) }}</pre>
      
      <div class="links">
        <h4>لینک‌های تست:</h4>
        <NuxtLink to="/test-api" class="link">تست API</NuxtLink>
        <NuxtLink to="/test-auth" class="link">تست احراز هویت</NuxtLink>
        <NuxtLink to="/dashboard" class="link">داشبورد</NuxtLink>
        <NuxtLink to="/dashboard/users" class="link">مدیریت کاربران</NuxtLink>
      </div>
    </div>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tokenInput = ref('')
const refreshTokenInput = ref('')
const saved = ref(false)
const savedUser = ref(null)
const error = ref('')

const saveTokens = async () => {
  if (!tokenInput.value) {
    error.value = 'لطفا توکن را وارد کنید'
    return
  }
  
  error.value = ''
  
  // Default admin user data based on your provided info
  const userData = {
    id: 1,
    name: 'مدیر سیستم',
    username: 'admin',
    email: 'admin@example.com',
    phone: '+989121234567',
    email_verified_at: '2025-09-01T09:06:24.000000Z',
    phone_verified_at: '2025-09-01T08:58:47.000000Z',
    preferred_method: 'password',
    avatar_url: 'http://127.0.0.1:8000/storage/avatars/admin.jpg',
    last_login_at: '2025-09-01T09:06:24.000000Z',
    is_admin: true,
    roles: []
  }
  
  // Save tokens with both naming conventions
  localStorage.setItem('access_token', tokenInput.value)
  localStorage.setItem('auth_token', tokenInput.value)
  localStorage.setItem('auth_user', JSON.stringify(userData))
  
  if (refreshTokenInput.value) {
    localStorage.setItem('refresh_token', refreshTokenInput.value)
    localStorage.setItem('auth_refresh_token', refreshTokenInput.value)
  }
  
  console.log('Saved tokens to localStorage')
  console.log('access_token:', tokenInput.value)
  console.log('user:', userData)
  
  savedUser.value = userData
  saved.value = true
  
  // Force reload auth state
  window.location.reload()
}

const useDefaultAdmin = () => {
  tokenInput.value = '3|aefftjK4E20n7CM14FaBP74glEAtt3mQKiaxgKek40541ef3'
  refreshTokenInput.value = '4|ghMTHaVG9R9lAn64ZjDpHlU1w0hTG5guyGi1F1Qr5febfba9'
  saveTokens()
}
</script>

<style scoped>
.container {
  padding: 2rem;
  max-width: 700px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

h2 {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 0.5rem;
}

h3 {
  margin-bottom: 1rem;
}

h4 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.info {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.input:focus {
  outline: none;
  border-color: #667eea;
}

small {
  display: block;
  margin-top: 0.5rem;
  color: #888;
  font-size: 0.875rem;
}

.btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;
  margin: 0.5rem;
  font-size: 1rem;
}

.btn:hover:not(:disabled) {
  background: #5a67d8;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn.secondary {
  background: #6b7280;
}

.btn.secondary:hover {
  background: #4b5563;
}

.success {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 0.5rem;
}

.error {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 0.5rem;
}

pre {
  background: white;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.links {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #c3e6cb;
}

.link {
  display: inline-block;
  margin: 0.25rem 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 0.375rem;
  border: 1px solid #667eea;
  transition: all 0.3s;
}

.link:hover {
  background: #667eea;
  color: white;
}
</style>
</template>