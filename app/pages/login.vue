<template>
  <div class="home-container">
    <div class="hero-section">
      <h1>به پروژه Nuxt 4 خوش آمدید!</h1>
      <p>این یک پروژه ساده با قابلیت احراز هویت است</p>

      <div class="action-buttons">
        <NuxtLink to="/dashboard" class="btn btn-primary">
          رفتن به داشبورد
        </NuxtLink>
        <NuxtLink to="/login" class="btn btn-secondary">
          ورود به سیستم
        </NuxtLink>
      </div>
    </div>

    <div class="features-section">
      <h2>امکانات</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🔐</div>
          <h3>احراز هویت</h3>
          <p>سیستم ساده لاگین و خروج</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>داشبورد</h3>
          <p>پنل مدیریت با آمار و اطلاعات</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>ریسپانسیو</h3>
          <p>سازگار با تمام دستگاه‌ها</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>سریع و ساده</h3>
          <p>ساخته شده با Nuxt 4</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
  margin-bottom: 50px;
}

.hero-section h1 {
  font-size: 48px;
  margin-bottom: 20px;
  font-weight: bold;
}

.hero-section p {
  font-size: 20px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 15px 30px;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  transition: transform 0.2s, box-shadow 0.2s;
  display: inline-block;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.features-section {
  text-align: center;
}

.features-section h2 {
  font-size: 36px;
  margin-bottom: 40px;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  padding: 40px 20px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 32px;
  }

  .hero-section p {
    font-size: 18px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 200px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
