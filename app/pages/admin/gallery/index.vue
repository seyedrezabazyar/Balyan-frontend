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
            <button @click="promptReject(image)" class="w-1/2 bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600">رد</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!loading && !error && images.length === 0" class="text-center py-10">
      <p>هیچ تصویر جدیدی برای بازبینی وجود ندارد.</p>
    </div>

    <!-- Rejection Reason Modal -->
    <div v-if="showRejectionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">دلیل رد تصویر</h3>
        <p class="mb-2">کتاب: <span class="font-semibold">{{ imageToReject?.book_title }}</span></p>
        <img :src="imageToReject?.thumbnail_url" class="w-full h-48 object-cover mb-4 rounded">
        <textarea
          v-model="rejectionReason"
          rows="3"
          class="w-full p-2 border rounded-md"
          placeholder="لطفاً دلیل رد شدن تصویر را وارد کنید..."
        ></textarea>
        <div class="mt-4 flex justify-end gap-2">
          <button @click="cancelReject" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">لغو</button>
          <button @click="confirmReject" :disabled="!rejectionReason" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300">
            ثبت رد
          </button>
        </div>
      </div>
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

const showRejectionModal = ref(false)
const imageToReject = ref(null)
const rejectionReason = ref('')

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
      images_to_approve: [id]
    })
    // Remove the image from the list after successful approval
    images.value = images.value.filter(img => img.id !== id)
  } catch (err) {
    console.error(`Error approving image ${id}:`, err)
    alert(`خطا در تایید تصویر. لطفاً دوباره تلاش کنید.`)
  }
}

function promptReject(image) {
  imageToReject.value = image
  rejectionReason.value = ''
  showRejectionModal.value = true
}

function cancelReject() {
  showRejectionModal.value = false
  imageToReject.value = null
  rejectionReason.value = ''
}

async function confirmReject() {
  if (!rejectionReason.value || !imageToReject.value) return
  const imageId = imageToReject.value.id
  try {
    await api.patch('/book-images/review-bulk', {
      images_to_reject: [{ id: imageId, rejection_reason: rejectionReason.value }]
    })
    // Remove the image from the list after successful rejection
    images.value = images.value.filter(img => img.id !== imageId)
    cancelReject() // Close the modal and reset state
  } catch (err) {
    console.error(`Error rejecting image ${imageId}:`, err)
    alert(`خطا در رد تصویر. لطفاً دوباره تلاش کنید.`)
  }
}
</script>

<style scoped>
/* Scoped styles for the component */
</style>
