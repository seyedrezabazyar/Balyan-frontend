<!-- components/dashboard/WelcomeCard.vue -->
<template>
  <div class="welcome-card">
    <div class="welcome-content">
      <div class="welcome-text">
        <h1>{{ greetingMessage }}, {{ displayName }}! 👋</h1>
        <p>{{ welcomeMessage }}</p>
      </div>

      <div class="welcome-stats">
        <div class="stat-item">
          <span class="stat-label">آخرین ورود</span>
          <span class="stat-value">{{ lastLoginTime }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">وضعیت حساب</span>
          <span class="stat-value verified">{{ accountStatus }}</span>
        </div>
      </div>
    </div>

    <div class="welcome-visual">
      <div class="user-avatar-large">
        {{ getInitials(displayName) }}
      </div>
    </div>
  </div>
</template>

<script setup>
interface Props {
  user?: any
  displayName: string
  welcomeMessage: string
}

const props = defineProps<Props>()

const greetingMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'صبح بخیر'
  if (hour < 18) return 'ظهر بخیر'
  return 'عصر بخیر'
})

const lastLoginTime = computed(() => {
  if (!props.user?.last_login_at) return 'اولین ورود'
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(props.user.last_login_at))
  } catch {
    return 'نامشخص'
  }
})

const accountStatus = computed(() => {
  if (!props.user) return 'فعال'
  const isEmailVerified = props.user.email_verified_at
  const isPhoneVerified = props.user.phone_verified_at

  if (isEmailVerified || isPhoneVerified) return 'تایید شده'
  return 'در انتظار تایید'
})

const getInitials = (name: string) => {
  if (!name) return 'ک'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(50%, -50%);
}

.welcome-content {
  flex: 1;
  z-index: 1;
}

.welcome-text h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.welcome-text p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.welcome-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
}

.stat-value {
  font-weight: 600;
  font-size: 1rem;
}

.stat-value.verified {
  color: #10b981;
  font-weight: 700;
}

.welcome-visual {
  z-index: 1;
}

.user-avatar-large {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  backdrop-filter: blur(10px);
}

@media (max-width: 768px) {
  .welcome-card {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
  }

  .welcome-text h1 {
    font-size: 1.5rem;
  }

  .welcome-stats {
    justify-content: center;
    flex-wrap: wrap;
  }

  .user-avatar-large {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
}
</style>
