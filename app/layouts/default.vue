<div class="modal-actions">
<button @click="hideLogoutConfirm" class="btn-secondary">انصراف</button>
<button @click="confirmLogout" class="btn-danger">خروج</button>
</div>
</div>
</div>

<!-- Coming Soon Modal -->
<div v-if="showComingSoonModal" class="modal-overlay" @click="hideComingSoonModal">
<div class="modal-content coming-soon-modal" @click.stop>
  <div class="modal-header">
    <div class="modal-icon coming-soon-icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
      </svg>
    </div>
    <h3>به زودی...</h3>
    <p>این قابلیت در حال توسعه است و به زودی در دسترس قرار می‌گیرد.</p>
  </div>
  <div class="modal-actions">
    <button @click="hideComingSoonModal" class="btn-primary">متوجه شدم</button>
  </div>
</div>
</div>

<!-- Mobile Menu Overlay -->
<div
  v-if="isMobileMenuOpen"
  class="mobile-overlay"
  @click="closeMobileMenu"
></div>

<!-- Toast Notifications -->
<div class="toast-container">
<div
  v-for="toast in toasts"
  :key="toast.id"
  :class="['toast', `toast-${toast.type}`]"
>
  <div class="toast-content">
    <svg v-if="toast.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <svg v-else-if="toast.type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <svg v-else-if="toast.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
    <span>{{ toast.message }}</span>
  </div>
  <button @click="removeToast(toast.id)" class="toast-close">×</button>
</div>
</div>
</div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'

// Use Auth composable
const { user, isLoggedIn, logout, initialize } = useAuth()

// Reactive state
const isInitializing = ref(true)
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isMobile = ref(false)
const activeDropdown = ref(null)
const currentTheme = ref('light')
const showLogoutModal = ref(false)
const showComingSoonModal = ref(false)

// User data
const legacyUsername = ref('')
const legacyLoggedIn = ref(false)
const userAvatar = ref('')

// Notifications
const notifications = ref([
  {
    id: 1,
    title: 'کاربر جدید',
    message: 'کاربری با نام "احمد محمدی" ثبت‌نام کرد',
    type: 'info',
    read: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 2,
    title: 'تصویر جدید',
    message: 'تصویر جدیدی در انتظار تایید است',
    type: 'warning',
    read: false,
    created_at: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: 3,
    title: 'به‌روزرسانی سیستم',
    message: 'نسخه 2.1.0 با موفقیت نصب شد',
    type: 'success',
    read: true,
    created_at: new Date(Date.now() - 60 * 60 * 1000)
  }
])

const toasts = ref([])
const usersCount = ref(156)
const pendingImagesCount = ref(3)

// Refs for dropdown elements
const managementDropdown = ref(null)
const notificationsDropdown = ref(null)
const userDropdown = ref(null)

// Computed properties
const isAuthenticated = computed(() => {
  return isLoggedIn.value || legacyLoggedIn.value
})

const displayName = computed(() => {
  if (user.value?.name) return user.value.name
  if (user.value?.email) return user.value.email.split('@')[0]
  if (user.value?.phone) return user.value.phone
  return legacyUsername.value || 'کاربر'
})

const userRole = computed(() => {
  if (!user.value) return 'مدیر سیستم'

  if (user.value.email && user.value.phone) {
    return 'کاربر کامل'
  } else if (user.value.email) {
    return 'کاربر ایمیل'
  } else if (user.value.phone) {
    return 'کاربر موبایل'
  }
  return 'کاربر جدید'
})

const userStatusClass = computed(() => {
  if (!isAuthenticated.value) return 'offline'
  return 'online'
})

const userStatusText = computed(() => {
  if (!isAuthenticated.value) return 'آفلاین'
  return 'آنلاین'
})

const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const currentYear = computed(() => {
  return new Date().getFullYear()
})

const appVersion = computed(() => {
  return '2.1.0'
})

// Methods
const getInitials = (name) => {
  if (!name) return 'ک'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2)
}

const checkScrolled = () => {
  isScrolled.value = window.scrollY > 50
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
  closeAllDropdowns()
}

const toggleDropdown = (dropdownName) => {
  if (activeDropdown.value === dropdownName) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = dropdownName
  }
}

const closeAllDropdowns = () => {
  activeDropdown.value = null
}

const handleClickOutside = (event) => {
  const dropdownElements = [
    managementDropdown.value,
    notificationsDropdown.value,
    userDropdown.value
  ]

  const clickedOutside = dropdownElements.every(element =>
    !element || !element.contains(event.target)
  )

  if (clickedOutside) {
    closeAllDropdowns()
  }
}

