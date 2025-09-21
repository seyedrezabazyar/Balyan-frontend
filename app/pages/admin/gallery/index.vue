<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">گالری تصاویر کتاب ها</h1>
      <div v-if="!loading" class="text-gray-600">
        <span class="font-medium">{{ images.length }}</span> تصویر در انتظار بازبینی
      </div>
    </div>

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-center py-10">
      <p>در حال بارگذاری تصاویر...</p>
    </div>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">خطا!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <!-- Image Grid -->
    <div v-if="!loading && !error && images.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div
        v-for="image in images"
        :key="image.id"
        class="relative border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm"
      >
        <img :src="image.thumbnail_url" :alt="image.book_title" class="w-full h-48 object-cover">

        <div class="p-2">
          <h3 class="text-sm font-medium truncate">{{ image.book.title }}</h3>
          <div class="flex justify-center gap-2 mt-2">
            <button @click="approveImage(image.id)" class="w-1/2 bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600">تایید</button>
            <button @click="rejectImage(image.id)" class="w-1/2 bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600">رد</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!loading && !error && images.length === 0" class="text-center py-10">
      <p>هیچ تصویر جدیدی برای بازبینی وجود ندارد.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApiAuth } from '~/composables/useApiAuth'

definePageMeta({
  layout: 'admin',
  title: 'گالری تصاویر کتاب ها',
  middleware: 'admin'
})

const api = useApiAuth()

const images = ref([])
const loading = ref(true)
const error = ref(null)

async function fetchImages() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/book-images', {
      params: { status: 'pending', per_page: 100 }
    })
    images.value = response.data || []
  } catch (err) {
    console.error('Error fetching images:', err)
    error.value = 'خطا در بارگذاری تصاویر. لطفاً دوباره تلاش کنید.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchImages)

async function approveImage(id) {
  try {
    await api.patch('/book-images/review-bulk', {
      images_to_approve: [id],
      images_to_reject: []
    })
    // Remove the image from the list after successful approval
    images.value = images.value.filter(img => img.id !== id)
  } catch (err) {
    console.error(`Error approving image ${id}:`, err)
    alert(`خطا در تایید تصویر. لطفاً دوباره تلاش کنید.`)
  }
}

async function rejectImage(id) {
  try {
    await api.patch('/book-images/review-bulk', {
      images_to_approve: [],
      images_to_reject: [{ id: id, rejection_reason: 'رد شده توسط مدیر' }]
    })
    // Remove the image from the list after successful rejection
    images.value = images.value.filter(img => img.id !== id)
  } catch (err) {
    console.error(`Error rejecting image ${id}:`, err)
    alert(`خطا در رد تصویر. لطفاً دوباره تلاش کنید.`)
  }
}
</script>

<style scoped>
/* Scoped styles for the component */
</style>
