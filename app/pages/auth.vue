<!-- pages/auth.vue -->
<template>
  <div class="auth-page">
    <div class="background-pattern"></div>
    <transition name="card-fade" mode="out-in">
      <div class="auth-card" :key="step">
        <div class="auth-header">
          <div class="logo-container">
            <div class="logo">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V12C2 16.5 4.5 20.74 8 22C8.5 21.5 9 21 9.5 20.5C10.5 19.5 11.5 18.5 12 17.5C12.5 18.5 13.5 19.5 14.5 20.5C15 21 15.5 21.5 16 22C19.5 20.74 22 16.5 22 12V7L12 2Z" fill="url(#gradient1)" />
                <path d="M12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7Z" fill="white" opacity="0.9" />
                <defs>
                  <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="22">
                    <stop stop-color="#667eea" />
                    <stop offset="1" stop-color="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <transition name="slide-up" mode="out-in">
            <h1 :key="title">{{ title }}</h1>
          </transition>
          <transition name="slide-up" mode="out-in">
            <p :key="subtitle">{{ subtitle }}</p>
          </transition>
        </div>

        <transition name="fade-slide" mode="out-in">
          <!-- Step 1: Enter identifier -->
          <div v-if="step === 1" key="step1" class="auth-form">
            <div class="input-group">
              <div class="input-wrapper">
                <input
                  v-model="form.identifier"
                  type="text"
                  class="input-field"
                  placeholder=" "
                  @keyup.enter="handleStep1"
                  @input="clearError"
                  :class="{ 'has-error': error }"
                />
                <label class="input-label">ایمیل یا شماره تلفن</label>
                <span class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor" />
                  </svg>
                </span>
              </div>
            </div>

            <transition name="expand">
              <div v-if="needsName" class="input-group">
                <div class="input-wrapper">
                  <input
                    v-model="form.name"
                    type="text"
                    class="input-field"
                    placeholder=" "
                    @keyup.enter="handleStep1"
                    @input="clearError"
                  />
                  <label class="input-label">نام و نام خانوادگی</label>
                  <span class="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4C13.11 4 14 4.89 14 6C14 7.11 13.11 8 12 8C10.89 8 10 7.11 10 6C10 4.89 10.89 4 12 4ZM12 14C14.67 14 20 15.34 20 18V20H4V18C4 15.34 9.33 14 12 14Z" fill="currentColor" />
                    </svg>
                  </span>
                </div>
              </div>
            </transition>

            <AppButton
              @click="handleStep1"
              :loading="loading"
              :disabled="!form.identifier.trim() || (needsName && !form.name.trim())"
              variant="primary"
              size="lg"
              fullWidth
              rounded
            >
              ادامه
            </AppButton>
          </div>

          <!-- Step 2: Password or OTP choice -->
          <div v-else-if="step === 2" key="step2" class="auth-form">
            <div class="user-info-card">
              <div class="user-avatar">
                {{ form.identifier[0].toUpperCase() }}
              </div>
              <div class="user-details">
                <span class="user-identifier">{{ form.identifier }}</span>
                <button type="button" @click="goBack" class="change-btn">تغییر</button>
              </div>
            </div>

            <div class="input-group">
              <div class="input-wrapper">
                <input
                  v-model="form.password"
                  type="password"
                  class="input-field"
                  placeholder=" "
                  @keyup.enter="handlePassword"
                  @input="clearError"
                  :class="{ 'has-error': error }"
                />
                <label class="input-label">رمز عبور</label>
                <span class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="currentColor" />
                  </svg>
                </span>
              </div>
            </div>

            <AppButton
              @click="handlePassword"
              :loading="loading"
              :disabled="!form.password.trim()"
              variant="primary"
              size="lg"
              fullWidth
              rounded
            >
              ورود با رمز عبور
            </AppButton>

            <div class="divider-container">
              <div class="divider-line"></div>
              <span class="divider-text">یا</span>
              <div class="divider-line"></div>
            </div>

            <AppButton
              @click="switchToOTP"
              variant="secondary"
              size="lg"
              fullWidth
              rounded
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 8px">
                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor" />
              </svg>
              ورود با کد تایید
            </AppButton>
          </div>

          <!-- Step 3: OTP verification -->
          <div v-else-if="step === 3" key="step3" class="auth-form">
            <div class="user-info-card">
              <div class="user-avatar">
                {{ form.identifier[0].toUpperCase() }}
              </div>
              <div class="user-details">
                <span class="user-identifier">{{ form.identifier }}</span>
                <button type="button" @click="goBack" class="change-btn">تغییر</button>
              </div>
            </div>

            <div class="otp-info-card">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#667eea" />
              </svg>
              <p>کد 6 رقمی به {{ form.identifier.includes('@') ? 'ایمیل' : 'شماره' }} شما ارسال شد</p>
            </div>

            <div class="otp-input-container">
              <input
                v-for="(digit, index) in 6"
                :key="index"
                v-model="otpDigits[index]"
                type="text"
                maxlength="1"
                class="otp-digit"
                :ref="el => otpRefs[index] = el"
                @input="handleOtpInput(index)"
                @keydown="handleOtpKeydown($event, index)"
                @paste="handleOtpPaste"
                :class="{ 'filled': otpDigits[index] }"
              />
            </div>

            <div class="timer-container">
              <transition name="fade" mode="out-in">
                <div v-if="timer > 0" key="timer" class="timer-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.2 16.2L11 13V7H12.5V12.2L17 14.9L16.2 16.2Z" fill="currentColor" />
                  </svg>
                  <span>{{ formatTimer(timer) }}</span>
                </div>
                <AppButton
                  v-else
                  key="resend"
                  @click="resendOTP"
                  variant="ghost"
                  size="md"
                  rounded
                >
                  ارسال مجدد کد
                </AppButton>
              </transition>
            </div>

            <AppButton
              @click="handleOTP"
              :loading="loading"
              :disabled="otpDigits.join('').length !== 6"
              variant="primary"
              size="lg"
              fullWidth
              rounded
            >
              تایید و ورود
            </AppButton>
          </div>

          <!-- Step 4: Success -->
          <div v-else-if="step === 4" key="step4" class="success-step">
            <div class="success-animation">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#10b981" opacity="0.2" />
                <path d="M9 12L11 14L15 10" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h2>ورود موفق!</h2>
            <p>در حال انتقال به داشبورد...</p>
            <div class="loading-bar">
              <div class="loading-progress"></div>
            </div>
          </div>
        </transition>

        <!-- Error message -->
        <transition name="shake">
          <div v-if="error" class="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor" />
            </svg>
            {{ error }}
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import AppButton from '~/components/AppButton.vue'

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
const otpDigits = ref(Array(6).fill(''))
const otpRefs = ref([])
let timerInterval = null

// Computed properties
const title = computed(() => {
  const titles = ['خوش آمدید', 'ورود به حساب', 'تایید هویت', 'موفق!']
  return titles[step.value - 1]
})

const subtitle = computed(() => {
  const subtitles = [
    'برای ادامه، اطلاعات خود را وارد کنید',
    'رمز عبور خود را وارد کنید یا با کد تایید وارد شوید',
    'کد 6 رقمی ارسال شده را وارد کنید',
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
  otpDigits.value = Array(6).fill('')
}

const formatTimer = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
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

// OTP input handlers
const handleOtpInput = async (index) => {
  const value = otpDigits.value[index]
  if (value && index < 5) {
    await nextTick()
    otpRefs.value[index + 1]?.focus()
  }
  
  form.otp = otpDigits.value.join('')
  
  if (form.otp.length === 6) {
    handleOTP()
  }
}

const handleOtpKeydown = (event, index) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
}

const handleOtpPaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').slice(0, 6)
  const digits = pastedData.split('')
  digits.forEach((digit, index) => {
    if (index < 6 && /\d/.test(digit)) {
      otpDigits.value[index] = digit
    }
  })
  form.otp = otpDigits.value.join('')
  if (form.otp.length === 6) {
    handleOTP()
  }
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
    error.value = err.message || 'خطایی رخ داده است'
  }
}

