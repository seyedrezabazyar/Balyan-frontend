<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <!-- Logo and Welcome -->
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-gray-800">
            به کتابخانه دیجیتال خوش آمدید
          </h1>
          <p class="text-sm text-gray-600">
            هزاران کتاب الکترونیکی در دسترس شما
          </p>
        </div>

        <!-- Navigation -->
        <nav class="flex items-center gap-4">
          <NuxtLink to="/books"
                    class="text-gray-700 hover:text-blue-600">
            مشاهده کتاب‌ها
          </NuxtLink>

          <!-- User Menu or Login Button -->
          <div v-if="authStore.isAuthenticated" class="relative">
            <button @click="showUserMenu = !showUserMenu"
                    class="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-sm">{{ authStore.user?.name || authStore.user?.email || 'کاربر' }}</span>
            </button>

            <!-- Dropdown Menu -->
            <div v-if="showUserMenu"
                 class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
              <NuxtLink to="/dashboard"
                        @click="showUserMenu = false"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                داشبورد
              </NuxtLink>
              <NuxtLink to="/profile"
                        @click="showUserMenu = false"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                پروفایل
              </NuxtLink>
              <NuxtLink to="/my-books"
                        @click="showUserMenu = false"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                کتاب‌های من
              </NuxtLink>
              <hr class="my-1">
              <button @click="logout"
                      class="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                خروج
              </button>
            </div>
          </div>

          <!-- Login Button -->
          <NuxtLink v-else to="/auth"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            ورود / ثبت‌نام
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

const authStore = useAuthStore()
const router = useRouter()
const showUserMenu = ref(false)

// مهم: پاس دادن توکن به useApi
const api = useApi(authStore.token)

const logout = async () => {
  try {
    if (authStore.token) {
      // تلاش برای خروج از سرور
      await api.post('/logout')
    }
  } catch (err) {
    console.warn('خطا در خروج از سرور:', err) // فقط لاگ کن، کاربر همچنان خارج شود
  } finally {
    // پاک کردن auth در هر صورت
    authStore.clearAuth()
    showUserMenu.value = false
    await router.push('/auth')
  }
}

</script>
