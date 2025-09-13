<!-- app/pages/profile.vue -->
<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h1 class="text-3xl font-bold text-gray-900">پروفایل کاربری</h1>
      <p class="text-gray-600 mt-1">مدیریت اطلاعات شخصی و تنظیمات حساب کاربری</p>
    </div>

    <!-- Messages -->
    <div v-if="message" :class="messageClass" class="p-4 rounded-lg">
      <p style="white-space: pre-wrap;">{{ message }}</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-3 space-y-6">

        <!-- Basic Information -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 border-b pb-4 mb-6">اطلاعات شخصی</h2>
          <form @submit.prevent="handleUpdateProfile" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">نام و نام خانوادگی</label>
                <input v-model="form.name" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">نام کاربری</label>
                <input v-model="form.username" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" :disabled="!isUsernameChangeable" />
                <p v-if="!isUsernameChangeable && user" class="text-xs text-red-600 mt-1">تغییر نام کاربری تا {{ user.days_until_username_change }} روز دیگر ممکن نیست.</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">استان</label>
                <select v-model="form.province_id" @change="onProvinceChange" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                  <option value="">انتخاب استان</option>
                  <option v-for="province in provinces" :key="province.id" :value="province.id">{{ province.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">شهر</label>
                <select v-model="form.city_id" :disabled="!form.province_id || loadingCities" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                  <option value="">{{ loadingCities ? 'در حال بارگذاری...' : 'انتخاب شهر' }}</option>
                  <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name }}</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700">آدرس کامل</label>
                <textarea v-model="form.address" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
              </div>
            </div>
            <button type="submit" :disabled="loading || !hasFormChanges" class="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">ذخیره تغییرات</button>
          </form>
        </div>

        <!-- Password Management -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 border-b pb-4 mb-6">مدیریت رمز عبور</h2>
          <form @submit.prevent="handlePasswordUpdate" class="space-y-4">
            <div v-if="authStore.hasPassword">
              <label class="block text-sm font-medium text-gray-700">رمز عبور فعلی</label>
              <input v-model="passwordForm.current_password" type="password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">رمز عبور جدید</label>
              <input v-model="passwordForm.password" type="password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required minlength="8" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">تکرار رمز عبور جدید</label>
              <input v-model="passwordForm.password_confirmation" type="password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
              <p v-if="passwordForm.password !== passwordForm.password_confirmation" class="text-xs text-red-600 mt-1">رمزها مطابقت ندارند.</p>
            </div>
            <button type="submit" :disabled="loading || passwordForm.password !== passwordForm.password_confirmation" class="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
              {{ authStore.hasPassword ? 'تغییر رمز عبور' : 'تنظیم رمز عبور' }}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const loading = ref(false)
const loadingCities = ref(false)
const message = ref('')
const messageType = ref('success')
const provinces = ref([])
const cities = ref([])

const originalForm = ref({})
const form = ref({
  name: '',
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

const isUsernameChangeable = computed(() => {
  if (!user.value) return false
  return !(user.value.days_until_username_change > 0)
})

const messageClass = computed(() => {
  return messageType.value === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
})

const hasFormChanges = computed(() => {
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value)
})

const populateForm = () => {
  if (user.value) {
    const formData = {
      name: user.value.name || '',
      username: user.value.username || '',
      province_id: user.value.province_id || '',
      city_id: user.value.city_id || '',
      address: user.value.address || ''
    }
    form.value = { ...formData }
    originalForm.value = { ...formData }
  }
}

const handleUpdateProfile = async () => {
  loading.value = true
  showMessage('')
  try {
    await authStore.updateProfile(form.value)
    originalForm.value = { ...form.value }
    showMessage('اطلاعات با موفقیت ذخیره شد.', 'success')
  } catch (error) {
    showMessage(error.data?.message || 'خطا در ذخیره اطلاعات.', 'error')
  } finally {
    loading.value = false
  }
}

const handlePasswordUpdate = async () => {
  loading.value = true
  showMessage('')
  if (passwordForm.value.password !== passwordForm.value.password_confirmation) {
    showMessage('رمز عبور و تکرار آن باید یکسان باشند.', 'error')
    loading.value = false
    return
  }
  try {
    if (authStore.hasPassword) {
      await authStore.updatePassword(passwordForm.value.current_password, passwordForm.value.password)
    } else {
      await authStore.setPassword(passwordForm.value.password)
    }
    passwordForm.value = { current_password: '', password: '', password_confirmation: '' }
    showMessage('رمز عبور با موفقیت ذخیره شد.', 'success')
  } catch (error) {
    showMessage(error.data?.message || 'خطا در ذخیره رمز عبور.', 'error')
  } finally {
    loading.value = false
  }
}

const loadProvinces = async () => {
  try {
    provinces.value = await authStore.getProvinces()
  } catch (error) {
    console.error('Failed to load provinces:', error)
  }
}

const loadCities = async (provinceId) => {
  if (!provinceId) {
    cities.value = []
    return
  }
  loadingCities.value = true
  try {
    cities.value = await authStore.getCities(provinceId)
  } catch (error) {
    console.error('Failed to load cities:', error)
  } finally {
    loadingCities.value = false
  }
}

const onProvinceChange = () => {
  form.value.city_id = ''
  loadCities(form.value.province_id)
}

const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
}

watch(user, (newUser) => {
  if (newUser) {
    populateForm()
    if (form.value.province_id) {
      loadCities(form.value.province_id)
    }
  }
}, { immediate: true, deep: true })

onMounted(async () => {
  await loadProvinces()
  if (!user.value) {
    await authStore.fetchUser()
  } else {
     // If user is already in store, ensure form is populated
    populateForm()
    if (form.value.province_id) {
      await loadCities(form.value.province_id)
    }
  }
})
</script>