const handlePassword = async () => {
  clearError()
  if (!form.password.trim()) return

  try {
    const result = await loginPassword(form.identifier, form.password)
    if (result.success) {
      step.value = 4
      setTimeout(() => {
        navigateTo('/dashboard', { replace: true })
      }, 1500)
    }
  } catch (err) {
    error.value = err.message || 'رمز عبور اشتباه است'
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
    await nextTick()
    otpRefs.value[0]?.focus()
  } catch (err) {
    error.value = err.message || 'خطا در ارسال کد تایید'
  }
}

const handleOTP = async () => {
  clearError()
  if (form.otp.length !== 6) return

  try {
    const result = await verifyOTP(form.identifier, form.otp, form.name)
    if (result.success) {
      step.value = 4
      setTimeout(() => {
        navigateTo('/dashboard', { replace: true })
      }, 1500)
    }
  } catch (err) {
    error.value = err.message || 'کد تایید اشتباه است'
    otpDigits.value = Array(6).fill('')
    otpRefs.value[0]?.focus()
  }
}

const resendOTP = () => sendOTPAndProceed()

// Cleanup
onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

// Auto-focus on mount
onMounted(() => {
  // Add subtle animation on mount
  document.querySelector('.auth-card')?.classList.add('mount-animation')
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background-image: 
    repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px),
    repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px);
  animation: pattern-move 20s linear infinite;
}

