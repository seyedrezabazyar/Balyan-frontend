<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">پروفایل کاربری</h1>

    <!-- نمایش پیام‌ها -->
    <div v-if="message" :class="messageClass" class="mb-6 p-4 rounded-lg flex items-center justify-between">
      <span>{{ message }}</span>
      <button @click="message = ''" class="text-lg font-bold">×</button>
    </div>

    <!-- Loading State -->
    <div v-if="initialLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Profile Form -->
    <div v-else class="bg-white rounded-lg shadow-lg p-6">
      <form @submit.prevent="updateProfile" class="space-y-6">
        <!-- بخش اطلاعات شخصی -->
        <div class="border-b pb-6">
          <h2 class="text-xl font-semibold mb-4">اطلاعات شخصی</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- نام و نام خانوادگی -->
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">
                نام و نام خانوادگی <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{'border-red-500': errors.name}"
                required
                maxlength="255"
              />
              <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
            </div>

            <!-- نام کاربری -->
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">نام کاربری</label>
              <input
                v-model="form.username"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{'border-red-500': errors.username}"
                maxlength="50"
                pattern="[a-zA-Z0-9_-]+"
                placeholder="فقط حروف انگلیسی، اعداد، _ و -"
              />
              <p v-if="errors.username" class="text-red-500 text-xs mt-1">{{ errors.username }}</p>
            </div>

            <!-- ایمیل -->
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">ایمیل</label>
              <div class="relative">
                <input
                  v-model="form.email"
                  type="email"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{'border-red-500': errors.email}"
                  maxlength="255"
                />
                <span v-if="user?.email_verified_at" class="absolute left-2 top-1/2 -translate-y-1/2 text-green-600">
                  ✓
                </span>
              </div>
              <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
              <p v-if="user?.email_verified_at" class="text-green-600 text-xs mt-1">تایید شده</p>
            </div>

            <!-- شماره موبایل -->
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">شماره موبایل</label>
              <div class="relative">
                <input
                  v-model="form.phone"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{'border-red-500': errors.phone}"
                  placeholder="09123456789"
                  maxlength="20"
                />
                <span v-if="user?.phone_verified_at" class="absolute left-2 top-1/2 -translate-y-1/2 text-green-600">
                  ✓
                </span>
              </div>
              <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
              <p v-if="user?.phone_verified_at" class="text-green-600 text-xs mt-1">تایید شده</p>
            </div>

            <!-- کد ملی -->
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">کد ملی</label>
              <input
                v-model="form.national_id"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{'border-red-500': errors.national_id}"
                placeholder="1234567890"
                maxlength="10"
                pattern="\d{10}"
              />
              <p v-if="errors.national_id" class="text-red-500 text-xs mt-1">{{ errors.national_id }}</p>
            </div>

            <!-- روش ورود ترجیحی -->
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">روش ورود ترجیحی</label>
              <select
                v-model="form.preferred_method"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="otp">کد یکبار مصرف</option>
                <option value="password" :disabled="!user?.password">رمز عبور</option>
              </select>
            </div>
          </div>
        </div>

        <!-- بخش موقعیت جغرافیایی -->
        <div class="border-b pb-6">
          <h2 class="text-xl font-semibold mb-4">موقعیت جغرافیایی</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- استان -->
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">استان</label>
              <select
                v-model="form.province_id"
                @change="onProvinceChange"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">انتخاب استان</option>
                <option v-for="province in provinces" :key="province.id" :value="province.id">
                  {{ province.name }}
                </option>
              </select>
              <p v-if="errors.province_id" class="text-red-500 text-xs mt-1">{{ errors.province_id }}</p>
            </div>

            <!-- شهر -->
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">شهر</label>
              <select
                v-model="form.city_id"
                :disabled="!form.province_id || loadingCities"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">{{ loadingCities ? 'در حال بارگذاری...' : 'انتخاب شهر' }}</option>
                <option v-for="city in cities" :key="city.id" :value="city.id">
                  {{ city.name }}
                </option>
              </select>
              <p v-if="errors.city_id" class="text-red-500 text-xs mt-1">{{ errors.city_id }}</p>
            </div>
          </div>
        </div>

        <!-- بخش پروفایل عمومی -->
        <div class="border-b pb-6">
          <h2 class="text-xl font-semibold mb-4">پروفایل عمومی</h2>
          
          <!-- آواتار -->
          <div class="mb-4">
            <label class="block mb-2 text-sm font-medium text-gray-700">تصویر پروفایل</label>
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="relative">
                <img
                  :src="avatarPreview || '/default-avatar.svg'"
                  alt="Avatar"
                  class="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                />
                <button
                  v-if="avatarPreview"
                  @click="removeAvatar"
                  type="button"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
              <div>
                <input
                  type="file"
                  @change="handleAvatarChange"
                  accept="image/jpeg,image/png"
                  ref="avatarInput"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="$refs.avatarInput.click()"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  انتخاب تصویر
                </button>
                <p class="text-xs text-gray-500 mt-2">حداکثر 2 مگابایت، فرمت JPEG یا PNG</p>
              </div>
            </div>
            <p v-if="errors.avatar" class="text-red-500 text-xs mt-1">{{ errors.avatar }}</p>
          </div>

          <!-- بیوگرافی -->
          <div class="mb-4">
            <label class="block mb-2 text-sm font-medium text-gray-700">درباره من</label>
            <textarea
              v-model="form.bio"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errors.bio}"
              maxlength="1000"
              placeholder="چند خط درباره خودتان بنویسید..."
            ></textarea>
            <p class="text-xs text-gray-500 text-left">{{ form.bio?.length || 0 }}/1000</p>
            <p v-if="errors.bio" class="text-red-500 text-xs mt-1">{{ errors.bio }}</p>
          </div>

          <!-- وب‌سایت -->
          <div class="mb-4">
            <label class="block mb-2 text-sm font-medium text-gray-700">وب‌سایت</label>
            <input
              v-model="form.website"
              type="url"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errors.website}"
              placeholder="https://example.com"
              maxlength="255"
            />
            <p v-if="errors.website" class="text-red-500 text-xs mt-1">{{ errors.website }}</p>
          </div>

          <!-- تنظیمات نمایش پروفایل -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">نمایش پروفایل</label>
              <select
                v-model="form.visibility"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">عمومی</option>
                <option value="members_only">فقط اعضا</option>
                <option value="private">خصوصی</option>
              </select>
            </div>

            <div class="flex items-center">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="form.show_achievements"
                  type="checkbox"
                  class="ml-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">نمایش دستاوردها</span>
              </label>
            </div>

            <div class="flex items-center">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="form.show_statistics"
                  type="checkbox"
                  class="ml-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">نمایش آمار</span>
              </label>
            </div>
          </div>
        </div>

        <!-- دکمه‌های عملیات -->
        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></span>
            {{ loading ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
          </button>

          <NuxtLink
            to="/dashboard"
            class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
          >
            بازگشت به داشبورد
          </NuxtLink>
        </div>
      </form>

      <!-- بخش تغییر رمز عبور -->
      <div class="mt-8 pt-8 border-t">
        <h2 class="text-xl font-semibold mb-4">مدیریت رمز عبور</h2>

        <div v-if="!user?.password" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p class="text-sm text-gray-700 mb-3">
            شما هنوز رمز عبور تنظیم نکرده‌اید. با تنظیم رمز عبور می‌توانید علاوه بر کد یکبار مصرف، با رمز عبور نیز وارد شوید.
          </p>
          <button
            @click="showPasswordForm = true"
            v-if="!showPasswordForm"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            تنظیم رمز عبور
          </button>
        </div>
        
        <div v-else class="mb-4">
          <p class="text-sm text-gray-600 mb-3">
            برای تغییر رمز عبور، ابتدا رمز فعلی و سپس رمز جدید را وارد کنید.
          </p>
          <button
            @click="showPasswordForm = true"
            v-if="!showPasswordForm"
            class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
          >
            تغییر رمز عبور
          </button>
        </div>

        <!-- فرم رمز عبور -->
        <form v-if="showPasswordForm" @submit.prevent="handlePassword" class="mt-4 space-y-4 max-w-md bg-gray-50 p-4 rounded-lg">
          <div v-if="user?.password">
            <label class="block mb-2 text-sm font-medium text-gray-700">رمز عبور فعلی</label>
            <input
              v-model="passwordForm.current_password"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">رمز عبور جدید</label>
            <input
              v-model="passwordForm.new_password"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              minlength="8"
              required
              @input="checkPasswordStrength"
            />
            <div class="mt-2">
              <div class="flex gap-1 mb-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="flex-1 h-1 rounded"
                  :class="i <= passwordStrength ? passwordStrengthColor : 'bg-gray-300'"
                ></div>
              </div>
              <p class="text-xs" :class="passwordStrengthTextColor">{{ passwordStrengthText }}</p>
            </div>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">تکرار رمز عبور جدید</label>
            <input
              v-model="passwordForm.password_confirmation"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              minlength="8"
              required
            />
            <p v-if="passwordForm.new_password && passwordForm.password_confirmation && passwordForm.new_password !== passwordForm.password_confirmation" class="text-red-500 text-xs mt-1">
              رمز عبور و تکرار آن یکسان نیستند
            </p>
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="loading || (passwordForm.new_password !== passwordForm.password_confirmation)"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'در حال ذخیره...' : 'ذخیره رمز عبور' }}
            </button>
            <button
              type="button"
              @click="cancelPasswordForm"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>

      <!-- اطلاعات حساب کاربری -->
      <div class="mt-8 pt-8 border-t">
        <h3 class="text-lg font-semibold mb-4">اطلاعات حساب کاربری</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div v-if="user?.created_at" class="flex justify-between">
            <span class="text-gray-600">تاریخ عضویت:</span>
            <span class="font-medium">{{ formatDate(user.created_at) }}</span>
          </div>
          <div v-if="user?.last_login_at" class="flex justify-between">
            <span class="text-gray-600">آخرین ورود:</span>
            <span class="font-medium">{{ formatDate(user.last_login_at) }}</span>
          </div>
          <div v-if="profile?.referral_code" class="flex justify-between">
            <span class="text-gray-600">کد دعوت:</span>
            <span class="font-mono font-medium bg-gray-100 px-2 py-1 rounded">{{ profile.referral_code }}</span>
          </div>
          <div v-if="profile?.total_points !== undefined" class="flex justify-between">
            <span class="text-gray-600">امتیاز کل:</span>
            <span class="font-medium">{{ profile.total_points.toLocaleString('fa-IR') }}</span>
          </div>
          <div v-if="profile?.current_level" class="flex justify-between">
            <span class="text-gray-600">سطح فعلی:</span>
            <span class="font-medium">سطح {{ profile.current_level }}</span>
          </div>
          <div v-if="profile?.reputation_score !== undefined" class="flex justify-between">
            <span class="text-gray-600">امتیاز اعتبار:</span>
            <span class="font-medium">{{ profile.reputation_score }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const api = useApi(authStore.token)

// State
const user = ref(null)
const profile = ref(null)
const loading = ref(false)
const initialLoading = ref(true)
const loadingCities = ref(false)
const message = ref('')
const messageClass = ref('')
const showPasswordForm = ref(false)
const provinces = ref([])
const cities = ref([])
const avatarPreview = ref('')
const errors = ref({})

// Password strength
const passwordStrength = ref(0)
const passwordStrengthColor = computed(() => {
  const colors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
  return colors[passwordStrength.value]
})
const passwordStrengthTextColor = computed(() => {
  const colors = ['', 'text-red-500', 'text-yellow-500', 'text-blue-500', 'text-green-500']
  return colors[passwordStrength.value]
})
const passwordStrengthText = computed(() => {
  const texts = ['', 'ضعیف', 'متوسط', 'خوب', 'قوی']
  return texts[passwordStrength.value]
})

// Form data
const form = ref({
  name: '',
  username: '',
  email: '',
  phone: '',
  national_id: '',
  avatar: null,
  province_id: '',
  city_id: '',
  bio: '',
  website: '',
  visibility: 'public',
  show_achievements: true,
  show_statistics: true
})

const passwordForm = ref({
  current_password: '',
  new_password: '',
  password_confirmation: ''
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadUserData(),
    loadProvinces()
  ])
  initialLoading.value = false
})

