<template>
  <div class="dashboard">
    <!-- Loading State -->
    <div v-if="!initialized" class="loading-state">
      <div class="spinner"></div>
      <p>در حال بارگذاری داشبورد...</p>
    </div>

    <template v-else>
      <!-- Welcome Card -->
      <div class="welcome-card">
        <h1>{{ displayName }}! 👋</h1>
        <p>{{ welcomeMessage }}</p>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div v-for="stat in dashboardStats" :key="stat.title" class="stat-card">
          <div :class="['stat-icon', stat.color]">
            {{ stat.icon }}
          </div>
          <div class="stat-content">
            <h3>{{ stat.title }}</h3>
            <p class="stat-value">{{ stat.value }}</p>
            <p :class="['stat-change', `change-${stat.changeType}`]">
              {{ stat.changeType === 'positive' ? '↗' : '↘' }} {{ stat.change }}
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>دسترسی سریع</h2>
        <div class="actions-grid">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.title"
            :to="action.route"
            class="action-card"
          >
            <div class="action-icon">{{ action.icon }}</div>
            <h3>{{ action.title }}</h3>
            <p>{{ action.description }}</p>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <div class="section-header">
          <h2>فعالیت‌های اخیر</h2>
          <button @click="refreshActivity" class="refresh-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            بروزرسانی
          </button>
        </div>

        <div class="activity-list">
          <div v-for="activity in activities" :key="activity.id" class="activity-item">
            <div class="activity-icon">{{ getActivityIcon(activity.type) }}</div>
            <div class="activity-content">
              <p>{{ activity.message }}</p>
              <span>{{ formatters.date(activity.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

const { user, initialized } = useAuth()
const { formatters } = useUtils()

// Computed
const displayName = computed(() => {
  if (!user.value) return 'کاربر عزیز'
  return user.value.name || user.value.email?.split('@')[0] || user.value.phone || 'کاربر عزیز'
})

const welcomeMessage = computed(() => {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'صبح بخیر' : hour < 18 ? 'ظهر بخیر' : 'عصر بخیر'
  return `${greeting}! به داشبورد خود خوش آمدید`
})

// Data
const dashboardStats = ref([
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
    change: '+5%',
    changeType: 'positive',
    icon: '📈',
    color: 'info'
  }
])

const quickActions = computed(() => {
  const baseActions = [
    {
      title: 'ویرایش پروفایل',
      description: 'مدیریت اطلاعات شخصی',
      icon: '👤',
      route: '/dashboard/profile'
    }
  ]

  if (user.value?.is_admin) {
    baseActions.unshift(
      {
        title: 'مدیریت کاربران',
        description: 'مشاهده و مدیریت کاربران',
        icon: '👥',
        route: '/dashboard/users'
      },
      {
        title: 'آمار سیستم',
        description: 'مشاهده آمار کلی',
        icon: '📊',
        route: '/dashboard/admin-stats'
      }
    )
  }

  return baseActions
})

const activities = ref([
  {
    id: 1,
    type: 'login',
    message: 'ورود موفق به سیستم',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    type: 'profile',
    message: 'اطلاعات پروفایل بروزرسانی شد',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 3,
    type: 'security',
    message: 'رمز عبور تغییر یافت',
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
])

// Methods
const getActivityIcon = (type: string) => {
  const icons = {
    login: '🔑',
    logout: '🚪',
    profile: '👤',
    security: '🔒'
  }
  return icons[type] || '📝'
}

const refreshActivity = () => {
  // Refresh activities logic here
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
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
  to { transform: rotate(360deg); }
}

.welcome-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow);
  text-align: center;
}

.welcome-card h1 {
  color: var(--dark);
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.welcome-card p {
  color: var(--gray);
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow);
  transition: var(--transition);
  border-left: 4px solid transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stat-card:has(.stat-icon.primary) { border-left-color: var(--primary); }
.stat-card:has(.stat-icon.success) { border-left-color: var(--success); }
.stat-card:has(.stat-icon.warning) { border-left-color: var(--warning); }
.stat-card:has(.stat-icon.info) { border-left-color: var(--info); }

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
}

.stat-icon.primary { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); }
.stat-icon.success { background: linear-gradient(135deg, var(--success), #059669); }
.stat-icon.warning { background: linear-gradient(135deg, var(--warning), #d97706); }
.stat-icon.info { background: linear-gradient(135deg, var(--info), #2563eb); }

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 0.875rem;
  color: var(--gray);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

.change-positive { color: var(--success); }
.change-negative { color: var(--danger); }

.quick-actions {
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow);
}

.quick-actions h2 {
  color: var(--dark);
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: var(--gray-50);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
  transition: var(--transition);
  text-decoration: none;
  color: inherit;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
}

.action-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
}

.action-card h3 {
  color: var(--dark);
  margin-bottom: 0.5rem;
}

.action-card p {
  color: var(--gray);
  margin: 0;
  font-size: 0.9rem;
}

.recent-activity {
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  color: var(--dark);
  margin: 0;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--gray-100);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: var(--gray-700);
  cursor: pointer;
  transition: var(--transition);
}

.refresh-btn:hover {
  background: var(--gray-200);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius);
  background: var(--gray-50);
}

.activity-item .activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.activity-content p {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: var(--dark);
}

.activity-content span {
  font-size: 0.8rem;
  color: var(--gray);
}

@media (max-width: 768px) {
  .dashboard {
    gap: 1.5rem;
  }

  .welcome-card {
    padding: 1.5rem;
  }

  .welcome-card h1 {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .action-icon {
    width: 56px;
    height: 56px;
    font-size: 1.75rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
