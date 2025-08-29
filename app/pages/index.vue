<!-- pages/index.vue -->
<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>سیستم مدیریت پیشرفته</h1>
        <p>مدیریت کاربران و احراز هویت با تکنولوژی‌های مدرن</p>

        <div class="hero-actions">
          <NuxtLink v-if="!isLoggedIn" to="/auth" class="btn btn-primary">
            شروع کنید
          </NuxtLink>
          <NuxtLink v-else to="/dashboard" class="btn btn-primary">
            ورود به داشبورد
          </NuxtLink>
        </div>
      </div>

      <div class="hero-visual">
        <div class="hero-card">
          <div class="card-header">
            <div class="card-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="card-body">
            <div class="demo-user">
              <div class="demo-avatar">👤</div>
              <div class="demo-info">
                <div class="demo-name">{{ displayName }}</div>
                <div class="demo-status">{{ isLoggedIn ? 'آنلاین' : 'آفلاین' }}</div>
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
        <div class="feature-card">
          <div class="feature-icon">🔐</div>
          <h3>احراز هویت امن</h3>
          <p>سیستم احراز هویت دو مرحله‌ای با پشتیبانی از رمز عبور و OTP</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h3>مدیریت کاربران</h3>
          <p>مدیریت کامل کاربران با امکان ویرایش، فعال/غیرفعال کردن</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>داشبورد تحلیلی</h3>
          <p>نمایش آمار و اطلاعات مهم در یک نگاه</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>سرعت بالا</h3>
          <p>طراحی بهینه برای عملکرد سریع و پایدار</p>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">1.2K+</div>
          <div class="stat-label">کاربران فعال</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">99.9%</div>
          <div class="stat-label">آپتایم</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">24/7</div>
          <div class="stat-label">پشتیبانی</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">100%</div>
          <div class="stat-label">امنیت</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { user, isLoggedIn, init } = useAuth()

const displayName = computed(() => {
  if (user.value?.name) return user.value.name
  if (user.value?.email) return user.value.email.split('@')[0]
  if (user.value?.phone) return user.value.phone
  return 'کاربر مهمان'
})

onMounted(() => init())
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, var(--primary), #764ba2);
  color: white;
  padding: 80px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 16px;
  line-height: 1.2;
}

.hero-content p {
  font-size: 1.3rem;
  margin-bottom: 32px;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 300px;
  overflow: hidden;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
}

.card-dots {
  display: flex;
  gap: 6px;
}

.card-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--light);
}

.card-dots span:nth-child(1) { background: #ef4444; }
.card-dots span:nth-child(2) { background: #f59e0b; }
.card-dots span:nth-child(3) { background: #10b981; }

.card-body {
  padding: 24px 20px;
  color: var(--dark);
}

.demo-user {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.demo-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
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
  color: var(--success);
  font-weight: 500;
}

.demo-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.demo-stat {
  text-align: center;
  padding: 12px;
  background: var(--light);
  border-radius: 8px;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: var(--gray);
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--dark);
}

.features {
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.features-header {
  text-align: center;
  margin-bottom: 60px;
}

.features-header h2 {
  font-size: 2.5rem;
  color: var(--dark);
  margin-bottom: 16px;
}

.features-header p {
  font-size: 1.2rem;
  color: var(--gray);
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.feature-card {
  background: white;
  border-radius: var(--radius);
  padding: 32px 24px;
  box-shadow: var(--shadow);
  text-align: center;
  transition: var(--transition);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.15);
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary), #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 24px;
}

.feature-card h3 {
  font-size: 1.3rem;
  color: var(--dark);
  margin-bottom: 16px;
}

.feature-card p {
  color: var(--gray);
  line-height: 1.6;
  margin: 0;
}

.stats {
  background: var(--dark);
  color: white;
  padding: 60px 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 8px;
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
    gap: 40px;
    padding: 60px 24px;
    text-align: center;
  }

  .hero-content h1 {
    font-size: 2.2rem;
  }

  .hero-content p {
    font-size: 1.1rem;
  }

  .hero-actions {
    justify-content: center;
  }

  .features {
    padding: 60px 20px;
  }

  .features-header h2 {
    font-size: 2rem;
  }

  .features-header p {
    font-size: 1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .feature-card {
    padding: 24px 20px;
  }

  .feature-icon {
    width: 64px;
    height: 64px;
    font-size: 2rem;
  }

  .stats {
    padding: 50px 20px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .stat-number {
    font-size: 2.2rem;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 1.8rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
