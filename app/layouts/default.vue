<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Header -->
    <header class="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <Icon name="heroicons:sparkles-solid" class="w-6 h-6 text-white" />
            </div>
            <span class="text-xl font-bold gradient-text">{{ appName }}</span>
          </NuxtLink>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <NuxtLink 
              v-for="item in navItems" 
              :key="item.to"
              :to="item.to"
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
            <UButton
              :icon="isDark ? 'heroicons:sun' : 'heroicons:moon'"
              variant="ghost"
              color="neutral"
              @click="toggleTheme"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            />

            <!-- Auth Buttons -->
            <template v-if="!authStore.isAuthenticated">
              <UButton
                to="/login"
                variant="ghost"
                color="neutral"
              >
                ورود
              </UButton>
              <UButton
                to="/register"
                color="primary"
              >
                ثبت نام
              </UButton>
            </template>

            <!-- User Menu -->
            <UDropdown v-else :items="userMenuItems">
              <UAvatar 
                :src="authStore.user?.avatar" 
                :alt="authStore.user?.name"
                size="sm"
                class="cursor-pointer"
              />
            </UDropdown>

            <!-- Mobile Menu -->
            <UButton
              :icon="mobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'"
              variant="ghost"
              color="neutral"
              class="md:hidden"
              @click="mobileMenuOpen = !mobileMenuOpen"
            />
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 dark:border-gray-700">
          <nav class="container mx-auto px-4 py-4 space-y-2">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              @click="mobileMenuOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>
      </Transition>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Icon name="heroicons:sparkles-solid" class="w-6 h-6 text-white" />
              </div>
              <span class="text-xl font-bold gradient-text">{{ appName }}</span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              پلتفرم حرفه‌ای مدیریت کسب و کار شما
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-4">دسترسی سریع</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/about" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  درباره ما
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/services" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  خدمات
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/pricing" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  قیمت‌گذاری
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-4">پشتیبانی</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/help" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  راهنما
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  تماس با ما
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/faq" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  سوالات متداول
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Social -->
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-4">شبکه‌های اجتماعی</h3>
            <div class="flex space-x-4 space-x-reverse">
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                <Icon name="mdi:twitter" class="w-6 h-6" />
              </a>
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                <Icon name="mdi:linkedin" class="w-6 h-6" />
              </a>
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                <Icon name="mdi:github" class="w-6 h-6" />
              </a>
              <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                <Icon name="mdi:instagram" class="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-center text-gray-600 dark:text-gray-400 text-sm">
            © {{ new Date().getFullYear() }} {{ appName }}. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const colorMode = useColorMode()
const config = useRuntimeConfig()

const appName = config.public.appName
const isDark = computed(() => colorMode.value === 'dark')
const mobileMenuOpen = ref(false)

const navItems = [
  { label: 'خانه', to: '/' },
  { label: 'خدمات', to: '/services' },
  { label: 'درباره ما', to: '/about' },
  { label: 'تماس با ما', to: '/contact' }
]

const userMenuItems = computed(() => [
  [{
    label: authStore.user?.name || 'کاربر',
    slot: 'account',
    disabled: true
  }],
  [{
    label: 'داشبورد',
    icon: 'i-heroicons-home',
    to: '/dashboard'
  }, {
    label: 'پروفایل',
    icon: 'i-heroicons-user',
    to: '/dashboard/profile'
  }, {
    label: 'تنظیمات',
    icon: 'i-heroicons-cog',
    to: '/dashboard/settings'
  }],
  [{
    label: 'خروج',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: () => authStore.logout()
  }]
])

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>