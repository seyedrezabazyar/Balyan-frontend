<!-- pages/dashboard/admin-stats.vue -->
<template>
  <div v-if="isAdmin" class="admin-stats">
    <div class="section-header">
      <h2>آمار مدیریتی</h2>
      <p>اطلاعات خلاصه سیستم</p>
    </div>

    <div class="stats-grid">
      <NuxtLink to="/dashboard/users" class="stat-card clickable">
        <div class="stat-icon users">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="stat-content">
          <h3>مدیریت کاربران</h3>
          <p class="stat-value">{{ userStats.total.toLocaleString() || '-' }}</p>
          <p class="stat-label">کل کاربران</p>
        </div>
        <div class="stat-arrow">←</div>
      </NuxtLink>

      <div class="stat-card">
        <div class="stat-icon books">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <h3>کتاب‌ها</h3>
          <p class="stat-value">{{ bookStats.total.toLocaleString() || '-' }}</p>
          <p class="stat-label">کل کتاب‌ها</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon categories">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <h3>دسته‌بندی‌ها</h3>
          <p class="stat-value">{{ categoryStats.total.toLocaleString() || '-' }}</p>
          <p class="stat-label">کل دسته‌ها</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon system">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
            <polyline points="9 12 11 14 16 9"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <h3>وضعیت سیستم</h3>
          <p class="stat-value">سالم</p>
          <p class="stat-label">آپتایم ۹۹.۹%</p>
        </div>
      </div>
    </div>

    <div class="quick-actions-grid">
      <button @click="navigateTo('/dashboard/users')" class="quick-action">
        <div class="action-icon">👥</div>
        <span>مدیریت کاربران</span>
      </button>

      <button @click="navigateTo('/dashboard/books')" class="quick-action">
        <div class="action-icon">📚</div>
        <span>مدیریت کتاب‌ها</span>
      </button>

      <button @click="navigateTo('/dashboard/categories')" class="quick-action">
        <div class="action-icon">🏷️</div>
        <span>دسته‌بندی‌ها</span>
      </button>

      <button @click="navigateTo('/dashboard/gallery/books')" class="quick-action">
        <div class="action-icon">🖼️</div>
        <span>گالری تصاویر</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'admin'], layout: 'dashboard' })
const { isAdmin } = useAuth()

// Mock stats - در واقعیت باید از API بیاید
const userStats = reactive({ total: 0 })
const bookStats = reactive({ total: 0 })
const categoryStats = reactive({ total: 0 })

// در صورت نیاز می‌توانید اینها را از API بگیرید
onMounted(() => {
  if (isAdmin.value) {
    // Load stats from API
    userStats.total = 1247
    bookStats.total = 3842
    categoryStats.total = 156
  }
})
</script>

<style scoped>
.admin-stats {
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
}

.section-header {
  margin-bottom: 2rem;
  text-align: center;
}

.section-header h2 {
  color: var(--dark);
  margin-bottom: 0.5rem;
}

.section-header p {
  color: var(--gray);
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card.clickable {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-icon.users {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
}

.stat-icon.books {
  background: linear-gradient(135deg, var(--success), #059669);
}

.stat-icon.categories {
  background: linear-gradient(135deg, var(--warning), #d97706);
}

.stat-icon.system {
  background: linear-gradient(135deg, var(--info), #2563eb);
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 1rem;
  color: var(--dark);
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark);
  margin: 0 0 0.25rem 0;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--gray);
  margin: 0;
}

.stat-arrow {
  color: var(--primary);
  font-size: 1.5rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.stat-card:hover .stat-arrow {
  opacity: 1;
  transform: translateX(0);
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--gray-50);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: var(--transition);
  cursor: pointer;
}

.quick-action:hover {
  background: var(--primary-light);
  border-color: var(--primary);
  transform: translateY(-2px);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.quick-action span {
  font-weight: 600;
  color: var(--dark);
  text-align: center;
}

@media (max-width: 768px) {
  .admin-stats {
    padding: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-card {
    padding: 1.25rem;
  }

  .stat-value {
    font-size: 1.75rem;
  }

  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-action {
    padding: 1.25rem;
  }

  .action-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
