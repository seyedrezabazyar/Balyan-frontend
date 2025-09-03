<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">پروفایل کاربری</h1>

    <!-- نمایش پیام‌ها -->
    <div v-if="message" :class="messageClass" class="mb-4 p-3 rounded">
      {{ message }}
    </div>

    <!-- فرم ساده -->
    <form @submit.prevent="updateProfile" class="space-y-4">
      <div>
        <label class="block mb-1 text-sm font-medium">نام و نام خانوادگی</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          required
        />
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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()

const user = ref(null)
const loading = ref(false)
const message = ref('')
const messageClass = ref('')
const showPasswordForm = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: '',
  username: '',
  preferred_method: 'otp'
})

const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})

onMounted(async () => {
  // اطمینان از وجود توکن
  if (!authStore.token) {
    await navigateTo('/auth')
    return
  }
  await loadUserData()
})

async function loadUserData() {
  try {
    // ایجاد api با توکن فعلی
    const api = useApi(authStore.token)
    const response = await api.get('/auth/user')
    
    // بررسی ساختار response
    user.value = response.user || response

    // پر کردن فرم با اطلاعات کاربر
    form.value = {
      name: user.value.name || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      username: user.value.username || '',
      preferred_method: user.value.preferred_method || 'otp'
    }
  } catch (error) {
    console.error('خطا در دریافت اطلاعات کاربر:', error)
    
    // اگر خطای 401 بود، به صفحه ورود برویم
    if (error?.status === 401 || error?.statusCode === 401) {
      authStore.clearAuth()
      await navigateTo('/auth')
    } else {
      showMessage('خطا در دریافت اطلاعات', 'error')
    }
  }
}

async function updateProfile() {
  loading.value = true
  message.value = ''

  try {
    // ایجاد api با توکن فعلی
    const api = useApi(authStore.token)
    const response = await api.post('/auth/profile/update', {
      name: form.value.name,
      email: form.value.email || null,
      phone: form.value.phone || null,
      preferred_method: form.value.preferred_method
    })

    user.value = response.user || response
    authStore.user = response.user || response
    showMessage('اطلاعات با موفقیت ذخیره شد', 'success')
  } catch (error) {
    console.error('خطا در به‌روزرسانی پروفایل:', error)
    
    // اگر خطای 401 بود، به صفحه ورود برویم
    if (error?.status === 401 || error?.statusCode === 401) {
      authStore.clearAuth()
      await navigateTo('/auth')
    } else {
      showMessage(error?.data?.message || error?.message || 'خطا در ذخیره اطلاعات', 'error')
    }
  } finally {
    loading.value = false
  }
}

async function handlePassword() {
  loading.value = true
  message.value = ''

  const endpoint = user.value?.password ? '/auth/password/update' : '/auth/password/set'

  try {
    // ایجاد api با توکن فعلی
    const api = useApi(authStore.token)
    await api.post(endpoint, passwordForm.value)
    showMessage('رمز عبور با موفقیت ذخیره شد', 'success')
    showPasswordForm.value = false
    resetPasswordForm()
    await loadUserData()
  } catch (error) {
    console.error('خطا در تغییر رمز عبور:', error)
    
    // اگر خطای 401 بود، به صفحه ورود برویم
    if (error?.status === 401 || error?.statusCode === 401) {
      authStore.clearAuth()
      await navigateTo('/auth')
    } else {
      showMessage(error?.data?.message || error?.message || 'خطا در ذخیره رمز عبور', 'error')
    }
  } finally {
    loading.value = false
  }
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
