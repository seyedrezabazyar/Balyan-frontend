<!-- pages/dashboard.vue -->
<template>
  <div class="dashboard">
    <div class="welcome-section">
      <div class="welcome-header">
        <div>
          <h1>خوش آمدید، {{ displayName }}! 👋</h1>
          <p>{{ welcomeMessage }}</p>
        </div>
        <button @click="handleLogout" class="btn-logout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          خروج از سیستم
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>کاربران فعال</h3>
          <p class="stat-value">1,247</p>
          <span class="stat-change positive">↗ 12% افزایش</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3>درآمد ماهانه</h3>
          <p class="stat-value">45.2M</p>
          <span class="stat-change positive">↗ 8% افزایش</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <h3>سفارشات جدید</h3>
          <p class="stat-value">189</p>
          <span class="stat-change negative">↘ 3% کاهش</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <h3>رشد فروش</h3>
          <p class="stat-value">24%</p>
          <span class="stat-change positive">↗ نسبت به ماه قبل</span>
        </div>
      </div>
    </div>

    <!-- User Info -->
    <div v-if="user" class="info-section">
      <h2>اطلاعات حساب کاربری</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">نام:</span>
          <span>{{ user.name || 'تعریف نشده' }}</span>
        </div>
        <div v-if="user.email" class="info-item">
          <span class="label">ایمیل:</span>
          <span>{{ user.email }}</span>
          <span v-if="user.email_verified_at" class="verified">✓</span>
        </div>
        <div v-if="user.phone" class="info-item">
          <span class="label">تلفن:</span>
          <span>{{ user.phone }}</span>
          <span v-if="user.phone_verified_at" class="verified">✓</span>
        </div>
        <div class="info-item">
          <span class="label">عضویت:</span>
          <span>{{ formatDate(user.created_at) }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="actions-section">
      <h2>دسترسی سریع</h2>
      <div class="actions-grid">
        <NuxtLink to="/users" class="action-card">
          <div class="action-icon">👥</div>
          <h3>مدیریت کاربران</h3>
          <p>مشاهده و مدیریت کاربران سیستم</p>
        </NuxtLink>

        <NuxtLink to="/dashboard/profile" class="action-card">
          <div class="action-icon">👤</div>
          <h3>ویرایش پروفایل</h3>
          <p>مدیریت اطلاعات شخصی</p>
        </NuxtLink>

        <button @click="showModal = true" class="action-card">
          <div class="action-icon">📊</div>
          <h3>گزارش جدید</h3>
          <p>تولید گزارش آماری</p>
        </button>

        <button @click="showModal = true" class="action-card">
          <div class="action-icon">⚙️</div>
          <h3>تنظیمات</h3>
          <p>مدیریت تنظیمات سیستم</p>
        </button>
      </div>
    </div>

    <!-- Coming Soon Modal -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal" @click.stop>
        <div class="modal-icon">⏰</div>
        <h3>به زودی...</h3>
        <p>این قابلیت در حال توسعه است</p>
        <button @click="showModal = false" class="btn btn-primary">متوجه شدم</button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const { user, restoreAuth, logout } = useAuth()
const { showToast } = useToast()
const showModal = ref(false)

const displayName = computed(() => {
  if (user.value?.name) return user.value.name
  if (user.value?.email) return user.value.email.split('@')[0]
  if (user.value?.phone) return user.value.phone
  return 'کاربر عزیز'
})

const welcomeMessage = computed(() => {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'صبح بخیر' : hour < 18 ? 'ظهر بخیر' : 'عصر بخیر'
  return `${greeting}! به داشبورد خود خوش آمدید`
})

const formatDate = (dateString) => {
  if (!dateString) return 'نامشخص'
  try {
    return new Intl.DateTimeFormat('fa-IR').format(new Date(dateString))
  } catch {
    return 'نامشخص'
  }
}

onMounted(() => restoreAuth())

const handleLogout = async () => {
  try {
    await logout()
    showToast('خروج با موفقیت انجام شد', 'success')
  } catch (error) {
    showToast('خطا در خروج از سیستم', 'error')
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  background: white;
  border-radius: var(--radius);
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: var(--shadow);
}

.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.welcome-header > div {
  text-align: right;
}

.welcome-section h1 {
  color: var(--dark);
  margin-bottom: 8px;
}

.welcome-section p {
  color: var(--gray);
  margin: 0;
  font-size: 1.1rem;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.btn-logout:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-logout:active {
  transform: translateY(0);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: var(--transition);
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, var(--primary), #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-content h3 {
  font-size: 0.9rem;
  color: var(--gray);
  margin: 0 0 8px 0;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--dark);
  margin: 0 0 4px 0;
}

.stat-change {
  font-size: 0.8rem;
  font-weight: 500;
}

.stat-change.positive { color: var(--success); }
.stat-change.negative { color: var(--danger); }

.info-section {
  background: white;
  border-radius: var(--radius);
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: var(--shadow);
}

.info-section h2 {
  color: var(--dark);
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--light);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--light);
  border-radius: 8px;
}

.info-item .label {
  font-weight: 600;
  color: var(--gray);
  min-width: 80px;
}

.verified {
  background: var(--success);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
}

.actions-section {
  margin-bottom: 32px;
}

.actions-section h2 {
  color: var(--dark);
  margin-bottom: 24px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.action-card {
  background: white;
  border: none;
  border-radius: var(--radius);
  padding: 24px;
  text-align: center;
  transition: var(--transition);
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow);
  display: block;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
  border-color: var(--primary);
}

.action-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, var(--primary), #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 16px;
}

.action-card h3 {
  color: var(--dark);
  margin: 0 0 8px 0;
  font-size: 1.1rem;
}

.action-card p {
  color: var(--gray);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.modal {
  background: white;
  border-radius: var(--radius);
  padding: 32px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.modal-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.modal h3 {
  color: var(--dark);
  margin-bottom: 8px;
}

.modal p {
  color: var(--gray);
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .welcome-section {
    padding: 24px;
  }

  .welcome-header {
    flex-direction: column;
    text-align: center;
  }

  .welcome-header > div {
    text-align: center;
  }

  .btn-logout {
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-card {
    padding: 20px;
  }

  .info-section {
    padding: 24px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .action-card {
    padding: 20px;
  }

  .action-icon {
    width: 56px;
    height: 56px;
    font-size: 1.8rem;
  }
}
</style>
