<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 py-10">
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h1 class="text-2xl font-bold mb-4">پروفایل</h1>
        <p class="text-gray-700 mb-6">سلام {{ user?.name || 'کاربر عزیز' }}</p>

        <div class="space-y-2 text-sm text-gray-700">
          <div>ایمیل: <span class="font-medium">{{ user?.email || '-' }}</span></div>
          <div>تلفن: <span class="font-medium">{{ user?.phone || '-' }}</span></div>
          <div>آخرین ورود: <span class="font-medium">{{ formatLastLogin }}</span></div>
          <div>تکمیل پروفایل: <span class="font-medium">{{ profileCompletionPercentage }}%</span></div>
        </div>

        <div class="mt-6 flex gap-3">
          <NuxtLink to="/" class="px-3 py-2 text-sm bg-blue-600 text-white rounded">خانه</NuxtLink>
          <NuxtLink to="/settings" class="px-3 py-2 text-sm bg-gray-100 rounded">تنظیمات</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const authStore = useAuthStore()

const loading = ref(false)
const stats = ref({})

const user = computed(() => authStore.user)

const formatLastLogin = computed(() => {
  if (!user.value?.last_login_at) return 'اولین بار'
  return new Date(user.value.last_login_at).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const profileCompletionPercentage = computed(() => {
  if (!user.value) return 0
  let completed = 0
  let total = 6
  if (user.value.name) completed++
  if (user.value.email) completed++
  if (user.value.phone) completed++
  if (user.value.email_verified_at) completed++
  if (user.value.phone_verified_at) completed++
  if (user.value.address) completed++
  return Math.round((completed / total) * 100)
})

const loadUserStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 200))
  stats.value = { total_points: 0 }
}

onMounted(async () => {
  if (!authStore.user && authStore.token) {
    await authStore.fetchUser()
  }
  loading.value = true
  try {
    await loadUserStats()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Minimal styles only */
</style>

