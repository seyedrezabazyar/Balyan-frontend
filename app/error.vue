<!-- app/error.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <!-- آیکون خطا -->
        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full"
             :class="errorColorClass">
          <svg class="h-10 w-10" :class="errorIconColorClass" fill="currentColor" viewBox="0 0 20 20">
            <path v-if="errorCode === 401 || errorCode === 403" fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            <path v-else-if="errorCode === 404" fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clip-rule="evenodd" />
            <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>

        <!-- عنوان خطا -->
        <h1 class="mt-6 text-3xl font-bold text-gray-900">
          {{ errorTitle }}
        </h1>

        <!-- توضیحات خطا -->
        <p class="mt-4 text-lg text-gray-600 max-w-md mx-auto">
          {{ errorMessage }}
        </p>

        <!-- جزئیات فنی (فقط در حالت توسعه) -->
        <div v-if="showTechnicalDetails" class="mt-6 bg-gray-100 rounded-lg p-4 text-left">
          <details class="text-sm">
            <summary class="cursor-pointer font-medium text-gray-700 mb-2">
              جزئیات فنی
            </summary>
            <div class="space-y-2 text-gray-600">
              <p><strong>کد خطا:</strong> {{ error.statusCode }}</p>
              <p><strong>پیام:</strong> {{ error.statusMessage || error.message }}</p>
              <p v-if="error.url"><strong>URL:</strong> {{ error.url }}</p>
              <p v-if="error.stack && isDev"><strong>Stack Trace:</strong></p>
              <pre v-if="error.stack && isDev" class="bg-gray-200 p-2 rounded text-xs overflow-auto">{{ error.stack }}</pre>
            </div>
          </details>
        </div>

        <!-- دکمه‌های اقدام -->
        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="handleRetry"
            :disabled="retrying"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="retrying" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ retrying ? 'در حال تلاش مجدد...' : 'تلاش مجدد' }}
          </button>

          <button
            @click="goHome"
            class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>

        <!-- لینک‌های کمکی -->
        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center text-sm">
          <NuxtLink v-if="error.statusCode === 401" to="/auth" class="text-blue-600 hover:text-blue-500">
            ورود مجدد
          </NuxtLink>
          <a href="/contact" class="text-blue-600 hover:text-blue-500">
            تماس با پشتیبانی
          </a>
          <a href="/help" class="text-blue-600 hover:text-blue-500">
            راهنما
          </a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-12 text-center text-sm text-gray-500">
      <p>اگر این مشکل ادامه دارد، لطفاً با تیم پشتیبانی تماس بگیرید.</p>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const retrying = ref(false)
const isDev = process.dev

// محاسبه خصوصیات خطا
const errorCode = computed(() => props.error.statusCode || 500)

const errorTitle = computed(() => {
  switch (errorCode.value) {
    case 400:
      return 'درخواست نامعتبر'
    case 401:
      return 'احراز هویت مورد نیاز'
    case 403:
      return 'دسترسی غیرمجاز'
    case 404:
      return 'صفحه مورد نظر یافت نشد'
    case 422:
      return 'اطلاعات نامعتبر'
    case 429:
      return 'تعداد درخواست‌ها زیاد است'
    case 500:
      return 'خطای داخلی سرور'
    case 502:
      return 'سرور در دسترس نیست'
    case 503:
      return 'سرویس موقتاً غیرفعال'
    default:
      return 'خطایی رخ داده است'
  }
})

const errorMessage = computed(() => {
  switch (errorCode.value) {
    case 400:
      return 'درخواست شما نامعتبر است. لطفاً اطلاعات را بررسی کنید.'
    case 401:
      return 'برای دسترسی به این صفحه باید وارد حساب کاربری خود شوید.'
    case 403:
      return 'شما دسترسی لازم برای مشاهده این صفحه را ندارید.'
    case 404:
      return 'صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابجا شده است.'
    case 422:
      return 'اطلاعات ارسالی نادرست است. لطفاً دوباره تلاش کنید.'
    case 429:
      return 'تعداد درخواست‌های شما از حد مجاز تجاوز کرده است. لطفاً کمی صبر کنید.'
    case 500:
      return 'خطایی در سرور رخ داده است. تیم فنی در حال رفع مشکل هستند.'
    case 502:
      return 'سرور موقتاً در دسترس نیست. لطفاً بعداً تلاش کنید.'
    case 503:
      return 'سرویس موقتاً غیرفعال است. احتملاً در حال بروزرسانی هستیم.'
    default:
      return props.error.statusMessage || props.error.message || 'خطای ناشناخته‌ای رخ داده است.'
  }
})

const errorColorClass = computed(() => {
  switch (errorCode.value) {
    case 401:
    case 403:
      return 'bg-amber-100'
    case 404:
      return 'bg-blue-100'
    case 500:
    case 502:
    case 503:
      return 'bg-red-100'
    default:
      return 'bg-gray-100'
  }
})

const errorIconColorClass = computed(() => {
  switch (errorCode.value) {
    case 401:
    case 403:
      return 'text-amber-600'
    case 404:
      return 'text-blue-600'
    case 500:
    case 502:
    case 503:
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
})

const showTechnicalDetails = computed(() => {
  return isDev || errorCode.value >= 500
})

// Actions
const handleRetry = async () => {
  retrying.value = true

  try {
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Refresh the page
    window.location.reload()
  } catch (error) {
    console.error('Retry failed:', error)
  } finally {
    retrying.value = false
  }
}

const goHome = () => {
  router.push('/')
}

// Log error for monitoring
onMounted(() => {
  console.error('Error page displayed:', {
    statusCode: errorCode.value,
    message: errorMessage.value,
    url: props.error.url,
    stack: props.error.stack
  })

  // Send error to monitoring service (if available)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: `${errorCode.value}: ${errorMessage.value}`,
      fatal: errorCode.value >= 500
    })
  }
})

// تنظیم عنوان صفحه
useHead({
  title: `خطا ${errorCode.value} - ${errorTitle.value}`
})
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
