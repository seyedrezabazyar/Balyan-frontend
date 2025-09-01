<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>ورود</h1>
      
      <form @submit.prevent="handleLogin">
        <input
          v-model="identifier"
          type="text"
          placeholder="ایمیل یا شماره موبایل"
          required
        />
        
        <input
          v-model="password"
          type="password"
          placeholder="رمز عبور"
          required
        />
        
        <button type="submit" :disabled="loading">
          {{ loading ? 'در حال ورود...' : 'ورود' }}
        </button>
      </form>
      
      <div v-if="error" class="error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'guest'
})

const { loginPassword, loading } = useAuth()

const identifier = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  
  try {
    const result = await loginPassword(identifier.value, password.value)
    
    if (result.success) {
      await navigateTo('/dashboard')
    } else {
      error.value = 'نام کاربری یا رمز عبور اشتباه است'
    }
  } catch (err) {
    error.value = 'خطا در ورود'
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  direction: rtl;
}

.auth-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 350px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
}

button {
  padding: 0.75rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #45a049;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #ffebee;
  color: #c62828;
  border-radius: 4px;
  text-align: center;
}
</style>