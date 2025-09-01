<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="logo">
        <div class="logo-icon">⚡</div>
        <h1>{{ pageTitle }}</h1>
        <p>{{ pageSubtitle }}</p>
      </div>

      <!-- Step 1: Identifier -->
      <form v-if="step === 'identifier'" @submit.prevent="handleIdentifier" class="auth-form">
        <div class="form-group">
          <input
            v-model="form.identifier"
            type="text"
            class="input"
            placeholder="ایمیل یا شماره موبایل"
            required
            autofocus
          />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'در حال بررسی...' : 'ادامه' }}
        </button>
      </form>

      <!-- Step 2: Password -->
      <form v-else-if="step === 'password'" @submit.prevent="handlePassword" class="auth-form">
        <div class="identifier-display">
          <span>{{ form.identifier }}</span>
          <button type="button" @click="resetForm" class="btn-link">تغییر</button>
        </div>

        <div class="form-group" v-if="isNewUser">
          <input
            v-model="form.name"
            type="text"
            class="input"
            placeholder="نام و نام خانوادگی"
            required
            autofocus
          />
        </div>

        <div class="form-group">
          <input
            v-model="form.password"
            type="password"
            class="input"
            placeholder="رمز عبور"
            required
            :autofocus="!isNewUser"
          />
        </div>

        <div class="form-group" v-if="isNewUser">
          <input
            v-model="form.confirmPassword"
            type="password"
            class="input"
            placeholder="تکرار رمز عبور"
            required
          />
        </div>

        <button type="button" @click="requestOTP" class="btn-link" v-if="!isNewUser">
          ورود با کد یکبار مصرف
        </button>

        <button type="submit" class="btn btn-primary" :disabled="loading || (isNewUser && form.password !== form.confirmPassword)">
          {{ loading ? (isNewUser ? 'در حال ثبت نام...' : 'در حال ورود...') : (isNewUser ? 'ثبت نام' : 'ورود') }}
        </button>

        <div v-if="isNewUser && form.password && form.confirmPassword && form.password !== form.confirmPassword" class="error-message">
          رمز عبور و تکرار آن یکسان نیستند
        </div>
      </form>

      <!-- Step 3: OTP -->
      <form v-else-if="step === 'otp'" @submit.prevent="handleOTP" class="auth-form">
        <div class="identifier-display">
          <span>{{ form.identifier }}</span>
          <button type="button" @click="resetForm" class="btn-link">تغییر</button>
        </div>

        <p class="otp-message">
          کد 6 رقمی به {{ utils.getIdentifierType(form.identifier) === 'email' ? 'ایمیل' : 'شماره موبایل' }} شما ارسال شد
        </p>

        <div class="form-group">
          <input
            v-model="form.otp"
            type="text"
            class="input otp-input"
            placeholder="کد 6 رقمی"
            maxlength="6"
            pattern="[0-9]{6}"
            required
            autofocus
          />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading || !validators.otp(form.otp)">
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

      <div v-if="error" class="error-message">
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

const { checkUserIdentifier, loginPassword, register, sendOTP, verifyOTP, loading } = useAuth()
const { showToast } = useToast()
const { validators, utils } = useUtils()

// Form state
const step = ref<'identifier' | 'password' | 'otp'>('identifier')
const form = reactive({
  identifier: '',
  name: '',
  password: '',
  confirmPassword: '',
  otp: ''
})
const error = ref('')
const timer = ref(0)
const userHasPassword = ref(true)
const isNewUser = ref(false)

let timerInterval: NodeJS.Timeout | null = null

// Computed
const canResend = computed(() => timer.value === 0)

const pageTitle = computed(() => {
  switch (step.value) {
    case 'identifier': return 'ورود / ثبت نام'
    case 'password': return isNewUser.value ? 'ثبت نام در سیستم' : 'وارد کردن رمز عبور'
    case 'otp': return 'تایید کد یکبار مصرف'
    default: return 'ورود'
  }
})

const pageSubtitle = computed(() => {
  switch (step.value) {
    case 'identifier': return 'ایمیل یا شماره موبایل خود را وارد کنید'
    case 'password': return isNewUser.value ? 'اطلاعات خود را برای ثبت نام وارد کنید' : 'رمز عبور خود را وارد کنید'
    case 'otp': return 'کد ارسال شده را وارد کنید'
    default: return ''
  }
})

