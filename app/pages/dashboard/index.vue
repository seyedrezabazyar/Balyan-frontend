<!-- app/pages/dashboard/index.vue - نسخه بهبود یافته -->
<template>
  <div class="dashboard">
    <!-- Loading State -->
    <div v-if="!initialized && !user" class="loading-state">
      <div class="spinner"></div>
      <p>در حال بارگذاری داشبورد...</p>
    </div>

    <!-- Dashboard Content -->
    <template v-else-if="user">
      <!-- Welcome Section -->
      <WelcomeCard
        :user="user"
        :display-name="displayName"
        :welcome-message="welcomeMessage"
      />

      <!-- Stats Grid -->
      <StatsGrid :stats="dashboardStats" />

      <!-- Quick Actions -->
      <QuickActions />

      <!-- Recent Activity -->
      <RecentActivity v-if="user" />

      <!-- User Info Card -->
      <UserInfoCard v-if="user" :user="user" />

      <!-- Coming Soon Modal -->
      <ComingSoonModal v-model="showComingSoon" />
    </template>

    <!-- Error State -->
    <div v-else class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>خطا در بارگذاری داشبورد</h3>
      <p>لطفاً دوباره تلاش کنید</p>
      <button @click="retryLoad" class="btn btn-primary">تلاش مجدد</button>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
// Lazy-load heavy dashboard components
const WelcomeCard = defineAsyncComponent(() => import('~/components/dashboard/WelcomeCard.vue'))
const StatsGrid = defineAsyncComponent(() => import('~/components/dashboard/StatsGrid.vue'))
const QuickActions = defineAsyncComponent(() => import('~/components/dashboard/QuickActions.vue'))
const RecentActivity = defineAsyncComponent(() => import('~/components/dashboard/RecentActivity.vue'))
const UserInfoCard = defineAsyncComponent(() => import('~/components/dashboard/UserInfoCard.vue'))
const ComingSoonModal = defineAsyncComponent(() => import('~/components/dashboard/ComingSoonModal.vue'))
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const { user, initialize, initialized, isLoggedIn, waitForInitialization } = useAuth()
const showComingSoon = ref(false)

const displayName = computed(() => {
  if (!user.value) return 'کاربر عزیز'
  return user.value.name || user.value.email?.split('@')[0] || user.value.phone || 'کاربر عزیز'
})

const welcomeMessage = computed(() => {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'صبح بخیر' : hour < 18 ? 'ظهر بخیر' : 'عصر بخیر'
  return `${greeting}! به داشبورد خود خوش آمدید`
})

const dashboardStats = computed(() => [
  {
    title: 'کاربران فعال',
    value: '1,247',
    change: '+12%',
    changeType: 'positive',
    icon: '👥',
    color: 'primary'
  },
  {
    title: 'درآمد ماهانه',
    value: '45.2M',
    change: '+8%',
    changeType: 'positive',
    icon: '💰',
    color: 'success'
  },
  {
    title: 'سفارشات جدید',
    value: '189',
    change: '-3%',
    changeType: 'negative',
    icon: '📦',
    color: 'warning'
  },
  {
    title: 'رشد فروش',
    value: '24%',
    change: 'نسبت به ماه قبل',
    changeType: 'positive',
    icon: '📈',
    color: 'info'
  }
])

provide('showComingSoon', () => {
  showComingSoon.value = true
})

const retryLoad = async () => {
  try {
    await initialize()
    if (!isLoggedIn.value) await navigateTo('/auth')
  } catch (error) {
    console.error('❌ Dashboard - Retry failed:', error)
  }
}

// Watch for auth state changes
watch(isLoggedIn, (newValue) => {
  if (!newValue) navigateTo('/auth')
})

watch(user, () => {}, { deep: true })

onMounted(async () => {
  if (!initialized.value) {
    await waitForInitialization()
  }
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 50vh;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--gray-200);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: var(--gray);
  margin: 0;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  text-align: center;
  padding: 2rem;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: var(--danger);
  margin-bottom: 0.5rem;
}

.error-state p {
  color: var(--gray);
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .dashboard {
    gap: 1.5rem;
  }

  .loading-state,
  .error-state {
    margin: 1rem;
    min-height: 200px;
  }
}
</style>
