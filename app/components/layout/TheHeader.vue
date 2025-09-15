<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo and Welcome -->
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="text-2xl font-bold text-gray-800">
            کتابخانه دیجیتال
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink to="/books" class="text-gray-700 hover:text-blue-600 transition">
            مشاهده کتاب‌ها
          </NuxtLink>

          <!-- User Menu or Login Button -->
          <div v-if="authStore.isAuthenticated" class="relative" ref="userMenuContainer">
            <button @click="toggleUserMenu"
                    class="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-sm">{{ authStore.user?.name || 'کاربر' }}</span>
            </button>

            <!-- Dropdown Menu -->
            <div v-if="showUserMenu"
                 class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
              <NuxtLink to="/dashboard" @click="closeUserMenu" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                داشبورد
              </NuxtLink>
              <NuxtLink to="/profile" @click="closeUserMenu" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                پروفایل
              </NuxtLink>
              <div v-if="authStore.isAdmin">
                <hr class="my-1">
                <NuxtLink to="/admin" @click="closeUserMenu" class="block px-4 py-2 text-sm text-purple-600 hover:bg-gray-100">
                  پنل مدیریت
                </NuxtLink>
              </div>
              <hr class="my-1">
              <button @click="logout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                خروج
              </button>
            </div>
          </div>
          <NuxtLink v-else to="/auth" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            ورود / ثبت‌نام
          </NuxtLink>
        </nav>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-t">
      <nav class="flex flex-col items-center gap-4 py-4">
        <NuxtLink to="/books" @click="closeMobileMenu" class="text-gray-700 hover:text-blue-600 transition">
          مشاهده کتاب‌ها
        </NuxtLink>

        <!-- User actions for mobile -->
        <div v-if="authStore.isAuthenticated" class="w-full">
          <hr class="my-2" />
          <NuxtLink to="/dashboard" @click="closeMobileMenu" class="block text-center py-2 text-sm text-gray-700 hover:bg-gray-100">
            داشبورد
          </NuxtLink>
          <NuxtLink to="/profile" @click="closeMobileMenu" class="block text-center py-2 text-sm text-gray-700 hover:bg-gray-100">
            پروفایل
          </NuxtLink>
          <div v-if="authStore.isAdmin">
            <hr class="my-1">
            <NuxtLink to="/admin" @click="closeMobileMenu" class="block text-center py-2 text-sm text-purple-600 hover:bg-gray-100">
              پنل مدیریت
            </NuxtLink>
          </div>
          <hr class="my-2" />
          <button @click="logout" class="w-full py-2 text-sm text-red-600 hover:bg-gray-100">
            خروج
          </button>
        </div>
        <NuxtLink v-else to="/auth" @click="closeMobileMenu" class="w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          ورود / ثبت‌نام
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const showUserMenu = ref(false)
const isMobileMenuOpen = ref(false)
const userMenuContainer = ref(null)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const logout = async () => {
  await authStore.logout()
  closeUserMenu()
  closeMobileMenu()
  await router.push('/auth')
}

// Click outside to close user dropdown
const handleClickOutside = (event) => {
  if (userMenuContainer.value && !userMenuContainer.value.contains(event.target)) {
    closeUserMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
