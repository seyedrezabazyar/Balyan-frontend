<!-- layouts/default.vue -->
<template>
  <div class="layout">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <NuxtLink to="/" class="logo">
          <div class="logo-icon">⚡</div>
          <span>سیستم مدیریت</span>
        </NuxtLink>

        <nav class="nav">
          <NuxtLink to="/">خانه</NuxtLink>
          <NuxtLink v-if="isLoggedIn" to="/dashboard">داشبورد</NuxtLink>
          <NuxtLink v-if="isLoggedIn" to="/users">کاربران</NuxtLink>

          <div v-if="isLoggedIn" class="user-menu">
            <button @click="showMenu = !showMenu" class="user-btn">
              <span>{{ displayName }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>

            <div v-if="showMenu" class="menu-dropdown">
              <NuxtLink to="/profile" @click="showMenu = false">پروفایل</NuxtLink>
              <button @click="handleLogout">خروج</button>
            </div>
          </div>

          <NuxtLink v-else to="/auth" class="btn btn-primary">ورود</NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main -->
    <main class="main">
      <NuxtPage />
    </main>

    <!-- Toast -->
    <div v-if="toast.show" :class="['toast', `toast-${toast.type}`]">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
const { user, isLoggedIn, logout, init } = useAuth()
const showMenu = ref(false)

// Toast system
const toast = ref({ show: false, message: '', type: 'success' })

const showToast = (message: string, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => toast.value.show = false, 3000)
}

const displayName = computed(() => {
  if (!user.value) return 'کاربر'
  return user.value.name || user.value.email?.split('@')[0] || user.value.phone
})

const handleLogout = async () => {
  await logout()
  showToast('خروج موفق')
  await navigateTo('/')
  showMenu.value = false
}

// Close menu on click outside
const closeMenu = () => showMenu.value = false
onMounted(() => {
  init()
  document.addEventListener('click', closeMenu)
})
onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})

// Provide toast to all child components
provide('showToast', showToast)
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--dark);
  text-decoration: none;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--primary), #764ba2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
}

.nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav a {
  color: var(--gray);
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: var(--transition);
}

.nav a:hover,
.nav a.router-link-active {
  color: var(--primary);
  background: rgba(102, 126, 234, 0.1);
}

.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--light);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: var(--shadow);
  min-width: 150px;
  padding: 8px 0;
  margin-top: 4px;
}

.menu-dropdown a,
.menu-dropdown button {
  display: block;
  width: 100%;
  padding: 12px 16px;
  text-align: right;
  border: none;
  background: none;
  color: var(--dark);
  text-decoration: none;
  transition: var(--transition);
}

.menu-dropdown a:hover,
.menu-dropdown button:hover {
  background: var(--light);
}

.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }

  .nav {
    gap: 12px;
  }

  .nav a {
    padding: 6px 12px;
    font-size: 0.9rem;
  }

  .main {
    padding: 16px;
  }
}
</style>
