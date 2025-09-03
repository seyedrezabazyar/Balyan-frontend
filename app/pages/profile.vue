<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">پروفایل کاربری</h1>

    <!-- نمایش پیام‌ها -->
    <div v-if="message" :class="messageClass" class="mb-4 p-3 rounded">
      {{ message }}
    </div>

    <!-- فرم پروفایل -->
    <form @submit.prevent="updateProfile" class="space-y-4">
      <div>
        <label class="block mb-1 text-sm font-medium">نام و نام خانوادگی</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          required
        />
        <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">ایمیل</label>
        <input
          v-model="form.email"
          type="email"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          :disabled="!!user?.email_verified_at"
        />
        <p v-if="user?.email_verified_at" class="text-xs text-green-600 mt-1">
          ✓ تایید شده
        </p>
        <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">شماره موبایل</label>
        <input
          v-model="form.phone"
          type="text"
          placeholder="09123456789"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          :disabled="!!user?.phone_verified_at"
        />
        <p v-if="user?.phone_verified_at" class="text-xs text-green-600 mt-1">
          ✓ تایید شده
        </p>
        <p v-if="errors.phone" class="text-xs text-red-600 mt-1">{{ errors.phone }}</p>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">نام کاربری</label>
        <input
          v-model="form.username"
          type="text"
          class="w-full px-3 py-2 border rounded bg-gray-100"
          disabled
        />
        <p class="text-xs text-gray-500 mt-1">نام کاربری قابل تغییر نیست</p>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">کد ملی</label>
        <input
          v-model="form.national_id"
          type="text"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
        />
        <p v-if="errors.national_id" class="text-xs text-red-600 mt-1">{{ errors.national_id }}</p>
      </div>

      <!-- آواتار -->
      <div>
        <label class="block mb-1 text-sm font-medium">تصویر پروفایل</label>
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            <img v-if="avatarPreview" :src="avatarPreview" class="w-full h-full object-cover" alt="avatar" />
            <span v-else class="text-xs text-gray-400">بدون تصویر</span>
          </div>
          <input type="file" accept="image/png,image/jpeg" @change="onAvatarChange" />
        </div>
        <p class="text-xs text-gray-500 mt-1">حداکثر 2 مگابایت، فرمت‌های JPEG/PNG</p>
        <p v-if="errors.avatar" class="text-xs text-red-600 mt-1">{{ errors.avatar }}</p>
      </div>

      <!-- استان / شهر -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 text-sm font-medium">استان</label>
          <select v-model="form.province_id" @change="onProvinceChange" class="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500">
            <option value="">انتخاب استان</option>
            <option v-for="p in provinces" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
          <p v-if="errors.province_id" class="text-xs text-red-600 mt-1">{{ errors.province_id }}</p>
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium">شهر</label>
          <select v-model="form.city_id" :disabled="!form.province_id" class="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500">
            <option value="">انتخاب شهر</option>
            <option v-for="c in cities" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <p v-if="errors.city_id" class="text-xs text-red-600 mt-1">{{ errors.city_id }}</p>
        </div>
      </div>

      <!-- بیو و وب‌سایت -->
      <div>
        <label class="block mb-1 text-sm font-medium">بیو</label>
        <textarea v-model="form.bio" rows="4" class="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"></textarea>
        <p v-if="errors.bio" class="text-xs text-red-600 mt-1">{{ errors.bio }}</p>
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium">وب‌سایت</label>
        <input v-model="form.website" type="url" class="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500" />
        <p v-if="errors.website" class="text-xs text-red-600 mt-1">{{ errors.website }}</p>
      </div>

      <!-- نمایش پروفایل و تنظیمات -->
      <div>
        <label class="block mb-1 text-sm font-medium">نمایش پروفایل</label>
        <select v-model="form.visibility" class="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500">
          <option value="public">عمومی</option>
          <option value="members_only">فقط اعضا</option>
          <option value="private">خصوصی</option>
        </select>
        <p v-if="errors.visibility" class="text-xs text-red-600 mt-1">{{ errors.visibility }}</p>
      </div>

      <div class="flex items-center gap-6">
        <label class="inline-flex items-center gap-2">
          <input type="checkbox" v-model="form.show_achievements" />
          <span class="text-sm">نمایش دستاوردها</span>
        </label>
        <label class="inline-flex items-center gap-2">
          <input type="checkbox" v-model="form.show_statistics" />
          <span class="text-sm">نمایش آمار</span>
        </label>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">روش ورود ترجیحی</label>
        <select
          v-model="form.preferred_method"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
        >
          <option value="otp">کد یکبار مصرف</option>
          <option value="password" :disabled="!user?.password">رمز عبور</option>
        </select>
      </div>

      <!-- دکمه‌ها -->
      <div class="flex gap-4 pt-4">
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
        </button>

        <NuxtLink
          to="/dashboard"
          class="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
        >
          بازگشت
        </NuxtLink>
      </div>
    </form>

    <!-- بخش تغییر رمز عبور -->
    <div class="mt-8 pt-8 border-t">
      <h2 class="text-lg font-semibold mb-4">رمز عبور</h2>

      <div v-if="!user?.password">
        <p class="text-sm text-gray-600 mb-3">
          شما هنوز رمز عبور تنظیم نکرده‌اید. با تنظیم رمز عبور می‌توانید با رمز هم وارد شوید.
        </p>
        <button
          @click="showPasswordForm = true"
          v-if="!showPasswordForm"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          تنظیم رمز عبور
        </button>
      </div>
      <div v-else>
        <p class="text-sm text-gray-600 mb-3">
          برای تغییر رمز عبور، ابتدا رمز فعلی و سپس رمز جدید را وارد کنید.
        </p>
        <button
          @click="showPasswordForm = true"
          v-if="!showPasswordForm"
          class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          تغییر رمز عبور
        </button>
      </div>

      <!-- فرم رمز عبور -->
      <form v-if="showPasswordForm" @submit.prevent="handlePassword" class="mt-4 space-y-3 max-w-sm">
        <div v-if="user?.password">
          <label class="block mb-1 text-sm font-medium">رمز عبور فعلی</label>
          <input
            v-model="passwordForm.current_password"
            type="password"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">رمز عبور جدید</label>
          <input
            v-model="passwordForm.password"
            type="password"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            minlength="8"
            required
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium">تکرار رمز عبور جدید</label>
          <input
            v-model="passwordForm.password_confirmation"
            type="password"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            minlength="8"
            required
          />
        </div>

        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'در حال ذخیره...' : 'ذخیره رمز' }}
          </button>
          <button
            type="button"
            @click="cancelPasswordForm"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>

    <!-- اطلاعات آخرین ورود -->
    <div class="mt-8 pt-8 border-t text-sm text-gray-600">
      <p v-if="user?.last_login_at">
        آخرین ورود: {{ new Date(user.last_login_at).toLocaleDateString('fa-IR') }}
      </p>
      <p v-if="user?.created_at">
        تاریخ عضویت: {{ new Date(user.created_at).toLocaleDateString('fa-IR') }}
      </p>
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

