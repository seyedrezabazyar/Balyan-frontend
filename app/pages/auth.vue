<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">
          ورود / ثبت‌نام
        </h2>

        <!-- Debug Info -->
        <div v-if="showDebug" class="mb-4 p-3 bg-gray-100 rounded text-xs">
          <p><strong>UI State:</strong> {{ uiState }}</p>
          <p><strong>Identifier:</strong> {{ identifier }}</p>
          <p><strong>User Exists Response:</strong> {{ checkUserResponse }}</p>
          <p><strong>OTP Sent:</strong> {{ otpSent }}</p>
        </div>

        <!-- Step 1: Enter Identifier -->
        <div v-if="uiState === 'identifier'">
          <form @submit.prevent="handleCheckUser">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">شماره موبایل یا ایمیل</label>
              <input v-model="identifier" type="text" dir="ltr" placeholder="09123456789 or email@example.com" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left" :class="{ 'border-red-500': identifierError }" required @input="identifier = formatters.toEnglishDigits($event.target.value)" />
              <p v-if="identifierError" class="text-xs text-red-500 mt-1">{{ identifierError }}</p>
            </div>
            <button type="submit" :disabled="isSubmitDisabled" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {{ loading ? 'در حال بررسی...' : 'ادامه' }}
            </button>
          </form>
        </div>

        <!-- Step 2: Password Login -->
        <div v-if="uiState === 'password'">
          <div class="mb-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-800"><strong>شناسه:</strong> {{ identifier }}</p>
          </div>
          <form @submit.prevent="handleLoginWithPassword">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">رمز عبور</label>
              <input v-model="password" type="password" placeholder="رمز عبور خود را وارد کنید" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
            <button type="submit" :disabled="loading" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mb-3">
              {{ loading ? 'در حال ورود...' : 'ورود با رمز عبور' }}
            </button>
            <button type="button" @click="handleRequestOtp" :disabled="loading" class="w-full text-center text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400">
              ورود با کد یکبار مصرف
            </button>
          </form>
        </div>

        <!-- Step 2: Register (New User) -->
        <div v-if="uiState === 'register'">
           <div class="mb-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-800"><strong>شناسه:</strong> {{ identifier }}</p>
            <p class="text-xs text-blue-600 mt-1">به نظر می‌رسد کاربر جدید هستید. برای تکمیل ثبت‌نام، نام خود را وارد کرده و کد تایید را دریافت کنید.</p>
          </div>
          <form @submit.prevent="handleRequestOtp()">
             <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">نام شما</label>
                <input v-model="userName" type="text" placeholder="نام و نام خانوادگی" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" :class="{ 'text-right': nameDirection === 'rtl', 'text-left': nameDirection === 'ltr' }" :dir="nameDirection" required />
                <p v-if="nameError" class="text-xs text-red-500 mt-1">{{ nameError }}</p>
              </div>
            <button type="submit" :disabled="loading" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {{ loading ? 'در حال ارسال...' : 'ارسال کد تایید و ثبت‌نام' }}
            </button>
          </form>
        </div>

        <!-- Step 2: OTP Login / Verification -->
        <div v-if="uiState === 'otp'">
          <div class="mb-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-800"><strong>شناسه:</strong> {{ identifier }}</p>
            <p class="text-xs text-gray-600 mb-2 mt-2" v-if="otpSent">کد تایید به {{ identifier }} ارسال شد.</p>
          </div>
          <form @submit.prevent="handleVerifyOtp">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">کد تایید ۶ رقمی</label>
               <p class="text-xs text-red-600 mb-2">برای تست، کد تایید: <strong>123456</strong></p>
              <input v-model="otp" type="text" placeholder="123456" maxlength="6" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest" required @input="otp = otp.replace(/[^0-9]/g, '')" />
            </div>
            <button type="submit" :disabled="loading || otp.length !== 6" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mb-3">
              {{ loading ? 'در حال تایید...' : 'تایید و ورود' }}
            </button>
            <div class="flex justify-between text-sm">
              <button type="button" @click="handleRequestOtp()" :disabled="resendTimer > 0" class="text-blue-600 hover:text-blue-700 disabled:text-gray-400">
                {{ resendTimer > 0 ? `ارسال مجدد (${resendTimer})` : 'ارسال مجدد کد' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Back button -->
        <div v-if="uiState !== 'identifier'" class="flex gap-2 mt-4">
          <button @click="changeIdentifier" class="text-sm text-gray-600 hover:text-gray-700">بازگشت و تغییر شناسه</button>
          <button @click="showDebug = !showDebug" class="text-xs text-gray-500 hover:text-gray-700 ml-auto">
            {{ showDebug ? 'مخفی کردن' : 'نمایش' }} Debug
          </button>
        </div>

        <!-- Error message -->
        <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
          <button @click="error = ''" class="text-xs text-red-500 underline mt-1">بستن</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import validator from 'validator'
import { useAuthStore } from '~/stores/auth'
import { useFormatters } from '~/composables/useFormatters'

definePageMeta({
  layout: false,
  middleware: 'guest'
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const formatters = useFormatters()

type UiState = 'identifier' | 'register' | 'password' | 'otp'
const uiState = ref<UiState>('identifier')

// Form data
const identifier = ref('')
const password = ref('')
const otp = ref('')
const userName = ref('')

// Response data
const checkUserResponse = ref<any>(null)

// UI control state
const loading = ref(false)
const error = ref('')
const otpSent = ref(false)
const resendTimer = ref(0)
const showDebug = ref(false)

// Input helpers
const nameDirection = ref('rtl')
const identifierError = ref('')
const nameError = ref('')

let resendInterval: NodeJS.Timeout | null = null

const isSubmitDisabled = computed(() => {
  return loading.value || !identifier.value.trim() || !!identifierError.value
})

const changeIdentifier = () => {
  uiState.value = 'identifier'
  password.value = ''
  otp.value = ''
  userName.value = ''
  otpSent.value = false
  error.value = ''
  checkUserResponse.value = null
}

const handleCheckUser = async () => {
  error.value = ''
  identifierError.value = ''
  const value = formatters.toEnglishDigits(identifier.value.trim())

  // --- Start: Input Validation ---
  if (value.includes('@')) {
    if (!validator.isEmail(value)) {
      identifierError.value = 'فرمت ایمیل وارد شده معتبر نیست.'
      return
    }
  } else {
    const normalizedPhone = formatters.normalizePhone(value)
    if (!validator.isMobilePhone(normalizedPhone, 'fa-IR')) {
      identifierError.value = 'شماره موبایل وارد شده معتبر نیست.'
      return
    }
    identifier.value = normalizedPhone
  }
  // --- End: Input Validation ---

  loading.value = true
  try {
    const response = await authStore.checkUser(identifier.value)
    checkUserResponse.value = response // Store for later use (e.g., in verifyOtp)

    // Check for a successful API response before proceeding
    if (response && response.success) {
      if (!response.user_exists) {
        // Scenario 3: User does not exist -> Go to registration form
        uiState.value = 'register'
      } else if (response.has_password) {
        // Scenario 1: User exists and has a password -> Go to password form
        uiState.value = 'password'
      } else {
        // Scenario 2: User exists but has no password -> Go to OTP flow
        // The OTP request will handle setting the uiState to 'otp'
        await handleRequestOtp(false)
      }
    } else {
      // Handle cases where the API call itself fails or returns success: false
      throw new Error(response?.message || 'پاسخ نامعتبر از سرور دریافت شد.')
    }
  } catch (err: any) {
    // Catch errors from the API call or the thrown error from above
    error.value = err.data?.message || err.message || 'خطایی در بررسی اطلاعات رخ داده است.'
  } finally {
    loading.value = false
  }
}

const handleLoginWithPassword = async () => {
  error.value = ''
  loading.value = true
  try {
    await authStore.loginWithPassword(identifier.value, password.value)
    const redirectPath = route.query.redirect?.toString() || '/dashboard'
    await router.push(redirectPath)
  } catch (err: any) {
    error.value = err.data?.message || 'شناسه یا رمز عبور اشتباه است.'
  } finally {
    loading.value = false
  }
}

const handleRequestOtp = async (showLoading = true) => {
  error.value = ''
  if (uiState.value === 'register' && !userName.value.trim()) {
    nameError.value = 'وارد کردن نام الزامی است.'
    return
  }
  nameError.value = ''

  if (showLoading) loading.value = true
  try {
    await authStore.sendOtp(identifier.value)
    otpSent.value = true
    uiState.value = 'otp'
    startResendTimer()
  } catch (err: any) {
    error.value = err.data?.message || 'خطا در ارسال کد تایید.'
  } finally {
    if (showLoading) loading.value = false
  }
}

const handleVerifyOtp = async () => {
  error.value = ''
  loading.value = true
  try {
    const nameToSend = checkUserResponse.value?.user_exists ? undefined : userName.value
    await authStore.verifyOtp(identifier.value, otp.value, nameToSend)
    const redirectPath = route.query.redirect?.toString() || '/dashboard'
    await router.push(redirectPath)
  } catch (err: any) {
    error.value = err.data?.message || 'کد تایید اشتباه است.'
  } finally {
    loading.value = false
  }
}

const startResendTimer = () => {
  resendTimer.value = 60
  if (resendInterval) clearInterval(resendInterval)
  resendInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--
    } else {
      clearInterval(resendInterval!)
    }
  }, 1000)
}

onUnmounted(() => {
  if (resendInterval) clearInterval(resendInterval)
})

watch(userName, (newName) => {
  if (newName && /[\u0600-\u06FF]/.test(newName.charAt(0))) {
    nameDirection.value = 'rtl'
  } else {
    nameDirection.value = 'ltr'
  }
})
</script>
