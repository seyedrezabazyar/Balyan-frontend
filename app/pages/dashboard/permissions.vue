<template>
  <div class="permissions-container">
    <!-- Header -->
    <header class="permissions-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="permissions-title">
            <Icon name="heroicons:key" class="title-icon" />
            مدیریت دسترسی‌ها
          </h1>
          <p class="permissions-subtitle">مشاهده و مدیریت تمامی دسترسی‌های سیستم</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">{{ totalPermissions }}</span>
            <span class="stat-label">کل دسترسی‌ها</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ Object.keys(groupedPermissions).length }}</span>
            <span class="stat-label">گروه دسترسی</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-box">
        <Icon name="heroicons:magnifying-glass" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجو در دسترسی‌ها..."
          @input="filterPermissions"
        />
      </div>
      <div class="view-controls">
        <button 
          @click="viewMode = 'grid'"
          :class="['view-btn', { active: viewMode === 'grid' }]"
        >
          <Icon name="heroicons:squares-2x2" />
          نمای کارت
        </button>
        <button 
          @click="viewMode = 'list'"
          :class="['view-btn', { active: viewMode === 'list' }]"
        >
          <Icon name="heroicons:list-bullet" />
          نمای لیست
        </button>
      </div>
    </div>

    <!-- Permissions Grid View -->
    <div v-if="viewMode === 'grid'" class="permissions-grid">
      <div 
        v-for="(permissions, groupName) in filteredPermissions" 
        :key="groupName"
        class="permission-group-card"
      >
        <div class="group-header">
          <div class="group-icon" :class="`group-${groupName}`">
            <Icon :name="getGroupIcon(groupName)" />
          </div>
          <div class="group-info">
            <h3>{{ getGroupDisplayName(groupName) }}</h3>
            <p>{{ permissions.length }} دسترسی</p>
          </div>
        </div>

        <div class="permissions-list">
          <div 
            v-for="permission in permissions" 
            :key="permission.id"
            class="permission-item"
          >
            <div class="permission-content">
              <h4>{{ permission.display_name }}</h4>
              <code>{{ permission.name }}</code>
            </div>
            <div class="permission-roles">
              <span 
                v-for="role in getPermissionRoles(permission.id)" 
                :key="role.id"
                class="role-tag"
                :class="`role-${role.name}`"
              >
                {{ role.display_name }}
              </span>
              <span v-if="!getPermissionRoles(permission.id).length" class="no-roles">
                بدون نقش
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Permissions List View -->
    <div v-else class="permissions-table-container">
      <table class="permissions-table">
        <thead>
          <tr>
            <th>گروه</th>
            <th>نام دسترسی</th>
            <th>شناسه فنی</th>
            <th>نقش‌های دارای این دسترسی</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(permissions, groupName) in filteredPermissions" :key="groupName">
            <tr v-for="permission in permissions" :key="permission.id">
              <td>
                <div class="group-badge">
                  <Icon :name="getGroupIcon(groupName)" />
                  {{ getGroupDisplayName(groupName) }}
                </div>
              </td>
              <td>
                <span class="permission-name">{{ permission.display_name }}</span>
              </td>
              <td>
                <code class="permission-code">{{ permission.name }}</code>
              </td>
              <td>
                <div class="roles-cell">
                  <span 
                    v-for="role in getPermissionRoles(permission.id)" 
                    :key="role.id"
                    class="role-tag"
                    :class="`role-${role.name}`"
                  >
                    {{ role.display_name }}
                  </span>
                  <span v-if="!getPermissionRoles(permission.id).length" class="no-roles">
                    بدون نقش
                  </span>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>در حال بارگذاری دسترسی‌ها...</p>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && totalPermissions === 0" class="empty-state">
      <Icon name="heroicons:key" class="empty-icon" />
      <h3>دسترسی‌ای یافت نشد</h3>
      <p>هیچ دسترسی در سیستم تعریف نشده است</p>
    </div>

    <!-- Permission Details Modal -->
    <div v-if="selectedPermission" class="modal-overlay" @click.self="closeDetailsModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>جزئیات دسترسی</h2>
          <button @click="closeDetailsModal" class="close-btn">
            <Icon name="heroicons:x-mark" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="permission-details">
            <div class="detail-row">
              <label>نام نمایشی:</label>
              <span>{{ selectedPermission.display_name }}</span>
            </div>
            <div class="detail-row">
              <label>شناسه فنی:</label>
              <code>{{ selectedPermission.name }}</code>
            </div>
            <div class="detail-row">
              <label>گروه:</label>
              <span>{{ getGroupDisplayName(selectedPermission.name.split('.')[0]) }}</span>
            </div>
            <div class="detail-row">
              <label>نقش‌های دارای این دسترسی:</label>
              <div class="roles-list">
                <span 
                  v-for="role in getPermissionRoles(selectedPermission.id)" 
                  :key="role.id"
                  class="role-badge"
                >
                  {{ role.display_name }}
                </span>
                <span v-if="!getPermissionRoles(selectedPermission.id).length" class="no-roles">
                  هیچ نقشی این دسترسی را ندارد
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Define middleware
definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'dashboard'
})

