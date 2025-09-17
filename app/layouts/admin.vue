<!-- app/layouts/admin.vue -->
<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 text-white flex flex-col">
      <div class="p-6 text-2xl font-bold border-b border-gray-700">
        <NuxtLink to="/admin">پنل مدیریت</NuxtLink>
      </div>
      <nav class="flex-grow p-4">
        <ul class="space-y-2">
          <li>
            <NuxtLink to="/admin" class="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700" active-class="bg-gray-900">
              <span class="w-6 h-6 i-heroicons-squares-2x2-solid"></span>
              <span>داشبورد</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/users" class="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700" active-class="bg-gray-900">
              <span class="w-6 h-6 i-heroicons-user-group-solid"></span>
              <span>مدیریت کاربران</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/roles" class="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700" active-class="bg-gray-900">
              <span class="w-6 h-6 i-heroicons-shield-check-solid"></span>
              <span>مدیریت نقش‌ها</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/books" class="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700" active-class="bg-gray-900">
              <span class="w-6 h-6 i-heroicons-book-open-solid"></span>
              <span>مدیریت کتاب‌ها</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/admin/orders" class="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700" active-class="bg-gray-900">
              <span class="w-6 h-6 i-heroicons-shopping-cart-solid"></span>
              <span>مدیریت سفارشات</span>
            </NuxtLink>
          </li>
          <!-- Add more admin links here -->
        </ul>
      </nav>
      <div class="p-4 border-t border-gray-700">
         <NuxtLink to="/" class="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 text-sm">
            <span class="w-5 h-5 i-heroicons-arrow-uturn-left-solid"></span>
            <span>بازگشت به سایت</span>
          </NuxtLink>
        <button @click="logout" class="w-full flex items-center gap-3 px-4 py-2 mt-2 rounded text-red-400 hover:bg-red-500 hover:text-white">
          <span class="w-6 h-6 i-heroicons-arrow-left-on-rectangle-solid"></span>
          <span>خروج</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col">
      <header class="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 class="text-xl font-semibold text-gray-800"> {{ $route.meta.title || 'مدیریت' }} </h1>
        <div v-if="authStore.user" class="text-sm">
          خوش آمدید، <span class="font-medium">{{ authStore.user.name }}</span>
        </div>
      </header>
      <div class="p-6 flex-grow">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

const authStore = useAuthStore()
const router = useRouter()
const api = useApi()

const logout = async () => {
  try {
    if (authStore.token) {
      await api.post('/logout')
    }
  } catch (err) {
    console.warn('Server logout failed, clearing client session anyway.', err)
  } finally {
    authStore.clearAuth()
    await router.push('/auth')
  }
}

// Set document title based on route meta
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - پنل مدیریت` : 'پنل مدیریت'
  }
})
</script>

<style>
/* Simple style for active link */
.router-link-exact-active {
  background-color: #1f2937; /* bg-gray-800 */
}
</style>
