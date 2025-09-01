<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>سیستم مدیریت پیشرفته</h1>
        <p>مدیریت کاربران و احراز هویت با تکنولوژی‌های مدرن</p>

        <div class="hero-actions">
          <NuxtLink
            :to="isLoggedIn ? '/dashboard' : '/auth'"
            class="btn btn-primary"
          >
            {{ isLoggedIn ? 'ورود به داشبورد' : 'شروع کنید' }}
          </NuxtLink>
        </div>
      </div>

      <div class="hero-visual">
        <div class="hero-card">
          <div class="card-header">
            <div class="card-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
          </div>
          <div class="card-body">
            <div class="demo-user">
              <div class="demo-avatar">👤</div>
              <div class="demo-info">
                <div class="demo-name">{{ displayName }}</div>
                <div :class="['demo-status', isLoggedIn ? 'online' : 'offline']">
                  {{ isLoggedIn ? 'آنلاین' : 'آفلاین' }}
                </div>
              </div>
            </div>
            <div class="demo-stats">
              <div class="demo-stat">
                <span class="stat-label">کاربران</span>
                <span class="stat-value">1.2K</span>
              </div>
              <div class="demo-stat">
                <span class="stat-label">فعال</span>
                <span class="stat-value">324</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="features-header">
        <h2>ویژگی‌های سیستم</h2>
        <p>امکانات پیشرفته برای مدیریت بهتر</p>
      </div>

      <div class="features-grid">
        <div v-for="feature in features" :key="feature.title" class="feature-card">
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="stats-grid">
        <div v-for="stat in statsData" :key="stat.label" class="stat-item">
          <div class="stat-number">{{ stat.number }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { user, isLoggedIn, restoreAuth } = useAuth()

const displayName = computed(() => {
  if (!user) return 'کاربر مهمان'
  if (user?.name) return user.name
  if (user?.email) return user.email.split('@')[0]
  if (user?.phone) return user.phone
  return 'کاربر مهمان'
})

const features = [
  {
    title: 'احراز هویت امن',
    description: 'سیستم احراز هویت دو مرحله‌ای با پشتیبانی از رمز عبور و OTP',
    icon: '🔐'
  },
  {
    title: 'مدیریت کاربران',
    description: 'مدیریت کامل کاربران با امکان ویرایش و کنترل دسترسی',
    icon: '👥'
  },
  {
    title: 'داشبورد تحلیلی',
    description: 'نمایش آمار و اطلاعات مهم در یک نگاه',
    icon: '📊'
  },
  {
    title: 'عملکرد بالا',
    description: 'طراحی بهینه برای سرعت و پایداری بالا',
    icon: '⚡'
  }
]

const statsData = [
  { number: '1.2K+', label: 'کاربران فعال' },
  { number: '99.9%', label: 'آپتایم' },
  { number: '24/7', label: 'پشتیبانی' },
  { number: '100%', label: 'امنیت' }
]

onMounted(() => restoreAuth())
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, var(--primary), #764ba2);
  color: white;
  padding: 5rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-content p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.hero-visual {
  display: flex;
  justify-content: center;
}

.hero-card {
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 300px;
  overflow: hidden;
}

.card-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
}

.card-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: var(--success); }

.card-body {
  padding: 1.5rem 1.25rem;
  color: var(--dark);
}

.demo-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.demo-avatar {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, var(--primary), #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.demo-name {
  font-weight: 600;
  color: var(--dark);
}

.demo-status {
  font-size: 0.9rem;
  font-weight: 500;
}

.demo-status.online { color: var(--success); }
.demo-status.offline { color: var(--gray); }

.demo-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.demo-stat {
  text-align: center;
  padding: 0.75rem;
  background: var(--light);
  border-radius: var(--radius);
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: var(--gray);
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--dark);
}

.features {
  padding: 5rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.features-header {
  text-align: center;
  margin-bottom: 3rem;
}

.features-header h2 {
  font-size: 2.5rem;
  color: var(--dark);
  margin-bottom: 1rem;
}

.features-header p {
  font-size: 1.2rem;
  color: var(--gray);
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  border-radius: var(--radius);
  padding: 2rem 1.5rem;
  box-shadow: var(--shadow);
  text-align: center;
  transition: var(--transition);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-md);
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 1rem;
  background: linear-gradient(135deg, var(--primary), #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 1.5rem;
}

.feature-card h3 {
  font-size: 1.3rem;
  color: var(--dark);
  margin-bottom: 1rem;
}

.feature-card p {
  color: var(--gray);
  line-height: 1.6;
  margin: 0;
}

.stats {
  background: var(--dark);
  color: white;
  padding: 4rem 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--primary), #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-item .stat-label {
  font-size: 1.1rem;
  opacity: 0.8;
  color: white;
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding: 4rem 1.5rem;
    text-align: center;
  }

  .hero-content h1 {
    font-size: 2.2rem;
  }

  .hero-content p {
    font-size: 1.1rem;
  }

  .features {
    padding: 4rem 1rem;
  }

  .features-header h2 {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .stats {
    padding: 3rem 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .stat-number {
    font-size: 2.2rem;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 1.8rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