// Methods
async function loadUserData() {
  try {
    const response = await api.get('/auth/user')
    user.value = response.user || response
    profile.value = response.profile || response.user?.profile || {}

    // Fill form with user data
    form.value = {
      name: user.value.name || '',
      username: user.value.username || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      national_id: user.value.national_id || '',
      avatar: null,
      province_id: user.value.province_id || '',
      city_id: user.value.city_id || '',
      bio: profile.value.bio || '',
      website: profile.value.website || '',
      visibility: profile.value.visibility || 'public',
      show_achievements: profile.value.show_achievements !== false,
      show_statistics: profile.value.show_statistics !== false
    }

    // Set avatar preview
    if (user.value.avatar || profile.value.avatar_path) {
      avatarPreview.value = user.value.avatar || profile.value.avatar_path
    }

    // Load cities if province is selected
    if (form.value.province_id) {
      await loadCities(form.value.province_id)
    }
  } catch (error) {
    console.error('Error loading user data:', error)
    showMessage('خطا در دریافت اطلاعات کاربری', 'error')
  }
}

async function loadProvinces() {
  try {
    provinces.value = await api.get('/provinces')
  } catch (error) {
    console.error('Error loading provinces:', error)
  }
}

async function loadCities(provinceId) {
  if (!provinceId) {
    cities.value = []
    return
  }

  loadingCities.value = true
  try {
    cities.value = await api.get(`/cities?province_id=${provinceId}`)
  } catch (error) {
    console.error('Error loading cities:', error)
    cities.value = []
  } finally {
    loadingCities.value = false
  }
}

