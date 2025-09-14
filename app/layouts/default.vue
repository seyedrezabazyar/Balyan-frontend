<!-- app/layouts/default.vue -->
<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <!-- Logo and Welcome -->
          <div class="flex items-center gap-4">
            <NuxtLink to="/" class="text-2xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md">
              کتابخانه دیجیتال
            </NuxtLink>
            <p class="text-sm text-gray-600 hidden md:block">
              هزاران کتاب الکترونیکی در دسترس شما
            </p>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button @click="showMobileMenu = !showMobileMenu" class="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink to="/books"
                      class="text-gray-700 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md px-2 py-1"
                      exact-active-class="text-blue-600 font-semibold">
              مشاهده کتاب‌ها
            </NuxtLink>

            <div v-if="!authStore.isAuthenticated">
              <NuxtLink to="/auth"
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                ورود / ثبت‌نام
              </NuxtLink>
            </div>

            <!-- User Menu -->
            <div v-if="authStore.isAuthenticated" class="relative">
              <button @click="showUserMenu = !showUserMenu"
                      class="flex items-center gap-2 text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1">
                <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="Avatar" class="w-8 h-8 rounded-full">
                <svg v-else class="w-8 h-8 rounded-full bg-gray-200 text-gray-500 p-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span class="text-sm font-medium hidden lg:block">{{ authStore.user?.name || 'کاربر' }}</span>
              </button>

              <!-- Dropdown Menu -->
              <transition name="fade">
                <div v-if="showUserMenu"
                     class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50">
                  <div class="p-1">
                    <NuxtLink to="/dashboard"
                              @click="showUserMenu = false"
                              class="block w-full text-right px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600">
                      داشبورد
                    </NuxtLink>
                    <NuxtLink to="/profile"
                              @click="showUserMenu = false"
                              class="block w-full text-right px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600">
                      پروفایل
                    </NuxtLink>

                    <div v-if="authStore.isAdmin">
                      <hr class="my-1">
                      <NuxtLink to="/admin"
                                @click="showUserMenu = false"
                                class="block w-full text-right px-4 py-2 text-sm text-purple-600 rounded-md hover:bg-gray-100">
                        پنل مدیریت
                      </NuxtLink>
                    </div>

                    <hr class="my-1">
                    <button @click="logout"
                            class="w-full text-right px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 hover:text-red-700">
                      خروج
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </nav>
        </div>

        <!-- Mobile Navigation -->
        <transition name="slide-down">
          <nav v-if="showMobileMenu" class="md:hidden pt-4 pb-2 border-t border-gray-200">
            <NuxtLink to="/books"
                      @click="showMobileMenu = false"
                      class="block py-2 px-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                      exact-active-class="bg-blue-50 text-blue-600 font-semibold">
              مشاهده کتاب‌ها
            </NuxtLink>

            <div v-if="!authStore.isAuthenticated" class="mt-4">
              <NuxtLink to="/auth"
                        @click="showMobileMenu = false"
                        class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                ورود / ثبت‌نام
              </NuxtLink>
            </div>

            <div v-if="authStore.isAuthenticated" class="pt-4 pb-3 border-t border-gray-200">
              <div class="flex items-center px-3">
                <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="Avatar" class="w-10 h-10 rounded-full">
                 <svg v-else class="w-10 h-10 rounded-full bg-gray-200 text-gray-500 p-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <div class="mr-3">
                  <div class="text-base font-medium text-gray-800">{{ authStore.user?.name }}</div>
                  <div class="text-sm font-medium text-gray-500">{{ authStore.user?.email }}</div>
                </div>
              </div>
              <div class="mt-3 space-y-1">
                <NuxtLink to="/dashboard" @click="showMobileMenu = false" class="block py-2 px-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100">داشبورد</NuxtLink>
                <NuxtLink to="/profile" @click="showMobileMenu = false" class="block py-2 px-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100">پروفایل</NuxtLink>
                <NuxtLink v-if="authStore.isAdmin" to="/admin" @click="showMobileMenu = false" class="block py-2 px-3 rounded-md text-base font-medium text-purple-600 hover:text-purple-700 hover:bg-gray-100">پنل مدیریت</NuxtLink>
                <button @click="logout" class="block w-full text-right py-2 px-3 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50">خروج</button>
              </div>
            </div>
          </nav>
        </transition>
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

const authStore = useAuthStore()
const router = useRouter()
const showUserMenu = ref(false)
const showMobileMenu = ref(false)


const logout = async () => {
  await authStore.logout()
  showUserMenu.value = false
  showMobileMenu.value = false
  await router.push('/auth')
}
</script>

<style scoped>
/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Down Transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
