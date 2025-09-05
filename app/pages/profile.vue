<!-- app/pages/dashboard/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
              <div class="mb-4 md:mb-0">
                <h1 class="text-3xl font-bold mb-2">
                  سلام {{ user?.name || 'کاربر عزیز' }}! 👋
                </h1>
                <p class="text-blue-100 text-lg">
                  به داشبورد خود خوش آمدید
                </p>
                <p class="text-blue-200 text-sm mt-1">
                  آخرین ورود: {{ formatLastLogin }}
                </p>
              </div>
              <div class="flex flex-col items-start md:items-end space-y-2">
                <div class="flex items-center gap-2">
                  <span v-if="user?.email_verified_at"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    ایمیل تایید شده
                  </span>
                  <span v-if="user?.phone_verified_at"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    تلفن تایید شده
                  </span>
                </div>
                <div v-if="authStore.isAdmin" class="flex items-center gap-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 12c0-2.21-.896-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.983 5.983 0 01-.757 2.829 1 1 0 01-1.415-1.415A3.987 3.987 0 0013 12a3.987 3.987 0 00-.172-1.414 1 1 0 010-1.415z" clip-rule="evenodd" />
                    </svg>
                    مدیر سیستم
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Main Dashboard Content -->
        <div class="lg:col-span-3 space-y-8">

          <!-- Quick Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="stat in quickStats" :key="stat.id"
                 class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
                  <p class="text-2xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
                  <p v-if="stat.change" class="text-sm mt-1"
                     :class="stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'">
                    {{ stat.change }}
                  </p>
                </div>
                <div class="p-3 rounded-full" :class="stat.bgColor">
                  <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                فعالیت‌های اخیر
              </h2>
            </div>
            <div class="p-6">
              <div v-if="recentActivities.length > 0" class="flow-root">
                <ul class="-mb-8">
                  <li v-for="(activity, index) in recentActivities" :key="activity.id"
                      class="relative">
                    <div v-if="index !== recentActivities.length - 1"
                         class="absolute top-4 right-4 -ml-px h-full w-0.5 bg-gray-200"></div>
                    <div class="relative flex space-x-3 space-x-reverse">
                      <div class="flex-shrink-0">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center"
                             :class="activity.bgColor">
                          <component :is="activity.icon" class="w-4 h-4" :class="activity.iconColor" />
                        </div>
                      </div>
                      <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4 space-x-reverse">
                        <div>
                          <p class="text-sm text-gray-900">{{ activity.title }}</p>
                          <p class="text-xs text-gray-500">{{ activity.description }}</p>
                        </div>
                        <div class="text-left whitespace-nowrap text-xs text-gray-500">
                          {{ activity.time }}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else class="text-center py-8">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p class="text-gray-500">فعالیت اخیری موجود نیست</p>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                پیشنهادات سیستم
              </h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="recommendation in recommendations" :key="recommendation.id"
                     class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div class="flex items-start gap-3">
                    <div class="p-2 rounded-lg" :class="recommendation.bgColor">
                      <component :is="recommendation.icon" class="w-5 h-5" :class="recommendation.iconColor" />
                    </div>
                    <div class="flex-1">
                      <h3 class="text-sm font-medium text-gray-900">{{ recommendation.title }}</h3>
                      <p class="text-xs text-gray-600 mt-1">{{ recommendation.description }}</p>
                      <button v-if="recommendation.action"
                              @click="handleRecommendationAction(recommendation)"
                              class="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
                        {{ recommendation.actionText }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">

          <!-- Profile Summary -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">پروفایل شما</h3>
            </div>
            <div class="p-6">
              <div class="text-center">
                <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {{ userInitials }}
                </div>
                <h4 class="text-lg font-semibold text-gray-900">{{ user?.name || 'کاربر' }}</h4>
                <p class="text-sm text-gray-600">{{ user?.email || user?.phone || 'اطلاعات ناقص' }}</p>

                <!-- Profile Completion -->
                <div class="mt-4">
                  <div class="flex items-center justify-between text-sm mb-2">
                    <span class="text-gray-600">تکمیل پروفایل</span>
                    <span class="font-medium">{{ profileCompletionPercentage }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                         :style="{ width: profileCompletionPercentage + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">دسترسی سریع</h3>
            </div>
            <div class="p-6 space-y-3">
              <NuxtLink v-for="action in quickActions" :key="action.id"
                        :to="action.to"
                        class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group">
                <div class="p-2 rounded-lg" :class="action.bgColor">
                  <component :is="action.icon" class="w-5 h-5" :class="action.iconColor" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    {{ action.title }}
                  </p>
                  <p class="text-xs text-gray-600">{{ action.description }}</p>
                </div>
                <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </NuxtLink>
            </div>
          </div>

          <!-- System Status -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">وضعیت سیستم</h3>
            </div>
            <div class="p-6 space-y-4">
              <div v-for="status in systemStatus" :key="status.id"
                   class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full" :class="status.color"></div>
                  <span class="text-sm text-gray-700">{{ status.label }}</span>
                </div>
                <span class="text-xs font-medium" :class="status.textColor">
                  {{ status.value }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

// Icons (using Heroicons as components)
import {
  BookOpenIcon,
  UserIcon,
  CogIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const authStore = useAuthStore()
const router = useRouter()

// Reactive state
const loading = ref(false)
const recentActivities = ref([])
const stats = ref({})

// Computed properties
const user = computed(() => authStore.user)

const userInitials = computed(() => {
  if (!user.value?.name) return 'ک'
  const name = user.value.name
  const parts = name.split(' ')
  return parts.length >= 2
    ? parts[0].charAt(0) + parts[1].charAt(0)
    : name.charAt(0)
})

const formatLastLogin = computed(() => {
  if (!user.value?.last_login_at) return 'اولین بار'
  return new Date(user.value.last_login_at).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const profileCompletionPercentage = computed(() => {
  if (!user.value) return 0

  let completed = 0
  let total = 6

  if (user.value.name) completed++
  if (user.value.email) completed++
  if (user.value.phone) completed++
  if (user.value.email_verified_at) completed++
  if (user.value.phone_verified_at) completed++
  if (user.value.address) completed++

  return Math.round((completed / total) * 100)
})

const quickStats = computed(() => [
  {
    id: 1,
    label: 'کتاب‌های خریداری شده',
    value: stats.value.purchased_books || '0',
    change: '+2 این ماه',
    changeType: 'positive',
    icon: BookOpenIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 2,
    label: 'نشان‌شده‌ها',
    value: stats.value.bookmarks || '0',
    change: '+5 این هفته',
    changeType: 'positive',
    icon: BookOpenIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 3,
    label: 'امتیاز کل',
    value: stats.value.total_points || '0',
    change: '+50 امتیاز',
    changeType: 'positive',
    icon: ChartBarIcon,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  }
])

const quickActions = computed(() => {
  const actions = [
    {
      id: 1,
      title: 'ویرایش پروفایل',
      description: 'تنظیم اطلاعات شخصی',
      to: '/profile',
      icon: UserIcon,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 2,
      title: 'مشاهده کتاب‌ها',
      description: 'مرور کتاب‌های موجود',
      to: '/books',
      icon: BookOpenIcon,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      title: 'تنظیمات حساب',
      description: 'مدیریت تنظیمات',
      to: '/settings',
      icon: CogIcon,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600'
    }
  ]

  // Add admin actions if user is admin
  if (authStore.isAdmin) {
    actions.push({
      id: 4,
      title: 'پنل مدیریت',
      description: 'مدیریت سیستم',
      to: '/admin',
      icon: UserGroupIcon,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    })
  }

  return actions
})

const recommendations = computed(() => {
  const recs = []

  // Check for incomplete profile
  if (profileCompletionPercentage.value < 100) {
    recs.push({
      id: 1,
      title: 'تکمیل پروفایل',
      description: 'پروفایل خود را کامل کنید تا تجربه بهتری داشته باشید',
      icon: UserIcon,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      action: 'complete-profile',
      actionText: 'تکمیل پروفایل'
    })
  }

  // Check for unverified email
  if (user.value?.email && !user.value?.email_verified_at) {
    recs.push({
      id: 2,
      title: 'تایید ایمیل',
      description: 'ایمیل خود را تایید کنید',
      icon: CheckCircleIcon,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      action: 'verify-email',
      actionText: 'تایید ایمیل'
    })
  }

  // Check for unverified phone
  if (user.value?.phone && !user.value?.phone_verified_at) {
    recs.push({
      id: 3,
      title: 'تایید شماره تلفن',
      description: 'شماره تلفن خود را تایید کنید',
      icon: CheckCircleIcon,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      action: 'verify-phone',
      actionText: 'تایید شماره'
    })
  }

  // Security recommendation
  if (!user.value?.password) {
    recs.push({
      id: 4,
      title: 'تنظیم رمز عبور',
      description: 'برای امنیت بیشتر رمز عبور تنظیم کنید',
      icon: ShieldCheckIcon,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      action: 'set-password',
      actionText: 'تنظیم رمز عبور'
    })
  }

  return recs
})

const systemStatus = computed(() => [
  {
    id: 1,
    label: 'وضعیت سرویس',
    value: 'عملکرد عالی',
    color: 'bg-green-500',
    textColor: 'text-green-600'
  },
  {
    id: 2,
    label: 'آخرین بروزرسانی',
    value: '2 ساعت پیش',
    color: 'bg-blue-500',
    textColor: 'text-blue-600'
  },
  {
    id: 3,
    label: 'پشتیبانی',
    value: 'آنلاین',
    color: 'bg-green-500',
    textColor: 'text-green-600'
  }
])

// Methods
const loadDashboardData = async () => {
  loading.value = true
  try {
    // Simulate API calls for dashboard data
    await Promise.all([
      loadUserStats(),
      loadRecentActivities()
    ])
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const loadUserStats = async () => {
  // Simulate API call for user statistics
  await new Promise(resolve => setTimeout(resolve, 500))
  stats.value = {
    purchased_books: 12,
    bookmarks: 8,
    total_points: 450
  }
}

const loadRecentActivities = async () => {
  // Simulate API call for recent activities
  await new Promise(resolve => setTimeout(resolve, 300))
  recentActivities.value = [
    {
      id: 1,
      title: 'خرید کتاب جدید',
      description: 'کتاب "برنامه‌نویسی JavaScript" خریداری شد',
      time: '2 ساعت پیش',
      icon: BookOpenIcon,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      title: 'تکمیل پروفایل',
      description: 'اطلاعات آدرس به‌روزرسانی شد',
      time: '1 روز پیش',
      icon: UserIcon,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      title: 'ورود به حساب',
      description: 'آخرین ورود از دستگاه موبایل',
      time: '2 روز پیش',
      icon: ClockIcon,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600'
    }
  ]
}

const handleRecommendationAction = (recommendation) => {
  switch (recommendation.action) {
    case 'complete-profile':
      router.push('/profile')
      break
    case 'verify-email':
      router.push('/profile#email-verification')
      break
    case 'verify-phone':
      router.push('/profile#phone-verification')
      break
    case 'set-password':
      router.push('/profile#password-section')
      break
    default:
      console.log('Unknown action:', recommendation.action)
  }
}

// Lifecycle
onMounted(async () => {
  console.log('Dashboard mounted')

  // Ensure user data is loaded
  if (!authStore.user && authStore.token) {
    await authStore.fetchUser()
  }

  // Load dashboard specific data
  await loadDashboardData()
})
</script>

<style scoped>
/* Custom animations for smooth transitions */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

/* Smooth hover effects */
.hover-scale {
  transition: transform 0.2s ease-in-out;
}

.hover-scale:hover {
  transform: scale(1.02);
}

/* Custom gradient backgrounds */
.gradient-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-green {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
}

/* Loading skeleton styles */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}
</style>
