<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">پروفایل کاربری</h1>

    <!-- Debug info برای بررسی user object -->
    <div v-if="showDebug" class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h3 class="font-semibold text-gray-800 mb-2">Debug Info (User Object):</h3>
      <pre class="text-xs text-gray-600 overflow-auto max-h-40">{{ JSON.stringify(user, null, 2) }}</pre>
      <button @click="showDebug = false" class="mt-2 text-xs text-blue-600">بستن Debug</button>
    </div>
    <button v-else @click="showDebug = true" class="mb-4 text-xs text-gray-500 underline">نمایش Debug Info</button>

    <!-- نمایش پیام‌ها -->
    <div v-if="message" :class="messageClass" class="mb-6 p-4 rounded-lg">
      {{ message }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- اطلاعات شخصی -->
      <div class="lg:col-span-2 space-y-8">
        <!-- اطلاعات اساسی -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-6">اطلاعات شخصی</h2>
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">نام و نام خانوادگی *</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">نام کاربری</label>
                <div class="relative">
                  <input
                    v-model="form.username"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :disabled="!canChangeUsername"
                    :class="{ 'bg-gray-100': !canChangeUsername }"
                  />
                  <button
                    v-if="canChangeUsername && form.username !== user?.username"
                    type="button"
                    @click="showUsernameWarning = true"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:text-yellow-600"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  {{ canChangeUsername ? 'فقط یک بار در سال قابل تغییر' : 'امسال تغییر داده‌اید' }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- ایمیل -->
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">ایمیل</label>
                <div class="relative">
                  <input
                    v-model="form.email"
                    type="email"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    :disabled="!!user?.email_verified_at"
                    :class="{ 'bg-gray-100': !!user?.email_verified_at }"
                  />
                  <div v-if="user?.email_verified_at" class="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <span v-if="user?.email_verified_at" class="text-xs text-green-600">
                    ✓ تایید شده
                  </span>
                  <span v-else class="text-xs text-yellow-600">
                    تایید نشده
                  </span>
                  <button
                    v-if="!user?.email_verified_at && form.email && form.email !== user?.email"
                    type="button"
                    @click="handleEmailVerification"
                    :disabled="emailVerificationSending"
                    class="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {{ emailVerificationSending ? 'در حال ارسال...' : 'ارسال کد تایید' }}
                  </button>
                </div>
              </div>

              <!-- شماره موبایل -->
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">شماره موبایل</label>
                <div class="relative">
                  <input
                    v-model="form.phone"
                    type="text"
                    placeholder="09123456789"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    :disabled="!!user?.phone_verified_at"
                    :class="{ 'bg-gray-100': !!user?.phone_verified_at }"
                  />
                  <div v-if="user?.phone_verified_at" class="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <span v-if="user?.phone_verified_at" class="text-xs text-green-600">
                    ✓ تایید شده
                  </span>
                  <span v-else class="text-xs text-yellow-600">
                    تایید نشده
                  </span>
                  <button
                    v-if="!user?.phone_verified_at && form.phone && form.phone !== user?.phone"
                    type="button"
                    @click="handlePhoneVerification"
                    :disabled="smsVerificationSending"
                    class="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {{ smsVerificationSending ? 'در حال ارسال...' : 'ارسال کد تایید' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- آدرس -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-700">آدرس</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-700">استان</label>
                  <select
                    v-model="form.province_id"
                    @change="onProvinceChange"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">انتخاب استان</option>
                    <option v-for="province in provinces" :key="province.id" :value="province.id">
                      {{ province.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-700">شهر</label>
                  <select
                    v-model="form.city_id"
                    :disabled="!form.province_id || loadingCities"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">{{ loadingCities ? 'در حال بارگذاری...' : 'انتخاب شهر' }}</option>
                    <option v-for="city in cities" :key="city.id" :value="city.id">
                      {{ city.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">آدرس کامل</label>
                <textarea
                  v-model="form.address"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="آدرس کامل خود را وارد کنید..."
                ></textarea>
              </div>
            </div>

            <!-- دکمه‌ها -->
            <div class="flex gap-4 pt-4">
              <button
                type="submit"
                :disabled="loading"
                class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {{ loading ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
              </button>

              <NuxtLink
                to="/dashboard"
                class="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 font-medium"
              >
                بازگشت
              </NuxtLink>
            </div>
          </form>
        </div>

        <!-- تغییر رمز عبور -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-6">رمز عبور</h2>

          <div v-if="!hasPassword" class="mb-6">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div class="flex">
                <svg class="w-5 h-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <div class="mr-3">
                  <h3 class="text-sm font-medium text-yellow-800">رمز عبور تنظیم نشده</h3>
                  <p class="text-sm text-yellow-700 mt-1">
                    با تنظیم رمز عبور می‌توانید علاوه بر کد یکبار مصرف، با رمز عبور نیز وارد شوید.
                  </p>
                </div>
              </div>
            </div>
            <button
              @click="showPasswordForm = true"
              v-if="!showPasswordForm"
              class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              تنظیم رمز عبور
            </button>
          </div>

          <div v-else class="mb-6">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div class="flex">
                <svg class="w-5 h-5 text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <div class="mr-3">
                  <h3 class="text-sm font-medium text-green-800">رمز عبور فعال است</h3>
                  <p class="text-sm text-green-700 mt-1">
                    می‌توانید رمز عبور خود را تغییر دهید.
                  </p>
                </div>
              </div>
            </div>
            <button
              @click="showPasswordForm = true"
              v-if="!showPasswordForm"
              class="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 font-medium"
            >
              تغییر رمز عبور
            </button>
          </div>

          <!-- فرم رمز عبور -->
          <form v-if="showPasswordForm" @submit.prevent="handlePassword" class="space-y-6">
            <div v-if="hasPassword">
              <label class="block mb-2 text-sm font-medium text-gray-700">رمز عبور فعلی *</label>
              <input
                v-model="passwordForm.current_password"
                type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">رمز عبور جدید *</label>
              <input
                v-model="passwordForm.password"
                type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                minlength="8"
                required
              />
              <p class="text-xs text-gray-500 mt-1">حداقل 8 کاراکتر</p>
            </div>

            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">تکرار رمز عبور جدید *</label>
              <input
                v-model="passwordForm.password_confirmation"
                type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                minlength="8"
                required
              />
            </div>

            <div class="flex gap-4">
              <button
                type="submit"
                :disabled="loading"
                class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {{ loading ? 'در حال ذخیره...' : 'ذخیره رمز' }}
              </button>
              <button
                type="button"
                @click="cancelPasswordForm"
                class="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- اطلاعات جانبی -->
      <div class="space-y-6">
        <!-- وضعیت حساب -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">وضعیت حساب</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">وضعیت:</span>
              <span v-if="user?.locked_until" class="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                قفل شده
              </span>
              <span v-else class="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                فعال
              </span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">ایمیل:</span>
              <span v-if="user?.email_verified_at" class="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                تایید شده
              </span>
              <span v-else class="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                تایید نشده
              </span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">موبایل:</span>
              <span v-if="user?.phone_verified_at" class="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                تایید شده
              </span>
              <span v-else class="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                تایید نشده
              </span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">رمز عبور:</span>
              <span v-if="hasPassword" class="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                تنظیم شده
              </span>
              <span v-else class="text-sm font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                تنظیم نشده
              </span>
            </div>
          </div>
        </div>

        <!-- تاریخ‌های مهم -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">اطلاعات حساب</h3>
          <div class="space-y-3">
            <div>
              <span class="text-sm text-gray-600">تاریخ عضویت:</span>
              <p class="text-sm text-gray-900 font-medium">
                {{ formatDate(user?.created_at) }}
              </p>
            </div>
            <div>
              <span class="text-sm text-gray-600">آخرین ورود:</span>
              <p class="text-sm text-gray-900 font-medium">
                {{ user?.last_login_at ? formatDate(user.last_login_at) : 'هیچوقت' }}
              </p>
            </div>
            <div v-if="user?.username_last_changed">
              <span class="text-sm text-gray-600">آخرین تغییر نام کاربری:</span>
              <p class="text-sm text-gray-900 font-medium">
                {{ formatDate(user.username_last_changed) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal تایید تغییر نام کاربری -->
    <div v-if="showUsernameWarning" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">هشدار تغییر نام کاربری</h3>
        <p class="text-sm text-gray-600 mb-6">
          نام کاربری فقط یک بار در سال قابل تغییر است. آیا مطمئن هستید که می‌خواهید نام کاربری خود را تغییر دهید؟
        </p>
        <div class="flex gap-4">
          <button
            @click="confirmUsernameChange"
            class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            بله، تغییر دهید
          </button>
          <button
            @click="showUsernameWarning = false"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>

    <!-- Modal تایید کد -->
    <div v-if="showVerificationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ verificationModal.type === 'email' ? 'تایید ایمیل' : 'تایید شماره موبایل' }}
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          کد تایید به {{ verificationModal.target }} ارسال شد.
        </p>
        <p class="text-xs text-red-600 mb-4">
          برای تست، کد تایید: 123456
        </p>
        <div class="mb-4">
          <label class="block mb-2 text-sm font-medium text-gray-700">کد تایید</label>
          <input
            v-model="verificationCode"
            type="text"
            maxlength="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="کد 6 رقمی"
          />
        </div>
        <div class="flex gap-4">
          <button
            @click="verifyCode"
            :disabled="!verificationCode || verificationCode.length !== 6 || loading"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'در حال تایید...' : 'تایید' }}
          </button>
          <button
            @click="closeVerificationModal"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const api = useApi(authStore.token)

// State
const user = ref(null)
const loading = ref(false)
const message = ref('')
const messageClass = ref('')
const showPasswordForm = ref(false)
const showUsernameWarning = ref(false)
const showVerificationModal = ref(false)
const showDebug = ref(false)
const emailVerificationSending = ref(false)
const smsVerificationSending = ref(false)
const loadingCities = ref(false)

// Data
const provinces = ref([])
const cities = ref([])
const verificationCode = ref('')
const verificationModal = ref({
  type: '',
  target: ''
})

// Forms
const form = ref({
  name: '',
  email: '',
  phone: '',
  username: '',
  province_id: '',
  city_id: '',
  address: ''
})

const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})

// Computed
const canChangeUsername = computed(() => {
  if (!user.value?.username_last_changed) return true
  const lastChanged = new Date(user.value.username_last_changed)
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  return lastChanged < oneYearAgo
})

// بررسی اینکه کاربر رمز دارد یا نه - چندین حالت ممکن را بررسی می‌کند
const hasPassword = computed(() => {
  if (!user.value) return false

  // بررسی فیلدهای مختلفی که ممکن است از API بیاید
  return !!(
    user.value.password ||
    user.value.has_password ||
    user.value.password_hash ||
    user.value.password_set ||
    (typeof user.value.password === 'string' && user.value.password.length > 0)
  )
})

// Methods
const loadUserData = async () => {
  try {
    const response = await api.get('/auth/user')
    user.value = response.user || response

    console.log('User loaded:', user.value) // برای debug

    // پر کردن فرم با اطلاعات کاربر
    form.value = {
      name: user.value.name || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      username: user.value.username || '',
      province_id: user.value.province_id || '',
      city_id: user.value.city_id || '',
      address: user.value.address || ''
    }

    // بارگذاری شهرها اگر استان انتخاب شده
    if (form.value.province_id) {
      await loadCitiesData(form.value.province_id)
    }

  } catch (error) {
    showMessage('خطا در دریافت اطلاعات', 'error')
    console.error('Error loading user data:', error)
  }
}

const loadProvincesData = async () => {
  try {
    // سعی می‌کنیم از API استفاده کنیم، اگر نبود از fallback استفاده می‌کنیم
    let response
    try {
      response = await api.get('/locations/provinces')
    } catch (error) {
      console.warn('Province API not available, using fallback data')
      response = {
        data: [
          { id: 1, name: 'تهران' },
          { id: 2, name: 'اصفهان' },
          { id: 3, name: 'شیراز' },
          { id: 4, name: 'مشهد' },
          { id: 5, name: 'تبریز' },
          { id: 6, name: 'اهواز' },
          { id: 7, name: 'کرج' },
          { id: 8, name: 'قم' },
          { id: 9, name: 'کرمان' },
          { id: 10, name: 'رشت' }
        ]
      }
    }

    provinces.value = response.data || response
  } catch (error) {
    console.error('خطا در دریافت استان‌ها:', error)
  }
}

const loadCitiesData = async (provinceId) => {
  if (!provinceId) {
    cities.value = []
    return
  }

  loadingCities.value = true
  try {
    // سعی می‌کنیم از API استفاده کنیم
    let response
    try {
      response = await api.get(`/locations/provinces/${provinceId}/cities`)
    } catch (error) {
      console.warn('Cities API not available, using fallback data')
      // داده‌های fallback برای شهرها
      const citiesData = {
        1: [
          { id: 1, name: 'تهران' },
          { id: 2, name: 'شهریار' },
          { id: 3, name: 'ورامین' }
        ],
        2: [
          { id: 4, name: 'اصفهان' },
          { id: 5, name: 'کاشان' },
          { id: 6, name: 'نجف‌آباد' }
        ],
        3: [
          { id: 7, name: 'شیراز' },
          { id: 8, name: 'مرودشت' },
          { id: 9, name: 'کازرون' }
        ]
      }
      response = {
        data: citiesData[provinceId] || []
      }
    }

    cities.value = response.data || response
  } catch (error) {
    console.error('خطا در دریافت شهرها:', error)
  } finally {
    loadingCities.value = false
  }
}

const onProvinceChange = async () => {
  form.value.city_id = ''
  await loadCitiesData(form.value.province_id)
}

const updateProfile = async () => {
  loading.value = true
  message.value = ''

  try {
    console.log('Sending update data:', form.value) // برای debug

    const updateData = {
      name: form.value.name,
      province_id: form.value.province_id || null,
      city_id: form.value.city_id || null,
      address: form.value.address || null
    }

    // فقط فیلدهای تغییر یافته را ارسال کن
    if (form.value.email !== user.value.email) {
      updateData.email = form.value.email || null
    }
    if (form.value.phone !== user.value.phone) {
      updateData.phone = form.value.phone || null
    }
    if (form.value.username !== user.value.username) {
      updateData.username = form.value.username
    }

    console.log('Final update data:', updateData) // برای debug

    const response = await api.post('/auth/profile/update', updateData)

    console.log('Update response:', response) // برای debug

    user.value = response.user || response
    authStore.user = user.value
    showMessage('اطلاعات با موفقیت ذخیره شد', 'success')
  } catch (error) {
    console.error('Error updating profile:', error)
    showMessage(error.data?.message || 'خطا در ذخیره اطلاعات', 'error')
  } finally {
    loading.value = false
  }
}

const handlePassword = async () => {
  loading.value = true
  message.value = ''

  try {
    if (hasPassword.value) {
      await api.post('/auth/password/update', passwordForm.value)
    } else {
      await api.post('/auth/password/set', {
        password: passwordForm.value.password,
        password_confirmation: passwordForm.value.password_confirmation
      })
    }

    showMessage('رمز عبور با موفقیت ذخیره شد', 'success')
    showPasswordForm.value = false
    resetPasswordForm()
    await loadUserData()
  } catch (error) {
    console.error('Error handling password:', error)
    showMessage(error.data?.message || 'خطا در ذخیره رمز عبور', 'error')
  } finally {
    loading.value = false
  }
}

const handleEmailVerification = async () => {
  if (!form.value.email) return

  emailVerificationSending.value = true
  try {
    await api.post('/auth/email/send-verification', {
      email: form.value.email
    })

    verificationModal.value = {
      type: 'email',
      target: form.value.email
    }
    showVerificationModal.value = true
  } catch (error) {
    showMessage('خطا در ارسال کد تایید ایمیل', 'error')
    console.error('Error sending email verification:', error)
  } finally {
    emailVerificationSending.value = false
  }
}

const handlePhoneVerification = async () => {
  if (!form.value.phone) return

  smsVerificationSending.value = true
  try {
    await api.post('/auth/phone/send-verification', {
      phone: form.value.phone
    })

    verificationModal.value = {
      type: 'phone',
      target: form.value.phone
    }
    showVerificationModal.value = true
  } catch (error) {
    showMessage('خطا در ارسال کد تایید موبایل', 'error')
    console.error('Error sending phone verification:', error)
  } finally {
    smsVerificationSending.value = false
  }
}

const verifyCode = async () => {
  if (!verificationCode.value || verificationCode.value.length !== 6) return

  loading.value = true
  try {
    if (verificationModal.value.type === 'email') {
      await api.post('/auth/email/verify', {
        email: verificationModal.value.target,
        code: verificationCode.value
      })
      showMessage('ایمیل با موفقیت تایید شد', 'success')
    } else {
      await api.post('/auth/phone/verify', {
        phone: verificationModal.value.target,
        code: verificationCode.value
      })
      showMessage('شماره موبایل با موفقیت تایید شد', 'success')
    }

    closeVerificationModal()
    await loadUserData()
  } catch (error) {
    showMessage('کد تایید اشتباه است', 'error')
    console.error('Error verifying code:', error)
  } finally {
    loading.value = false
  }
}

const confirmUsernameChange = () => {
  showUsernameWarning.value = false
  // Username can now be changed
}

const cancelPasswordForm = () => {
  showPasswordForm.value = false
  resetPasswordForm()
  message.value = ''
}

const resetPasswordForm = () => {
  passwordForm.value = {
    current_password: '',
    password: '',
    password_confirmation: ''
  }
}

const closeVerificationModal = () => {
  showVerificationModal.value = false
  verificationCode.value = ''
  verificationModal.value = { type: '', target: '' }
}

const showMessage = (msg, type) => {
  message.value = msg
  messageClass.value = type === 'success'
    ? 'bg-green-100 text-green-700 border border-green-200'
    : 'bg-red-100 text-red-700 border border-red-200'

  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const formatDate = (dateString) => {
  if (!dateString) return 'نامشخص'
  return new Date(dateString).toLocaleDateString('fa-IR')
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadUserData(),
    loadProvincesData()
  ])
})
</script>