// Theme management
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', currentTheme.value)

  // Save to localStorage
  if (process.client) {
    localStorage.setItem('theme', currentTheme.value)
  }

  showToast(`حالت ${currentTheme.value === 'light' ? 'روشن' : 'تاریک'} فعال شد`, 'success')
}

const initTheme = () => {
  if (process.client) {
    const savedTheme = localStorage.getItem('theme') || 'light'
    currentTheme.value = savedTheme
    document.documentElement.setAttribute('data-theme', savedTheme)
  }
}

// Authentication
const checkAuthState = () => {
  if (process.client) {
    // Check legacy auth
    const isLoggedInLegacy = localStorage.getItem('isLoggedIn') === 'true'
    const username = localStorage.getItem('username')

    legacyLoggedIn.value = isLoggedInLegacy && !isLoggedIn.value
    legacyUsername.value = username || ''

    // Load user avatar
    if (user.value?.avatar) {
      userAvatar.value = user.value.avatar
    }
  }
}

const showLogoutConfirm = () => {
  showLogoutModal.value = true
  closeAllDropdowns()
}

const hideLogoutConfirm = () => {
  showLogoutModal.value = false
}

const confirmLogout = async () => {
  showLogoutModal.value = false

  if (isLoggedIn.value) {
    // New auth system logout
    await logout()
  } else {
    // Legacy logout
    if (process.client) {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('username')
      legacyLoggedIn.value = false
      legacyUsername.value = ''
    }
  }

  showToast('با موفقیت خارج شدید', 'success')

  // Redirect to home after a delay
  setTimeout(() => {
    navigateTo('/')
  }, 1000)
}

// Notifications
const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
  showToast('همه اعلانات علامت‌گذاری شدند', 'success')
}

