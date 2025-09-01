<template>
  <div class="min-h-screen bg-gray-50" dir="rtl">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="text-xl font-bold text-blue-600">
            کتابخانه دیجیتال
          </NuxtLink>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink to="/" class="text-gray-700 hover:text-blue-600 transition">
              صفحه اصلی
            </NuxtLink>
            <NuxtLink to="/books" class="text-gray-700 hover:text-blue-600 transition">
              کتاب‌ها
            </NuxtLink>
            <NuxtLink to="/categories" class="text-gray-700 hover:text-blue-600 transition">
              دسته‌بندی‌ها
            </NuxtLink>
            <NuxtLink to="/blog" class="text-gray-700 hover:text-blue-600 transition">
              وبلاگ
            </NuxtLink>
          </nav>

          <!-- User Actions -->
          <div class="flex items-center gap-4">
            <!-- Cart -->
            <NuxtLink to="/cart" class="relative">
              <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span v-if="cartStore.itemCount > 0"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {{ cartStore.itemCount }}
              </span>
            </NuxtLink>

            <!-- User Menu -->
            <div v-if="authStore.isAuthenticated" class="relative">
              <button @click="showUserMenu = !showUserMenu"
                      class="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="text-sm">{{ authStore.user?.name }}</span>
              </button>

              <!-- Dropdown Menu -->
              <div v-if="showUserMenu"
                   class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                <NuxtLink to="/dashboard"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  داشبورد
                </NuxtLink>
                <NuxtLink to="/profile"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  پروفایل
                </NuxtLink>
                <NuxtLink to="/my-books"
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
            <NuxtLink v-else to="/app/pages/auth"
                      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              ورود / ثبت‌نام
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white mt-12">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="font-bold mb-4">درباره ما</h3>
            <p class="text-sm text-gray-400">
              کتابخانه دیجیتال، منبعی برای دانلود کتاب‌های الکترونیکی
            </p>
          </div>
          <div>
            <h3 class="font-bold mb-4">لینک‌های مفید</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><NuxtLink to="/about">درباره ما</NuxtLink></li>
              <li><NuxtLink to="/contact">تماس با ما</NuxtLink></li>
              <li><NuxtLink to="/terms">قوانین</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h3 class="font-bold mb-4">دسته‌بندی‌ها</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><NuxtLink to="/categories/programming">برنامه‌نویسی</NuxtLink></li>
              <li><NuxtLink to="/categories/design">طراحی</NuxtLink></li>
              <li><NuxtLink to="/categories/business">کسب و کار</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h3 class="font-bold mb-4">خبرنامه</h3>
            <p class="text-sm text-gray-400 mb-4">
              از جدیدترین کتاب‌ها مطلع شوید
            </p>
            <form @submit.prevent="subscribeNewsletter" class="flex gap-2">
              <input type="email" v-model="newsletterEmail"
                     placeholder="ایمیل شما"
                     class="flex-1 px-3 py-2 rounded text-gray-800 text-sm">
              <button type="submit"
                      class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition text-sm">
                عضویت
              </button>
            </form>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          © ۱۴۰۳ کتابخانه دیجیتال. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const cartStore = useCartStore()
const showUserMenu = ref(false)
const newsletterEmail = ref('')

onMounted(() => {
  authStore.initAuth()
  if (authStore.isAuthenticated) {
    cartStore.fetchCart()
  }
})

const logout = async () => {
  await authStore.logout()
  showUserMenu.value = false
}

const subscribeNewsletter = () => {
  // TODO: Implement newsletter subscription
  console.log('Newsletter subscription:', newsletterEmail.value)
  newsletterEmail.value = ''
}

// Close user menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
})
</script>
