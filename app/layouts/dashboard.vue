<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside :class="['sidebar', { collapsed: sidebarCollapsed }]">
      <div class="sidebar-header">
        <div class="logo">
          <Icon name="heroicons:book-open" class="logo-icon" />
          <span v-if="!sidebarCollapsed" class="logo-text">کتابخانه دیجیتال</span>
        </div>
        <button @click="toggleSidebar" class="toggle-btn">
          <Icon :name="sidebarCollapsed ? 'heroicons:chevron-left' : 'heroicons:chevron-right'" />
        </button>
      </div>

      <nav class="sidebar-nav">
        <template v-for="item in filteredMenuItems" :key="item.path">
          <!-- Single item without children -->
          <NuxtLink
            v-if="!item.children"
            :to="item.path"
            class="nav-item"
            :class="{ active: isActive(item.path) }"
          >
            <Icon :name="item.icon" class="nav-icon" />
            <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
            <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
          </NuxtLink>

          <!-- Item with children -->
          <div v-else class="nav-group">
            <button
              @click="toggleGroup(item.path)"
              class="nav-item group-toggle"
              :class="{ active: isGroupActive(item) }"
            >
              <Icon :name="item.icon" class="nav-icon" />
              <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
              <Icon
                v-if="!sidebarCollapsed"
                :name="expandedGroups.includes(item.path) ? 'heroicons:chevron-down' : 'heroicons:chevron-left'"
                class="group-arrow"
              />
            </button>
            <div
              v-if="!sidebarCollapsed && expandedGroups.includes(item.path)"
              class="nav-children"
            >
              <NuxtLink
                v-for="child in item.children"
                :key="child.path"
                :to="child.path"
                class="nav-child"
                :class="{ active: isActive(child.path) }"
              >
                <Icon :name="child.icon" class="nav-icon small" />
                <span class="nav-label">{{ child.label }}</span>
              </NuxtLink>
            </div>
          </div>
        </template>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">
            <img v-if="user?.avatar_url" :src="user.avatar_url" :alt="user.name" />
            <div v-else class="avatar-placeholder">
              {{ user?.name?.charAt(0) || '?' }}
            </div>
          </div>
          <div v-if="!sidebarCollapsed" class="user-details">
            <p class="user-name">{{ user?.name }}</p>
            <p class="user-role">{{ primaryRole }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="logout-btn" :title="sidebarCollapsed ? 'خروج' : ''">
          <Icon name="heroicons:arrow-left-on-rectangle" />
          <span v-if="!sidebarCollapsed">خروج</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-container">
      <!-- Header -->
      <header class="main-header">
        <div class="header-left">
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>
        <div class="header-right">
          <button class="header-btn notification-btn">
            <Icon name="heroicons:bell" />
            <span class="notification-badge">3</span>
          </button>
          <button class="header-btn">
            <Icon name="heroicons:cog-6-tooth" />
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface MenuItem {
  path: string
  label: string
  icon: string
  badge?: string | number
  permission?: string | string[]
  role?: string | string[]
  children?: MenuItem[]
}

// Composables
const route = useRoute()
const router = useRouter()
const { user, isAdmin, hasRole, hasPermission, logout } = useAuth()
const { showToast } = useToast()

// State
const sidebarCollapsed = ref(false)
const expandedGroups = ref<string[]>([])

// Menu items with permissions
const menuItems: MenuItem[] = [
  {
    path: '/dashboard',
    label: 'داشبورد',
    icon: 'heroicons:home'
  },
  {
    path: '/dashboard/profile',
    label: 'پروفایل',
    icon: 'heroicons:user'
  },
  {
    path: '/dashboard/books',
    label: 'کتاب‌ها',
    icon: 'heroicons:book-open',
    permission: ['books.view', 'books.create', 'books.edit']
  },
  {
    path: '/dashboard/categories',
    label: 'دسته‌بندی‌ها',
    icon: 'heroicons:folder',
    permission: 'categories.view'
  },
  {
    path: '/dashboard/gallery',
    label: 'گالری',
    icon: 'heroicons:photo',
    permission: 'media.view'
  },
  {
    path: '#admin',
    label: 'مدیریت سیستم',
    icon: 'heroicons:shield-check',
    role: 'admin',
    children: [
      {
        path: '/dashboard/users',
        label: 'کاربران',
        icon: 'heroicons:users',
        permission: 'users.view'
      },
      {
        path: '/dashboard/roles',
        label: 'نقش‌ها',
        icon: 'heroicons:shield-check',
        permission: 'roles.view'
      },
      {
        path: '/dashboard/permissions',
        label: 'دسترسی‌ها',
        icon: 'heroicons:key',
        permission: 'permissions.view'
      },
      {
        path: '/dashboard/AdminStats',
        label: 'آمار سیستم',
        icon: 'heroicons:chart-bar',
        role: 'admin'
      }
    ]
  }
]

// Computed
const filteredMenuItems = computed(() => {
  return menuItems.filter(item => {
    // Check role requirement
    if (item.role) {
      if (!hasRole(item.role)) return false
    }
    
    // Check permission requirement
    if (item.permission) {
      if (!hasPermission(item.permission)) return false
    }
    
    // Filter children if exists
    if (item.children) {
      item.children = item.children.filter(child => {
        if (child.role && !hasRole(child.role)) return false
        if (child.permission && !hasPermission(child.permission)) return false
        return true
      })
      
      // If no children left, hide the parent
      if (item.children.length === 0) return false
    }
    
    return true
  })
})

const pageTitle = computed(() => {
  // Find current page in menu items
  const findTitle = (items: MenuItem[]): string => {
    for (const item of items) {
      if (item.path === route.path) {
        return item.label
      }
      if (item.children) {
        const childTitle = findTitle(item.children)
        if (childTitle) return childTitle
      }
    }
    return ''
  }
  
  return findTitle(menuItems) || 'داشبورد'
})

const primaryRole = computed(() => {
  if (isAdmin.value) return 'مدیر سیستم'
  const role = user.value?.roles?.[0]
  return role?.display_name || 'کاربر'
})

// Methods
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  if (sidebarCollapsed.value) {
    expandedGroups.value = []
  }
}

