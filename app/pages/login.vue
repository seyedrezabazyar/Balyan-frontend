<!-- pages/login.vue -->
<template>
  <div class="login-container">
    <div class="login-wrapper">
      <!-- Login Card -->
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
              <path d="M2 17L12 22L22 17"></path>
              <path d="M2 12L12 17L22 12"></path>
            </svg>
          </div>
          <h1 class="login-title">خوش آمدید</h1>
          <p class="login-subtitle">برای ادامه وارد حساب کاربری خود شوید</p>
        </div>

        <!-- Legacy Login Form (Fallback) -->
        <form @click.prevent="handleLegacyLogin" class="login-form">
          <!-- Username Field -->
          <div class="form-group">
            <label for="username" class="form-label">نام کاربری</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                id="username"
                v-model="username"
                type="text"
                class="form-input"
                placeholder="admin"
                required
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label for="password" class="form-label">رمز عبور</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="1234"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
              >
                <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="rememberMe" class="checkbox-input" />
              <span class="checkbox-text">مرا به خاطر بسپار</span>
            </label>
            <NuxtLink to="/auth/login" class="forgot-link">سیستم جدید احراز هویت</NuxtLink>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <button type="submit" class="submit-btn" :disabled="isLoading">
            <svg v-if="!isLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span v-if="!isLoading">ورود (Legacy)</span>
            <span v-else>در حال ورود...</span>
          </button>
        </form>

        <!-- Demo Info -->
        <div class="demo-info">
          <p class="demo-title">حساب آزمایشی Legacy:</p>
          <div class="demo-credentials">
            <span>نام کاربری: <strong>admin</strong></span>
            <span>رمز عبور: <strong>1234</strong></span>
          </div>
        </div>

        <!-- Footer Links -->
        <div class="login-footer">
          <p>حساب کاربری ندارید؟ <NuxtLink to="/auth/register" class="signup-link">ثبت نام کنید</NuxtLink></p>
          <NuxtLink to="/" class="home-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            بازگشت به صفحه اصلی
          </NuxtLink>
        </div>
      </div>

      <!-- Side Decoration -->
      <div class="side-decoration">
        <div class="decoration-content">
          <h2>سیستم مدیریت هوشمند</h2>
          <p>با ورود به سیستم، به تمامی امکانات مدیریتی دسترسی خواهید داشت</p>
          <div class="features-list">
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>داشبورد پیشرفته</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>گزارشات لحظه‌ای</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>مدیریت کاربران</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>امنیت بالا</span>
            </div>
          </div>

          <!-- New Auth System Button -->
          <div class="new-auth-button">
            <NuxtLink to="/auth/login" class="new-auth-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                <path d="M2 17L12 22L22 17"></path>
                <path d="M2 12L12 17L22 12"></path>
              </svg>
              سیستم جدید احراز هویت
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Form data
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

// UI state
const isLoading = ref(false)
const errorMessage = ref('')

// Handle legacy login (existing functionality)
const handleLegacyLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Simple validation (username: admin, password: 1234)
  if (username.value === 'admin' && password.value === '1234') {
    // Save login status to localStorage (legacy way)
    if (import.meta.client) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', username.value)

      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true')
      }
    }

    // Redirect to dashboard
    await navigateTo('/dashboard')
  } else {
    errorMessage.value = 'نام کاربری یا رمز عبور اشتباه است'
    isLoading.value = false
  }
}

// Check if user is already logged in
onMounted(() => {
  if (import.meta.client) {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn === 'true') {
      navigateTo('/dashboard')
    }
  }
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
}

.login-wrapper {
  display: flex;
  width: 100%;
  max-width: 1200px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Login Card */
.login-card {
  flex: 1;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px;
  color: white;
  margin-bottom: 20px;
}

.login-title {
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 10px;
}

.login-subtitle {
  color: #6b7280;
  font-size: 1rem;
}

/* Form Styles */
.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 500;
  font-size: 0.95rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  right: 15px;
  color: #9ca3af;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 12px 45px 12px 15px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
}

.form-input::placeholder {
  color: #9ca3af;
}

.password-toggle {
  position: absolute;
  left: 15px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #667eea;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  margin-left: 8px;
  cursor: pointer;
}

.checkbox-text {
  color: #6b7280;
  font-size: 0.95rem;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Demo Info */
.demo-info {
  margin-top: 30px;
  padding: 15px;
  background: #f3f4f6;
  border-radius: 10px;
  text-align: center;
}

.demo-title {
  color: #6b7280;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.demo-credentials {
  display: flex;
  justify-content: center;
  gap: 20px;
  color: #374151;
  font-size: 0.95rem;
}

.demo-credentials strong {
  color: #667eea;
  font-weight: 600;
}

/* Footer Links */
.login-footer {
  margin-top: 30px;
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
}

.signup-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.signup-link:hover {
  text-decoration: underline;
}

.home-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.3s ease;
}

.home-link:hover {
  color: #667eea;
}

/* Side Decoration */
.side-decoration {
  flex: 1;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.side-decoration::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  animation: moveGrid 20s linear infinite;
}

@keyframes moveGrid {
  0% { transform: translate(0, 0); }
  100% { transform: translate(30px, 30px); }
}

.decoration-content {
  position: relative;
  z-index: 1;
  color: white;
}

.decoration-content h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.decoration-content p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0.9;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 40px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.feature-item svg {
  color: #ffd700;
}

.feature-item span {
  font-size: 1rem;
}

.new-auth-button {
  text-align: center;
}

.new-auth-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.new-auth-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 900px) {
  .side-decoration {
    display: none;
  }

  .login-card {
    min-width: unset;
    padding: 40px 30px;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .demo-credentials {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
