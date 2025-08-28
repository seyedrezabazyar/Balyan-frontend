<!-- layouts/default.vue -->
<template>
  <div class="layout-container">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <NuxtLink to="/">سایت من</NuxtLink>
        </div>
        <nav class="navigation">
          <NuxtLink to="/" class="nav-link">صفحه اصلی</NuxtLink>
          <NuxtLink to="/dashboard" class="nav-link">داشبورد</NuxtLink>

          <div v-if="!isAuthenticated" class="guest-actions">
            <NuxtLink to="/auth" class="nav-link login-link">ورود / ثبت نام</NuxtLink>
          </div>

          <div v-else class="user-menu">
            <div class="welcome-section">
              <div class="user-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="welcome-info">
                <span class="welcome-text">خوش آمدید</span>
                <span class="user-name">{{ displayName }}</span>
              </div>
            </div>
            <button @click="handleLogout" class="logout-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              خروج
            </button>
          </div>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <NuxtPage />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 سایت من. تمامی حقوق محفوظ است.</p>
        <div class="footer-links">
          <NuxtLink to="/">صفحه اصلی</NuxtLink>
          <NuxtLink to="/dashboard">داشبورد</NuxtLink>
          <NuxtLink to="/auth">احراز هویت</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

// Use Auth composable
const { user, isLoggedIn, logout, initialize } = useAuth()

// Legacy support
const legacyUsername = ref('')
const legacyLoggedIn = ref(false)

// Combined authentication state
const isAuthenticated = computed(() => {
  return isLoggedIn.value || legacyLoggedIn.value
})

// Display name
const displayName = computed(() => {
  if (user.value?.name) return user.value.name
  if (user.value?.email) return user.value.email.split('@')[0]
  if (user.value?.phone) return user.value.phone
  return legacyUsername.value || 'کاربر'
})

// Handle logout
const handleLogout = async () => {
  if (isLoggedIn.value) {
    // New auth system logout
    await logout()
  } else {
    // Legacy logout
    if (import.meta.client) {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('username')
      legacyLoggedIn.value = false
      legacyUsername.value = ''
    }
  }

  // Redirect to home
  await navigateTo('/')
}

// Check authentication state
const checkAuthState = () => {
  if (import.meta.client) {
    // Check legacy auth
    const isLoggedInLegacy = localStorage.getItem('isLoggedIn') === 'true'
    const username = localStorage.getItem('username')

    legacyLoggedIn.value = isLoggedInLegacy && !isLoggedIn.value
    legacyUsername.value = username || ''
  }
}

// Watch for route changes
const route = useRoute()
watch(() => route.path, () => {
  checkAuthState()
})

// Initialize
onMounted(() => {
  initialize()
  checkAuthState()
})
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo a {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  text-decoration: none;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background-color: #f0f0f0;
  color: #667eea;
}

.login-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  font-weight: 600;
}

.login-link:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-1px);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.welcome-info {
  display: flex;
  flex-direction: column;
}

.welcome-text {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  line-height: 1;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background: #fecaca;
  transform: translateY(-1px);
}

.main-content {
  flex: 1;
  padding: 0;
}

.footer {
  background: #333;
  color: white;
  padding: 30px 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-content p {
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: white;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
    gap: 15px;
  }

  .navigation {
    flex-wrap: wrap;
    justify-content: center;
  }

  .footer-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .user-menu {
    flex-direction: column;
    gap: 10px;
  }

  .welcome-section {
    padding: 6px 12px;
  }

  .logout-button {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}
</style>
