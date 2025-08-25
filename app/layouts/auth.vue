<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Form -->
    <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div class="w-full max-w-md space-y-8">
        <!-- Logo -->
        <div class="text-center">
          <NuxtLink to="/" class="inline-flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <Icon name="heroicons:sparkles-solid" class="w-7 h-7 text-white" />
            </div>
            <span class="text-2xl font-bold gradient-text">{{ appName }}</span>
          </NuxtLink>
        </div>

        <!-- Content -->
        <slot />

        <!-- Theme Toggle -->
        <div class="flex justify-center">
          <UButton
            :icon="isDark ? 'heroicons:sun' : 'heroicons:moon'"
            variant="ghost"
            color="gray"
            @click="toggleTheme"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          />
        </div>
      </div>
    </div>

    <!-- Right Side - Image/Pattern -->
    <div class="hidden lg:block lg:w-1/2 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
        <!-- Pattern Overlay -->
        <div class="absolute inset-0 opacity-10">
          <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        <!-- Content -->
        <div class="relative h-full flex items-center justify-center p-12">
          <div class="text-center text-white space-y-6">
            <h1 class="text-4xl font-bold">
              به پلتفرم حرفه‌ای ما خوش آمدید
            </h1>
            <p class="text-xl text-primary-100 max-w-md mx-auto">
              مدیریت کسب و کار خود را به سطح جدیدی ببرید
            </p>
            
            <!-- Features -->
            <div class="grid grid-cols-2 gap-6 mt-12">
              <div class="text-left space-y-2">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon name="heroicons:shield-check" class="w-6 h-6" />
                  </div>
                  <span class="font-semibold">امنیت بالا</span>
                </div>
                <p class="text-primary-100 text-sm">
                  حفاظت از اطلاعات شما با بالاترین استانداردها
                </p>
              </div>
              
              <div class="text-left space-y-2">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon name="heroicons:chart-bar" class="w-6 h-6" />
                  </div>
                  <span class="font-semibold">تحلیل دقیق</span>
                </div>
                <p class="text-primary-100 text-sm">
                  گزارشات جامع و تحلیل‌های هوشمند
                </p>
              </div>
              
              <div class="text-left space-y-2">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon name="heroicons:users" class="w-6 h-6" />
                  </div>
                  <span class="font-semibold">مدیریت تیم</span>
                </div>
                <p class="text-primary-100 text-sm">
                  همکاری آسان با اعضای تیم
                </p>
              </div>
              
              <div class="text-left space-y-2">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon name="heroicons:bolt" class="w-6 h-6" />
                  </div>
                  <span class="font-semibold">سرعت بالا</span>
                </div>
                <p class="text-primary-100 text-sm">
                  عملکرد سریع و بهینه
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const config = useRuntimeConfig()

const appName = config.public.appName
const isDark = computed(() => colorMode.value === 'dark')

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>