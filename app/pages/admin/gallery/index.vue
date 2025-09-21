<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">گالری تصاویر کتاب ها</h1>
      <div v-if="!loading" class="text-gray-600">
        <span class="font-medium">{{ pendingCount }}</span> تصویر در انتظار،
        <span class="font-medium text-green-600">{{ approvedCount }}</span> تایید شده،
        <span class="font-medium text-red-600">{{ rejectedCount }}</span> رد شده
      </div>
    </div>

    <!-- Actions -->
    <div class="mb-4 flex justify-between items-center">
      <button
        @click="approveAllPending"
        class="bg-green-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-600 disabled:bg-gray-400"
        :disabled="pendingCount === 0 || submitting"
      >
        تایید همه باقی‌مانده‌ها
      </button>
      <button
        @click="submitReviews"
        :disabled="submitting || (approvedCount === 0 && rejectedCount === 0)"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <span v-if="submitting">در حال ارسال...</span>
        <span v-else>ثبت تغییرات</span>
      </button>
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
    <div v-if="!loading && !error" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div
        v-for="image in images"
        :key="image.id"
        class="relative border-2 rounded-lg overflow-hidden shadow-sm"
        :class="{
          'border-green-500': reviewStates[image.id]?.status === 'approved',
          'border-red-500': reviewStates[image.id]?.status === 'rejected',
          'border-gray-300': reviewStates[image.id]?.status === 'pending'
        }"
      >
        <img :src="image.thumbnail_url" :alt="image.book_title" class="w-full h-48 object-cover">

        <div class="absolute top-1 right-1">
            <span v-if="reviewStates[image.id]?.status === 'approved'" class="h-6 w-6 bg-green-500 text-white flex items-center justify-center rounded-full i-heroicons-check-solid"></span>
            <span v-if="reviewStates[image.id]?.status === 'rejected'" class="h-6 w-6 bg-red-500 text-white flex items-center justify-center rounded-full i-heroicons-x-mark-solid"></span>
        </div>

        <div class="p-2">
          <h3 class="text-sm font-medium truncate">{{ image.book_title }}</h3>
          <div class="flex justify-center gap-2 mt-2">
            <template v-if="reviewStates[image.id]?.status === 'pending'">
              <button @click="approveImage(image.id)" class="w-1/2 bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600">تایید</button>
              <button @click="promptReject(image)" class="w-1/2 bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600">رد</button>
            </template>
            <template v-else>
              <button @click="undoAction(image.id)" class="w-full bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600">لغو</button>
            </template>
          </div>
        </div>
      </div>
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
const submitting = ref(false)
const error = ref(null)

const reviewStates = ref({}) // { [id]: { status: 'pending' | 'approved' | 'rejected', reason?: '...' } }

const showRejectionModal = ref(false)
const imageToReject = ref(null)
const rejectionReason = ref('')

const statusCounts = computed(() => {
  return Object.values(reviewStates.value).reduce((counts, state) => {
    counts[state.status] = (counts[state.status] || 0) + 1
    return counts
  }, { pending: 0, approved: 0, rejected: 0 })
})

const pendingCount = computed(() => statusCounts.value.pending)
const approvedCount = computed(() => statusCounts.value.approved)
const rejectedCount = computed(() => statusCounts.value.rejected)

async function fetchImages() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/book-images', {
      params: { status: 'pending', per_page: 100 }
    })
    images.value = response.data || []
    initializeStates()
  } catch (err) {
    console.error('Error fetching images:', err)
    error.value = 'خطا در بارگذاری تصاویر. لطفاً دوباره تلاش کنید.'
  } finally {
    loading.value = false
  }
}

function initializeStates() {
  const newStates = {}
  images.value.forEach(img => {
    newStates[img.id] = { status: 'pending' }
  })
  reviewStates.value = newStates
}

onMounted(fetchImages)

function approveImage(id) {
  reviewStates.value[id] = { status: 'approved' }
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

function confirmReject() {
  if (!rejectionReason.value || !imageToReject.value) return
  const imageId = imageToReject.value.id
  reviewStates.value[imageId] = { status: 'rejected', reason: rejectionReason.value }
  cancelReject()
}

function undoAction(id) {
  reviewStates.value[id] = { status: 'pending' }
}

function approveAllPending() {
    for (const id in reviewStates.value) {
        if (reviewStates.value[id].status === 'pending') {
            reviewStates.value[id].status = 'approved'
        }
    }
}

async function submitReviews() {
  submitting.value = true
  error.value = null

  const images_to_approve = []
  const images_to_reject = []

  // Process all images currently loaded on the page
  for (const id in reviewStates.value) {
    const state = reviewStates.value[id];
    // Treat 'pending' as 'approved' during final submission
    if (state.status === 'approved' || state.status === 'pending') {
      images_to_approve.push(parseInt(id, 10))
    } else if (state.status === 'rejected') {
      images_to_reject.push({ id: parseInt(id, 10), rejection_reason: state.reason })
    }
  }

  // Do not submit if no action is to be taken (e.g., all images were left pending and are now being approved)
  if (images_to_approve.length === 0 && images_to_reject.length === 0) {
    alert("هیچ تصویری برای بررسی وجود ندارد.");
    submitting.value = false;
    return;
  }

  const payload = { images_to_approve, images_to_reject }

  try {
    const response = await api.patch('/book-images/review-bulk', payload)

    if (response.data?.failed_count > 0) {
        let alertMessage = `عملیات با موفقیت نسبی انجام شد.\n` +
            `تایید شده: ${response.data.approved_count}\n` +
            `رد شده: ${response.data.rejected_count}\n` +
            `ناموفق: ${response.data.failed_count}`;

        response.data.failed_items.forEach(item => {
            alertMessage += `\n- تصویر با شناسه ${item.id}: ${item.error}`;
        });
        alert(alertMessage);
    } else {
        alert(response.message || 'عملیات با موفقیت انجام شد.');
    }

    // Refresh the list of images
    await fetchImages()

  } catch (err) {
    console.error('Error submitting reviews:', err)
    error.value = err.data?.message || 'خطا در ارسال بازبینی‌ها. لطفاً دوباره تلاش کنید.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Scoped styles for the component */
</style>
