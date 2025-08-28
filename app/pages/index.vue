<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="dashboard-title">داشبورد مدیریت</h1>
          <p class="dashboard-subtitle">خلاصه‌ای از وضعیت سیستم شما</p>
        </div>
        <div class="header-right">
          <div class="user-card">
            <div class="user-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="user-details">
              <span class="user-name">{{ displayName }}</span>
              <span class="user-role">{{ userRole }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <!-- Welcome Section -->
      <section class="welcome-section" v-if="user">
        <div class="welcome-card">
          <div class="welcome-content">
            <h2>خوش آمدید، {{ user.name || 'کاربر عزیز' }}! 👋</h2>
            <p>به داشبورد مدیریت خود خوش آمدید</p>
          </div>
          <div class="auth-info">
            <div class="auth-badge new-system">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
              </svg>
              سیستم جدید
            </div>
          </div>
        </div>
      </section>

      <!-- Legacy Welcome -->
      <section class="welcome-section" v-else>
        <div class="welcome-card legacy">
          <div class="welcome-content">
            <h2>خوش آمدید، {{ displayName }}! 👋</h2>
            <p>شما با سیستم legacy وارد شده‌اید</p>
          </div>
          <div class="auth-info">
            <div class="auth-badge legacy-system">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              سیستم قدیمی
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Cards -->
      <section class="stats-section">
        <div class="stat-card">
          <div class="stat-icon users">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3>کاربران فعال</h3>
            <p class="stat-value">1,247</p>
            <p class="stat-change positive">↗ 12% افزایش</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon revenue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3>درآمد ماهانه</h3>
            <p class="stat-value">45.2M</p>
            <p class="stat-change positive">↗ 8% افزایش</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon orders">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3>سفارشات جدید</h3>
            <p class="stat-value">189</p>
            <p class="stat-change negative">↘ 3% کاهش</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon growth">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          </div>
          <div class="stat-content">
            <h3>رشد فروش</h3>
            <p class="stat-value">24%</p>
            <p class="stat-change positive">↗ نسبت به ماه قبل</p>
          </div>
        </div>
      </section>

      <!-- User Info Section (New System) -->
      <section class="user-info-section" v-if="user">
        <div class="info-card">
          <h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            اطلاعات حساب کاربری
          </h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">نام:</span>
              <span class="info-value">{{ user.name || 'تعریف نشده' }}</span>
            </div>
            <div class="info-item" v-if="user.email">
              <span class="info-label">ایمیل:</span>
              <span class="info-value">{{ user.email }}</span>
              <span v-if="user.email_verified_at" class="verified-badge">تایید شده ✓</span>
            </div>
            <div class="info-item" v-if="user.phone">
              <span class="info-label">تلفن:</span>
              <span class="info-value">{{ user.phone }}</span>
              <span v-if="user.phone_verified_at" class="verified-badge">تایید شده ✓</span>
            </div>
            <div class="info-item">
              <span class="info-label">نوع احراز هویت:</span>
              <span class="info-value">{{ user.preferred_method === 'otp' ? 'کد یکبار مصرف' : 'رمز عبور' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">تاریخ عضویت:</span>
              <span class="info-value">{{ formatDate(user.created_at) }}</span>
            </div>
            <div class="info-item" v-if="user.last_login_at">
              <span class="info-label">آخرین ورود:</span>
              <span class="info-value">{{ formatDate(user.last_login_at) }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="actions-section">
        <h2>دسترسی سریع</h2>
        <div class="actions-grid">
          <button class="action-card" @click="showComingSoon">
            <div class="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
            </div>
            <h3>افزودن کاربر</h3>
            <p>ثبت کاربر جدید در سیستم</p>
          </button>

          <button class="action-card" @click="showComingSoon">
            <div class="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3>گزارش جدید</h3>
            <p>تولید گزارش آماری</p>
          </button>

          <NuxtLink to="/dashboard/gallery/books" class="action-card link-card">
            <div class="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <h3>گالری تصاویر</h3>
            <p>مدیریت تصاویر کتاب‌ها</p>
          </NuxtLink>

          <button class="action-card" @click="showProfileSettings">
            <div class="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            <h3>تنظیمات</h3>
            <p>مدیریت پروفایل و تنظیمات</p>
          </button>
        </div>
      </section>

      <!-- Navigation Links -->
      <section class="navigation-section">
        <div class="nav-cards">
          <NuxtLink to="/" class="nav-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            صفحه اصلی
          </NuxtLink>

          <button @click="handleLogout" class="nav-card logout-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            خروج از حساب
          </button>
        </div>
      </section>
    </main>

    <!-- Coming Soon Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
          </svg>
        </div>
        <h3>به زودی...</h3>
        <p>این قابلیت در حال توسعه است و به زودی در دسترس قرار می‌گیرد.</p>
        <button @click="closeModal" class="modal-btn">متوجه شدم</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

// Use Auth composable
const { user, isLoggedIn, logout, initialize } = useAuth()

// Apply auth middleware
definePageMeta({
  middleware: 'auth'
})

// Modal state
const showModal = ref(false)

// Legacy support
const legacyUsername = ref('')

// Computed properties
const displayName = computed(() => {
  if (user.value?.name && user.value.name !== 'کاربر') {
    return user.value.name
  }
  if (user.value?.email) {
    return user.value.email.split('@')[0]
  }
  if (user.value?.phone) {
    return user.value.phone
  }
  return legacyUsername.value || 'کاربر عزیز'
})

const userRole = computed(() => {
  if (!user.value) return 'مدیر سیستم (Legacy)'

  if (user.value.email && user.value.phone) {
    return 'کاربر کامل'
  } else if (user.value.email) {
    return 'کاربر ایمیل'
  } else if (user.value.phone) {
    return 'کاربر موبایل'
  }
  return 'کاربر جدید'
})

// Methods
const handleLogout = async () => {
  if (user.value) {
    // New auth system logout
    await logout()
  } else {
    // Legacy logout
    if (process.client) {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('username')
    }
  }

  // Redirect to home page
  await navigateTo('/')
}

const formatDate = (dateString) => {
  if (!dateString) return 'نامشخص'
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (e) {
    return 'نامشخص'
  }
}

const showComingSoon = () => {
  showModal.value = true
}

const showProfileSettings = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// Initialize
onMounted(() => {
  initialize()

  if (process.client) {
    // Check for legacy login
    const storedUsername = localStorage.getItem('username')
    if (storedUsername && !user.value) {
      legacyUsername.value = storedUsername
    }
  }
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
}

.dashboard-header {
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 30px 30px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 8px;
  font-weight: 700;
}

.dashboard-subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.2;
}

.user-role {
  font-size: 0.85rem;
  opacity: 0.9;
  line-height: 1;
}

.dashboard-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 30px;
}

.welcome-section {
  margin-bottom: 40px;
}

.welcome-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.welcome-card.legacy {
  border-color: rgba(251, 146, 60, 0.3);
  background: linear-gradient(135deg, #fef3c7 0%, #fff 100%);
}

.welcome-content h2 {
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.welcome-content p {
  color: #6b7280;
  margin: 0;
}

.auth-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.auth-badge.new-system {
  background: #d1fae5;
  color: #065f46;
}

.auth-badge.legacy-system {
  background: #fef3c7;
  color: #92400e;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  border: 1px solid #f3f4f6;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.users {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.stat-icon.orders {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.stat-icon.growth {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.stat-content h3 {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-change {
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.user-info-section {
  margin-bottom: 40px;
}

.info-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.info-card h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1a1a1a;
  font-size: 1.3rem;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f3f4f6;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.info-label {
  font-weight: 600;
  color: #374151;
  min-width: 100px;
}

.info-value {
  color: #1a1a1a;
  flex: 1;
}

.verified-badge {
  background: #d1fae5;
  color: #065f46;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.actions-section {
  margin-bottom: 40px;
}

.actions-section h2 {
  font-size: 1.4rem;
  color: #1a1a1a;
  margin-bottom: 24px;
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border: 2px solid #f3f4f6;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.action-card:hover {
  border-color: #667eea;
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.15);
}

.link-card {
  display: block;
}

.action-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
}

.action-card h3 {
  font-size: 1.1rem;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.action-card p {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.navigation-section {
  margin-top: 50px;
}

.nav-cards {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 15px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-card:hover {
  background: #667eea;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.logout-card {
  border-color: #ef4444;
  color: #ef4444;
  cursor: pointer;
  background: none;
}

.logout-card:hover {
  background: #ef4444;
  color: white;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-icon {
  color: #667eea;
  margin-bottom: 20px;
}

.modal-content h3 {
  color: #1a1a1a;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.modal-content p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 30px;
}

.modal-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .header-content {
    padding: 25px;
  }

  .dashboard-main {
    padding: 30px 25px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .welcome-card {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .stats-section {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }

  .stat-card {
    padding: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .nav-cards {
    flex-direction: column;
    align-items: center;
  }

  .nav-card {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .dashboard-main {
    padding: 20px 15px;
  }

  .user-card {
    padding: 16px;
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .modal-content {
    padding: 30px 20px;
  }
}
</style>