// Types
interface Permission {
  id: number
  name: string
  display_name: string
}

interface Role {
  id: number
  name: string
  display_name: string
  permissions?: Permission[]
}

// Composables
const { api } = useApi()
const { showToast } = useToast()

// State
const permissions = ref<Record<string, Permission[]>>({})
const roles = ref<Role[]>([])
const loading = ref(false)
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const selectedPermission = ref<Permission | null>(null)

// Computed
const groupedPermissions = computed(() => permissions.value)

const totalPermissions = computed(() => {
  return Object.values(permissions.value).reduce((total, group) => total + group.length, 0)
})

const filteredPermissions = computed(() => {
  if (!searchQuery.value) return permissions.value
  
  const search = searchQuery.value.toLowerCase()
  const filtered: Record<string, Permission[]> = {}
  
  Object.entries(permissions.value).forEach(([groupName, perms]) => {
    const filteredPerms = perms.filter(perm => 
      perm.display_name.toLowerCase().includes(search) ||
      perm.name.toLowerCase().includes(search) ||
      getGroupDisplayName(groupName).toLowerCase().includes(search)
    )
    
    if (filteredPerms.length > 0) {
      filtered[groupName] = filteredPerms
    }
  })
  
  return filtered
})

// Methods
const fetchPermissions = async () => {
  loading.value = true
  try {
    const response = await api('/api/auth/permissions')
    if (response.success) {
      permissions.value = response.data || {}
    }
  } catch (error) {
    showToast('خطا در دریافت دسترسی‌ها', 'error')
    console.error('Error fetching permissions:', error)
  } finally {
    loading.value = false
  }
}

