<!-- app/pages/dashboard/users/[id].vue -->
<template>
  <div class="user-detail-page">
    <div class="page-header">
      <div class="header-left">
        <h1>جزئیات کاربر</h1>
        <p v-if="user">{{ user.name }}</p>
      </div>
      <div class="header-actions">
        <NuxtLink to="/dashboard/users" class="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          بازگشت
        </NuxtLink>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>در حال بارگذاری...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <h3>خطا در بارگذاری</h3>
      <p>{{ error }}</p>
      <button @click="loadUser" class="btn btn-primary">تلاش مجدد</button>
    </div>

    <div v-else-if="user" class="user-content">
      <!-- User Info Card -->
      <div class="info-card">
        <div class="card-header">
          <div class="user-avatar-large">
            {{ getInitials(user.name) }}
          </div>
          <div class="user-main-info">
            <h2>{{ user.name }}</h2>
            <p class="username">@{{ user.username || 'نامشخص' }}</p>
            <div class="badges">
              <span v-if="user.is_admin" class="badge admin">مدیر سیستم</span>
              <span :class="['badge', 'status', getUserStatus(user)]">
                {{ getUserStatusText(user) }}
              </span>
            </div>
          </div>
        </div>

        <div class="card-body">
          <div class="info-grid">
            <div class="info-item">
              <label>شناسه کاربر:</label>
              <span>#{{ user.id }}</span>
            </div>
            <div class="info-item">
              <label>نام کاربری:</label>
              <span>{{ user.username || 'تعریف نشده' }}</span>
            </div>
            <div class="info-item">
              <label>ایمیل:</label>
              <div class="contact-info">
                <span>{{ user.email || 'تعریف نشده' }}</span>
                <span v-if="user.email_verified_at" class="verified">✓ تایید شده</span>
                <span v-else-if="user.email" class="unverified">تایید نشده</span>
              </div>
            </div>
            <div class="info-item">
              <label>تلفن:</label>
              <div class="contact-info">
                <span>{{ user.phone || 'تعریف نشده' }}</span>
                <span v-if="user.phone_verified_at" class="verified">✓ تایید شده</span>
                <span v-else-if="user.phone" class="unverified">تایید نشده</span>
              </div>
            </div>
            <div class="info-item">
              <label>روش احراز هویت:</label>
              <span :class="['method-badge', user.preferred_method]">
                {{ user.preferred_method === 'otp' ? 'OTP' : 'رمز عبور' }}
              </span>
            </div>
            <div class="info-item">
              <label>تاریخ عضویت:</label>
              <span>{{ formatDate(user.created_at) }}</span>
            </div>
            <div class="info-item">
              <label>آخرین ورود:</label>
              <span>{{ formatDate(user.last_login_at) || 'هرگز' }}</span>
            </div>
            <div class="info-item">
              <label>تلاش‌های ناموفق:</label>
              <span :class="{ 'text-danger': user.failed_attempts > 0 }">
                {{ user.failed_attempts || 0 }}
              </span>
            </div>
          </div>
        </div>

        <div class="card-actions" v-if="!user.is_admin">
          <button @click="verifyEmail" class="btn btn-secondary" v-if="user.email && !user.email_verified_at">
            تایید ایمیل
          </button>
          <button @click="verifyPhone" class="btn btn-secondary" v-if="user.phone && !user.phone_verified_at">
            تایید تلفن
          </button>
          <button @click="showResetPasswordModal = true" class="btn btn-warning">
            بازنشانی رمز عبور
          </button>
          <button @click="toggleStatus" :class="['btn', getUserStatus(user) === 'locked' ? 'btn-success' : 'btn-danger']">
            {{ getUserStatus(user) === 'locked' ? 'رفع قفل' : 'قفل کردن' }}
          </button>
        </div>
      </div>

      <!-- Activity History -->
      <div class="activity-card">
        <div class="card-header">
          <h3>تاریخچه فعالیت‌ها</h3>
        </div>
        <div class="card-body">
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon login">👤</div>
              <div class="activity-content">
                <p>آخرین ورود به سیستم</p>
                <span class="activity-time">{{ formatDate(user.last_login_at) || 'هرگز' }}</span>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon join">🎉</div>
              <div class="activity-content">
                <p>عضویت در سیستم</p>
                <span class="activity-time">{{ formatDate(user.created_at) }}</span>
              </div>
            </div>
            <div v-if="user.email_verified_at" class="activity-item">
              <div class="activity-icon verify">✅</div>
              <div class="activity-content">
                <p>تایید ایمیل</p>
                <span class="activity-time">{{ formatDate(user.email_verified_at) }}</span>
              </div>
            </div>
            <div v-if="user.phone_verified_at" class="activity-item">
              <div class="activity-icon verify">✅</div>
              <div class="activity-content">
                <p>تایید شماره تلفن</p>
                <span class="activity-time">{{ formatDate(user.phone_verified_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <div v-if="showResetPasswordModal" class="modal-overlay" @click="closeResetPasswordModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>بازنشانی رمز عبور</h3>
          <button @click="closeResetPasswordModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <p class="modal-description">
            رمز عبور جدید برای <strong>{{ user?.name }}</strong> را وارد کنید:
          </p>
          <form @submit.prevent="handleResetPassword">
            <div class="form-group">
              <label>رمز عبور جدید *</label>
              <input
                v-model="resetPasswordForm.password"
                type="password"
                required
                minlength="8"
                placeholder="حداقل 8 کاراکتر"
              />
            </div>
            <div class="form-group">
              <label>تأیید رمز عبور *</label>
              <input
                v-model="resetPasswordForm.confirmPassword"
                type="password"
                required
                minlength="8"
                placeholder="تکرار رمز عبور"
              />
            </div>
            <div v-if="!isValidPassword" class="form-error">
              رمزهای عبور باید مطابقت داشته باشند و حداقل 8 کاراکتر باشند
            </div>
            <div class="form-actions">
              <button type="button" @click="closeResetPasswordModal" class="btn-secondary">
                انصراف
              </button>
              <button type="submit" class="btn-primary" :disabled="isProcessing || !isValidPassword">
                {{ isProcessing ? 'در حال انجام...' : 'تغییر رمز عبور' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'dashboard'
})

const route = useRoute()
const { getUserById, verifyUserEmail, verifyUserPhone, resetUserPassword, toggleUserLock } = useUsers()

// State
const user = ref(null)
const loading = ref(true)
const error = ref('')
const isProcessing = ref(false)
const showResetPasswordModal = ref(false)

const resetPasswordForm = reactive({
  password: '',
  confirmPassword: ''
})

// Computed
const userId = computed(() => parseInt(route.params.id))

const isValidPassword = computed(() => {
  return resetPasswordForm.password === resetPasswordForm.confirmPassword &&
    resetPasswordForm.password.length >= 8
})

// Methods
const getInitials = (name) => {
  if (!name) return 'ک'
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const getUserStatus = (user) => {
  if (user?.locked_until && new Date(user.locked_until) > new Date()) return 'locked'
  return 'active'
}

const getUserStatusText = (user) => {
  const status = getUserStatus(user)
  if (status === 'locked') return 'قفل شده'
  return 'فعال'
}

const formatDate = (date) => {
  if (!date) return ''
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  } catch {
    return ''
  }
}

const loadUser = async () => {
  if (!userId.value) {
    error.value = 'شناسه کاربر معتبر نیست'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    const userData = await getUserById(userId.value)
    if (userData) {
      user.value = userData
    } else {
      error.value = 'کاربر یافت نشد'
    }
  } catch (err) {
    error.value = 'خطا در بارگذاری اطلاعات کاربر'
    console.error('Error loading user:', err)
  } finally {
    loading.value = false
  }
}

const verifyEmail = async () => {
  if (!user.value?.id || user.value.email_verified_at) return

  isProcessing.value = true
  const success = await verifyUserEmail(user.value.id)
  isProcessing.value = false

  if (success) {
    await loadUser() // Reload user data
  }
}

const verifyPhone = async () => {
  if (!user.value?.id || user.value.phone_verified_at) return

  isProcessing.value = true
  const success = await verifyUserPhone(user.value.id)
  isProcessing.value = false

  if (success) {
    await loadUser() // Reload user data
  }
}

const toggleStatus = async () => {
  if (!user.value?.id || user.value.is_admin) return

  isProcessing.value = true
  const success = await toggleUserLock(user.value.id)
  isProcessing.value = false

  if (success) {
    await loadUser() // Reload user data
  }
}

const handleResetPassword = async () => {
  if (!isValidPassword.value || !user.value?.id) return

  isProcessing.value = true
  const success = await resetUserPassword(user.value.id, resetPasswordForm.password)
  isProcessing.value = false

  if (success) {
    closeResetPasswordModal()
  }
}

const closeResetPasswordModal = () => {
  showResetPasswordModal.value = false
  resetPasswordForm.password = ''
  resetPasswordForm.confirmPassword = ''
}

// Lifecycle
onMounted(() => {
  loadUser()
})
</script>

<style scoped>
.user-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left h1 {
  margin-bottom: 0.5rem;
  color: var(--dark);
}

.header-left p {
  margin: 0;
  color: var(--gray);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--gray-100);
  color: var(--dark);
  text-decoration: none;
  border-radius: var(--radius);
  transition: var(--transition);
}

.back-btn:hover {
  background: var(--gray-200);
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: white;
  border-radius: var(--radius-lg);
  padding: 3rem 2rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--gray-200);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.user-content {
  display: grid;
  gap: 2rem;
  grid-template-columns: 2fr 1fr;
}

.info-card, .activity-card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.card-header {
  padding: 2rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;
}

.user-main-info h2 {
  margin: 0 0 0.5rem 0;
  color: var(--dark);
}

.username {
  margin: 0 0 1rem 0;
  color: var(--gray);
  font-size: 0.9rem;
}

.badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.admin {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.badge.status.active {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.badge.status.locked {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.card-body {
  padding: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  background: var(--gray-50);
  border-radius: var(--radius);
}

.info-item label {
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.verified {
  color: var(--success);
  font-size: 0.8rem;
  font-weight: 600;
}

.unverified {
  color: var(--danger);
  font-size: 0.8rem;
  font-weight: 600;
}

.text-danger {
  color: var(--danger);
  font-weight: 600;
}

.method-badge {
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.8rem;
  font-weight: 600;
}

.method-badge.password {
  background: var(--info-light);
  color: var(--info);
}

.method-badge.otp {
  background: var(--warning-light);
  color: var(--warning);
}

.card-actions {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.activity-card .card-header h3 {
  margin: 0;
  color: var(--dark);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius);
  background: var(--gray-50);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: white;
  box-shadow: var(--shadow-sm);
}

.activity-content p {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: var(--dark);
}

.activity-time {
  font-size: 0.8rem;
  color: var(--gray);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.modal-header h3 {
  margin: 0;
  color: var(--dark);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--gray);
  padding: 0.5rem;
  border-radius: var(--radius);
  transition: var(--transition);
}

.close-btn:hover {
  background: var(--gray-100);
}

.modal-body {
  padding: 1.5rem;
}

.modal-description {
  margin-bottom: 1.5rem;
  color: var(--gray-700);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--dark);
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  font-size: 1rem;
  transition: var(--transition);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-error {
  color: var(--danger);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--dark);
}

.btn-secondary:hover {
  background: var(--gray-200);
}

.btn-success {
  background: var(--success);
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-warning {
  background: var(--warning);
  color: white;
}

.btn-warning:hover {
  background: #d97706;
}

.btn-danger {
  background: var(--danger);
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .user-detail-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .user-content {
    grid-template-columns: 1fr;
  }

  .card-header {
    flex-direction: column;
    text-align: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .contact-info {
    align-items: flex-start;
  }

  .card-actions {
    flex-direction: column;
  }
}
</style>
