<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Logo -->
      <div class="logo">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7V12C2 16.5 4.5 20.74 8 22C12 20.74 22 16.5 22 12V7L12 2Z" fill="currentColor" />
        </svg>
      </div>

      <!-- Title -->
      <h1 class="title">{{ pageTitle }}</h1>
      <p class="subtitle">{{ pageSubtitle }}</p>

      <!-- Form Container -->
      <div class="form-container">
        <!-- Step 1: Enter Identifier -->
        <form v-if="step === 'identifier'" @submit.prevent="handleIdentifier">
          <div class="form-group">
            <input
              v-model="identifier"
              type="text"
              class="input"
              placeholder="ایمیل یا شماره موبایل"
              required
              autofocus
            />
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'در حال پردازش...' : 'ادامه' }}
          </button>
        </form>

        <!-- Step 2: Password -->
        <form v-else-if="step === 'password'" @submit.prevent="handlePassword">
          <div class="identifier-display">
            <span>{{ identifier }}</span>
            <button type="button" @click="resetForm" class="btn-link">تغییر</button>
          </div>

          <div class="form-group">
            <input
              v-model="password"
              type="password"
              class="input"
              placeholder="رمز عبور"
              required
              autofocus
            />
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'در حال ورود...' : 'ورود' }}
          </button>

          <div class="divider">یا</div>

          <button type="button" @click="requestOTP" class="btn btn-secondary">
            ورود با کد یکبار مصرف
          </button>
        </form>

        <!-- Step 3: OTP -->
        <form v-else-if="step === 'otp'" @submit.prevent="handleOTP">
          <div class="identifier-display">
            <span>{{ identifier }}</span>
            <button type="button" @click="resetForm" class="btn-link">تغییر</button>
          </div>

          <p class="otp-message">
            کد 6 رقمی به {{ isEmail ? 'ایمیل' : 'شماره موبایل' }} شما ارسال شد
          </p>

          <div class="form-group">
            <input
              v-model="otp"
              type="text"
              class="input otp-input"
              placeholder="کد 6 رقمی"
              maxlength="6"
              pattern="[0-9]{6}"
              required
              autofocus
            />
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading || otp.length !== 6">
            {{ loading ? 'در حال تایید...' : 'تایید و ورود' }}
          </button>

          <button 
            v-if="canResend" 
            type="button" 
            @click="requestOTP" 
            class="btn-link resend-btn"
          >
            ارسال مجدد کد
          </button>
          <span v-else class="timer">
            ارسال مجدد بعد از {{ timer }} ثانیه
          </span>
        </form>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

// Middleware
definePageMeta({
  layout: false,
  middleware: 'guest'
})

// Composables
const { loginPassword, sendOTP, verifyOTP, checkUserIdentifier, loading } = useAuth()
const router = useRouter()

// State
const step = ref('identifier')
const identifier = ref('')
const password = ref('')
const otp = ref('')
const error = ref('')
const timer = ref(0)
const userHasPassword = ref(true) // Default to true until we check
let timerInterval = null

// Computed
const isEmail = computed(() => identifier.value.includes('@'))
const canResend = computed(() => timer.value === 0)

const pageTitle = computed(() => {
  switch (step.value) {
    case 'identifier': return 'ورود به حساب'
    case 'password': return 'وارد کردن رمز عبور'
    case 'otp': return 'تایید کد یکبار مصرف'
    default: return 'ورود'
  }
})

const pageSubtitle = computed(() => {
  switch (step.value) {
    case 'identifier': return 'ایمیل یا شماره موبایل خود را وارد کنید'
    case 'password': return 'رمز عبور خود را وارد کنید'
    case 'otp': return 'کد ارسال شده را وارد کنید'
    default: return ''
  }
})

// Methods
const resetForm = () => {
  step.value = 'identifier'
  identifier.value = ''
  password.value = ''
  otp.value = ''
  error.value = ''
  stopTimer()
}

