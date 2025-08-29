<!-- pages/dashboard/index.vue -->
<template>
  <div class="dashboard">
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

    <!-- User Info Card (for authenticated users) -->
    <UserInfoCard v-if="user" :user="user" />

    <!-- Coming Soon Modal -->
    <ComingSoonModal v-model="showComingSoon" />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const { user, initialize } = useAuth()
const showComingSoon = ref(false)

// Computed properties
const displayName = computed(() => {
  if (!user.value) return 'کاربر عزیز'
  if (user.value.name && user.value.name !== 'کاربر') return user.value.name
  if (user.value.email) return user.value.email.split('@')[0]
  if (user.value.phone) return user.value.phone
  return process.client && localStorage.getItem('username') || 'کاربر عزیز'
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

// Provide modal control to child components
provide('showComingSoon', () => {
  showComingSoon.value = true
})

// Initialize on mount
onMounted(() => {
  initialize()
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .dashboard {
    gap: 1.5rem;
  }
}
</style>
