<template>
  <div class="auth-container">
    <div class="auth-wrapper">
      <!-- Main Auth Card -->
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
              <path d="M2 17L12 22L22 17"></path>
              <path d="M2 12L12 17L22 12"></path>
            </svg>
          </div>
          <h1 class="auth-title">{{ getTitle() }}</h1>
          <p class="auth-subtitle">{{ getSubtitle() }}</p>
        </div>

        <div class="auth-form">
          <!-- Step 1: Identifier Input -->
          <div v-if="step === 1" class="step-container">
            <div class="form-group">
              <label for="identifier" class="form-label">ایمیل یا شماره تلفن</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22 6 12 13 2 6"></polyline>
                </svg>
                <input
                  id="identifier"
                  v-model="identifier"
                  type="text"
                  class="form-input"
                  placeholder="example@email.com یا 09123456789"
                  :disabled="isLoading"
                  @keyup.enter="handleIdentifierSubmit"
                />
              </div>
            </div>

            <!-- Name Input (only shown for registration flow) -->
            <div v-if="showNameInput" class="form-group">
              <label for="name" class="form-label">نام و نام خانوادگی</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  class="form-input"
                  placeholder="نام کامل خود را وارد کنید"
                  :disabled="isLoading"
                  @keyup.enter="handleIdentifierSubmit"
                />
              </div>
            </div>

            <!-- Error/Success Messages -->
            <div v-if="errorMessage" class="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {{ errorMessage }}
            </div>

            <div v-if="successMessage" class="success-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {{ successMessage }}
            </div>

            <!-- Submit Button -->
            <button
              @click="handleIdentifierSubmit"
              class="submit-btn"
              :disabled="isLoading || !identifier.trim() || (showNameInput && !name.trim())"
            >
              <svg v-if="!isLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
              <div v-else class="loading-spinner"></div>
              <span v-if="!isLoading">ادامه</span>
              <span v-else>در حال بررسی...</span>
            </button>
          </div>

          <!-- Step 2: Password Input -->
          <div v-if="step === 2" class="step-container">
            <div class="user-info">
              <p>ورود برای: <strong>{{ userInfo.identifier }}</strong></p>
              <button @click="goBack" class="back-btn">تغییر</button>
            </div>

            <div v-if="userInfo.user_name" class="welcome-message">
              <p>خوش آمدید، {{ userInfo.user_name }}! 👋</p>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">رمز عبور</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="رمز عبور خود را وارد کنید"
                  :disabled="isLoading"
                  @keyup.enter="handlePasswordLogin"
                />
                <button type="button" @click="showPassword = !showPassword" class="toggle-password">
                  <svg v-if="showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="errorMessage" class="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {{ errorMessage }}
            </div>

            <div class="action-buttons">
              <button
                @click="handlePasswordLogin"
                class="submit-btn btn-primary"
                :disabled="isLoading || !password.trim()"
              >
                <svg v-if="!isLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <div v-else class="loading-spinner"></div>
                <span v-if="!isLoading">ورود</span>
                <span v-else>در حال ورود...</span>
              </button>

              <button @click="switchToOTP" class="submit-btn btn-secondary" :disabled="isLoading">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                ورود با کد
              </button>
            </div>
          </div>

          <!-- Step 3: OTP Verification -->
          <div v-if="step === 3" class="step-container">
            <div class="user-info">
              <p>تایید برای: <strong>{{ userInfo.identifier }}</strong></p>
              <button @click="goBack" class="back-btn">تغییر</button>
            </div>

            <div class="otp-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <p>{{ getOTPMessage() }}</p>
            </div>

            <div class="form-group">
              <label for="otpCode" class="form-label">کد تایید</label>
              <div class="input-wrapper">
                <input
                  id="otpCode"
                  v-model="otpCode"
                  type="text"
                  class="form-input otp-input"
                  placeholder="123456"
                  maxlength="6"
                  :disabled="isLoading"
                  @input="handleOTPInput"
                  @keyup.enter="handleOTPVerify"
                />
              </div>
            </div>

            <!-- Timer -->
            <div v-if="otpTimer > 0" class="otp-timer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ارسال مجدد کد تا {{ otpTimer }} ثانیه دیگر
            </div>

            <!-- Resend Button -->
            <div v-else class="resend-container">
              <p>کد را دریافت نکردید؟</p>
              <button @click="handleResendOTP" class="resend-btn" :disabled="isLoading">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                ارسال مجدد
              </button>
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
            <button
              @click="handleOTPVerify"
              class="submit-btn"
              :disabled="isLoading || otpCode.length !== 6"
            >
              <svg v-if="!isLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              <div v-else class="loading-spinner"></div>
              <span v-if="!isLoading">{{ isRegistration ? 'ثبت نام' : 'ورود' }}</span>
              <span v-else>{{ isRegistration ? 'در حال ثبت نام...' : 'در حال ورود...' }}</span>
            </button>
          </div>

          <!-- Step 4: Success -->
          <div v-if="step === 4" class="step-container">
            <div class="success-container">
              <div class="success-icon">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h2>{{ isRegistration ? 'ثبت نام موفقیت‌آمیز!' : 'ورود موفقیت‌آمیز!' }}</h2>
              <p>{{ isRegistration ? 'حساب کاربری شما ایجاد شد.' : 'به حساب کاربری خود خوش آمدید.' }}</p>

              <button @click="goToDashboard" class="submit-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                ورود به داشبورد
              </button>
            </div>
          </div>
        </div>

        <!-- Footer Links -->
        <div class="auth-footer" v-if="step !== 4">
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
          <h2>ورود آسان و امن</h2>
          <p>سیستم احراز هویت پیشرفته با پشتیبانی از OTP</p>
          <div class="features-list">
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
              </svg>
              <span>امنیت بالا</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>تایید با OTP</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
              <span>سرعت بالا</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Composable
