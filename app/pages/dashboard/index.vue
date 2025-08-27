<!-- pages/dashboard/index.vue -->
<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="dashboard-title">داشبورد</h1>
          <p class="dashboard-subtitle">خلاصه‌ای از وضعیت کسب و کار شما</p>
        </div>
        <div class="header-right">
          <div class="user-info">
            <div class="user-avatar">👤</div>
            <div class="user-details">
              <span class="user-name">{{ displayName }}</span>
              <span class="user-role">{{ userRole }}</span>
            </div>
          </div>
          <button @click="handleLogout" class="logout-btn">خروج</button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <!-- Stats Cards -->
      <section class="stats-section">
        <div class="stat-card">
          <h3>کاربران فعال</h3>
          <p class="stat-value">1,234</p>
          <p class="stat-change">12% افزایش</p>
        </div>
        <div class="stat-card">
          <h3>درآمد امروز</h3>
          <p class="stat-value">45.2M</p>
          <p class="stat-change">8% افزایش</p>
        </div>
        <div class="stat-card">
          <h3>سفارشات جدید</h3>
          <p class="stat-value">89</p>
          <p class="stat-change">3% کاهش</p>
        </div>
      </section>

      <!-- Auth System Info -->
      <section class="auth-info-section" v-if="user">
        <div class="auth-info-card">
          <h2>اطلاعات کاربری (سیستم جدید)</h2>
          <div class="auth-info-content">
            <p><strong>نام:</strong> {{ user.name || 'تعریف نشده' }}</p>
            <p v-if="user.email"><strong>ایمیل:</strong> {{ user.email }}</p>
            <p v-if="user.phone"><strong>تلفن:</strong> {{ user.phone }}</p>
            <p><strong>تاریخ عضویت:</strong> {{ formatDate(user.created_at) }}</p>
          </div>
        </div>
      </section>

      <!-- Legacy Info -->
      <section class="auth-info-section" v-else>
        <div class="auth-info-card">
          <h2>اطلاعات کاربری (Legacy)</h2>
          <div class="auth-info-content">
            <p><strong>نام کاربری:</strong> {{ displayName }}</p>
            <p><strong>نوع ورود:</strong> سیستم قدیمی</p>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions">
        <h2>دسترسی سریع</h2>
        <div class="actions-grid">
          <button class="action-btn">افزودن کاربر</button>
          <button class="action-btn">گزارش جدید</button>
          <NuxtLink to="/dashboard/gallery/books" class="action-btn">گالری تصاویر</NuxtLink>
          <button class="action-btn">تنظیمات</button>
        </div>
      </section>

      <!-- Navigation -->
      <section class="navigation-section">
        <NuxtLink to="/" class="nav-link">بازگشت به صفحه اصلی</NuxtLink>
      </section>
    </main>
  </div>
</template>

<script setup>
// Use Auth composable
const { user, logout, isLoggedIn, initialize } = useAuth();

// Apply auth middleware
definePageMeta({
  middleware: 'auth'
});

// Legacy support
const legacyUsername = ref('');

const displayName = computed(() => {
  if (user.value?.name) return user.value.name;
  if (user.value?.email) return user.value.email;
  if (user.value?.phone) return user.value.phone;
  return legacyUsername.value || 'کاربر عزیز';
});

const userRole = computed(() => {
  return user.value ? 'کاربر سیستم جدید' : 'مدیر سیستم (Legacy)';
});

const handleLogout = async () => {
  if (user.value) {
    // New auth system logout
    await logout();
  } else {
    // Legacy logout
    if (process.client) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
    }
  }

  // Redirect to login page
  navigateTo('/login');
};

const formatDate = (dateString) => {
  if (!dateString) return 'نامشخص';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR').format(date);
  } catch (e) {
    return 'نامشخص';
  }
};

// Initialize
onMounted(() => {
  initialize();

  if (process.client) {
    // Check for legacy login
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && !user.value) {
      legacyUsername.value = storedUsername;
    }
  }
});
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: #f0f2f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
}

.dashboard-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-title {
  font-size: 1.8rem;
  color: #1a1a1a;
  margin-bottom: 5px;
}

.dashboard-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.95rem;
}

.user-role {
  font-size: 0.85rem;
  color: #6b7280;
}

.logout-btn {
  padding: 10px 20px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #fecaca;
  transform: translateY(-2px);
}

.dashboard-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 0.85rem;
  font-weight: 500;
  color: #10b981;
}

.auth-info-section {
  margin-bottom: 40px;
}

.auth-info-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.auth-info-card h2 {
  color: #1a1a1a;
  font-size: 1.3rem;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.auth-info-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.auth-info-content p {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 0;
}

.quick-actions {
  margin-bottom: 40px;
}

.quick-actions h2 {
  font-size: 1.3rem;
  color: #1a1a1a;
  margin-bottom: 20px;
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.action-btn {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  color: #4b5563;
  font-weight: 500;
  text-decoration: none;
  display: block;
  text-align: center;
}

.action-btn:hover {
  border-color: #667eea;
  background: #f3f4ff;
  transform: translateY(-3px);
  color: #4b5563;
}

.navigation-section {
  text-align: center;
  padding-top: 20px;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 15px;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
