<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">
          ورود / ثبت‌نام
        </h2>

        <!-- Debug Info -->
        <div v-if="showDebug" class="mb-4 p-3 bg-gray-100 rounded text-xs">
          <p><strong>Step:</strong> {{ step }}</p>
          <p><strong>User Exists:</strong> {{ userExists }}</p>
          <p><strong>Has Password:</strong> {{ hasPassword }}</p>
          <p><strong>OTP Sent:</strong> {{ otpSent }}</p>
          <p><strong>Identifier:</strong> {{ identifier }}</p>
        </div>

        <!-- Step 1: Enter identifier -->
        <div v-if="step === 1">
          <form @submit.prevent="checkUser">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                شماره موبایل یا ایمیل
              </label>
              <input
                v-model="identifier"
                type="text"
                dir="ltr"
                placeholder="09123456789 or email@example.com"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
                :class="{ 'border-red-500': identifierError }"
                required
                @input="identifier = formatters.toEnglishDigits($event.target.value)"
              />
              <p v-if="identifierError" class="text-xs text-red-500 mt-1">{{ identifierError }}</p>
            </div>
            <button
              type="submit"
              :disabled="loading || identifierError"
              class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {{ loading ? 'در حال بررسی...' : 'ادامه' }}
            </button>
          </form>
        </div>

        <!-- Step 2: Authentication Options -->
        <div v-else-if="step === 2">
          <!-- Show identifier -->
          <div class="mb-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-800">
              <strong>شناسه:</strong> {{ identifier }}
            </p>
            <p class="text-xs text-blue-600 mt-1">
              {{ userExists ? 'کاربر موجود است' : 'کاربر جدید خواهد شد' }}
              {{ hasPassword ? ' - دارای رمز عبور' : ' - بدون رمز عبور' }}
            </p>
          </div>

          <!-- Password Login (if user exists and has password) -->
          <div v-if="userExists && hasPassword && !showOtpForm">
            <form @submit.prevent="loginWithPassword">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  رمز عبور
                </label>
                <input
                  v-model="password"
                  type="password"
                  placeholder="رمز عبور خود را وارد کنید"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mb-3"
              >
                {{ loading ? 'در حال ورود...' : 'ورود با رمز عبور' }}
              </button>
              <button
                type="button"
                @click="switchToOtp"
                class="w-full text-blue-600 hover:text-blue-700 text-sm border border-blue-300 py-2 rounded-lg"
              >
                ورود با کد یکبار مصرف
              </button>
            </form>
          </div>

          <!-- OTP Form -->
          <div v-else-if="showOtpForm || !userExists || !hasPassword">
            <!-- Step 2a: Request OTP -->
            <div v-if="!otpSent">
              <p class="text-sm text-gray-600 mb-4">
                {{ userExists ? 'برای ورود، کد تایید ارسال خواهد شد.' : 'برای ثبت‌نام، کد تایید ارسال خواهد شد.' }}
              </p>

              <!-- Add name field for new users -->
              <div v-if="!userExists" class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  نام شما
                </label>
                <input
                  v-model="userName"
                  type="text"
                  placeholder="نام و نام خانوادگی"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'text-right': nameDirection === 'rtl', 'text-left': nameDirection === 'ltr' }"
                  :dir="nameDirection"
                  required
                />
                <p v-if="nameError" class="text-xs text-red-500 mt-1">{{ nameError }}</p>
              </div>

              <button
                @click="requestOtp"
                :disabled="loading"
                class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {{ loading ? 'در حال ارسال...' : 'ارسال کد تایید' }}
              </button>
            </div>

            <!-- Step 2b: Verify OTP -->
            <div v-else>
              <form @submit.prevent="verifyOtp">
                <p class="text-sm text-gray-600 mb-2">
                  کد تایید به {{ identifier }} ارسال شد
                </p>
                <p class="text-xs text-red-600 mb-4">
                  برای تست، کد تایید: <strong>123456</strong>
                </p>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    کد تایید ۶ رقمی
                  </label>
                  <input
                    v-model="otp"
                    type="text"
                    placeholder="123456"
                    maxlength="6"
                    class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                    required
                    @input="otp = otp.replace(/[^0-9]/g, '')"
                  />
                </div>
                <button
                  type="submit"
                  :disabled="loading || otp.length !== 6"
                  class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mb-3"
                >
                  {{ loading ? 'در حال تایید...' : 'تایید و ورود' }}
                </button>
                <div class="flex justify-between text-sm">
                  <button
                    type="button"
                    @click="requestOtp"
                    :disabled="resendTimer > 0"
                    class="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                  >
                    {{ resendTimer > 0 ? `ارسال مجدد (${resendTimer})` : 'ارسال مجدد کد' }}
                  </button>
                  <button
                    type="button"
                    @click="changeIdentifier"
                    class="text-gray-600 hover:text-gray-700"
                  >
                    تغییر شماره/ایمیل
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Back button -->
        <div v-if="step > 1" class="flex gap-2 mt-4">
          <button
            @click="goBack"
            class="text-sm text-gray-600 hover:text-gray-700"
          >
            بازگشت
          </button>
          <button
            @click="showDebug = !showDebug"
            class="text-xs text-gray-500 hover:text-gray-700 ml-auto"
          >
            {{ showDebug ? 'مخفی کردن' : 'نمایش' }} Debug
          </button>
        </div>

        <!-- Error message -->
        <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
          <button @click="error = ''" class="text-xs text-red-500 underline mt-1">
            بستن
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import validator from 'validator'
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'
import { useFormatters } from '~/composables/useFormatters'

