<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">گالری تصاویر کتاب ها</h1>
      <div v-if="!loading" class="text-gray-600">
        <span class="font-medium">{{ images.length }}</span> تصویر در انتظار بازبینی
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-4 border-b border-gray-200">
      <nav class="flex -mb-px space-x-4" aria-label="Tabs">
        <button
          @click="activeTab = 'pending'"
          :class="[
            'px-3 py-2 font-medium text-sm rounded-t-md',
            activeTab === 'pending'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          در انتظار بازبینی ({{ images.length }})
        </button>
        <button
          @click="activeTab = 'approved'"
          :class="[
            'px-3 py-2 font-medium text-sm rounded-t-md',
            activeTab === 'approved'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          تایید شده ({{ approvedImages.length }})
        </button>
        <button
          @click="activeTab = 'rejected'"
          :class="[
            'px-3 py-2 font-medium text-sm rounded-t-md',
            activeTab === 'rejected'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          رد شده ({{ rejectedImages.length }})
        </button>
      </nav>
    </div>

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-center py-10">
      <p>در حال بارگذاری تصاویر...</p>
    </div>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">خطا!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <!-- Image Grids -->
    <div v-if="!loading && !error">
      <!-- Pending Tab -->
      <div v-if="activeTab === 'pending'">
        <div v-if="images.length > 0" class="grid grid-cols-4 gap-2">
          <template v-for="image in images" :key="image.id">
            <div v-if="image.thumbnail_url" class="relative border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <img :src="image.thumbnail_url" :alt="image.book.title" class="w-full h-64 object-cover cursor-pointer" @click="showFullscreen(image.url || image.thumbnail_url)">
              <div class="p-2">
                <h3 class="text-sm font-medium truncate">{{ image.book.title }}</h3>
                <div class="flex justify-center gap-2 mt-2">
                  <button @click="approveImage(image.id)" class="w-1/2 bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600">تایید</button>
                  <button @click="rejectImage(image.id)" class="w-1/2 bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600">رد</button>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div v-else class="text-center py-10"><p>هیچ تصویر جدیدی برای بازبینی وجود ندارد.</p></div>
        <div v-if="pendingMeta && pendingMeta.current_page < pendingMeta.last_page" class="text-center mt-6">
          <button @click="loadMore('pending')" :disabled="loadingMore" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400">
            {{ loadingMore ? 'در حال بارگذاری...' : 'بارگذاری بیشتر' }}
          </button>
        </div>
      </div>

      <!-- Approved Tab -->
      <div v-if="activeTab === 'approved'">
        <div v-if="approvedImages.length > 0" class="grid grid-cols-4 gap-2">
          <template v-for="image in approvedImages" :key="image.id">
            <div v-if="image.thumbnail_url" class="relative border-2 border-green-300 rounded-lg overflow-hidden shadow-sm">
              <img :src="image.thumbnail_url" :alt="image.book.title" class="w-full h-64 object-cover cursor-pointer" @click="showFullscreen(image.url || image.thumbnail_url)">
              <div class="p-2">
                <h3 class="text-sm font-medium truncate">{{ image.book.title }}</h3>
                <button
                @click="resetImageStatus(image, 'approved')"
                class="w-full mt-2 bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600"
                >
                  انتقال به صف بازبینی
                </button>
              </div>
            </div>
          </template>
        </div>
        <div v-else class="text-center py-10"><p>هیچ تصویر تایید شده‌ای وجود ندارد.</p></div>
        <div v-if="approvedMeta && approvedMeta.current_page < approvedMeta.last_page" class="text-center mt-6">
          <button @click="loadMore('approved')" :disabled="loadingMore" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400">
            {{ loadingMore ? 'در حال بارگذاری...' : 'بارگذاری بیشتر' }}
          </button>
        </div>
      </div>

      <!-- Rejected Tab -->
      <div v-if="activeTab === 'rejected'">
        <div v-if="rejectedImages.length > 0" class="grid grid-cols-4 gap-2">
          <template v-for="image in rejectedImages" :key="image.id">
            <div v-if="image.thumbnail_url" class="relative border-2 border-red-300 rounded-lg overflow-hidden shadow-sm">
              <img :src="image.thumbnail_url" :alt="image.book.title" class="w-full h-64 object-cover cursor-pointer" @click="showFullscreen(image.url || image.thumbnail_url)">
              <div class="p-2">
                <h3 class="text-sm font-medium truncate">{{ image.book.title }}</h3>
                <p class="text-xs text-gray-500 mt-1">دلیل رد: {{ image.rejection_reason }}</p>
                <button
                @click="resetImageStatus(image, 'rejected')"
                class="w-full mt-2 bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600"
                >
                  انتقال به صف بازبینی
                </button>
              </div>
            </div>
          </template>
        </div>
        <div v-else class="text-center py-10"><p>هیچ تصویر رد شده‌ای وجود ندارد.</p></div>
        <div v-if="rejectedMeta && rejectedMeta.current_page < rejectedMeta.last_page" class="text-center mt-6">
          <button @click="loadMore('rejected')" :disabled="loadingMore" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400">
            {{ loadingMore ? 'در حال بارگذاری...' : 'بارگذاری بیشتر' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Fullscreen Image Viewer -->
    <div v-if="fullscreenImageUrl" @click="hideFullscreen" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer">
      <img :src="fullscreenImageUrl" class="max-w-full max-h-full object-contain">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApiAuth } from '~/composables/useApiAuth'

definePageMeta({
  layout: 'fullscreen',
  title: 'گالری تصاویر کتاب ها',
  middleware: 'admin'
})

const api = useApiAuth()

const images = ref([]) // This will now be for pending images
const approvedImages = ref([])
const rejectedImages = ref([])

const pendingMeta = ref(null)
const approvedMeta = ref(null)
const rejectedMeta = ref(null)

const loading = ref(true)
const error = ref(null)
const activeTab = ref('pending') // 'pending', 'approved', 'rejected'
const fullscreenImageUrl = ref(null)

function showFullscreen(url) {
  fullscreenImageUrl.value = url
}

function hideFullscreen() {
  fullscreenImageUrl.value = null
}

async function fetchAllImages() {
  loading.value = true
  error.value = null
  try {
    const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
      api.get('/book-images', { params: { status: 'pending', per_page: 100 } }),
      api.get('/book-images', { params: { status: 'approved', per_page: 100 } }),
      api.get('/book-images', { params: { status: 'rejected', per_page: 100 } })
    ])

    images.value = pendingRes.data || []
    pendingMeta.value = pendingRes.meta || null

    approvedImages.value = approvedRes.data || []
    approvedMeta.value = approvedRes.meta || null

    rejectedImages.value = rejectedRes.data || []
    rejectedMeta.value = rejectedRes.meta || null

  } catch (err) {
    console.error('Error fetching image lists:', err)
    error.value = 'خطا در بارگذاری لیست تصاویر. لطفاً دوباره تلاش کنید.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchAllImages)

async function approveImage(id) {
  try {
    await api.patch('/book-images/review-bulk', {
      images_to_approve: [id],
      images_to_reject: []
    })
    // Refetch all lists to ensure UI is in sync with the database
    await fetchAllImages()
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
    // Refetch all lists to ensure UI is in sync with the database
    await fetchAllImages()
  } catch (err) {
    console.error(`Error rejecting image ${id}:`, err)
    alert(`خطا در رد تصویر. لطفاً دوباره تلاش کنید.`)
  }
}

const loadingMore = ref(false)

async function loadMore(status) {
  if (loadingMore.value) return

  let metaRef, listRef
  switch (status) {
    case 'pending':
      metaRef = pendingMeta
      listRef = images
      break
    case 'approved':
      metaRef = approvedMeta
      listRef = approvedImages
      break
    case 'rejected':
      metaRef = rejectedMeta
      listRef = rejectedImages
      break
    default:
      return
  }

  if (!metaRef.value || metaRef.value.current_page >= metaRef.value.last_page) {
    return
  }

  loadingMore.value = true
  try {
    const response = await api.get('/book-images', {
      params: {
        status: status,
        per_page: 100,
        page: metaRef.value.current_page + 1
      }
    })

    listRef.value.push(...(response.data || []))

    if (metaRef.value) {
      metaRef.value.current_page = response.meta.current_page
      metaRef.value.last_page = response.meta.last_page
    }
  } catch (err) {
    console.error(`Error loading more ${status} images:`, err)
    alert(`خطا در بارگذاری صفحات بیشتر.`)
  } finally {
    loadingMore.value = false
  }
}

async function resetImageStatus(image, fromList) {
  try {
    await api.patch(`/book-images/${image.id}/reset`)
    // Refetch all lists to ensure UI is in sync with the database
    await fetchAllImages()
  } catch (err) {
    console.error(`Error resetting image ${image.id} status:`, err)
    alert(`خطا در بازگرداندن وضعیت تصویر.`)
  }
}
</script>

<style scoped>
/* Scoped styles for the component */
</style>
