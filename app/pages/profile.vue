<!-- app/pages/profile.vue -->
<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">پروفایل کاربری</h1>
          <p class="text-gray-600 mt-1">مدیریت اطلاعات شخصی و تنظیمات حساب کاربری</p>
        </div>
        <div class="flex gap-3">
          <NuxtLink to="/dashboard"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            بازگشت به داشبورد
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" :class="messageClass"
         class="p-4 rounded-lg flex items-start gap-3 animate-fade-in">
      <svg v-if="messageType === 'success'" class="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <svg v-else class="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <div class="flex-1">
        <p class="font-medium" style="white-space: pre-wrap;">{{ message }}</p>
        <button @click="clearMessage" class="text-sm underline mt-1 opacity-75 hover:opacity-100">
          بستن
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-3 space-y-6">

        <!-- Basic Information -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              اطلاعات شخصی
            </h2>
          </div>

          <div class="p-6">
            <form @submit.prevent="handleUpdateProfile" class="space-y-6">
              <!-- Name and Username Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    نام و نام خانوادگی <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="نام کامل خود را وارد کنید"
                    required
                  />
                  <p class="text-xs text-gray-500">این نام در سراسر سایت نمایش داده خواهد شد</p>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    نام کاربری
                  </label>
                  <div class="relative">
                    <input
                      v-model="form.username"
                      type="text"
                      class="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors"
                      :class="{
                        'border-gray-300 focus:border-blue-500 focus:ring-blue-500': !usernameError,
                        'bg-gray-100 cursor-not-allowed': !isUsernameChangeable,
                        'border-red-500 focus:border-red-500 focus:ring-red-500': usernameError,
                      }"
                      :disabled="!isUsernameChangeable"
                      placeholder="نام کاربری منحصر به فرد"
                    />
                  </div>
                  <p v-if="usernameError" class="text-xs text-red-600 mt-1">{{ usernameError }}</p>
                  <p v-else-if="user && user.days_until_username_change > 0" class="text-xs text-red-600 mt-1">
                    شما فقط هر ۳۶۵ روز یک بار می‌توانید نام کاربری خود را تغییر دهید. {{ user.days_until_username_change }} روز تا تغییر بعدی باقی مانده است.
                  </p>
                  <p v-else class="text-xs text-gray-500 mt-1">
                    نام کاربری فقط هر ۳۶۵ روز یکبار قابل تغییر است.
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  :disabled="loading || !hasFormChanges"
                  class="flex-1 sm:flex-none bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ loading ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
                </button>

                <button
                  v-if="hasFormChanges"
                  type="button"
                  @click="resetForm"
                  class="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                >
                  بازگردانی تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Password Management -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              مدیریت رمز عبور
            </h2>
          </div>

          <div class="p-6">
            <!-- Password Status -->
            <div v-if="!hasPassword" class="mb-6">
              <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 class="text-sm font-medium text-amber-800">رمز عبور تنظیم نشده</h3>
                  <p class="text-sm text-amber-700 mt-1">
                    در حال حاضر فقط با کد یکبار مصرف وارد می‌شوید. با تنظیم رمز عبور امنیت حساب خود را افزایش دهید.
                  </p>
              </div>
            </div>

            <div v-else class="mb-6">
              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 class="text-sm font-medium text-green-800">رمز عبور فعال است</h3>
                  <p class="text-sm text-green-700 mt-1">
                    می‌توانید با رمز عبور یا کد یکبار مصرف وارد شوید.
                  </p>
              </div>
            </div>

            <!-- Password Form Toggle -->
            <div v-if="!showPasswordForm" class="text-center">
              <button
                @click="showPasswordForm = true"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors"
                :class="hasPassword
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-green-600 text-white hover:bg-green-700'"
              >
                {{ hasPassword ? 'تغییر رمز عبور' : 'تنظیم رمز عبور' }}
              </button>
            </div>

            <!-- Password Form -->
            <form v-if="showPasswordForm" @submit.prevent="handlePasswordUpdate" class="space-y-6">
              <div v-if="hasPassword" class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">رمز عبور فعلی *</label>
                <input
                  v-model="passwordForm.current_password"
                  type="password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">رمز عبور جدید *</label>
                <input
                  v-model="passwordForm.password"
                  type="password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  minlength="8"
                  required
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">تکرار رمز عبور جدید *</label>
                <input
                  v-model="passwordForm.password_confirmation"
                  type="password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  minlength="8"
                  required
                />
                <p v-if="passwordForm.password_confirmation && passwordForm.password !== passwordForm.password_confirmation"
                   class="text-xs text-red-600">
                  رمز عبور و تکرار آن باید یکسان باشند
                </p>
              </div>

              <div class="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  :disabled="loading || (passwordForm.password !== passwordForm.password_confirmation)"
                  class="flex-1 sm:flex-none bg-blue-600 text-white px-6 py-3 rounded-lg"
                >
                  {{ loading ? 'در حال ذخیره...' : 'ذخیره رمز عبور' }}
                </button>
                <button
                  type="button"
                  @click="cancelPasswordForm"
                  class="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-6 py-3 rounded-lg"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Account Status -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">وضعیت حساب</h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">آخرین ورود:</span>
              <p class="text-sm font-medium text-gray-900">
                {{ user?.last_login_at ? formatDate(user.last_login_at) : 'هیچوقت' }}
              </p>
            </div>
            <div v-if="user?.username_last_changed_at">
              <span class="text-sm text-gray-600">آخرین تغییر نام کاربری:</span>
              <p class="text-sm font-medium text-gray-900">
                {{ formatDate(user.username_last_changed_at) }}
              </p>
            </div>
          </div>
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
const { user, hasPassword } = storeToRefs(authStore)

