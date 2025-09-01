<template>
  <header class="header">
    <div class="header-container">
      <!-- Logo -->
      <NuxtLink to="/" class="logo">
        <div class="logo-icon">⚡</div>
        <span class="logo-text">سیستم مدیریت</span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="nav desktop-nav">
        <NuxtLink to="/" class="nav-link">خانه</NuxtLink>

        <template v-if="isLoggedIn">
          <NuxtLink to="/dashboard" class="nav-link">داشبورد</NuxtLink>
          <NuxtLink v-if="isAdmin" to="/dashboard/users" class="nav-link">کاربران</NuxtLink>
        </template>

        <!-- User Menu -->
        <div v-if="isLoggedIn" class="user-menu" ref="userMenuRef">
          <button @click="toggleUserMenu" class="user-btn">
            <div class="user-avatar">
              {{ getInitials(user?.name) }}
            </div>
            <span class="user-name">{{ displayName }}</span>
            <ChevronDownIcon :class="['chevron', { rotated: showUserMenu }]" />
          </button>

          <Transition name="dropdown">
            <div v-if="showUserMenu" class="user-dropdown">
              <NuxtLink to="/dashboard/profile" @click="closeUserMenu" class="dropdown-item">
                <UserIcon />
                <span>پروفایل</span>
              </NuxtLink>
              <button @click="handleLogout" class="dropdown-item logout">
                <LogOutIcon />
                <span>خروج</span>
              </button>
            </div>
          </Transition>
        </div>

        <!-- Auth Button -->
        <NuxtLink v-if="!isLoggedIn" to="/auth" class="btn btn-primary">
          ورود / ثبت نام
        </NuxtLink>
      </nav>

      <!-- Mobile Menu Button -->
      <button @click="toggleMobileMenu" class="mobile-menu-btn">
        <MenuIcon v-if="!showMobileMenu" />
        <XIcon v-else />
      </button>
    </div>

    <!-- Mobile Navigation -->
    <Transition name="mobile-menu">
      <nav v-if="showMobileMenu" class="mobile-nav">
        <NuxtLink to="/" @click="closeMobileMenu" class="mobile-nav-link">خانه</NuxtLink>

        <template v-if="isLoggedIn">
          <NuxtLink to="/dashboard" @click="closeMobileMenu" class="mobile-nav-link">داشبورد</NuxtLink>
          <NuxtLink v-if="isAdmin" to="/dashboard/users" @click="closeMobileMenu" class="mobile-nav-link">کاربران</NuxtLink>
          <NuxtLink to="/dashboard/profile" @click="closeMobileMenu" class="mobile-nav-link">پروفایل</NuxtLink>
          <button @click="handleLogout" class="mobile-nav-link logout">خروج</button>
        </template>

        <NuxtLink v-if="!isLoggedIn" to="/auth" @click="closeMobileMenu" class="mobile-nav-link primary">
          ورود / ثبت نام
        </NuxtLink>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { h } from 'vue'

const { user, isLoggedIn, isAdmin, logout } = useAuth()
const { showToast } = useToast()
const { getInitials } = useUtils()

// State
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const userMenuRef = ref(null)

// Computed
const displayName = computed(() => {
  if (!user.value) return 'کاربر'
  return user.value.name || user.value.email?.split('@')[0] || user.value.phone || 'کاربر'
})

// Methods
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleLogout = async () => {
  try {
    await logout()
    showToast('خروج با موفقیت انجام شد', 'success')
  } catch (error) {
    showToast('خطا در خروج از سیستم', 'error')
  }
  closeUserMenu()
  closeMobileMenu()
}

// Handle outside clicks
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    closeUserMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Icon components
const ChevronDownIcon = {
  render() {
    return h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'm6 9 6 6 6-6' })
    ])
  }
}

const UserIcon = {
  render() {
    return h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '12', cy: '7', r: '4' })
    ])
  }
}

const LogOutIcon = {
  render() {
    return h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
      h('polyline', { points: '16 17 21 12 16 7' }),
      h('line', { x1: '21', y1: '12', x2: '9', y2: '12' })
    ])
  }
}

const MenuIcon = {
  render() {
    return h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('line', { x1: '4', y1: '12', x2: '20', y2: '12' }),
      h('line', { x1: '4', y1: '6', x2: '20', y2: '6' }),
      h('line', { x1: '4', y1: '18', x2: '20', y2: '18' })
    ])
  }
}

const XIcon = {
  render() {
    return h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'm18 6-12 12' }),
      h('path', { d: 'm6 6 12 12' })
    ])
  }
}
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--dark);
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--primary), #764ba2);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: var(--gray);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  transition: var(--transition);
  text-decoration: none;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary);
  background: var(--primary-light);
}

.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--light);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
}

.user-btn:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--primary), #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
}

.user-name {
  font-weight: 500;
  color: var(--dark);
}

.chevron {
  transition: transform 0.2s;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  min-width: 180px;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: right;
  color: var(--dark);
  text-decoration: none;
  transition: var(--transition);
  cursor: pointer;
}

.dropdown-item:hover {
  background: var(--light);
}

.dropdown-item.logout {
  color: var(--danger);
  border-top: 1px solid var(--border);
}

.dropdown-item.logout:hover {
  background: var(--danger-light);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--dark);
}

.mobile-nav {
  display: none;
  flex-direction: column;
  padding: 1rem;
  border-top: 1px solid var(--border);
  background: white;
}

.mobile-nav-link {
  padding: 0.75rem 1rem;
  color: var(--gray);
  text-decoration: none;
  border-radius: var(--radius);
  transition: var(--transition);
  background: none;
  border: none;
  text-align: right;
  cursor: pointer;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  color: var(--primary);
  background: var(--primary-light);
}

.mobile-nav-link.primary {
  background: linear-gradient(135deg, var(--primary), #764ba2);
  color: white;
  font-weight: 600;
  margin-top: 0.5rem;
}

.mobile-nav-link.logout {
  color: var(--danger);
  border-top: 1px solid var(--border);
  margin-top: 0.5rem;
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  max-height: 0;
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  max-height: 400px;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-nav {
    display: flex;
  }

  .logo-text {
    display: none;
  }
}
</style>
