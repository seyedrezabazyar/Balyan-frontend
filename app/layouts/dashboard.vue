<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <NuxtLink to="/dashboard" class="flex items-center space-x-3">
          <div class="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <Icon name="heroicons:sparkles-solid" class="w-5 h-5 text-white" />
          </div>
          <span class="text-lg font-bold gradient-text">{{ appName }}</span>
        </NuxtLink>
        <UButton
          icon="i-heroicons-x-mark"
          variant="ghost"
          color="neutral"
          size="sm"
          class="lg:hidden"
          @click="sidebarOpen = false"
        />
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <template v-for="item in menuItems" :key="item.id">
          <!-- Section Header -->
          <div v-if="item.type === 'header'" class="px-3 mt-6 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {{ item.label }}
          </div>
          
          <!-- Menu Item -->
          <NuxtLink
            v-else
            :to="item.to || '/'"
            :class="[
              'flex items-center px-3 py-2 rounded-lg transition-colors group',
              isActiveRoute(item.to || '/')
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <Icon :name="item.icon || 'i-heroicons-home'" class="w-5 h-5 ml-3" />
            <span class="flex-1">{{ item.label }}</span>
            <span v-if="item.badge" class="px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full">
              {{ item.badge }}
            </span>
          </NuxtLink>
        </template>
      </nav>

      <!-- User Info -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3 space-x-reverse">
          <UAvatar
            :src="authStore.user?.avatar"
            :alt="authStore.user?.name"
            size="sm"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {{ authStore.user?.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ authStore.user?.email }}
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="lg:mr-64">
      <!-- Header -->
      <header class="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <!-- Mobile Menu Button -->
          <UButton
            icon="i-heroicons-bars-3"
            variant="ghost"
            color="neutral"
            class="lg:hidden"
            @click="sidebarOpen = true"
          />

          <!-- Breadcrumb -->
          <div class="hidden lg:block">
            <nav class="flex items-center space-x-2 text-sm">
              <NuxtLink to="/dashboard" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                داشبورد
              </NuxtLink>
              <Icon name="heroicons:chevron-left" class="w-4 h-4 text-gray-400" />
              <span class="text-gray-700 dark:text-gray-200 font-medium">{{ currentPageTitle }}</span>
            </nav>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <UButton
              icon="i-heroicons-magnifying-glass"
              variant="ghost"
              color="neutral"
              @click="searchModalOpen = true"
            />

            <!-- Notifications -->
            <UDropdown :items="notificationItems">
              <UButton
                icon="i-heroicons-bell"
                variant="ghost"
                color="neutral"
                class="relative"
              >
                <span class="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </UButton>
            </UDropdown>

            <!-- Theme Toggle -->
            <UButton
              :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
              variant="ghost"
              color="neutral"
              @click="toggleTheme"
            />

            <!-- User Menu -->
            <UDropdown :items="userMenuItems">
              <UAvatar
                :src="authStore.user?.avatar"
                :alt="authStore.user?.name"
                size="sm"
                class="cursor-pointer"
              />
            </UDropdown>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>

    <!-- Search Modal -->
    <UModal v-model="searchModalOpen">
      <UCard>
        <template #header>
          <div class="flex items-center space-x-3 space-x-reverse">
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو..."
              class="flex-1 bg-transparent border-none outline-none focus:ring-0 text-gray-900 dark:text-gray-100"
              autofocus
            />
          </div>
        </template>

        <div class="space-y-2">
          <div v-for="result in searchResults" :key="result.id" class="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <div class="flex items-center space-x-3 space-x-reverse">
              <Icon :name="result.icon" class="w-5 h-5 text-gray-400" />
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ result.title }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ result.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const authStore = useAuthStore()
const colorMode = useColorMode()

const sidebarOpen = ref(false)
const searchModalOpen = ref(false)
const searchQuery = ref('')
const isDark = computed(() => colorMode.value === 'dark')

const config = useRuntimeConfig()
const appName = config.public.appName

const menuItems = [
  { id: 'overview', label: 'نمای کلی', icon: 'i-heroicons-home', to: '/dashboard' },
  { id: 'header-1', type: 'header', label: 'مدیریت' },
  { id: 'users', label: 'کاربران', icon: 'i-heroicons-users', to: '/dashboard/users', badge: '12' },
  { id: 'products', label: 'محصولات', icon: 'i-heroicons-cube', to: '/dashboard/products' },
  { id: 'orders', label: 'سفارشات', icon: 'i-heroicons-shopping-cart', to: '/dashboard/orders', badge: '3' },
  { id: 'analytics', label: 'تحلیل‌ها', icon: 'i-heroicons-chart-bar', to: '/dashboard/analytics' },
  { id: 'header-2', type: 'header', label: 'تنظیمات' },
  { id: 'profile', label: 'پروفایل', icon: 'i-heroicons-user', to: '/dashboard/profile' },
  { id: 'settings', label: 'تنظیمات', icon: 'i-heroicons-cog', to: '/dashboard/settings' },
  { id: 'help', label: 'راهنما', icon: 'i-heroicons-question-mark-circle', to: '/dashboard/help' }
]

const notificationItems = [
  [{
    label: 'اعلان‌ها',
    slot: 'header',
    disabled: true
  }],
  [{
    label: 'سفارش جدید دریافت شد',
    icon: 'i-heroicons-shopping-cart',
    time: '5 دقیقه پیش'
  }, {
    label: 'کاربر جدید ثبت نام کرد',
    icon: 'i-heroicons-user-plus',
    time: '1 ساعت پیش'
  }, {
    label: 'گزارش ماهانه آماده است',
    icon: 'i-heroicons-document-text',
    time: '3 ساعت پیش'
  }],
  [{
    label: 'مشاهده همه',
    icon: 'i-heroicons-arrow-left'
  }]
]

const userMenuItems = [
  [{
    label: authStore.user?.name || 'کاربر',
    slot: 'account',
    disabled: true
  }],
  [{
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
]

const searchResults = computed(() => {
  if (!searchQuery.value) return []
  
  // Mock search results
  return [
    { id: 1, title: 'مدیریت کاربران', description: 'مشاهده و ویرایش کاربران', icon: 'i-heroicons-users' },
    { id: 2, title: 'تنظیمات امنیتی', description: 'پیکربندی امنیت سیستم', icon: 'i-heroicons-shield-check' },
    { id: 3, title: 'گزارشات فروش', description: 'تحلیل فروش ماهانه', icon: 'i-heroicons-chart-bar' }
  ]
})

const currentPageTitle = computed(() => {
  const path = route.path
  const item = menuItems.find(item => item.to === path)
  return item?.label || 'صفحه'
})

function isActiveRoute(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>