async function onProvinceChange() {
  form.value.city_id = ''
  await loadCities(form.value.province_id)
}

async function updateProfile() {
  loading.value = true
  errors.value = {}
  message.value = ''

  try {
    // Validate
    if (!form.value.name) {
      errors.value.name = 'نام و نام خانوادگی الزامی است'
      loading.value = false
      return
    }

    if (!form.value.email && !form.value.phone) {
      showMessage('حداقل یکی از فیلدهای ایمیل یا شماره موبایل باید پر شود', 'error')
      loading.value = false
      return
    }

    const response = await api.post('/auth/profile/update', form.value)
    
    user.value = response.user
    profile.value = response.profile || response.user?.profile || {}
    authStore.user = response.user
    
    showMessage('اطلاعات با موفقیت ذخیره شد', 'success')
  } catch (error) {
    if (error.data?.errors) {
      errors.value = error.data.errors
      showMessage('لطفا خطاهای فرم را بررسی کنید', 'error')
    } else {
      showMessage(error.data?.message || 'خطا در ذخیره اطلاعات', 'error')
    }
  } finally {
    loading.value = false
  }
}

async function handlePassword() {
  loading.value = true
  message.value = ''

  const endpoint = user.value?.password ? '/auth/password/update' : '/auth/password/set'
  const payload = user.value?.password 
    ? {
        current_password: passwordForm.value.current_password,
        new_password: passwordForm.value.new_password
      }
    : {
        password: passwordForm.value.new_password
      }

  try {
    await api.post(endpoint, payload)
    showMessage('رمز عبور با موفقیت ذخیره شد', 'success')
    showPasswordForm.value = false
    resetPasswordForm()
    await loadUserData()
  } catch (error) {
    showMessage(error.data?.message || 'خطا در ذخیره رمز عبور', 'error')
  } finally {
    loading.value = false
  }
}