const user = ref(null)
const loading = ref(false)
const message = ref('')
const messageClass = ref('')
const showPasswordForm = ref(false)
const provinces = ref([])
const cities = ref([])
const errors = ref({})

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
  show_statistics: true,
  preferred_method: 'otp'
})

const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})

onMounted(async () => {
  await loadUserData()
  await loadProvinces()
  if (form.value.province_id) await loadCities(form.value.province_id)
})

async function loadUserData() {
  try {
    const response = await api.get('/user')
    user.value = response.user || response

    // پر کردن فرم با اطلاعات کاربر
    form.value = {
      name: user.value.name || '',
      username: user.value.username || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      national_id: user.value.national_id || '',
      avatar: user.value.avatar || null,
      province_id: user.value.province_id || '',
      city_id: user.value.city_id || '',
      bio: user.value.profile?.bio || '',
      website: user.value.profile?.website || '',
      visibility: user.value.profile?.visibility || 'public',
      show_achievements: user.value.profile?.show_achievements ?? true,
      show_statistics: user.value.profile?.show_statistics ?? true,
      preferred_method: user.value.preferred_method || 'otp'
    }
  } catch (error) {
    showMessage('خطا در دریافت اطلاعات', 'error')
  }
}

async function loadProvinces() {
  try {
    provinces.value = await $fetch('/provinces')
  } catch (e) {
    // ignore for now
  }
}

async function loadCities(provinceId) {
  try {
    cities.value = await $fetch(`/cities?province_id=${provinceId}`)
  } catch (e) {
    // ignore for now
  }
}

