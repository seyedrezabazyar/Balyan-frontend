<template>
  <div class="p-6" v-if="authStore.isLoggedIn && authStore.currentUser">
    <h1 class="text-2xl font-bold mb-4">داشبورد</h1>
    <p class="text-gray-600 mb-6">به داشبورد خوش آمدید!</p>

    <!-- دکمه فقط برای ادمین -->
    <div v-if="authStore.isAdmin" class="mb-4">
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        @click="performAdminAction"
      >
        مدیریت سیستم (فقط ادمین)
      </button>
    </div>

    <!-- بقیه محتوا -->
    <div>
      <p>محتوای داشبورد برای همه کاربران...</p>
    </div>

    <!-- نمایش JSON کاربر برای دیباگ -->
    <div class="mt-6 bg-gray-100 p-4 rounded-lg">
      <h2 class="text-xl font-semibold mb-2">اطلاعات کاربر وارد شده (برای دیباگ):</h2>
      <pre class="whitespace-pre-wrap text-sm">{{ userInfo }}</pre>
      <p class="text-red-600 mt-2">
        وضعیت ادمین: {{ authStore.isAdmin ? 'بله (ادمین است)' : 'خیر (ادمین نیست)' }}
      </p>
    </div>
  </div>

  <!-- نمایش پیام در حال بارگذاری یا لاگین نشده -->
  <div v-else class="p-6 text-gray-500">
    در حال بارگذاری اطلاعات کاربر یا شما لاگین نکرده‌اید...
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const api = useApi()

onMounted(async () => {
  if (authStore.isLoggedIn && !authStore.currentUser) {
    await authStore.fetchUser()
  }
})

const userInfo = computed(() => JSON.stringify(authStore.currentUser, null, 2) || 'هیچ اطلاعاتی موجود نیست')

const performAdminAction = async () => {
  try {
    // The new structure has a /dashboard/index.get.ts. A DELETE endpoint for cache
    // would logically be /dashboard/cache.delete.ts. I'll assume this or create it.
    await api.delete('/dashboard/cache')
    alert('عملیات ادمین با موفقیت انجام شد!')
  } catch (error) {
    console.error('خطا در عملیات ادمین:', error)
    alert('خطایی رخ داد!')
  }
}
</script>