const formatNotificationTime = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} روز پیش`
  if (hours > 0) return `${hours} ساعت پیش`
  if (minutes > 0) return `${minutes} دقیقه پیش`
  return 'الان'
}

// Modals
const showReportsModal = () => {
  closeAllDropdowns()
  showComingSoonModal.value = true
}

const showSettingsModal = () => {
  closeAllDropdowns()
  showComingSoonModal.value = true
}

const showAccountSettings = () => {
  closeAllDropdowns()
  showComingSoonModal.value = true
}

const hideComingSoonModal = () => {
  showComingSoonModal.value = false
}

// Toast notifications
let toastId = 0

const showToast = (message, type = 'info') => {
  const toast = {
    id: ++toastId,
    message,
    type
  }

  toasts.value.push(toast)

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(toast.id)
  }, 5000)
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Lifecycle hooks
onMounted(async () => {
  // Initialize auth
  await initialize()
  checkAuthState()

  // Initialize theme
  initTheme()

  // Add event listeners
  window.addEventListener('scroll', checkScrolled)
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', handleClickOutside)

  // Initial checks
  checkScrolled()
  checkMobile()

  // Simulate loading
  setTimeout(() => {
    isInitializing.value = false
  }, 1000)
})

onBeforeUnmount(() => {
  // Cleanup
  window.removeEventListener('scroll', checkScrolled)
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('click', handleClickOutside)
  document.body.style.overflow = ''
})

// Watch route changes
const route = useRoute()
watch(() => route.path, () => {
  closeMobileMenu()
  closeAllDropdowns()
  checkAuthState()
})

// Provide global toast method
provide('showToast', showToast)
</script>

<style scoped>
/* CSS Variables for theming */
:root {
  --primary-color: #667eea;
  --primary-dark: #764ba2;
  --secondary-color: #f8f9fa;
  --text-color: #1a1a1a;
  --text-muted: #6b7280;
  --border-color: #e5e7eb;
  --background-color: #ffffff;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="dark"] {
  --text-color: #ffffff;
  --text-muted: #9ca3af;
  --border-color: #374151;
  --background-color: #1f2937;
  --secondary-color: #374151;
}

* {
  box-sizing: border-box;
}

.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--secondary-color);
  color: var(--text-color);
  transition: var(--transition);
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Header */
.header {
  background: var(--background-color);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: var(--transition);
  border-bottom: 1px solid var(--border-color);
}

.header-scrolled {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

/* Logo */
.logo {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text-color);
  transition: var(--transition);
}

.logo-link:hover {
  color: var(--primary-color);
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
}

/* Navigation */
.navigation {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  justify-content: flex-end;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: var(--transition);
  cursor: pointer;
  border: none;
  background: none;
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  transform: translateY(-2px);
}

.nav-link span {
  white-space: nowrap;
}

/* Dropdown */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  position: relative;
}

.dropdown-toggle.active {
  background: var(--secondary-color);
  color: var(--primary-color);
}

.dropdown-arrow {
  transition: var(--transition);
}

.dropdown-toggle.active .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.15);
  min-width: 240px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px) scale(0.95);
  transition: var(--transition);
  z-index: 1001;
  overflow: hidden;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: var(--text-color);
  text-decoration: none;
  transition: var(--transition);
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: right;
  font-size: 0.9rem;
  position: relative;
}

.dropdown-item:hover {
  background: var(--secondary-color);
  color: var(--primary-color);
}

.dropdown-item:first-child {
  border-radius: 16px 16px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 16px 16px;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 8px 0;
}

.item-badge {
  margin-right: auto;
  background: var(--primary-color);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.item-badge.pending {
  background: #ef4444;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* User Actions */
.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-right: 24px;
}

.auth-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: var(--transition);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
}

/* User Menu */
.user-menu {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notifications {
  position: relative;
}

.notification-btn {
  position: relative;
  background: var(--secondary-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: var(--transition);
  color: var(--text-color);
}

.notification-btn:hover,
.notification-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.notification-badge {
  position: absolute;
  top: -4px;
  left: -4px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.notifications-menu {
  min-width: 320px;
  max-width: 400px;
  max-height: 480px;
  overflow-y: auto;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.dropdown-header h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.mark-read-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition);
}

.mark-read-btn:hover {
  text-decoration: underline;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.no-notifications {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
}

.no-notifications svg {
  margin-bottom: 12px;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: var(--transition);
  border-left: 4px solid transparent;
}

.notification-item:hover {
  background: var(--secondary-color);
}

.notification-item.unread {
  background: rgba(102, 126, 234, 0.05);
  border-left-color: var(--primary-color);
}

.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon.info {
  background: #dbeafe;
  color: #1e40af;
}

.notification-icon.warning {
  background: #fef3c7;
  color: #92400e;
}

.notification-icon.success {
  background: #d1fae5;
  color: #065f46;
}

.notification-content h5 {
  margin: 0 0 4px 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.notification-content p {
  margin: 0 0 4px 0;
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.dropdown-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.view-all-btn {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition);
}

.view-all-btn:hover {
  text-decoration: underline;
}

/* User Profile Dropdown */
.user-profile-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: var(--secondary-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  cursor: pointer;
  transition: var(--transition);
  color: var(--text-color);
}

.user-profile-btn:hover,
.user-profile-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  font-weight: 600;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  line-height: 1;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-dropdown-menu {
  min-width: 320px;
}

.user-info-header {
  display: flex;
  gap: 16px;
  padding: 24px 20px 16px;
  border-bottom: 1px solid var(--border-color);
}

.user-avatar-large {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.user-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details h4 {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.user-details p {
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.user-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.user-status.online .status-dot {
  background: #10b981;
}

.user-status.offline .status-dot {
  background: #6b7280;
}

.logout-item {
  color: #dc2626 !important;
}

.logout-item:hover {
  background: #fee2e2 !important;
  color: #dc2626 !important;
}

/* Mobile Menu */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: var(--transition);
}

.mobile-menu-toggle:hover {
  background: var(--secondary-color);
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(4px);
}

/* Main Content */
.main-content {
  flex: 1;
  min-height: 0;
}

/* Footer */
.footer {
  background: var(--text-color);
  color: var(--background-color);
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 24px 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.footer-section h4 {
  margin: 0 0 20px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--background-color);
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 1.3rem;
  font-weight: 700;
}

.footer-description {
  color: #9ca3af;
  line-height: 1.6;
  margin: 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #9ca3af;
  text-decoration: none;
  transition: var(--transition);
}

.footer-links a:hover {
  color: var(--background-color);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding: 24px 0;
}

.footer-bottom-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #9ca3af;
  font-size: 0.9rem;
}

.theme-toggle-footer {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: var(--transition);
}

.theme-toggle-footer:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Modals */
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
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: var(--background-color);
  border-radius: 20px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 32px 128px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(32px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  text-align: center;
  margin-bottom: 24px;
}

.modal-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.logout-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.coming-soon-icon {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
}

.modal-header h3 {
  margin: 0 0 8px 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.modal-header p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.95rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: var(--secondary-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--border-color);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.4);
}

/* Toast Notifications */
.toast-container {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.toast {
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideInLeft 0.3s ease;
  position: relative;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-success {
  border-left: 4px solid #10b981;
}

.toast-error {
  border-left: 4px solid #ef4444;
}

.toast-warning {
  border-left: 4px solid #f59e0b;
}

.toast-info {
  border-left: 4px solid var(--primary-color);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.toast-success .toast-content svg {
  color: #10b981;
}

.toast-error .toast-content svg {
  color: #ef4444;
}

.toast-warning .toast-content svg {
  color: #f59e0b;
}

.toast-info .toast-content svg {
  color: var(--primary-color);
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px;
  border-radius: 4px;
  transition: var(--transition);
}

.toast-close:hover {
  background: var(--secondary-color);
  color: var(--text-color);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-content {
    padding: 0 20px;
  }

  .user-actions {
    gap: 12px;
    margin-right: 16px;
  }

  .nav-links {
    gap: 4px;
  }

  .dropdown-menu {
    min-width: 200px;
  }

  .user-dropdown-menu {
    min-width: 280px;
  }

  .notifications-menu {
    min-width: 280px;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
    height: 60px;
  }

  .logo-text {
    font-size: 1.3rem;
  }

  .mobile-menu-toggle {
    display: flex;
    order: 1;
  }

  .navigation {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: var(--background-color);
    border-top: 1px solid var(--border-color);
    flex-direction: column;
    padding: 20px;
    gap: 16px;
    transform: translateY(-100vh);
    transition: transform 0.3s ease;
    height: calc(100vh - 60px);
    overflow-y: auto;
    z-index: 1000;
  }

  .navigation.nav-open {
    transform: translateY(0);
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }

  .nav-link {
    width: 100%;
    justify-content: flex-start;
    padding: 16px 20px;
    border-radius: 12px;
  }

  .user-actions {
    width: 100%;
    margin-right: 0;
    flex-direction: column;
    gap: 12px;
  }

  .user-menu {
    width: 100%;
    flex-direction: column;
    gap: 12px;
  }

  .user-profile-btn {
    width: 100%;
    justify-content: flex-start;
    padding: 16px 20px;
  }

  .mobile-hidden {
    display: none;
  }

  .dropdown-menu {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    border: none;
    border-radius: 0;
    background: var(--secondary-color);
    margin-top: 8px;
  }

  .footer-content {
    padding: 40px 16px 20px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
  }

  .footer-bottom-content {
    padding: 0 16px;
    flex-direction: column;
    text-align: center;
  }

  .toast-container {
    left: 16px;
    right: 16px;
    max-width: none;
  }

  .modal-content {
    padding: 24px;
    margin: 16px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 12px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
  }

  .logo-text {
    font-size: 1.2rem;
  }

  .navigation {
    padding: 16px;
  }

  .nav-link {
    padding: 14px 16px;
    font-size: 0.9rem;
  }

  .user-profile-btn {
    padding: 14px 16px;
  }

  .dropdown-item {
    padding: 12px 16px;
    font-size: 0.85rem;
  }

  .footer-content {
    padding: 30px 12px 16px;
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .modal-content {
    padding: 20px;
    margin: 12px;
  }

  .modal-icon {
    width: 48px;
    height: 48px;
  }

  .toast {
    padding: 12px;
  }

  .toast-container {
    left: 12px;
    right: 12px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --border-color: #000000;
    --text-muted: #000000;
  }

  [data-theme="dark"] {
    --border-color: #ffffff;
    --text-muted: #ffffff;
  }
}

/* Focus styles for accessibility */
button:focus,
a:focus,
input:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .header,
  .footer,
  .mobile-menu-toggle,
  .dropdown-menu,
  .modal-overlay,
  .toast-container {
    display: none !important;
  }

  .main-content {
    margin: 0;
    box-shadow: none;
  }
}
</style><!-- app/layouts/default.vue -->
<template>
  <div class="layout-container">
    <!-- Loading Overlay -->
    <div v-if="isInitializing" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>
    </div>

    <!-- Header -->
    <header class="header" :class="{ 'header-scrolled': isScrolled }">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo">
          <NuxtLink to="/" class="logo-link">
            <div class="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7z"></path>
                <polyline points="9 12 11 14 16 9"></polyline>
              </svg>
            </div>
            <span class="logo-text">سایت من</span>
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="navigation" :class="{ 'nav-open': isMobileMenuOpen }">
          <!-- Main Links -->
          <div class="nav-links">
            <NuxtLink to="/" class="nav-link" @click="closeMobileMenu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>صفحه اصلی</span>
            </NuxtLink>

            <NuxtLink to="/dashboard" class="nav-link" @click="closeMobileMenu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>داشبورد</span>
            </NuxtLink>

            <!-- Management Dropdown (Only for authenticated users) -->
            <div v-if="isAuthenticated" class="dropdown" ref="managementDropdown">
              <button
                class="dropdown-toggle nav-link"
                @click="toggleDropdown('management')"
                :class="{ active: activeDropdown === 'management' }"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>مدیریت</span>
                <svg class="dropdown-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div class="dropdown-menu" :class="{ show: activeDropdown === 'management' }">
                <NuxtLink to="/dashboard/users" class="dropdown-item" @click="closeAllDropdowns">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span>مدیریت کاربران</span>
                  <span class="item-badge">{{ usersCount }}</span>
                </NuxtLink>

                <NuxtLink to="/dashboard/gallery/books" class="dropdown-item" @click="closeAllDropdowns">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span>گالری تصاویر</span>
                  <span v-if="pendingImagesCount > 0" class="item-badge pending">{{ pendingImagesCount }}</span>
                </NuxtLink>

                <div class="dropdown-divider"></div>

                <button class="dropdown-item" @click="showReportsModal">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  <span>گزارشات</span>
                </button>

                <button class="dropdown-item" @click="showSettingsModal">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span>تنظیمات</span>
                </button>
              </div>
            </div>
          </div>

          <!-- User Actions -->
          <div class="user-actions">
            <!-- Guest Actions -->
            <div v-if="!isAuthenticated" class="guest-actions">
              <NuxtLink to="/auth" class="auth-btn" @click="closeMobileMenu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <span>ورود / ثبت نام</span>
              </NuxtLink>
            </div>

            <!-- User Menu -->
            <div v-else class="user-menu">
              <!-- Notifications -->
              <div class="notifications" ref="notificationsDropdown">
                <button
                  class="notification-btn"
                  @click="toggleDropdown('notifications')"
                  :class="{ active: activeDropdown === 'notifications' }"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <span v-if="unreadNotifications > 0" class="notification-badge">{{ unreadNotifications }}</span>
                </button>

                <div class="dropdown-menu notifications-menu" :class="{ show: activeDropdown === 'notifications' }">
                  <div class="dropdown-header">
                    <h4>اعلانات</h4>
                    <button v-if="unreadNotifications > 0" @click="markAllAsRead" class="mark-read-btn">
                      علامت‌گذاری همه
                    </button>
                  </div>

                  <div class="notifications-list">
                    <div v-if="notifications.length === 0" class="no-notifications">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                      <p>اعلانی وجود ندارد</p>
                    </div>

                    <div
                      v-for="notification in notifications.slice(0, 5)"
                      :key="notification.id"
                      class="notification-item"
                      :class="{ unread: !notification.read }"
                      @click="markAsRead(notification.id)"
                    >
                      <div class="notification-icon" :class="notification.type">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <div class="notification-content">
                        <h5>{{ notification.title }}</h5>
                        <p>{{ notification.message }}</p>
                        <span class="notification-time">{{ formatNotificationTime(notification.created_at) }}</span>
                      </div>
                    </div>
                  </div>

                  <div v-if="notifications.length > 5" class="dropdown-footer">
                    <NuxtLink to="/dashboard/notifications" class="view-all-btn">
                      مشاهده همه اعلانات
                    </NuxtLink>
                  </div>
                </div>
              </div>

              <!-- User Profile Dropdown -->
              <div class="user-profile-dropdown" ref="userDropdown">
                <button
                  class="user-profile-btn"
                  @click="toggleDropdown('user')"
                  :class="{ active: activeDropdown === 'user' }"
                >
                  <div class="user-avatar">
                    <img v-if="userAvatar" :src="userAvatar" :alt="displayName" />
                    <span v-else class="avatar-initials">{{ getInitials(displayName) }}</span>
                  </div>
                  <div class="user-info" :class="{ 'mobile-hidden': isMobile }">
                    <span class="user-name">{{ displayName }}</span>
                    <span class="user-role">{{ userRole }}</span>
                  </div>
                  <svg class="dropdown-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                <div class="dropdown-menu user-dropdown-menu" :class="{ show: activeDropdown === 'user' }">
                  <!-- User Info Header -->
                  <div class="user-info-header">
                    <div class="user-avatar-large">
                      <img v-if="userAvatar" :src="userAvatar" :alt="displayName" />
                      <span v-else class="avatar-initials">{{ getInitials(displayName) }}</span>
                    </div>
                    <div class="user-details">
                      <h4>{{ displayName }}</h4>
                      <p>{{ userRole }}</p>
                      <div class="user-status" :class="userStatusClass">
                        <div class="status-dot"></div>
                        <span>{{ userStatusText }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="dropdown-divider"></div>

                  <!-- Quick Actions -->
                  <NuxtLink to="/dashboard" class="dropdown-item" @click="closeAllDropdowns">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span>داشبورد</span>
                  </NuxtLink>

                  <NuxtLink to="/dashboard/profile" class="dropdown-item" @click="closeAllDropdowns">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>ویرایش پروفایل</span>
                  </NuxtLink>

                  <button class="dropdown-item" @click="showAccountSettings">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    <span>تنظیمات حساب</span>
                  </button>

                  <div class="dropdown-divider"></div>

                  <!-- Theme Toggle -->
                  <button class="dropdown-item" @click="toggleTheme">
                    <svg v-if="currentTheme === 'light'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                    <span>{{ currentTheme === 'light' ? 'حالت تاریک' : 'حالت روشن' }}</span>
                  </button>

                  <div class="dropdown-divider"></div>

                  <!-- Logout -->
                  <button class="dropdown-item logout-item" @click="showLogoutConfirm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>خروج از حساب</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Menu Toggle -->
          <button class="mobile-menu-toggle" @click="toggleMobileMenu">
            <svg v-if="!isMobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <div class="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7z"></path>
                <polyline points="9 12 11 14 16 9"></polyline>
              </svg>
            </div>
            <span>سایت من</span>
          </div>
          <p class="footer-description">
            سیستم مدیریت پیشرفته با قابلیت‌های کامل احراز هویت و مدیریت کاربران
          </p>
        </div>

        <div class="footer-section">
          <h4>لینک‌های سریع</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/">صفحه اصلی</NuxtLink></li>
            <li><NuxtLink to="/dashboard">داشبورد</NuxtLink></li>
            <li v-if="isAuthenticated"><NuxtLink to="/dashboard/profile">پروفایل</NuxtLink></li>
            <li v-if="!isAuthenticated"><NuxtLink to="/auth">ورود</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>مدیریت</h4>
          <ul class="footer-links">
            <li v-if="isAuthenticated"><NuxtLink to="/dashboard/users">کاربران</NuxtLink></li>
            <li v-if="isAuthenticated"><NuxtLink to="/dashboard/gallery/books">گالری</NuxtLink></li>
            <li><a href="#" @click.prevent="showReportsModal">گزارشات</a></li>
            <li><a href="#" @click.prevent="showSettingsModal">تنظیمات</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>تماس با ما</h4>
          <div class="contact-info">
            <div class="contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22 6 12 13 2 6"></polyline>
              </svg>
              <span>info@example.com</span>
            </div>
            <div class="contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>021-12345678</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>&copy; {{ currentYear }} سایت من. تمامی حقوق محفوظ است.</p>
          <div class="footer-meta">
            <span>نسخه {{ appVersion }}</span>
            <span>|</span>
            <button @click="toggleTheme" class="theme-toggle-footer">
              {{ currentTheme === 'light' ? '🌙' : '☀️' }}
            </button>
          </div>
        </div>
      </div>
    </footer>

    <!-- Modals and Overlays -->
    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="modal-overlay" @click="hideLogoutConfirm">
      <div class="modal-content logout-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon logout-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          <h3>خروج از حساب کاربری</h3>
          <p>آیا مطمئن هستید که می‌خواهید خارج شوید؟</p>
        </div>
        <div class="modal-actions">
          <button @click="hideLogoutConfirm" class="btn-secondary">انصراف</button>
          <button @click="confirmLogout" class="btn-danger">خروج</button>
        </div>
      </div>
    </div>

    <!-- Coming Soon Modal -->
    <div v-if="showComingSoonModal" class="modal-overlay" @click="hideComingSoonModal">
      <div class="modal-content coming-soon-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon coming-soon-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
          </div>
          <h3>به زودی...</h3>
          <p>این قابلیت در حال توسعه است و به زودی در دسترس قرار می‌گیرد.</p>
        </div>
        <div class="modal-actions">
          <button @click="hideComingSoonModal" class="btn-primary">متوجه شدم</button>
        </div>
      </div>
    </div>

    <!-- Account Settings Modal -->
    <div v-if="showAccountSettingsModal" class="modal-overlay" @click="hideAccountSettingsModal">
      <div class="modal-content account-settings-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon settings-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          <h3>تنظیمات حساب کاربری</h3>
          <p>برای دسترسی کامل به تنظیمات، به صفحه پروفایل بروید.</p>
        </div>
        <div class="modal-content-body">
          <div class="quick-settings">
            <div class="setting-item">
              <div class="setting-info">
                <h4>تم سایت</h4>
                <p>تغییر حالت روشن/تاریک</p>
              </div>
              <button @click="toggleTheme" class="setting-toggle">
                <svg v-if="currentTheme === 'light'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <span>{{ currentTheme === 'light' ? 'تاریک' : 'روشن' }}</span>
              </button>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h4>زبان سایت</h4>
                <p>فارسی (پیش‌فرض)</p>
              </div>
              <button class="setting-toggle" disabled>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span>فارسی</span>
              </button>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h4>اعلانات</h4>
                <p>دریافت اعلانات جدید</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="notificationsEnabled">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="hideAccountSettingsModal" class="btn-secondary">بستن</button>
          <NuxtLink to="/dashboard/profile" @click="hideAccountSettingsModal" class="btn-primary">
            ویرایش کامل پروفایل
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>

    <!-- Toast Notifications -->
    <div class="toast-container">
      <transition-group name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
        >
          <div class="toast-icon">
            <svg v-if="toast.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <svg v-else-if="toast.type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <svg v-else-if="toast.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div class="toast-content">
            <span class="toast-message">{{ toast.message }}</span>
            <div v-if="toast.action" class="toast-action">
              <button @click="toast.action.handler" class="toast-action-btn">
                {{ toast.action.text }}
              </button>
            </div>
          </div>
          <button @click="removeToast(toast.id)" class="toast-close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div class="toast-progress" :style="{ animationDuration: `${toast.duration}ms` }"></div>
        </div>
      </transition-group>
    </div>

    <!-- Global Loading -->
    <div v-if="globalLoading" class="global-loading">
      <div class="global-loading-content">
        <div class="loading-spinner"></div>
        <p>{{ globalLoadingText || 'در حال بارگذاری...' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'

// Use Auth composable
const { user, isLoggedIn, logout, initialize } = useAuth()

// Reactive state
const isInitializing = ref(true)
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isMobile = ref(false)
const activeDropdown = ref(null)
const currentTheme = ref('light')
const showLogoutModal = ref(false)
const showComingSoonModal = ref(false)
const showAccountSettingsModal = ref(false)
const notificationsEnabled = ref(true)
const globalLoading = ref(false)
const globalLoadingText = ref('')

// User data
const legacyUsername = ref('')
const legacyLoggedIn = ref(false)
const userAvatar = ref('')

// Notifications
const notifications = ref([
  {
    id: 1,
    title: 'کاربر جدید',
    message: 'کاربری با نام "احمد محمدی" ثبت‌نام کرد',
    type: 'info',
    read: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 2,
    title: 'تصویر جدید',
    message: 'تصویر جدیدی در انتظار تایید است',
    type: 'warning',
    read: false,
    created_at: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: 3,
    title: 'به‌روزرسانی سیستم',
    message: 'نسخه 2.1.0 با موفقیت نصب شد',
    type: 'success',
    read: true,
    created_at: new Date(Date.now() - 60 * 60 * 1000)
  }
])

const toasts = ref([])
const usersCount = ref(156)
const pendingImagesCount = ref(3)

// Refs for dropdown elements
const managementDropdown = ref(null)
const notificationsDropdown = ref(null)
const userDropdown = ref(null)

// Computed properties
const isAuthenticated = computed(() => {
  return isLoggedIn.value || legacyLoggedIn.value
})

const displayName = computed(() => {
  if (user.value?.name) return user.value.name
  if (user.value?.email) return user.value.email.split('@')[0]
  if (user.value?.phone) return user.value.phone
  return legacyUsername.value || 'کاربر'
})

const userRole = computed(() => {
  if (!user.value) return 'مدیر سیستم'

  if (user.value.email && user.value.phone) {
    return 'کاربر کامل'
  } else if (user.value.email) {
    return 'کاربر ایمیل'
  } else if (user.value.phone) {
    return 'کاربر موبایل'
  }
  return 'کاربر جدید'
})

const userStatusClass = computed(() => {
  if (!isAuthenticated.value) return 'offline'
  return 'online'
})

const userStatusText = computed(() => {
  if (!isAuthenticated.value) return 'آفلاین'
  return 'آنلاین'
})

const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const currentYear = computed(() => {
  return new Date().getFullYear()
})

const appVersion = computed(() => {
  return '2.1.0'
})

// Methods
const getInitials = (name) => {
  if (!name) return 'ک'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2)
}

const checkScrolled = () => {
  isScrolled.value = window.scrollY > 50
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
  closeAllDropdowns()
}

const toggleDropdown = (dropdownName) => {
  if (activeDropdown.value === dropdownName) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = dropdownName
  }
}

const closeAllDropdowns = () => {
  activeDropdown.value = null
}

const handleClickOutside = (event) => {
  const dropdownElements = [
    managementDropdown.value,
    notificationsDropdown.value,
    userDropdown.value
  ]

  const clickedOutside = dropdownElements.every(element =>
    !element || !element.contains(event.target)
  )

  if (clickedOutside) {
    closeAllDropdowns()
  }
}

// Theme management
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', currentTheme.value)

  // Save to localStorage
  if (process.client) {
    localStorage.setItem('theme', currentTheme.value)
  }

  showToast(`حالت ${currentTheme.value === 'light' ? 'روشن' : 'تاریک'} فعال شد`, 'success')
}

const initTheme = () => {
  if (process.client) {
    const savedTheme = localStorage.getItem('theme') || 'light'
    currentTheme.value = savedTheme
    document.documentElement.setAttribute('data-theme', savedTheme)
  }
}

// Authentication
const checkAuthState = () => {
  if (process.client) {
    // Check legacy auth
    const isLoggedInLegacy = localStorage.getItem('isLoggedIn') === 'true'
    const username = localStorage.getItem('username')

    legacyLoggedIn.value = isLoggedInLegacy && !isLoggedIn.value
    legacyUsername.value = username || ''

    // Load user avatar
    if (user.value?.avatar) {
      userAvatar.value = user.value.avatar
    }

    // Load notifications settings
    const savedNotifications = localStorage.getItem('notificationsEnabled')
    if (savedNotifications !== null) {
      notificationsEnabled.value = JSON.parse(savedNotifications)
    }
  }
}

const showLogoutConfirm = () => {
  showLogoutModal.value = true
  closeAllDropdowns()
}

const hideLogoutConfirm = () => {
  showLogoutModal.value = false
}

const confirmLogout = async () => {
  showLogoutModal.value = false

  setGlobalLoading(true, 'در حال خروج از حساب...')

  try {
    if (isLoggedIn.value) {
      // New auth system logout
      await logout()
    } else {
      // Legacy logout
      if (process.client) {
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('username')
        legacyLoggedIn.value = false
        legacyUsername.value = ''
      }
    }

    showToast('با موفقیت خارج شدید', 'success')

    // Redirect to home after a delay
    setTimeout(() => {
      navigateTo('/')
    }, 1000)
  } catch (error) {
    showToast('خطا در خروج از حساب', 'error')
  } finally {
    setGlobalLoading(false)
  }
}

// Notifications
const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
  showToast('همه اعلانات علامت‌گذاری شدند', 'success')
}

const formatNotificationTime = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} روز پیش`
  if (hours > 0) return `${hours} ساعت پیش`
  if (minutes > 0) return `${minutes} دقیقه پیش`
  return 'الان'
}

