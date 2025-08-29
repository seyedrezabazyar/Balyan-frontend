<!-- app/pages/index.vue - Updated version with new links -->
<template>
  <div class="dashboard-container">
    <!-- Header section remains the same -->
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
      <!-- Welcome sections remain the same -->
      <!-- ... -->

      <!-- Updated Quick Actions Section -->
      <section class="actions-section">
        <h2>دسترسی سریع</h2>
        <div class="actions-grid">
          <!-- User Management -->
          <NuxtLink to="/dashboard/users" class="action-card link-card">
            <div class="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>مدیریت کاربران</h3>
            <p>مشاهده و مدیریت کاربران سیستم</p>
          </NuxtLink>

          <!-- Profile Edit -->
          <NuxtLink to="/dashboard/profile" class="action-card link-card">
            <div class="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3>ویرایش پروفایل</h3>
            <p>مدیریت اطلاعات شخصی و حساب</p>
          </NuxtLink>

          <!-- Existing actions -->
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
            <p>مدیریت تنظیمات سیستم</p>
          </button>
        </div>
      </section>

      <!-- Rest of the dashboard remains the same -->
      <!-- ... -->
    </main>

    <!-- Coming Soon Modal remains the same -->
    <!-- ... -->
  </div>
</template>

<script setup>
// All existing script content remains the same
// ...
</script>

<style scoped>
/* All existing styles remain the same */
/* ... */
</style>
