<!-- app/pages/admin/users/[id]/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">جزئیات کاربر</h1>
          <p class="text-gray-600 mt-2">مشاهده اطلاعات کامل کاربر</p>
        </div>
        <NuxtLink to="/admin/users"
                  class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
          بازگشت به لیست کاربران
        </NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">در حال بارگذاری...</p>
      </div>

      <div v-else-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- اطلاعات اصلی -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4">اطلاعات شخصی</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">نام</label>
                <p class="mt-1 text-sm text-gray-900">{{ user.name || 'نام نامشخص' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">نام کاربری</label>
                <p class="mt-1 text-sm text-gray-900">{{ user.username }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">ایمیل</label>
                <p class="mt-1 text-sm text-gray-900">{{ user.email || 'ایمیل ندارد' }}</p>
                <span v-if="user.email_verified_at"
                      class="inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  تایید شده در {{ new Date(user.email_verified_at).toLocaleDateString('fa-IR') }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">شماره تلفن</label>
                <p class="mt-1 text-sm text-gray-900">{{ user.phone || 'تلفن ندارد' }}</p>
                <span v-if="user.phone_verified_at"
                      class="inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  تایید شده در {{ new Date(user.phone_verified_at).toLocaleDateString('fa-IR') }}
                </span>
              </div>
            </div>
          </div>

          <!-- نقش‌ها و دسترسی‌ها -->
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4">نقش‌ها و دسترسی‌ها</h2>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">نقش‌های فعلی</label>
              <div class="flex flex-wrap gap-2">
                <span v-for="role in user.roles" :key="role.id"
                      class="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                  {{ role.display_name }}
                </span>
                <span v-if="user.roles?.length === 0" class="text-gray-500 text-sm">
                  هیچ نقشی تعریف نشده
                </span>
              </div>
            </div>

            <div v-if="user.permissions?.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">دسترسی‌ها</label>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div v-for="permission in user.permissions" :key="permission.id"
                     class="px-2 py-1 bg-gray-100 rounded">
                  {{ permission.display_name }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- اطلاعات جانبی -->
        <div>
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4">وضعیت حساب</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">وضعیت:</span>
                <span v-if="user.locked_until"
                      class="text-sm font-medium text-red-600">قفل شده</span>
                <span v-else class="text-sm font-medium text-green-600">فعال</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">مدیر سیستم:</span>
                <span class="text-sm font-medium"
                      :class="user.is_admin ? 'text-purple-600' : 'text-gray-600'">
                  {{ user.is_admin ? 'بله' : 'خیر' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">روش ورود ترجیحی:</span>
                <span class="text-sm text-gray-900">{{ user.preferred_method }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4">تاریخ‌های مهم</h3>
            <div class="space-y-3">
              <div>
                <span class="text-sm text-gray-600">تاریخ ثبت‌نام:</span>
                <p class="text-sm text-gray-900">
                  {{ new Date(user.created_at).toLocaleDateString('fa-IR') }}
                </p>
              </div>
              <div>
                <span class="text-sm text-gray-600">آخرین ورود:</span>
                <p class="text-sm text-gray-900">
                  {{ user.last_login_at ? new Date(user.last_login_at).toLocaleDateString('fa-IR') : 'هیچوقت' }}
                </p>
              </div>
            </div>
          </div>

          <!-- عملیات سریع -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">عملیات</h3>
            <div class="space-y-2">
              <button @click="toggleLock"
                      class="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50"
                      :class="user.locked_until ? 'text-green-600' : 'text-yellow-600'">
                {{ user.locked_until ? 'باز کردن حساب' : 'قفل کردن حساب' }}
              </button>
              <button @click="resetPassword"
                      class="w-full text-left px-3 py-2 text-sm text-red-600 rounded hover:bg-gray-50">
                بازنشانی رمز عبور
              </button>
              <button v-if="!user.email_verified_at && user.email"
                      @click="verifyEmail"
                      class="w-full text-left px-3 py-2 text-sm text-blue-600 rounded hover:bg-gray-50">
                تایید ایمیل دستی
              </button>
              <button v-if="!user.phone_verified_at && user.phone"
                      @click="verifyPhone"
                      class="w-full text-left px-3 py-2 text-sm text-blue-600 rounded hover:bg-gray-50">
                تایید تلفن دستی
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'admin'
})

const route = useRoute()
const authStore = useAuthStore()

const user = ref(null)
const loading = ref(true)

const loadUser = async () => {
  try {
    const authAPI = useAuthAPI()
    user.value = await authAPI.getUser(route.params.id)
  } catch (error) {
    console.error('خطا در دریافت کاربر:', error)
  } finally {
    loading.value = false
  }
}

const toggleLock = async () => {
  try {
    const authAPI = useAuthAPI()
    await authAPI.toggleUserLock(user.value.id)
    await loadUser()
    alert('عملیات با موفقیت انجام شد')
  } catch (error) {
    alert('خطا در انجام عملیات')
  }
}

const resetPassword = async () => {
  const newPassword = prompt('رمز عبور جدید را وارد کنید:')
  if (!newPassword) return

  try {
    const authAPI = useAuthAPI()
    await authAPI.resetPassword(user.value.id, newPassword)
    alert('رمز عبور با موفقیت تغییر کرد')
  } catch (error) {
    alert('خطا در تغییر رمز عبور')
  }
}

const verifyEmail = async () => {
  try {
    const authAPI = useAuthAPI()
    await authAPI.verifyEmail(user.value.id)
    await loadUser()
    alert('ایمیل با موفقیت تایید شد')
  } catch (error) {
    alert('خطا در تایید ایمیل')
  }
}

const verifyPhone = async () => {
  try {
    const authAPI = useAuthAPI()
    await authAPI.verifyPhone(user.value.id)
    await loadUser()
    alert('تلفن با موفقیت تایید شد')
  } catch (error) {
    alert('خطا در تایید تلفن')
  }
}

onMounted(() => {
  loadUser()
})
</script>