const fetchRoles = async () => {
  try {
    const response = await api('/api/auth/roles?with_permissions=true')
    if (response.success) {
      roles.value = response.data || []
    }
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

const getGroupDisplayName = (groupName: string) => {
  const names: Record<string, string> = {
    users: 'کاربران',
    books: 'کتاب‌ها',
    posts: 'مقالات',
    comments: 'نظرات',
    categories: 'دسته‌بندی‌ها',
    media: 'رسانه‌ها',
    settings: 'تنظیمات',
    reports: 'گزارش‌ها',
    roles: 'نقش‌ها',
    permissions: 'دسترسی‌ها'
  }
  return names[groupName] || groupName
}

const getGroupIcon = (groupName: string) => {
  const icons: Record<string, string> = {
    users: 'heroicons:users',
    books: 'heroicons:book-open',
    posts: 'heroicons:document-text',
    comments: 'heroicons:chat-bubble-left-right',
    categories: 'heroicons:folder',
    media: 'heroicons:photo',
    settings: 'heroicons:cog-6-tooth',
    reports: 'heroicons:chart-bar',
    roles: 'heroicons:shield-check',
    permissions: 'heroicons:key'
  }
  return icons[groupName] || 'heroicons:cube'
}

const getPermissionRoles = (permissionId: number) => {
  return roles.value.filter(role => 
    role.permissions?.some(p => p.id === permissionId)
  )
}

const filterPermissions = () => {
  // Filtering is handled by computed property
}

const showPermissionDetails = (permission: Permission) => {
  selectedPermission.value = permission
}

const closeDetailsModal = () => {
  selectedPermission.value = null
}

// Lifecycle
onMounted(() => {
  fetchPermissions()
  fetchRoles()
})
</script>

<style scoped>
.permissions-container {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.permissions-header {
  background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.permissions-title {
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.title-icon {
  font-size: 2rem;
}

.permissions-subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.9;
}

.header-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

/* Search Section */
.search-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0 1rem;
}

.search-box svg {
  width: 20px;
  height: 20px;
  color: #6b7280;
}

.search-box input {
  flex: 1;
  border: none;
  background: none;
  padding: 0.75rem;
  font-size: 0.95rem;
  outline: none;
}

.view-controls {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.view-btn:hover {
  background: #e5e7eb;
}

.view-btn.active {
  background: #f59e0b;
  color: white;
}

/* Grid View */
.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.permission-group-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.permission-group-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.group-header {
  padding: 1.5rem;
  background: #f9fafb;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.group-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.group-icon.group-users {
  background: #dbeafe;
  color: #2563eb;
}

.group-icon.group-books {
  background: #d1fae5;
  color: #10b981;
}

.group-icon.group-posts {
  background: #ede9fe;
  color: #8b5cf6;
}

.group-icon.group-comments {
  background: #fed7aa;
  color: #ea580c;
}

.group-icon.group-categories {
  background: #fef3c7;
  color: #d97706;
}

.group-icon.group-media {
  background: #fce7f3;
  color: #ec4899;
}

.group-icon.group-settings {
  background: #e0e7ff;
  color: #4f46e5;
}

.group-icon.group-reports {
  background: #ccfbf1;
  color: #14b8a6;
}

.group-info h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #1f2937;
}

.group-info p {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.permissions-list {
  padding: 1rem;
  display: grid;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.permission-item {
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
}

.permission-item:hover {
  background: #f3f4f6;
}

.permission-content h4 {
  margin: 0;
  font-size: 0.9rem;
  color: #1f2937;
}

.permission-content code {
  display: block;
  margin: 0.25rem 0 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.permission-roles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.role-tag {
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.role-tag.role-admin {
  background: #fee2e2;
  color: #dc2626;
}

.role-tag.role-editor {
  background: #dbeafe;
  color: #2563eb;
}

.role-tag.role-moderator {
  background: #fef3c7;
  color: #d97706;
}

.role-tag.role-author {
  background: #ede9fe;
  color: #7c3aed;
}

.role-tag.role-user {
  background: #f3f4f6;
  color: #4b5563;
}

.no-roles {
  font-size: 0.75rem;
  color: #9ca3af;
  font-style: italic;
}

/* Table View */
.permissions-table-container {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.permissions-table {
  width: 100%;
  border-collapse: collapse;
}

.permissions-table thead {
  background: #f9fafb;
}

.permissions-table th {
  padding: 1rem;
  text-align: right;
  font-weight: 600;
  color: #4b5563;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.permissions-table tbody tr {
  border-top: 1px solid #e5e7eb;
  transition: background 0.2s;
}

.permissions-table tbody tr:hover {
  background: #f9fafb;
}

.permissions-table td {
  padding: 1rem;
}

.group-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.group-badge svg {
  width: 16px;
  height: 16px;
}

.permission-name {
  font-weight: 500;
  color: #1f2937;
}

.permission-code {
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  color: #4b5563;
}

.roles-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

/* Loading State */
.loading-state {
  padding: 4rem 2rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #f59e0b;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty State */
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 1rem;
}

.empty-icon {
  font-size: 4rem;
  color: #e5e7eb;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #4b5563;
  margin: 0 0 0.5rem;
}

.empty-state p {
  color: #9ca3af;
  margin: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2937;
}

.close-btn {
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
}

.close-btn:hover {
  background: #e5e7eb;
}

.modal-body {
  padding: 1.5rem;
}

.permission-details {
  display: grid;
  gap: 1rem;
}

.detail-row {
  display: grid;
  gap: 0.5rem;
}

.detail-row label {
  font-weight: 500;
  color: #4b5563;
  font-size: 0.9rem;
}

.detail-row span,
.detail-row code {
  color: #1f2937;
}

.detail-row code {
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  width: fit-content;
}

.roles-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

/* Responsive */
@media (max-width: 768px) {
  .permissions-grid {
    grid-template-columns: 1fr;
  }
  
  .search-section {
    flex-direction: column;
  }
  
  .search-box {
    width: 100%;
  }
  
  .header-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .permissions-table {
    font-size: 0.875rem;
  }
  
  .permissions-table th,
  .permissions-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>