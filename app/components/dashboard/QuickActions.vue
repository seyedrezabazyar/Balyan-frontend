<!-- components/dashboard/QuickActions.vue -->
<template>
  <div class="quick-actions">
    <div class="section-header">
      <h2>دسترسی سریع</h2>
      <p>انجام سریع کارهای روزانه</p>
    </div>

    <div class="actions-grid">
      <NuxtLink
        v-for="action in primaryActions"
        :key="action.title"
        :to="action.route"
        class="action-card primary"
      >
        <div class="action-icon">{{ action.icon }}</div>
        <h3>{{ action.title }}</h3>
        <p>{{ action.description }}</p>
      </NuxtLink>

      <button
        v-for="action in secondaryActions"
        :key="action.title"
        @click="handleActionClick(action)"
        class="action-card secondary"
      >
        <div class="action-icon">{{ action.icon }}</div>
        <h3>{{ action.title }}</h3>
        <p>{{ action.description }}</p>
      </button>
    </div>
  </div>
</template>

<script setup>
const showComingSoon = inject('showComingSoon')

const primaryActions = [
  {
    title: 'مدیریت کاربران',
    description: 'مشاهده و مدیریت کاربران سیستم',
    icon: '👥',
    route: '/dashboard/users'
  },
  {
    title: 'گالری تصاویر',
    description: 'بررسی و تایید تصاویر کتاب‌ها',
    icon: '🖼️',
    route: '/dashboard/gallery/books'
  },
  {
    title: 'ویرایش پروفایل',
    description: 'مدیریت اطلاعات شخصی',
    icon: '👤',
    route: '/dashboard/profile'
  }
]

const secondaryActions = [
  {
    title: 'گزارش جدید',
    description: 'تولید گزارش آماری',
    icon: '📊',
    action: 'report'
  },
  {
    title: 'تنظیمات سیستم',
    description: 'مدیریت تنظیمات کلی',
    icon: '⚙️',
    action: 'settings'
  },
  {
    title: 'پشتیبانی',
    description: 'ارتباط با تیم پشتیبانی',
    icon: '🎧',
    action: 'support'
  }
]

const handleActionClick = (action) => {
  if (showComingSoon) {
    showComingSoon()
  }
}
</script>

<style scoped>
.quick-actions {
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow);
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  color: var(--dark);
  margin-bottom: 0.5rem;
}

.section-header p {
  color: var(--gray);
  margin: 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: var(--gray-50);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
  transition: var(--transition);
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
}

.action-card.primary {
  background: linear-gradient(135deg, var(--primary-light), rgba(102, 126, 234, 0.05));
  border-color: var(--primary);
}

.action-card.primary:hover {
  background: linear-gradient(135deg, var(--primary-light), var(--primary-light));
}

.action-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
}

.action-card.secondary .action-icon {
  background: linear-gradient(135deg, var(--gray-400), var(--gray-500));
}

.action-card h3 {
  color: var(--dark);
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.action-card p {
  color: var(--gray);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .quick-actions {
    padding: 1.5rem;
  }

  .actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .action-card {
    padding: 1.25rem;
  }

  .action-icon {
    width: 56px;
    height: 56px;
    font-size: 1.75rem;
  }
}
</style>