@keyframes pattern-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(70px, 70px); }
}

.auth-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 440px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  position: relative;
  z-index: 1;
}

.mount-animation {
  animation: mount-fade 0.6s ease-out;
}

@keyframes mount-fade {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo-container {
  display: inline-flex;
  margin-bottom: 20px;
}

.logo {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  animation: logo-float 3s ease-in-out infinite;
}

@keyframes logo-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.auth-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.auth-header p {
  color: #6b7280;
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  position: relative;
}

.input-wrapper {
  position: relative;
}

.input-field {
  width: 100%;
  padding: 16px 48px 16px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 16px;
  background: #f9fafb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.input-field.has-error {
  border-color: #ef4444;
  animation: shake-input 0.5s;
}

@keyframes shake-input {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

.input-label {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 16px;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(to bottom, transparent 45%, white 45%, white 55%, transparent 55%);
  padding: 0 4px;
}

.input-field:focus + .input-label,
.input-field:not(:placeholder-shown) + .input-label {
  top: 0;
  font-size: 12px;
  color: #667eea;
  background: white;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  transition: color 0.3s;
}

.input-field:focus ~ .input-icon {
  color: #667eea;
}

.user-info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 16px;
  margin-bottom: 8px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 20px;
}

.user-details {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-identifier {
  font-weight: 600;
  color: #374151;
}

.change-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.change-btn:hover {
  background: rgba(102, 126, 234, 0.1);
}

.divider-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 8px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.divider-text {
  color: #9ca3af;
  font-size: 14px;
  font-weight: 500;
}

.otp-info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border-radius: 16px;
  margin-bottom: 8px;
}

.otp-info-card p {
  margin: 0;
  color: #5b21b6;
  font-size: 14px;
  font-weight: 500;
}

.otp-input-container {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.otp-digit {
  width: 50px;
  height: 56px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #1a1a1a;
}

.otp-digit:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  transform: scale(1.05);
}

.otp-digit.filled {
  border-color: #667eea;
  background: white;
}

.timer-container {
  display: flex;
  justify-content: center;
  min-height: 40px;
}

.timer-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
  color: #92400e;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.success-step {
  text-align: center;
  padding: 40px 0;
}

.success-animation {
  margin-bottom: 24px;
  animation: success-scale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes success-scale {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.success-step h2 {
  color: #10b981;
  margin-bottom: 8px;
  font-size: 24px;
}

.success-step p {
  color: #6b7280;
  margin-bottom: 24px;
}

.loading-bar {
  width: 200px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin: 0 auto;
  overflow: hidden;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 2px;
  animation: loading-fill 1.5s ease-out forwards;
}

@keyframes loading-fill {
  from { width: 0; }
  to { width: 100%; }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 12px;
  text-align: right;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 500;
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 100px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: scale(0.95);
}

.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-fade-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

.card-fade-leave-to {
  opacity: 0;
  transform: scale(1.05) translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    padding: 28px 20px;
    border-radius: 20px;
  }

  .auth-header h1 {
    font-size: 24px;
  }

  .otp-digit {
    width: 45px;
    height: 50px;
    font-size: 20px;
  }

  .otp-input-container {
    gap: 6px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .auth-card {
    background: rgba(31, 41, 55, 0.98);
    color: #f3f4f6;
  }

  .auth-header h1 {
    color: #f3f4f6;
  }

  .auth-header p {
    color: #9ca3af;
  }

  .input-field {
    background: #1f2937;
    border-color: #374151;
    color: #f3f4f6;
  }

  .input-field:focus {
    background: #111827;
    border-color: #818cf8;
    box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.1);
  }

  .input-label {
    background: linear-gradient(to bottom, transparent 45%, #1f2937 45%, #1f2937 55%, transparent 55%);
  }

  .input-field:focus + .input-label,
  .input-field:not(:placeholder-shown) + .input-label {
    background: #1f2937;
    color: #818cf8;
  }

  .user-info-card {
    background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  }

  .user-identifier {
    color: #f3f4f6;
  }

  .otp-info-card {
    background: linear-gradient(135deg, #312e81 0%, #1e1b4b 100%);
  }

  .otp-info-card p {
    color: #c7d2fe;
  }

  .otp-digit {
    background: #1f2937;
    border-color: #374151;
    color: #f3f4f6;
  }

  .otp-digit:focus,
  .otp-digit.filled {
    background: #111827;
    border-color: #818cf8;
  }

  .error-message {
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
    color: #fecaca;
  }
}
</style>