const { checkUser, loginWithPassword, sendOTP, verifyOTP, isLoading } = useAuth()

// Middleware
definePageMeta({
  middleware: 'guest',
  layout: false
})

// State
const step = ref(1) // 1: identifier, 2: password, 3: otp, 4: success
const identifier = ref('')
const name = ref('')
const password = ref('')
const otpCode = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const otpTimer = ref(0)
const userInfo = ref({})
const isRegistration = ref(false)
let timerInterval = null

// Computed
const showNameInput = computed(() => {
  // Show name input if we detected it's a new user
  return userInfo.value.status === 'new_user'
})

// Methods
const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const goBack = () => {
  step.value = 1
  clearMessages()
  password.value = ''
  otpCode.value = ''
  userInfo.value = {}
}

const goToDashboard = () => {
  navigateTo('/dashboard')
}

const getTitle = () => {
  if (step.value === 1 && showNameInput.value) return 'ثبت نام'
  if (step.value === 2) return 'ورود به حساب'
  if (step.value === 3) return isRegistration.value ? 'تکمیل ثبت نام' : 'تایید ورود'
  return 'احراز هویت'
}

const getSubtitle = () => {
  if (step.value === 1 && showNameInput.value) return 'برای ایجاد حساب جدید اطلاعات خود را وارد کنید'
  if (step.value === 2) return 'رمز عبور خود را وارد کنید'
  if (step.value === 3) return 'کد تایید ارسال شده را وارد کنید'
  return 'ایمیل یا شماره تلفن خود را وارد کنید'
}

const getOTPMessage = () => {
  const type = identifier.value.includes('@') ? 'ایمیل' : 'شماره تلفن'
  return `کد تایید 6 رقمی به ${type} شما ارسال شد`
}

const startOTPTimer = (seconds = 120) => {
  otpTimer.value = seconds
  if (timerInterval) clearInterval(timerInterval)

  timerInterval = setInterval(() => {
    otpTimer.value--
    if (otpTimer.value <= 0) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }, 1000)
}

// Step 1: Check user and determine flow
const handleIdentifierSubmit = async () => {
  clearMessages()

  if (!identifier.value.trim()) {
    errorMessage.value = 'لطفاً ایمیل یا شماره تلفن خود را وارد کنید'
    return
  }

  console.log('🔍 Checking user...', identifier.value)

  const result = await checkUser(identifier.value)

  console.log('📋 Check result:', result)

  if (!result.success) {
    errorMessage.value = result.message || 'خطا در بررسی حساب کاربری'
    return
  }

  // Store user info for next steps
  userInfo.value = result

  // Route based on user status
  if (result.status === 'existing_user_with_password') {
    // User exists and has password → go to password step
    step.value = 2
  } else if (result.status === 'existing_user_otp_only') {
    // User exists but no password → send OTP for login
    isRegistration.value = false
    await sendOTPAndProceed()
  } else if (result.status === 'new_user') {
    // New user → check if name is provided
    if (!name.value.trim()) {
      errorMessage.value = 'لطفاً نام و نام خانوادگی خود را وارد کنید'
      return
    }
    // Send OTP for registration
    isRegistration.value = true
    await sendOTPAndProceed()
  } else {
    errorMessage.value = 'وضعیت نامشخص کاربری'
  }
}

