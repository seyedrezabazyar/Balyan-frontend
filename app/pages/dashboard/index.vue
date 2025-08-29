<!-- pages/dashboard/index.vue -->
<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>داشبورد</h1>
      <p>خلاصه‌ای از وضعیت سیستم</p>
    </div>

    <!-- Welcome Section -->
    <div class="welcome-card">
      <div class="welcome-content">
        <h2>خوش آمدید، {{ displayName }}! 👋</h2>
        <p>{{ welcomeMessage }}</p>
      </div>
      <div class="auth-badge" :class="{ 'new-system': user, 'legacy': !user }">
        {{ user ? 'سیستم جدید' : 'سیستم قدیمی' }}
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon users">👥</div>
        <div class="stat-content">
          <h3>کاربران فعال</h3>
          <p class="stat-value">1,247</p>
          <p class="stat-change positive">↗ 12% افزایش</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon revenue">💰</div>
        <div class="stat-content">
          <h3>درآمد ماهانه</h3>
          <p class="stat-value">45.2M</p>
          <p class="stat-change positive">↗ 8% افزایش</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orders">📦</div>
        <div class="stat-content">
          <h3>سفارشات جدید</h3>
          <p class="stat-value">189</p>
          <p class="stat-change negative">↘ 3% کاهش</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon growth">📈</div>
        <div class="stat-content">
          <h3>رشد فروش</h3>
          <p class="stat-value">24%</p>
          <p class="stat-change positive">↗ نسبت به ماه قبل</p>
        </div>
      </div>
    </div>

    <!-- User Info -->
    <div v-if="user" class="info-card">
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
        <button @click="showModal = true" class="action-card">
          <div class="action-icon">👤</div>
          <h3>افزودن کاربر</h3>
        </button>

        <button @click="showModal = true" class="action-card">
          <div class="action-icon">📊</div>
          <h3>گزارش جدید</h3>
        </button>

        <NuxtLink to="/dashboard/gallery/books" class="action-card">
          <div class="action-icon">🖼️</div>
          <h3>گالری تصاویر</h3>
        </NuxtLink>

        <button @click="showModal = true" class="action-card">
          <div class="action-icon">⚙️</div>
          <h3>تنظیمات</h3>
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal" @click.stop>
        <div class="modal-icon">⏰</div>
        <h3>به زودی...</h3>
        <p>این قابلیت در حال توسعه است</p>
        <button @click="showModal = false" class="btn-primary">متوجه شدم</button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });

const { user, logout, initialize } = useAuth();
const showModal = ref(false);

const displayName = computed(() => {
  if (user.value?.name && user.value.name !== 'کاربر') return user.value.name;
  if (user.value?.email) return user.value.email.split('@')[0];
  if (user.value?.phone) return user.value.phone;
  return process.client && localStorage.getItem('username') || 'کاربر عزیز';
});

const welcomeMessage = computed(() => {
  if (user.value) return 'به داشبورد جدید خود خوش آمدید';
  return 'شما با سیستم قدیمی وارد شده‌اید';
});

const formatDate = (dateString) => {
  if (!dateString) return 'نامشخص';
  try {
    return new Intl.DateTimeFormat('fa-IR').format(new Date(dateString));
  } catch {
    return 'نامشخص';
  }
};

onMounted(() => initialize());
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  color: #6b7280;
  margin: 0;
}

.welcome-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.welcome-content h2 {
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.welcome-content p {
  color: #6b7280;
  margin: 0;
}

.auth-badge {
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.auth-badge.new-system {
  background: #d1fae5;
  color: #065f46;
}

.auth-badge.legacy {
  background: #fef3c7;
  color: #92400e;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.stat-icon.users { background: linear-gradient(135deg, #667eea, #764ba2); }
.stat-icon.revenue { background: linear-gradient(135deg, #10b981, #059669); }
.stat-icon.orders { background: linear-gradient(135deg, #f59e0b, #d97706); }
.stat-icon.growth { background: linear-gradient(135deg, #ef4444, #dc2626); }

.stat-content h3 {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

.stat-change.positive { color: #10b981; }
.stat-change.negative { color: #ef4444; }

.info-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.info-card h2 {
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.info-item .label {
  font-weight: 600;
  color: #374151;
  min-width: 70px;
}

.verified {
  background: #d1fae5;
  color: #065f46;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
}

.actions-section {
  margin-bottom: 2rem;
}

.actions-section h2 {
  color: #1a1a1a;
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-card {
  background: white;
  border: 2px solid #f3f4f6;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.action-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.action-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  color: #1a1a1a;
  margin: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  max-width: 300px;
  width: 90%;
}

.modal-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.modal h3 {
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.modal p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .dashboard { padding: 1rem; }
  .welcome-card {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  .stats-grid { grid-template-columns: 1fr; }
  .info-grid { grid-template-columns: 1fr; }
  .actions-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .actions-grid { grid-template-columns: 1fr; }
}
</style>
