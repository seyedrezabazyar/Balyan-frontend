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

    <!-- User Info Card -->
    <UserInfoCard v-if="user" :user="user" />

    <!-- Coming Soon Modal -->
    <ComingSoonModal v-model="showComingSoon" />
  </div>
</template>

<script setup lang="ts">
import WelcomeCard from '~/components/dashboard/WelcomeCard.vue'
import StatsGrid from '~/components/dashboard/StatsGrid.vue'
import QuickActions from '~/components/dashboard/QuickActions.vue'
import RecentActivity from '~/components/dashboard/RecentActivity.vue'
import UserInfoCard from '~/components/dashboard/UserInfoCard.vue'
import ComingSoonModal from '~/components/dashboard/ComingSoonModal.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const { user, initialize } = useAuth()
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
    changeType: 'positive' as const,
    icon: '👥',
    color: 'primary' as const
  },
  {
    title: 'درآمد ماهانه',
    value: '45.2M',
    change: '+8%',
    changeType: 'positive' as const,
    icon: '💰',
    color: 'success' as const
  },
  {
    title: 'سفارشات جدید',
    value: '189',
    change: '-3%',
    changeType: 'negative' as const,
    icon: '📦',
    color: 'warning' as const
  },
  {
    title: 'رشد فروش',
    value: '24%',
    change: 'نسبت به ماه قبل',
    changeType: 'positive' as const,
    icon: '📈',
    color: 'info' as const
  }
])

provide('showComingSoon', () => {
  showComingSoon.value = true
})

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