const startTimer = (seconds = 120) => {
  timer.value = seconds
  timerInterval = setInterval(() => {
    timer.value--
    if (timer.value <= 0) {
      stopTimer()
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  timer.value = 0
}

const handleIdentifier = async () => {
  error.value = ''
  
  try {
    // Check if user exists and has password
    const checkResult = await checkUserIdentifier(identifier.value)
    
    if (checkResult.success && checkResult.data) {
      userHasPassword.value = checkResult.data.has_password || false
      
      // تصمیم‌گیری بر اساس نوع identifier و وجود پسورد
      if (isEmail.value && userHasPassword.value) {
        // اگر ایمیل است و پسورد دارد، صفحه پسورد را نشان بده
        step.value = 'password'
      } else {
        // در غیر این صورت، مستقیم OTP ارسال کن
        await requestOTP()
      }
    } else {
      // اگر کاربر وجود ندارد، برای ثبت نام OTP ارسال کن
      await requestOTP()
    }
  } catch (err) {
    // در صورت خطا، فرض کن کاربر جدید است و OTP ارسال کن
    await requestOTP()
  }
}

const handlePassword = async () => {
  error.value = ''
  
  try {
    const result = await loginPassword(identifier.value, password.value)
    
    if (result.success) {
      // ورود موفق
      await router.push('/dashboard')
    } else {
      error.value = result.message || 'رمز عبور اشتباه است'
    }
  } catch (err) {
    error.value = err.message || 'خطا در ورود'
  }
}

const requestOTP = async () => {
  error.value = ''
  
  try {
    const result = await sendOTP(identifier.value)
    
    if (result.success) {
      step.value = 'otp'
      startTimer(120)
      
      // نمایش کد در حالت debug (فقط برای تست)
      if (result.debug_code) {
        console.log('Debug OTP Code:', result.debug_code)
      }
    } else {
      error.value = result.message || 'خطا در ارسال کد'
    }
  } catch (err) {
    error.value = err.message || 'خطا در ارسال کد'
  }
}

const handleOTP = async () => {
  error.value = ''
  
  try {
    const result = await verifyOTP(identifier.value, otp.value)
    
    if (result.success) {
      // ورود موفق
      stopTimer()
      await router.push('/dashboard')
    } else {
      error.value = result.message || 'کد وارد شده اشتباه است'
      otp.value = ''
    }
  } catch (err) {
    error.value = err.message || 'خطا در تایید کد'
    otp.value = ''
  }
}

// Cleanup
onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  color: white;
}

.title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin: 0 0 2rem;
  font-size: 0.875rem;
}

.form-container {
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  font-family: inherit;
}

.input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.otp-input {
  text-align: center;
  font-size: 1.25rem;
  letter-spacing: 0.5rem;
  font-weight: 600;
}

.btn {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-link {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s;
}

.btn-link:hover {
  text-decoration: underline;
}

.identifier-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.identifier-display span {
  font-weight: 600;
  color: #374151;
}

.divider {
  text-align: center;
  color: #9ca3af;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 2rem);
  height: 1px;
  background: #e5e7eb;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.otp-message {
  text-align: center;
  color: #6b7280;
  margin: 0 0 1.5rem;
  font-size: 0.875rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.resend-btn {
  display: block;
  margin: 1rem auto 0;
  width: auto;
}

.timer {
  display: block;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
  animation: shake 0.3s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .auth-container {
    background: #1f2937;
    color: #f3f4f6;
  }

  .title {
    color: #f3f4f6;
  }

  .subtitle {
    color: #9ca3af;
  }

  .input {
    background: #111827;
    border-color: #374151;
    color: #f3f4f6;
  }

  .input:focus {
    border-color: #818cf8;
    box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.1);
  }

  .btn-secondary {
    background: #374151;
    color: #f3f4f6;
  }

  .btn-secondary:hover {
    background: #4b5563;
  }

  .identifier-display {
    background: #374151;
  }

  .identifier-display span {
    color: #f3f4f6;
  }

  .otp-message {
    background: #374151;
    color: #d1d5db;
  }

  .error-message {
    background: #7f1d1d;
    color: #fecaca;
  }
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .auth-container {
    padding: 1.5rem;
  }

  .title {
    font-size: 1.25rem;
  }

  .otp-input {
    letter-spacing: 0.25rem;
  }
}
</style>