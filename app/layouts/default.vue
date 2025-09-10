<!-- app/layouts/default.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <!-- Logo and Welcome -->
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="text-2xl font-bold text-gray-800">
            کتابخانه دیجیتال
          </NuxtLink>
          <p class="text-sm text-gray-600 hidden md:block">
            هزاران کتاب الکترونیکی در دسترس شما
          </p>
        </div>

        <!-- Navigation -->
        <nav class="flex items-center gap-4">
          <NuxtLink to="/books"
                    class="text-gray-700 hover:text-blue-600">
            مشاهده کتاب‌ها
          </NuxtLink>

          <!-- Cart Icon -->
          <NuxtLink to="/cart" class="relative text-gray-700 hover:text-blue-600 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span v-if="cartStore.uniqueItemCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ cartStore.uniqueItemCount }}
              </span>
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

              <!-- Admin Menu -->
              <div v-if="authStore.isAdmin">
                <hr class="my-1">
                <NuxtLink to="/admin"
                          @click="showUserMenu = false"
                          class="block px-4 py-2 text-sm text-purple-600 hover:bg-gray-100">
                  پنل مدیریت
                </NuxtLink>
                <NuxtLink to="/admin/users"
                          @click="showUserMenu = false"
                          class="block px-4 py-2 text-sm text-purple-600 hover:bg-gray-100">
                  مدیریت کاربران
                </NuxtLink>
                <NuxtLink to="/admin/roles"
                          @click="showUserMenu = false"
                          class="block px-4 py-2 text-sm text-purple-600 hover:bg-gray-100">
                  مدیریت نقش‌ها
                </NuxtLink>
              </div>

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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { useApi } from '~/composables/useApi'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const showUserMenu = ref(false)

const api = useApi(authStore.token)

onMounted(() => {
  cartStore.fetchCart()
})

const logout = async () => {
  try {
    if (authStore.token) {
      await api.post('/auth/logout')
    }
  } catch (err) {
    console.warn('خطا در خروج از سرور:', err)
  } finally {
    authStore.clearAuth()
    showUserMenu.value = false
    await router.push('/auth')
  }
}
</script>
