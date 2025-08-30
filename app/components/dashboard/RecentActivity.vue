<!-- components/dashboard/RecentActivity.vue -->
<template>
  <div class="recent-activity">
    <div class="section-header">
      <h2>فعالیت‌های اخیر</h2>
      <button class="refresh-btn" @click="refreshActivities">
        <RefreshIcon :class="{ spinning: isRefreshing }" />
        بروزرسانی
      </button>
    </div>

    <div class="activity-list">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="activity-item"
        :class="[`activity-${activity.type}`]"
      >
        <div class="activity-icon">
          {{ getActivityIcon(activity.type) }}
        </div>
        <div class="activity-content">
          <p class="activity-message">{{ activity.message }}</p>
          <span class="activity-time">{{ formatTime(activity.created_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const isRefreshing = ref(false)

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

const refreshActivities = async () => {
  isRefreshing.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  isRefreshing.value = false
}

const getActivityIcon = (type) => {
  const icons = {
    login: '🔑',
    logout: '🚪',
    profile: '👤',
    security: '🔒',
    email: '📧',
    phone: '📱',
    default: '📝'
  }
  return icons[type] || icons.default
}

const formatTime = (dateString) => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes} دقیقه پیش`
    if (hours < 24) return `${hours} ساعت پیش`
    return `${days} روز پیش`
  } catch {
    return 'زمان نامشخص'
  }
}

import { h } from 'vue'
const RefreshIcon = {
  render() {
    return h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '23 4 23 10 17 10' }),
      h('polyline', { points: '1 20 1 14 7 14' }),
      h('path', { d: 'm3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15' })
    ])
  }
}
</script>

<style scoped>
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

.spinning {
  animation: spin 1s linear infinite;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius);
  border-left: 4px solid var(--border);
  background: var(--gray-50);
}

.activity-login { border-left-color: var(--success); }
.activity-logout { border-left-color: var(--warning); }
.activity-profile { border-left-color: var(--info); }
.activity-security { border-left-color: var(--danger); }

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-message {
  margin: 0 0 0.25rem 0;
  color: var(--dark);
  font-weight: 500;
}

.activity-time {
  font-size: 0.875rem;
  color: var(--gray);
}

@media (max-width: 768px) {
  .recent-activity {
    padding: 1.5rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
