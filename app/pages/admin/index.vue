<!-- app/pages/admin/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">پنل مدیریت</h1>
        <p class="text-gray-600 mt-2">مدیریت کاربران و سیستم</p>
      </div>


      <!-- Error Display -->
      <div v-if="errors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-red-800 mb-2">خطاها:</h3>
        <div class="space-y-1 text-sm text-red-700">
          <div v-for="(error, index) in errors" :key="index">
            {{ error }}
          </div>
        </div>
        <button @click="errors = []" class="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm">
          پاک کردن خطاها
        </button>
      </div>

      <!-- آمار سریع -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">کل کاربران</h3>
          <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.total_users || '-' }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">کاربران فعال</h3>
          <p class="text-2xl font-bold text-green-600 mt-2">{{ stats.verified_emails || '-' }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">ثبت نام هفته گذشته</h3>
          <p class="text-2xl font-bold text-blue-600 mt-2">{{ stats.recent_registrations || '-' }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">حساب‌های قفل شده</h3>
          <p class="text-2xl font-bold text-red-600 mt-2">{{ stats.locked_accounts || '-' }}</p>
        </div>
      </div>

      <!-- منوی دسترسی سریع -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
             @click="$router.push('/admin/users')">
          <div class="flex items-center">
            <div class="bg-blue-500 p-3 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div class="mr-4">
              <h3 class="text-lg font-medium text-gray-900">مدیریت کاربران</h3>
              <p class="text-sm text-gray-500">مشاهده و ویرایش کاربران</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
             @click="$router.push('/admin/roles')">
          <div class="flex items-center">
            <div class="bg-green-500 p-3 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div class="mr-4">
              <h3 class="text-lg font-medium text-gray-900">مدیریت نقش‌ها</h3>
              <p class="text-sm text-gray-500">تنظیم نقش‌ها و دسترسی‌ها</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="bg-purple-500 p-3 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="mr-4">
              <h3 class="text-lg font-medium text-gray-900">گزارشات</h3>
              <p class="text-sm text-gray-500">آمار و گزارش‌های سیستم</p>
            </div>
          </div>
        </div>

        <!-- New Card 1: Book Management -->
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
             @click="$router.push('/admin/books')">
          <div class="flex items-center">
            <div class="bg-cyan-500 p-3 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div class="mr-4">
              <h3 class="text-lg font-medium text-gray-900">مدیریت کتاب ها</h3>
              <p class="text-sm text-gray-500">افزودن، ویرایش و حذف کتاب‌ها</p>
            </div>
          </div>
        </div>

        <!-- New Card 2: Image Gallery -->
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
             @click="$router.push('/admin/gallery')">
          <div class="flex items-center">
            <div class="bg-teal-500 p-3 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 010-2.828L14 8" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div class="mr-4">
              <h3 class="text-lg font-medium text-gray-900">گالری تصاویر کتاب ها</h3>
              <p class="text-sm text-gray-500">مدیریت تصاویر و آپلودها</p>
            </div>
          </div>
        </div>

        <!-- New Card 3: Order List -->
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
             @click="$router.push('/admin/orders')">
          <div class="flex items-center">
            <div class="bg-amber-500 p-3 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div class="mr-4">
              <h3 class="text-lg font-medium text-gray-900">لیست سفارش ها</h3>
              <p class="text-sm text-gray-500">مشاهده و پیگیری سفارشات</p>
            </div>
          </div>
        </div>

        <!-- New Card 4: Book Merging -->
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
             @click="$router.push('/admin/books/merge')">
          <div class="flex items-center">
            <div class="bg-orange-500 p-3 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div class="mr-4">
              <h3 class="text-lg font-medium text-gray-900">ادغام کتاب‌ها</h3>
              <p class="text-sm text-gray-500">ادغام و لغو ادغام کتاب‌ها</p>
            </div>
          </div>
        </div>

        <!-- New Card 5: Content Filter -->
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
             @click="$router.push('/admin/content-filter')">
          <div class="flex items-center">
            <div class="bg-red-500 p-3 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15l-3.5-3.5a6 6 0 018-8l3.5 3.5-8 8z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15l-3.5-3.5a6 6 0 018-8l3.5 3.5-8 8zM3 21l3.5-3.5"></path></svg>
            </div>
            <div class="mr-4">
              <h3 class="text-lg font-medium text-gray-900">فیلتر محتوا</h3>
              <p class="text-sm text-gray-500">مدیریت کلمات ممنوعه</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApiAuth } from '~/composables/useApiAuth'
import { useAuthStore } from '~/stores/auth'
import { useRuntimeConfig } from '#app'

definePageMeta({
  middleware: 'admin',
  layout: 'default'
})

const authStore = useAuthStore()
const api = useApiAuth()

const stats = ref({})
const errors = ref([])

const addError = (error) => {
  errors.value.push(new Date().toLocaleTimeString() + ': ' + error)
}

const loadStats = async () => {
  try {
    const response = await api.get('/dashboard/stats')
    stats.value = response.data || response
  } catch (error) {
    console.error('Error fetching stats:', error)
    addError(`Error fetching stats: ${error.message}`)
  }
}

onMounted(async () => {
  console.log('Admin panel mounted')
  console.log('Auth store state:', {
    token: !!authStore.token,
    tokenLength: authStore.token?.length,
    user: authStore.user,
    isAdmin: authStore.isAdmin
  })

  // اطمینان از اینکه token و user بارگذاری شده‌اند
  if (!authStore.token || !authStore.user) {
    console.log('Token or user missing, initializing auth...')
    authStore.initAuth()

    if (!authStore.user && authStore.token) {
      try {
        await authStore.fetchUser()
      } catch (error) {
        console.error('Failed to fetch user:', error)
        addError('خطا در دریافت اطلاعات کاربر')
      }
    }
  }

  await loadStats()
})
</script>