// Step 2: Password login
const handlePasswordLogin = async () => {
  clearMessages()

  if (!password.value.trim()) {
    errorMessage.value = 'لطفاً رمز عبور خود را وارد کنید'
    return
  }

  console.log('🔐 Logging in with password...')

  const result = await loginWithPassword(identifier.value, password.value)

  if (result.success) {
    step.value = 4
    setTimeout(() => {
      navigateTo('/dashboard')
    }, 2000)
  } else {
    errorMessage.value = result.message || 'نام کاربری یا رمز عبور اشتباه است'
  }
}

// Switch to OTP login from password step
const switchToOTP = async () => {
  clearMessages()
  isRegistration.value = false
  await sendOTPAndProceed()
}

// Send OTP and proceed to step 3
const sendOTPAndProceed = async () => {
  console.log('📱 Sending OTP...')

  const result = await sendOTP(identifier.value)

  if (result.success) {
    step.value = 3
    startOTPTimer()
    successMessage.value = 'کد تایید با موفقیت ارسال شد!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } else {
    errorMessage.value = result.message || 'خطا در ارسال کد تایید'
  }
}

// OTP input handler
const handleOTPInput = (event) => {
  const target = event.target
  target.value = target.value.replace(/[^0-9]/g, '')
  otpCode.value = target.value
}

// Step 3: Verify OTP
const handleOTPVerify = async () => {
  clearMessages()

  if (otpCode.value.length !== 6) {
    errorMessage.value = 'لطفاً کد تایید 6 رقمی را وارد کنید'
    return
  }

  console.log('✅ Verifying OTP...')

  // For registration, pass the name
  const userName = isRegistration.value ? name.value : undefined

  const result = await verifyOTP(identifier.value, otpCode.value, userName)

  if (result.success) {
    step.value = 4
    setTimeout(() => {
      navigateTo('/dashboard')
    }, 2000)
  } else {
    errorMessage.value = result.message || 'کد تایید اشتباه است'
  }
}

// Resend OTP
const handleResendOTP = async () => {
  clearMessages()
  await sendOTPAndProceed()
}

// Cleanup
onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.auth-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
}

.auth-wrapper {
  display: flex;
  width: 100%;
  max-width: 1200px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  min-height: 600px;
}

.auth-card {
  flex: 1;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 400px;
}

.auth-header {
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

.auth-title {
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 10px;
}

.auth-subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.auth-form {
  flex: 1;
}

.step-container {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f3f4f6;
  border-radius: 10px;
  margin-bottom: 25px;
}

.welcome-message {
  padding: 15px;
  background: #d1fae5;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: center;
  color: #065f46;
}

.back-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background: #e0e7ff;
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
  z-index: 1;
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

.otp-input {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.5rem;
  padding-right: 15px;
}

.toggle-password {
  position: absolute;
  left: 15px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.3s;
}

.toggle-password:hover {
  color: #374151;
}

.otp-info {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #e0f2fe;
  border-radius: 10px;
  margin-bottom: 25px;
}

.otp-timer {
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: center;
  padding: 10px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.resend-container {
  text-align: center;
  margin-bottom: 20px;
}

.resend-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.resend-btn:hover:not(:disabled) {
  background: #e0e7ff;
}

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

.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #d1fae5;
  color: #065f46;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
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

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-buttons .submit-btn {
  width: auto;
  flex: 1;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.success-container {
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  margin-bottom: 20px;
}

.success-icon svg {
  color: #10b981;
}

.success-container h2 {
  color: #1f2937;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.success-container p {
  color: #6b7280;
  margin-bottom: 30px;
}

.auth-footer {
  margin-top: 30px;
  text-align: center;
}

.home-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.3s ease;
}

.home-link:hover {
  color: #374151;
}

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
  text-align: center;
}

.decoration-content h2 {
  font-size: 2rem;
  margin-bottom: 15px;
}

.decoration-content p {
  font-size: 1.1rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

@media (max-width: 900px) {
  .side-decoration {
    display: none;
  }

  .auth-card {
    min-width: unset;
    padding: 40px 30px;
  }
}

@media (max-width: 480px) {
  .auth-container {
    padding: 10px;
  }

  .auth-card {
    padding: 30px 20px;
  }

  .auth-title {
    font-size: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .form-input {
    padding: 12px 40px 12px 12px;
  }
}
</style>
