<!-- app/components/AvatarUpload.vue -->
<template>
  <div class="flex flex-col items-center space-y-4">
    <!-- Avatar Display -->
    <div class="relative group">
      <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
        <img
          v-if="currentAvatar"
          :src="currentAvatar"
          :alt="userName"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
          <span class="text-white text-2xl font-bold">
            {{ userInitial }}
          </span>
        </div>
      </div>

      <!-- Upload Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
           @click="triggerFileInput">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>

      <!-- Loading Spinner -->
      <div v-if="uploading" class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
        <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>

    <!-- File Input (Hidden) -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      class="hidden"
    />

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-2 text-center">
      <button
        @click="triggerFileInput"
        :disabled="uploading"
        class="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {{ uploading ? 'در حال آپلود...' : 'تغییر تصویر' }}
      </button>

      <button
        v-if="currentAvatar"
        @click="deleteAvatar"
        :disabled="uploading"
        class="text-sm bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors"
      >
        حذف تصویر
      </button>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="w-full max-w-xs">
      <div class="bg-gray-200 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
      <p class="text-xs text-gray-500 text-center mt-1">{{ uploadProgress }}%</p>
    </div>

    <!-- Help Text -->
    <p class="text-xs text-gray-500 text-center max-w-xs">
      فایل‌های JPG، PNG یا GIF با حداکثر حجم 2 مگابایت مجاز هستند
    </p>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3 max-w-xs">
      <p class="text-sm text-red-600 text-center">{{ error }}</p>
      <button @click="error = ''" class="text-xs text-red-500 underline mt-1 block mx-auto">
        بستن
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProfile } from '~/composables/useProfile'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['avatar-updated'])

const profileComposable = useProfile()

// State
const fileInput = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')

// Computed
const currentAvatar = computed(() => {
  return props.user?.avatar_url || props.user?.avatar || null
})

const userName = computed(() => {
  return props.user?.name || props.user?.email || 'کاربر'
})

const userInitial = computed(() => {
  const name = userName.value
  if (name === 'کاربر') return 'ک'

  // اگر نام فارسی باشد، اولین حرف را برگردان
  if (/[\u0600-\u06FF]/.test(name)) {
    return name.charAt(0)
  }

  // اگر انگلیسی باشد، اولین حرف نام و نام خانوادگی
  const nameParts = name.split(' ')
  if (nameParts.length > 1) {
    return nameParts[0].charAt(0) + nameParts[1].charAt(0)
  }

  return name.charAt(0).toUpperCase()
})

// Methods
const triggerFileInput = () => {
  if (!uploading.value) {
    fileInput.value?.click()
  }
}

const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validation
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  if (!validTypes.includes(file.type)) {
    error.value = 'فرمت فایل باید JPG، PNG یا GIF باشد'
    return
  }

  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    error.value = 'حجم فایل نباید بیشتر از 2 مگابایت باشد'
    return
  }

  await uploadAvatar(file)
}

const uploadAvatar = async (file) => {
  uploading.value = true
  uploadProgress.value = 0
  error.value = ''

  try {
    // شبیه‌سازی پیشرفت آپلود
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += Math.random() * 20
      }
    }, 100)

    const response = await profileComposable.uploadAvatar(file)

    clearInterval(progressInterval)
    uploadProgress.value = 100

    // انتظار کمی برای نمایش 100%
    setTimeout(() => {
      uploadProgress.value = 0
    }, 1000)

    emit('avatar-updated', response)

    console.log('Avatar uploaded successfully:', response)
  } catch (err) {
    console.error('Avatar upload failed:', err)
    error.value = err.data?.message || 'خطا در آپلود تصویر'
    uploadProgress.value = 0
  } finally {
    uploading.value = false

    // پاک کردن input برای امکان انتخاب مجدد همان فایل
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const deleteAvatar = async () => {
  if (!confirm('آیا مطمئن هستید که می‌خواهید تصویر پروفایل خود را حذف کنید؟')) {
    return
  }

  uploading.value = true
  error.value = ''

  try {
    const response = await profileComposable.deleteAvatar()
    emit('avatar-updated', { avatar_url: null })
    console.log('Avatar deleted successfully:', response)
  } catch (err) {
    console.error('Avatar delete failed:', err)
    error.value = err.data?.message || 'خطا در حذف تصویر'
  } finally {
    uploading.value = false
  }
}

// Image preview for selected file
const previewImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.readAsDataURL(file)
  })
}
</script>

<style scoped>
/* Custom hover effects */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Smooth transitions */
.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