definePageMeta({
  layout: false,
  middleware: 'guest'
})

const api = useApi()
const authStore = useAuthStore()
const router = useRouter()
const formatters = useFormatters()

// State
const step = ref(1)
const identifier = ref('')
const password = ref('')
const otp = ref('')
const userName = ref('')
const userExists = ref(false)
const hasPassword = ref(false)
const otpSent = ref(false)
const loading = ref(false)
const error = ref('')
const resendTimer = ref(0)
const showOtpForm = ref(false)
const showDebug = ref(false)
const nameDirection = ref('rtl')
const identifierError = ref('')
const nameError = ref('')

let resendInterval = null

// Helper function
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
}

const checkUser = async () => {
  error.value = '';
  identifierError.value = '';

  const value = formatters.toEnglishDigits(identifier.value);
  const isPhone = /^[0-9+]+$/.test(value.trim());

  if (isPhone) {
    const normalizedPhone = formatters.normalizePhone(value);
    if (!validator.isMobilePhone(normalizedPhone, 'fa-IR')) {
      identifierError.value = 'شماره موبایل وارد شده معتبر نیست.';
      return;
    }
    identifier.value = normalizedPhone;
  } else {
    if (!validator.isEmail(value)) {
      identifierError.value = 'فرمت ایمیل وارد شده معتبر نیست.';
      return;
    }
  }

  loading.value = true;
  try {
    const response = await api.post('/auth/check-user', {
      identifier: identifier.value
    })

    // اگر response یک string است، آن را parse کن
    let parsedResponse = response
    if (typeof response === 'string') {
      try {
        parsedResponse = JSON.parse(response)
      } catch (e) {
        console.error('Failed to parse response:', e)
        parsedResponse = response
      }
    }

    // بررسی ساختارهای مختلف response
    const data = parsedResponse?.data || parsedResponse

    // تشخیص وجود کاربر با روش‌های مختلف
    const userExistsCheck =
      data?.user_exists === true ||
      data?.exists === true ||
      data?.status === 'existing_user_with_password' ||
      data?.status === 'existing_user_otp_only'

    // تشخیص وجود رمز عبور
    const hasPasswordCheck =
      data?.has_password === true ||
      data?.requires_password === true ||
      data?.status === 'existing_user_with_password'

    userExists.value = userExistsCheck
    hasPassword.value = hasPasswordCheck

    console.log('Parsed response:', {
      userExists: userExists.value,
      hasPassword: hasPassword.value,
      responseStatus: data?.status,
      rawData: data
    })

    step.value = 2

    // If new user or user without password, show OTP form immediately
    if (!userExists.value || !hasPassword.value) {
      showOtpForm.value = true
    }

  } catch (err) {
    console.error('Check user error:', err)
    console.error('Error response:', err?.response)
    console.error('Error data:', err?.data)

    error.value = err.data?.message || err.message || 'خطایی رخ داده است'
  } finally {
    loading.value = false
  }
}

