<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>داشبورد</h1>
      <div class="user-info">
        <span>خوش آمدید، {{ username }}</span>
        <button @click="handleLogout" class="logout-btn">خروج</button>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="welcome-card">
        <h2>خوش آمدید به پنل مدیریت</h2>
        <p>این صفحه داشبورد شماست. از اینجا می‌تونید به تمام بخش‌های سایت دسترسی داشته باشید.</p>
      </div>

      <div class="cards-grid">
        <div class="card">
          <h3>آمار کلی</h3>
          <div class="stat-number">1,234</div>
          <p>تعداد کل کاربران</p>
        </div>

        <div class="card">
          <h3>فروش امروز</h3>
          <div class="stat-number">56</div>
          <p>سفارش جدید</p>
        </div>

        <div class="card">
          <h3>درآمد</h3>
          <div class="stat-number">12,500,000</div>
          <p>تومان</p>
        </div>

        <div class="card">
          <h3>بازدید</h3>
          <div class="stat-number">8,945</div>
          <p>بازدید امروز</p>
        </div>
      </div>

      <div class="navigation-card">
        <h3>دسترسی سریع</h3>
        <div class="nav-buttons">
          <NuxtLink to="/" class="nav-btn">صفحه اصلی</NuxtLink>
          <button class="nav-btn">کاربران</button>
          <button class="nav-btn">محصولات</button>
          <button class="nav-btn">گزارشات</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// اعمال middleware احراز هویت
definePageMeta({
  middleware: 'auth'
})

const username = ref('')

// دریافت نام کاربری از localStorage
onMounted(() => {
  if (typeof window !== 'undefined') {
    username.value = localStorage.getItem('username') || 'کاربر'
  }
})

// تابع خروج از سیستم
const handleLogout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
  }
  navigateTo('/login')
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px 0;
  border-bottom: 2px solid #eee;
}

.dashboard-header h1 {
  color: #333;
  font-size: 28px;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info span {
  color: #666;
  font-size: 16px;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #c0392b;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.welcome-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.welcome-card h2 {
  color: #333;
  margin-bottom: 15px;
}

.welcome-card p {
  color: #666;
  line-height: 1.6;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

.card h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10px;
}

.card p {
  color: #666;
  margin: 0;
}

.navigation-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navigation-card h3 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.nav-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.nav-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s;
  display: inline-block;
}

.nav-btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .nav-buttons {
    flex-direction: column;
  }
}
</style>