// Modals
const showReportsModal = () => {
  closeAllDropdowns()
  showComingSoonModal.value = true
}

const showSettingsModal = () => {
  closeAllDropdowns()
  showComingSoonModal.value = true
}

const showAccountSettings = () => {
  closeAllDropdowns()
  showAccountSettingsModal.value = true
}

const hideComingSoonModal = () => {
  showComingSoonModal.value = false
}

const hideAccountSettingsModal = () => {
  showAccountSettingsModal.value = false
}

// Global loading
const setGlobalLoading = (loading, text = '') => {
  globalLoading.value = loading
  globalLoadingText.value = text
}

// Toast notifications
let toastId = 0

const showToast = (message, type = 'info', options = {}) => {
  const toast = {
    id: ++toastId,
    message,
    type,
    duration: options.duration || 5000,
    action: options.action
  }

  toasts.value.push(toast)

  // Auto remove after duration
  setTimeout(() => {
    removeToast(toast.id)
  }, toast.duration)
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Watch notifications setting
watch(notificationsEnabled, (newValue) => {
  if (process.client) {
    localStorage.setItem('notificationsEnabled', JSON.stringify(newValue))
  }
  showToast(
    newValue ? 'اعلانات فعال شد' : 'اعلانات غیرفعال شد',
    'info'
  )
})

// Lifecycle hooks
onMounted(async () => {
  // Initialize auth
  await initialize()
  checkAuthState()

  // Initialize theme
  initTheme()

  // Add event listeners
  window.addEventListener('scroll', checkScrolled)
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', handleClickOutside)

  // Initial checks
  checkScrolled()
  checkMobile()

  // Simulate loading
  setTimeout(() => {
    isInitializing.value = false
  }, 1000)
})

onBeforeUnmount(() => {
  // Cleanup
  window.removeEventListener('scroll', checkScrolled)
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('click', handleClickOutside)
  document.body.style.overflow = ''
})

// Watch route changes
const route = useRoute()
watch(() => route.path, () => {
  closeMobileMenu()
  closeAllDropdowns()
  checkAuthState()
})

// Provide global methods
provide('showToast', showToast)
provide('setGlobalLoading', setGlobalLoading)
</script>
