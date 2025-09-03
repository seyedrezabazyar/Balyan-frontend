<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">
          ورود / ثبت‌نام
        </h2>

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
                  placeholder="09123456789 یا email@example.com"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
              />
            </div>
            <button
                type="submit"
                :disabled="loading"
                class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {{ loading ? 'در حال بررسی...' : 'ادامه' }}
            </button>
          </form>
        </div>

        <!-- Step 2: Password or OTP -->
        <div v-else-if="step === 2">
          <!-- If user exists and has password -->
          <div v-if="userExists && hasPassword">
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
                {{ loading ? 'در حال ورود...' : 'ورود' }}
              </button>
              <button
                  type="button"
                  @click="requestOtp"
                  class="w-full text-blue-600 hover:text-blue-700 text-sm"
              >
                ورود با کد یکبار مصرف
              </button>
            </form>
          </div>

          <!-- OTP Login -->
          <div v-else>
            <div v-if="!otpSent">
              <p class="text-sm text-gray-600 mb-4">
                {{ userExists ? 'برای ورود، کد تایید ارسال خواهد شد.' : 'برای ثبت‌نام، کد تایید ارسال خواهد شد.' }}
              </p>
              <button
                  @click="requestOtp"
                  :disabled="loading"
                  class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {{ loading ? 'در حال ارسال...' : 'ارسال کد تایید' }}
              </button>
            </div>
            <div v-else>
              <form @submit.prevent="verifyOtp">
                <p class="text-sm text-gray-600 mb-2">
                  کد تایید به {{ identifier }} ارسال شد
                </p>
                <p class="text-xs text-red-600 mb-4">
                  برای تست، کد تایید: 123456
                </p>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    کد تایید
                  </label>
                  <input
                      v-model="otp"
                      type="text"
                      placeholder="کد 6 رقمی"
                      maxlength="6"
                      class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg"
                      required
                  />
                </div>
                <button
                    type="submit"
                    :disabled="loading"
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
        <button
            v-if="step > 1"
            @click="goBack"
            class="mt-4 text-sm text-gray-600 hover:text-gray-700"
        >
          بازگشت
        </button>

        <!-- Error message -->
        <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false,
  middleware: 'guest'
})

const api = useApi()
const authStore = useAuthStore()
const router = useRouter()

const step = ref(1)
const identifier = ref('')
const password = ref('')
const otp = ref('')
const userExists = ref(false)
const hasPassword = ref(false)
const otpSent = ref(false)
const loading = ref(false)
const error = ref('')
const resendTimer = ref(0)

let resendInterval = null

const checkUser = async () => {
  error.value = ''
  loading.value = true
  try {
    const response = await api.post('/auth/check-user', { identifier: identifier.value })
    userExists.value = response.exists
    hasPassword.value = response.has_password
    step.value = 2
    if (!response.exists || !response.has_password) {
      await requestOtp()
    }
  } catch (err) {
    error.value = err.data?.message || 'خطایی رخ داده است'
  } finally {
    loading.value = false
  }
}

const loginWithPassword = async () => {
  error.value = ''
  loading.value = true
  try {
    const response = await api.post('/auth/login-password', {
      identifier: identifier.value,
      password: password.value
    })
    authStore.setAuth(response)
    await router.push('/dashboard')
  } catch (err) {
    error.value = err.data?.message || 'رمز عبور اشتباه است'
  } finally {
    loading.value = false
  }
}

const requestOtp = async () => {
  error.value = ''
  loading.value = true
  try {
    await api.post('/auth/send-otp', { identifier: identifier.value })
    otpSent.value = true
    startResendTimer()
  } catch (err) {
    error.value = err.data?.message || 'خطا در ارسال کد تایید'
  } finally {
    loading.value = false
  }
}

const verifyOtp = async () => {
  error.value = ''
  loading.value = true
  try {
    const response = await api.post('/auth/verify-otp', {
      identifier: identifier.value,
      otp: otp.value
    })
    authStore.setAuth(response)
    await router.push('/dashboard')
  } catch (err) {
    error.value = err.data?.message || 'کد تایید اشتباه است'
  } finally {
    loading.value = false
  }
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
  otp.value = ''
  password.value = ''
  error.value = ''
}

const goBack = () => {
  if (step.value === 2) {
    step.value = 1
    otpSent.value = false
    otp.value = ''
    password.value = ''
    error.value = ''
  }
}

onUnmounted(() => {
  if (resendInterval) clearInterval(resendInterval)
})
</script>