const loginWithPassword = async () => {
  error.value = ''
  loading.value = true

  try {
    const cleanIdentifier = sanitizeInput(identifier.value)
    const cleanPassword = sanitizeInput(password.value)

    console.log('Login attempt:', { identifier: cleanIdentifier })

    const response = await api.post('/auth/login-password', {
      identifier: cleanIdentifier,
      password: cleanPassword
    })

    console.log('Login response:', response)

    authStore.setAuth(response)
    await router.push('/dashboard')
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.data?.message || err.message || 'خطا در ورود. لطفاً رمز عبور خود را بررسی کنید.'
  } finally {
    loading.value = false
  }
}

const requestOtp = async () => {
  error.value = ''
  loading.value = true

  try {
    const cleanIdentifier = sanitizeInput(identifier.value)

    console.log('Requesting OTP for:', cleanIdentifier)

    const response = await api.post('/auth/send-otp', {
      identifier: cleanIdentifier
    })

    console.log('OTP request response:', response)

    otpSent.value = true
    showOtpForm.value = true
    startResendTimer()
  } catch (err) {
    console.error('OTP request error:', err)
    error.value = err.data?.message || err.message || 'خطا در ارسال کد تایید'
  } finally {
    loading.value = false
  }
}

const verifyOtp = async () => {
  error.value = ''
  loading.value = true

  try {
    const cleanIdentifier = sanitizeInput(identifier.value)
    const cleanOtp = sanitizeInput(otp.value)

    console.log('Verifying OTP:', { identifier: cleanIdentifier, otp: cleanOtp })

    const requestData = {
      identifier: cleanIdentifier,
      otp: cleanOtp
    }

    // Add name for new users
    if (!userExists.value && userName.value) {
      requestData.name = sanitizeInput(userName.value)
    }

    const response = await api.post('/auth/verify-otp', requestData)

    console.log('OTP verification response:', response)

    authStore.setAuth(response)
    await router.push('/dashboard')
  } catch (err) {
    console.error('OTP verification error:', err)
    error.value = err.data?.message || err.message || 'کد تایید اشتباه است'
  } finally {
    loading.value = false
  }
}

const switchToOtp = () => {
  showOtpForm.value = true
  password.value = ''
}

const startResendTimer = () => {
  resendTimer.value = 60
  if (resendInterval) clearInterval(resendInterval)
  resendInterval = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) {
      clearInterval(resendInterval)
    }
  }, 1000)
}

const changeIdentifier = () => {
  step.value = 1
  otpSent.value = false
  showOtpForm.value = false
  otp.value = ''
  password.value = ''
  userName.value = ''
  userExists.value = false
  hasPassword.value = false
  error.value = ''
}

const goBack = () => {
  if (step.value === 2) {
    if (otpSent.value) {
      otpSent.value = false
      otp.value = ''
    } else if (showOtpForm.value && userExists.value && hasPassword.value) {
      showOtpForm.value = false
      password.value = ''
    } else {
      changeIdentifier()
    }
  }
}

onUnmounted(() => {
  if (resendInterval) clearInterval(resendInterval)
})

watch(userName, (newName) => {
  nameError.value = ''
  if (newName && newName.length > 0) {
    const isRtl = /[\u0600-\u06FF]/.test(newName.charAt(0));
    nameDirection.value = isRtl ? 'rtl' : 'ltr';
  }
})

watch(identifier, (newIdentifier) => {
  identifierError.value = ''
})
</script>