function handleAvatarChange(event) {
  const file = event.target.files[0]
  if (!file) return

  // Validate file
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    errors.value.avatar = 'فقط فایل‌های JPEG و PNG مجاز هستند'
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    errors.value.avatar = 'حجم فایل نباید بیشتر از 2 مگابایت باشد'
    return
  }

  errors.value.avatar = ''

  // Read file
  const reader = new FileReader()
  reader.onloadend = () => {
    avatarPreview.value = reader.result
    form.value.avatar = reader.result
  }
  reader.readAsDataURL(file)
}

function removeAvatar() {
  avatarPreview.value = ''
  form.value.avatar = null
  if (this.$refs.avatarInput) {
    this.$refs.avatarInput.value = ''
  }
}

function checkPasswordStrength() {
  const password = passwordForm.value.new_password
  let strength = 0

  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password) && /[^a-zA-Z\d]/.test(password)) strength++

  passwordStrength.value = strength
}

function cancelPasswordForm() {
  showPasswordForm.value = false
  resetPasswordForm()
  message.value = ''
}

function resetPasswordForm() {
  passwordForm.value = {
    current_password: '',
    new_password: '',
    password_confirmation: ''
  }
  passwordStrength.value = 0
}

function showMessage(msg, type) {
  message.value = msg
  messageClass.value = type === 'success'
    ? 'bg-green-100 text-green-700 border border-green-200'
    : 'bg-red-100 text-red-700 border border-red-200'

  if (type === 'success') {
    setTimeout(() => {
      message.value = ''
    }, 5000)
  }
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
/* Add any custom styles here */
</style>