const loading = ref(false)
const message = ref('')
const messageType = ref('success')
const usernameError = ref('')
const showPasswordForm = ref(false)

const originalForm = ref({})
const form = ref({
  name: '',
  username: '',
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
  return messageType.value === 'success'
    ? 'bg-green-50 text-green-700 border border-green-200'
    : 'bg-red-50 text-red-700 border border-red-200'
})

const hasFormChanges = computed(() => {
  if (!originalForm.value || !form.value) return false
  return Object.keys(form.value).some(key => form.value[key] !== originalForm.value[key])
})

const populateForm = () => {
  if (user.value) {
    const formData = {
      name: user.value.name || '',
      username: user.value.username || '',
    }
    form.value = { ...formData }
    originalForm.value = { ...formData }
  }
}

const handleUpdateProfile = async () => {
  loading.value = true
  clearMessage()
  usernameError.value = ''

  try {
    const updateData = {
      name: form.value.name,
      username: form.value.username,
    }
    await authStore.updateProfile(updateData)
    originalForm.value = { ...form.value }
    showMessage('اطلاعات با موفقیت ذخیره شد', 'success')
  } catch (error) {
    if (error.statusCode === 422 && error.data?.errors?.username) {
      usernameError.value = error.data.errors.username[0]
    } else {
      showMessage(error.data?.message || 'خطا در ذخیره اطلاعات', 'error')
    }
  } finally {
    loading.value = false
  }
}

const handlePasswordUpdate = async () => {
  loading.value = true
  clearMessage()

  if (passwordForm.value.password !== passwordForm.value.password_confirmation) {
    showMessage('رمز عبور و تکرار آن باید یکسان باشند', 'error')
    loading.value = false
    return
  }

  try {
    if (hasPassword.value) {
      await authStore.updatePassword(passwordForm.value.current_password, passwordForm.value.password)
    } else {
      await authStore.setPassword(passwordForm.value.password)
    }

    showMessage('رمز عبور با موفقیت ذخیره شد', 'success')
    showPasswordForm.value = false
    resetPasswordForm()
  } catch (error) {
    showMessage(error.data?.message || 'خطا در ذخیره رمز عبور', 'error')
  } finally {
    loading.value = false
  }
}

const cancelPasswordForm = () => {
  showPasswordForm.value = false
  resetPasswordForm()
  clearMessage()
}

const resetPasswordForm = () => {
  passwordForm.value = {
    current_password: '',
    password: '',
    password_confirmation: ''
  }
}

const resetForm = () => {
  form.value = { ...originalForm.value }
}

const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => clearMessage(), 5000)
}

const clearMessage = () => {
  message.value = ''
}

const formatDate = (dateString) => {
  if (!dateString) return 'نامشخص'
  return new Date(dateString).toLocaleDateString('fa-IR')
}

watch(user, (newUser) => {
  if (newUser) {
    populateForm()
  }
}, { immediate: true })

onMounted(() => {
  if (!user.value) {
    authStore.fetchUser()
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
