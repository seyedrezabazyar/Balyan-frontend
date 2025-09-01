<!-- components/dashboard/UserInfoCard.vue -->
<template>
  <div class="user-info-card">
    <div class="card-header">
      <h2>اطلاعات حساب کاربری</h2>
      <NuxtLink to="/dashboard/profile" class="edit-link">
        ویرایش پروفایل →
      </NuxtLink>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">
          <UserIcon />
          <span>نام کاربری</span>
        </div>
        <span class="info-value">{{ user.name || 'تعریف نشده' }}</span>
      </div>

      <div v-if="user.email" class="info-item">
        <div class="info-label">
          <MailIcon />
          <span>ایمیل</span>
        </div>
        <div class="info-value">
          <span>{{ user.email }}</span>
          <span v-if="user.email_verified_at" class="verified-badge">✓</span>
        </div>
      </div>

      <div v-if="user.phone" class="info-item">
        <div class="info-label">
          <PhoneIcon />
          <span>تلفن</span>
        </div>
        <div class="info-value">
          <span>{{ user.phone }}</span>
          <span v-if="user.phone_verified_at" class="verified-badge">✓</span>
        </div>
      </div>

      <div class="info-item">
        <div class="info-label">
          <ShieldIcon />
          <span>روش احراز هویت</span>
        </div>
        <span class="info-value">{{ user.preferred_method === 'otp' ? 'OTP' : 'رمز عبور' }}</span>
      </div>

      <div class="info-item">
        <div class="info-label">
          <CalendarIcon />
          <span>تاریخ عضویت</span>
        </div>
        <span class="info-value">{{ formatDate(user.created_at) }}</span>
      </div>

      <div class="info-item">
        <div class="info-label">
          <ClockIcon />
          <span>آخرین ورود</span>
        </div>
        <span class="info-value">{{ formatDate(user.last_login_at) || 'اولین ورود' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})

const formatDate = (dateString) => {
  if (!dateString) return null
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  } catch {
    return 'نامشخص'
  }
}

// Icons (render functions to avoid runtime template compilation)
import { h } from 'vue'

const UserIcon = {
  render() {
    return h('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '12', cy: '7', r: '4' })
    ])
  }
}

const MailIcon = {
  render() {
    return h('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' }),
      h('polyline', { points: '22 6 12 13 2 6' })
    ])
  }
}

const PhoneIcon = {
  render() {
    return h('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' })
    ])
  }
}

const ShieldIcon = {
  render() {
    return h('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z' })
    ])
  }
}

const CalendarIcon = {
  render() {
    return h('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' }),
      h('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
      h('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
      h('line', { x1: '3', y1: '10', x2: '21', y2: '10' })
    ])
  }
}

const ClockIcon = {
  render() {
    return h('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('polyline', { points: '12 6 12 12 16 14' })
    ])
  }
}
</script>

<style scoped>
.user-info-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border);
}

.card-header h2 {
  color: var(--dark);
  margin: 0;
}

.edit-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.edit-link:hover {
  color: var(--primary-dark);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--gray-50);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  color: var(--gray-700);
}

.info-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--dark);
  font-weight: 500;
}

.verified-badge {
  background: var(--success);
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .user-info-card {
    padding: 1.5rem;
  }

  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