async function updateProfile() {
  loading.value = true
  message.value = ''
  errors.value = {}

  // حداقل یکی از ایمیل یا موبایل الزامی است
  if (!form.value.email && !form.value.phone) {
    errors.value.email = 'ایمیل یا شماره موبایل باید وارد شود'
    errors.value.phone = 'ایمیل یا شماره موبایل باید وارد شود'
    loading.value = false
    return
  }

  try {
    const payload = {
      name: form.value.name,
      username: form.value.username || null,
      email: form.value.email || null,
      phone: form.value.phone || null,
      national_id: form.value.national_id || null,
      avatar: form.value.avatar || null,
      province_id: form.value.province_id ? Number(form.value.province_id) : null,
      city_id: form.value.city_id ? Number(form.value.city_id) : null,
      bio: form.value.bio || null,
      website: form.value.website || null,
      visibility: form.value.visibility || 'public',
      show_achievements: !!form.value.show_achievements,
      show_statistics: !!form.value.show_statistics,
      preferred_method: form.value.preferred_method || 'otp'
    }

    const response = await api.post('/profile/update', payload)

    user.value = response.user
    authStore.user = response.user
    showMessage('اطلاعات با موفقیت ذخیره شد', 'success')
  } catch (error) {
    if (error?.status === 422 && error?.data?.errors) {
      const fieldErrors = error.data.errors
      // نگاشت خطاها به شکل ساده
      for (const key in fieldErrors) {
        errors.value[key] = Array.isArray(fieldErrors[key]) ? fieldErrors[key][0] : fieldErrors[key]
      }
      showMessage('لطفاً خطاهای مشخص‌شده را برطرف کنید', 'error')
    } else if (error?.status === 400) {
      showMessage(error.data?.message || 'درخواست نامعتبر است', 'error')
    } else if (error?.status === 401) {
      showMessage('ابتدا وارد شوید', 'error')
    } else {
      showMessage('خطایی رخ داد. دوباره تلاش کنید', 'error')
    }
  } finally {
    loading.value = false
  }
}

async function handlePassword() {
  loading.value = true
  message.value = ''

  const endpoint = user.value?.password ? '/password/update' : '/password/set'

  try {
    await api.post(endpoint, passwordForm.value)
    showMessage('رمز عبور با موفقیت ذخیره شد', 'success')
    showPasswordForm.value = false
    resetPasswordForm()
    await loadUserData()
  } catch (error) {
    if (error?.status === 400 || error?.status === 422) {
      showMessage(error.data?.message || 'اطلاعات وارد شده صحیح نیست', 'error')
    } else if (error?.status === 401) {
      showMessage('ابتدا وارد شوید', 'error')
    } else {
      showMessage('خطایی رخ داد. دوباره تلاش کنید', 'error')
    }
  } finally {
    loading.value = false
  }
}

const avatarPreview = computed(() => {
  if (!form.value.avatar) return ''
  const value = form.value.avatar
  if (typeof value === 'string' && (value.startsWith('data:') || value.startsWith('http'))) return value
  return ''
})

function onProvinceChange(e) {
  const id = (e?.target?.value ?? form.value.province_id)
  form.value.province_id = id
  form.value.city_id = ''
  if (id) loadCities(id)
}

function onAvatarChange(event) {
  const file = event?.target?.files?.[0]
  if (!file) return
  const validTypes = ['image/jpeg', 'image/png']
  if (!validTypes.includes(file.type)) {
    errors.value.avatar = 'فرمت فایل نامعتبر است'
    return
  }
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    errors.value.avatar = 'حجم فایل بیش از 2 مگابایت است'
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    form.value.avatar = reader.result
  }
  reader.readAsDataURL(file)
}

function cancelPasswordForm() {
  showPasswordForm.value = false
  resetPasswordForm()
  message.value = ''
}

function resetPasswordForm() {
  passwordForm.value = {
    current_password: '',
    password: '',
    password_confirmation: ''
  }
}

function showMessage(msg, type) {
  message.value = msg
  messageClass.value = type === 'success'
    ? 'bg-green-100 text-green-700 border border-green-200'
    : 'bg-red-100 text-red-700 border border-red-200'

  setTimeout(() => {
    message.value = ''
  }, 5000)
}
</script>
