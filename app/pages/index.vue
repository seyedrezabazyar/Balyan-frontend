<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
        به کتابخانه دیجیتال خوش آمدید
      </h1>

      <div class="max-w-2xl mx-auto text-center">
        <p class="text-lg text-gray-600 mb-8">
          هزاران کتاب الکترونیکی در دسترس شما
        </p>

        <div class="flex gap-4 justify-center">
          <NuxtLink
            to="/books"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            مشاهده کتاب‌ها
          </NuxtLink>

          <NuxtLink
            to="/auth"
            class="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            ورود / ثبت‌نام
          </NuxtLink>

          <NuxtLink
            to="/debug-api"
            class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            (DEBUG) Test API
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})
</script>