// Methods
const resetForm = () => {
  step.value = 'identifier'
  Object.assign(form, { identifier: '', name: '', password: '', confirmPassword: '', otp: '' })
  error.value = ''
  isNewUser.value = false
  stopTimer()
}

const startTimer = (seconds = 120) => {
  timer.value = seconds
  timerInterval = setInterval(() => {
    timer.value--
    if (timer.value <= 0) stopTimer()
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
    // For demo, we check if it's a known user
    const knownUsers = ['user@example.com', 'admin@example.com', '09123456789', '09123456788']
    const userExists = knownUsers.includes(form.identifier)
    
    if (userExists) {
      isNewUser.value = false
      userHasPassword.value = true
      step.value = 'password'
    } else {
      // New user - show registration form
      isNewUser.value = true
      step.value = 'password'
    }
  } catch (err) {
    error.value = 'خطا در بررسی کاربر'
  }
}

const handlePassword = async () => {
  error.value = ''

  try {
    if (isNewUser.value) {
      // Register new user
      if (form.password !== form.confirmPassword) {
        error.value = 'رمز عبور و تکرار آن یکسان نیستند'
        return
      }
      
      if (!form.name || form.name.trim().length < 2) {
        error.value = 'نام باید حداقل 2 کاراکتر باشد'
        return
      }
      
      const result = await register(form.identifier, form.password, form.name)
      
      if (result.success) {
        await navigateTo('/dashboard')
      } else {
        error.value = result.message || 'خطا در ثبت نام'
      }
    } else {
      // Login existing user
      const result = await loginPassword(form.identifier, form.password)

      if (result.success) {
        await navigateTo('/dashboard')
      } else {
        error.value = result.message || 'رمز عبور اشتباه است'
      }
    }
  } catch (err: any) {
    error.value = err.message || (isNewUser.value ? 'خطا در ثبت نام' : 'خطا در ورود')
  }
}

const requestOTP = async () => {
  error.value = ''

  try {
    const result = await sendOTP(form.identifier)

    if (result.success) {
      step.value = 'otp'
      startTimer(120)

      if (result.debug_code) {
        console.log('Debug OTP:', result.debug_code)
      }
    } else {
      error.value = result.message || 'خطا در ارسال کد'
    }
  } catch (err: any) {
    error.value = err.message || 'خطا در ارسال کد'
  }
}

const handleOTP = async () => {
  error.value = ''

  try {
    const result = await verifyOTP(form.identifier, form.otp)

    if (result.success) {
      stopTimer()
      await navigateTo('/dashboard')
    } else {
      error.value = result.message || 'کد وارد شده اشتباه است'
      form.otp = ''
    }
  } catch (err: any) {
    error.value = err.message || 'خطا در تایید کد'
    form.otp = ''
  }
}

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
  padding: 2rem 1rem;
  direction: rtl;
}

.auth-container {
  background: white;
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 420px;
}

.logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
}

.logo h1 {
  font-size: 1.5rem;
  color: var(--dark);
  margin-bottom: 0.5rem;
}

.logo p {
  color: var(--gray);
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 0;
}

.input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
}

.input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.otp-input {
  text-align: center;
  font-size: 1.25rem;
  letter-spacing: 0.5rem;
  font-weight: 600;
}

.identifier-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--gray-50);
  border-radius: 0.5rem;
  border: 1px solid var(--border);
}

.identifier-display span {
  font-weight: 600;
  color: var(--dark);
}

.btn-link {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s;
  text-decoration: underline;
}

.btn-link:hover {
  color: var(--primary-dark);
}

.otp-message {
  text-align: center;
  color: var(--gray);
  background: var(--gray-50);
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  margin: 0;
}

.resend-btn {
  align-self: center;
  margin-top: 0.5rem;
}

.timer {
  text-align: center;
  color: var(--gray);
  font-size: 0.875rem;
  margin-top: 1rem;
}

.error-message {
  background: var(--danger-light);
  color: var(--danger);
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1rem;
  animation: shake 0.3s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@media (max-width: 480px) {
  .auth-container {
    padding: 2rem 1.5rem;
  }

  .logo-icon {
    width: 56px;
    height: 56px;
    font-size: 1.75rem;
  }

  .otp-input {
    letter-spacing: 0.25rem;
  }
}
</style>