const toggleGroup = (path: string) => {
  const index = expandedGroups.value.indexOf(path)
  if (index > -1) {
    expandedGroups.value.splice(index, 1)
  } else {
    expandedGroups.value.push(path)
  }
}

const isActive = (path: string) => {
  return route.path === path
}

const isGroupActive = (item: MenuItem) => {
  if (!item.children) return false
  return item.children.some(child => route.path === child.path)
}

const handleLogout = async () => {
  if (confirm('آیا از خروج اطمینان دارید؟')) {
    await logout()
    showToast('با موفقیت خارج شدید', 'success')
  }
}

// Auto-expand active groups on mount
onMounted(() => {
  menuItems.forEach(item => {
    if (item.children && isGroupActive(item)) {
      expandedGroups.value.push(item.path)
    }
  })
  
  // Restore sidebar state from localStorage
  const savedState = localStorage.getItem('sidebarCollapsed')
  if (savedState !== null) {
    sidebarCollapsed.value = savedState === 'true'
  }
})

// Save sidebar state to localStorage
watch(sidebarCollapsed, (value) => {
  localStorage.setItem('sidebarCollapsed', value.toString())
})
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  background: #f3f4f6;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: white;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
  z-index: 100;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.125rem;
  color: #1f2937;
}

.logo-icon {
  font-size: 1.5rem;
  color: #667eea;
}

.sidebar.collapsed .logo-text {
  display: none;
}

.toggle-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.toggle-btn:hover {
  background: #e5e7eb;
}

/* Sidebar Navigation */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: right;
}

.nav-item:hover {
  background: #f9fafb;
  color: #1f2937;
}

.nav-item.active {
  background: #ede9fe;
  color: #7c3aed;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #7c3aed;
}

.nav-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.nav-icon.small {
  font-size: 1rem;
}

.nav-label {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
}

.nav-badge {
  padding: 0.125rem 0.5rem;
  background: #dc2626;
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.sidebar.collapsed .nav-label,
.sidebar.collapsed .nav-badge,
.sidebar.collapsed .group-arrow {
  display: none;
}

.sidebar.collapsed .nav-item {
  padding: 0.75rem;
  justify-content: center;
}

/* Navigation Groups */
.nav-group {
  position: relative;
}

.group-toggle {
  position: relative;
}

.group-arrow {
  margin-right: auto;
  transition: transform 0.2s;
}

.nav-children {
  background: #f9fafb;
  padding: 0.5rem 0;
}

.nav-child {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1.5rem 0.5rem 3rem;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.nav-child:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.nav-child.active {
  color: #7c3aed;
  font-weight: 500;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  margin: 0.125rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.sidebar.collapsed .user-details {
  display: none;
}

.logout-btn {
  width: 100%;
  padding: 0.75rem;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #dc2626;
  color: white;
}

/* Main Container */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Main Header */
.main-header {
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.header-right {
  display: flex;
  gap: 0.75rem;
}

.header-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
  position: relative;
}

.header-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.notification-badge {
  position: absolute;
  top: -4px;
  left: -4px;
  width: 18px;
  height: 18px;
  background: #dc2626;
  color: white;
  border-radius: 50%;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    right: -260px;
    height: 100vh;
    transition: right 0.3s ease;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar.mobile-open {
    right: 0;
  }
  
  .sidebar.collapsed {
    width: 260px;
  }
  
  .main-container {
    margin-right: 0;
  }
  
  .main-header {
    padding: 1rem;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>