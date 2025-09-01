<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside :class="['sidebar', { collapsed: sidebarCollapsed }]">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">📚</span>
          <span v-if="!sidebarCollapsed" class="logo-text">کتابخانه دیجیتال</span>
        </div>
        <button @click="toggleSidebar" class="toggle-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="sidebarCollapsed" d="M15 18l-6-6 6-6" />
            <path v-else d="M9 18l6-6-6-6" />
          </svg>
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
            <span class="nav-icon">{{ item.icon }}</span>
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
              <span class="nav-icon">{{ item.icon }}</span>
              <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
              <svg v-if="!sidebarCollapsed" class="group-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path v-if="expandedGroups.includes(item.path)" d="M6 9l6 6 6-6" />
                <path v-else d="M15 18l-6-6 6-6" />
              </svg>
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
                <span class="nav-icon small">{{ child.icon }}</span>
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span class="notification-badge">3</span>
          </button>
          <button class="header-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M20.46 20.46l-4.24-4.24M1.54 20.46l4.24-4.24" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="main-content">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { usePermissions } from '~/composables/usePermissions';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  badge?: string | number;
  permission?: string | string[];
  children?: MenuItem[];
}

// Composables
const route = useRoute();
const router = useRouter();
const { user, isAdmin, hasPermission, logout } = useAuth();
const { showToast } = useToast();
const { canViewUsers, canViewRoles, canViewPermissions, canViewBooks, canViewCategories, canViewMedia } = usePermissions();

// State
const sidebarCollapsed = ref(false);
const expandedGroups = ref<string[]>([]);

// Menu items with permissions
const menuItems: MenuItem[] = [
  {
    path: '/dashboard',
    label: 'داشبورد',
    icon: '🏠',
  },
  {
    path: '/dashboard/profile',
    label: 'پروفایل',
    icon: '👤',
  },
  {
    path: '/dashboard/books',
    label: 'کتاب‌ها',
    icon: '📚',
    permission: ['books.view', 'books.create', 'books.edit'],
  },
  {
    path: '/dashboard/categories',
    label: 'دسته‌بندی‌ها',
    icon: '📁',
    permission: 'categories.view',
  },
  {
    path: '/dashboard/gallery/books',
    label: 'گالری',
    icon: '🖼️',
    permission: 'media.view',
  },
  {
    path: '#admin',
    label: 'مدیریت سیستم',
    icon: '🛡️',
    permission: ['users.view', 'roles.view', 'permissions.view'],
    children: [
      {
        path: '/dashboard/users',
        label: 'کاربران',
        icon: '👥',
        permission: 'users.view',
      },
      {
        path: '/dashboard/roles',
        label: 'نقش‌ها',
        icon: '🔐',
        permission: 'roles.view',
      },
      {
        path: '/dashboard/permissions',
        label: 'دسترسی‌ها',
        icon: '🔑',
        permission: 'permissions.view',
      },
      {
        path: '/dashboard/admin-stats',
        label: 'آمار سیستم',
        icon: '📊',
        permission: 'reports.view',
      },
    ],
  },
];

// Computed
const filteredMenuItems = computed(() => {
  return menuItems.filter((item) => {
    // Skip permission check during SSR to avoid hydration issues
    if (process.server) return true;

    // Check if user is admin or has required permissions
    if (item.permission) {
      if (!isAdmin.value && !hasPermission(item.permission)) return false;
    }

    // Filter children if exists
    if (item.children) {
      item.children = item.children.filter((child) => {
        if (child.permission && !isAdmin.value && !hasPermission(child.permission)) return false;
        return true;
      });

      // If no children left, hide the parent
      if (item.children.length === 0) return false;
    }

    return true;
  });
});

const pageTitle = computed(() => {
  // Find current page in menu items
  const findTitle = (items: MenuItem[]): string => {
    for (const item of items) {
      if (item.path === route.path) {
        return item.label;
      }
      if (item.children) {
        const childTitle = findTitle(item.children);
        if (childTitle) return childTitle;
      }
    }
    return '';
  };

  return findTitle(menuItems) || 'داشبورد';
});

const primaryRole = computed(() => {
  if (isAdmin.value) return 'مدیر سیستم';
  const role = user.value?.roles?.[0];
  return role?.display_name || 'کاربر';
});

// Methods
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  if (sidebarCollapsed.value) {
    expandedGroups.value = [];
  }
};

const toggleGroup = (path: string) => {
  const index = expandedGroups.value.indexOf(path);
  if (index > -1) {
    expandedGroups.value.splice(index, 1);
  } else {
    expandedGroups.value.push(path);
  }
};

const isActive = (path: string) => {
  return route.path === path;
};

const isGroupActive = (item: MenuItem) => {
  if (!item.children) return false;
  return item.children.some((child) => route.path === child.path);
};

const handleLogout = async () => {
  if (confirm('آیا از خروج اطمینان دارید؟')) {
    await logout();
    showToast('با موفقیت خارج شدید', 'success');
    router.push('/auth');
  }
};

// Auto-expand active groups on mount
onMounted(() => {
  if (process.client) {
    menuItems.forEach((item) => {
      if (item.children && isGroupActive(item)) {
        expandedGroups.value.push(item.path);
      }
    });

    // Restore sidebar state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      sidebarCollapsed.value = savedState === 'true';
    }
  }
});

// Save sidebar state to localStorage
watch(sidebarCollapsed, (value) => {
  if (process.client) {
    localStorage.setItem('sidebarCollapsed', value.toString());
  }
});
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
