<!-- pages/auth.vue -->
<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo">⚡</div>
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>

      <!-- Step 1: Enter identifier -->
      <div v-if="step === 1" class="auth-form">
        <div class="form-group">
          <input
            v-model="form.identifier"
            type="text"
            placeholder="ایمیل یا شماره تلفن"
            @keyup.enter="handleStep1"
          />
        </div>

        <div v-if="needsName" class="form-group">
          <input
            v-model="form.name"
            type="text"
            placeholder="نام و نام خانوادگی"
            @keyup.enter="handleStep1"
          />
        </div>

        <button @click="handleStep1" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'در حال بررسی...' : 'ادامه' }}
        </button>
      </div>

      <!-- Step 2: Password or OTP choice -->
      <div v-else-if="step === 2" class="auth-form">
        <div class="user-info">
          <span>{{ form.identifier }}</span>
          <button type="button" @click="goBack">تغییر</button>
        </div>

        <div class="form-group">
          <input
            v-model="form.password"
            type="password"
            placeholder="رمز عبور"
            @keyup.enter="handlePassword"
          />
          <button @click="handlePassword" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'در حال ورود...' : 'ورود' }}
          </button>
        </div>

        <div class="divider">یا</div>

        <button @click="switchToOTP" class="btn btn-secondary">
          ورود با کد تایید
        </button>
      </div>

      <!-- Step 3: OTP verification -->
      <div v-else-if="step === 3" class="auth-form">
        <div class="user-info">
          <span>{{ form.identifier }}</span>
          <button type="button" @click="goBack">تغییر</button>
        </div>

        <p class="otp-info">
          کد 6 رقمی به {{ form.identifier.includes('@') ? 'ایمیل' : 'شماره' }} شما ارسال شد
        </p>

        <div class="form-group">
          <input
            v-model="form.otp"
            type="text"
            placeholder="123456"
            maxlength="6"
            class="otp-input"
            @keyup.enter="handleOTP"
          />
        </div>

        <div v-if="timer > 0" class="timer">
          ارسال مجدد تا {{ timer }} ثانیه
        </div>
        <button v-else type="button" @click="resendOTP" class="resend-btn">
          ارسال مجدد کد
        </button>

        <button @click="handleOTP" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'تایید...' : 'تایید' }}
        </button>
      </div>

      <!-- Step 4: Success (This should not be shown as we navigate immediately) -->
      <div v-else-if="step === 4" class="success-step">
        <div class="success-icon">✅</div>
        <h2>ورود موفق!</h2>
        <p>در حال انتقال به داشبورد...</p>
      </div>

      <!-- Error message -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'guest', layout: false })

const { checkUser, loginPassword, sendOTP, verifyOTP, loading } = useAuth()

// Reactive state
const step = ref(1)
const form = reactive({
  identifier: '',
  name: '',
  password: '',
  otp: ''
})
const error = ref('')
const needsName = ref(false)
const timer = ref(0)
let timerInterval = null; // Fixed: Added semicolon

// Computed properties
const title = computed(() => {
  const titles = ['احراز هویت', 'ورود', 'تایید کد', 'موفق!']
  return titles[step.value - 1]
})

const subtitle = computed(() => {
  const subtitles = [
    'ایمیل یا شماره تلفن خود را وارد کنید',
    'رمز عبور خود را وارد کنید',
    'کد تایید ارسال شده را وارد کنید',
    'شما با موفقیت وارد شدید'
  ]
  return subtitles[step.value - 1]
})

// Helper methods
const clearError = () => error.value = ''
const goBack = () => {
  step.value = 1
  clearError()
  Object.assign(form, { password: '', otp: '' })
}

const startTimer = () => {
  timer.value = 120
  timerInterval = setInterval(() => {
    timer.value--
    if (timer.value <= 0) {
      clearInterval(timerInterval)
    }
  }, 1000)
}

// Main handlers
const handleStep1 = async () => {
  clearError()
  if (!form.identifier.trim()) return

  try {
    const result = await checkUser(form.identifier)
    if (result.status === 'new_user') {
      needsName.value = true
      if (!form.name.trim()) return
    }

    if (result.status === 'existing_user_with_password') {
      step.value = 2
    } else {
      await sendOTPAndProceed()
    }
  } catch (err) {
    error.value = err.message
  }
}

const handlePassword = async () => {
  clearError()
  if (!form.password.trim()) return

  try {
    const result = await loginPassword(form.identifier, form.password)
    if (result.success) {
      // Navigate immediately after successful login without showing success step
      await navigateTo('/dashboard', { replace: true })
    }
  } catch (err) {
    error.value = err.message
  }
}

const switchToOTP = async () => {
  await sendOTPAndProceed()
}

const sendOTPAndProceed = async () => {
  try {
    await sendOTP(form.identifier)
    step.value = 3
    startTimer()
  } catch (err) {
    error.value = err.message
  }
}

const handleOTP = async () => {
  clearError()
  if (form.otp.length !== 6) return

  try {
    const result = await verifyOTP(form.identifier, form.otp, form.name)
    if (result.success) {
      // Navigate immediately after successful OTP verification without showing success step
      await navigateTo('/dashboard', { replace: true })
    }
  } catch (err) {
    error.value = err.message
  }
}

const resendOTP = () => sendOTPAndProceed()

// Cleanup
onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary), #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: var(--radius);
  padding: 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary), #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  margin: 0 auto 16px;
}

.auth-header h1 {
  margin-bottom: 8px;
  color: var(--dark);
}

.auth-header p {
  color: var(--gray);
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--light);
  border-radius: 8px;
  font-weight: 500;
}

.user-info button {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-size: 0.9rem;
}

.divider {
  text-align: center;
  color: var(--gray);
  position: relative;
  margin: 8px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
  z-index: 0;
}

.otp-info {
  background: #e0f2fe;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
}

.otp-input {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.5rem;
}

.timer {
  text-align: center;
  background: #fef3c7;
  color: #92400e;
  padding: 8px;
  border-radius: 8px;
  font-size: 0.9rem;
}

.resend-btn {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  text-align: center;
  padding: 8px;
  font-weight: 500;
}

.success-step {
  text-align: center;
  padding: 32px 0;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.success-step h2 {
  color: var(--success);
  margin-bottom: 8px;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin-top: 16px;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px;
  }
}
</style>
