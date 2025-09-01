<template>
  <div class="users-container">
    <!-- Header -->
    <header class="users-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="users-title">
            <Icon name="heroicons:users-solid" class="title-icon" />
            مدیریت کاربران
          </h1>
          <p class="users-subtitle">مدیریت کاربران سیستم، نقش‌ها و سطح دسترسی‌ها</p>
        </div>
        <div class="header-actions">
          <button @click="showAddUserModal = true" class="btn-primary">
            <Icon name="heroicons:plus" />
            افزودن کاربر جدید
          </button>
        </div>
      </div>
    </header>

    <!-- Statistics Cards -->
    <div class="stats-grid" v-if="statistics">
      <div class="stat-card">
        <div class="stat-icon blue">
          <Icon name="heroicons:users" />
        </div>
        <div class="stat-content">
          <h3>کل کاربران</h3>
          <p class="stat-value">{{ statistics.total_users?.toLocaleString('fa-IR') || 0 }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green">
          <Icon name="heroicons:envelope-check" />
        </div>
        <div class="stat-content">
          <h3>ایمیل تایید شده</h3>
          <p class="stat-value">{{ statistics.verified_emails?.toLocaleString('fa-IR') || 0 }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon purple">
          <Icon name="heroicons:device-phone-mobile" />
        </div>
        <div class="stat-content">
          <h3>تلفن تایید شده</h3>
          <p class="stat-value">{{ statistics.verified_phones?.toLocaleString('fa-IR') || 0 }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orange">
          <Icon name="heroicons:key" />
        </div>
        <div class="stat-content">
          <h3>دارای رمز عبور</h3>
          <p class="stat-value">{{ statistics.users_with_password?.toLocaleString('fa-IR') || 0 }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon teal">
          <Icon name="heroicons:user-plus" />
        </div>
        <div class="stat-content">
          <h3>ثبت‌نام اخیر</h3>
          <p class="stat-value">{{ statistics.recent_registrations?.toLocaleString('fa-IR') || 0 }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon red">
          <Icon name="heroicons:lock-closed" />
        </div>
        <div class="stat-content">
          <h3>حساب قفل شده</h3>
          <p class="stat-value">{{ statistics.locked_accounts?.toLocaleString('fa-IR') || 0 }}</p>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="search-box">
        <Icon name="heroicons:magnifying-glass" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجو در نام، ایمیل یا شماره تلفن..."
          @input="debouncedSearch"
        />
      </div>

      <div class="filter-controls">
        <select v-model="filters.email_verified" @change="() => fetchUsers()" class="filter-select">
          <option value="">همه ایمیل‌ها</option>
          <option value="true">ایمیل تایید شده</option>
          <option value="false">ایمیل تایید نشده</option>
        </select>

        <select v-model="filters.phone_verified" @change="() => fetchUsers()" class="filter-select">
          <option value="">همه تلفن‌ها</option>
          <option value="true">تلفن تایید شده</option>
          <option value="false">تلفن تایید نشده</option>
        </select>

        <select v-model="filters.role" @change="() => fetchUsers()" class="filter-select">
          <option value="">همه نقش‌ها</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.display_name }}
          </option>
        </select>

        <button @click="resetFilters" class="btn-secondary">
          <Icon name="heroicons:arrow-path" />
          پاک کردن فیلترها
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="table-container">
      <table class="users-table" v-if="users.length > 0">
        <thead>
          <tr>
            <th>کاربر</th>
            <th>اطلاعات تماس</th>
            <th>نقش‌ها</th>
            <th>وضعیت</th>
            <th>تاریخ عضویت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>
              <div class="user-info">
                <div class="user-avatar">
                  <img v-if="user.avatar_url" :src="user.avatar_url" :alt="user.name" loading="lazy" />
                  <div v-else class="avatar-placeholder">
                    {{ user.name?.charAt(0) || '?' }}
                  </div>
                </div>
                <div>
                  <p class="user-name">{{ user.name }}</p>
                  <p class="user-id">ID: {{ user.id }}</p>
                </div>
              </div>
            </td>
            <td>
              <div class="contact-info">
                <div v-if="user.email" class="contact-item">
                  <Icon name="heroicons:envelope" />
                  <span>{{ user.email }}</span>
                  <span v-if="user.email_verified_at" class="verified-badge">
                    <Icon name="heroicons:check-circle" />
                  </span>
                </div>
                <div v-if="user.phone" class="contact-item">
                  <Icon name="heroicons:phone" />
                  <span>{{ user.phone }}</span>
                  <span v-if="user.phone_verified_at" class="verified-badge">
                    <Icon name="heroicons:check-circle" />
                  </span>
                </div>
              </div>
            </td>
            <td>
              <div class="roles-list">
                <span
                  v-for="role in user.roles"
                  :key="role.id"
                  class="role-badge"
                  :class="`role-${role.name}`"
                >
                  {{ role.display_name }}
                </span>
                <span v-if="!user.roles?.length" class="no-role">بدون نقش</span>
              </div>
            </td>
            <td>
              <div class="status-info">
                <span v-if="user.locked_until" class="status-badge locked">
                  <Icon name="heroicons:lock-closed" />
                  قفل شده
                </span>
                <span v-else class="status-badge active">
                  <Icon name="heroicons:check-circle" />
                  فعال
                </span>
              </div>
            </td>
            <td>
              <div class="date-info">
                {{ formatDate(user.created_at) }}
              </div>
            </td>
            <td>
              <div class="actions">
                <button @click="editUser(user)" class="action-btn edit" title="ویرایش">
                  <Icon name="heroicons:pencil" />
                </button>
                <button @click="manageRoles(user)" class="action-btn roles" title="مدیریت نقش‌ها">
                  <Icon name="heroicons:shield-check" />
                </button>
                <button 
                  @click="toggleLock(user)" 
                  class="action-btn"
                  :class="user.locked_until ? 'unlock' : 'lock'"
                  :title="user.locked_until ? 'باز کردن قفل' : 'قفل کردن'"
                >
                  <Icon :name="user.locked_until ? 'heroicons:lock-open' : 'heroicons:lock-closed'" />
                </button>
                <button @click="deleteUser(user)" class="action-btn delete" title="حذف">
                  <Icon name="heroicons:trash" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-else-if="!loading" class="empty-state">
        <Icon name="heroicons:users" class="empty-icon" />
        <h3>کاربری یافت نشد</h3>
        <p>هیچ کاربری با فیلترهای انتخاب شده یافت نشد</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.last_page > 1" class="pagination">
      <button 
        @click="changePage(pagination.current_page - 1)"
        :disabled="pagination.current_page === 1"
        class="pagination-btn"
      >
        <Icon name="heroicons:chevron-right" />
      </button>
      
      <div class="pagination-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="changePage(page)"
          :class="['pagination-number', { active: page === pagination.current_page }]"
        >
          {{ page }}
        </button>
      </div>

      <button 
        @click="changePage(pagination.current_page + 1)"
        :disabled="pagination.current_page === pagination.last_page"
        class="pagination-btn"
      >
        <Icon name="heroicons:chevron-left" />
      </button>
    </div>

    <!-- Role Management Modal -->
    <div v-if="showRoleModal" class="modal-overlay" @click.self="closeRoleModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>مدیریت نقش‌های {{ selectedUser?.name }}</h2>
          <button @click="closeRoleModal" class="close-btn">
            <Icon name="heroicons:x-mark" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="roles-grid">
            <div v-for="role in roles" :key="role.id" class="role-item">
              <label class="role-checkbox">
                <input
                  type="checkbox"
                  :checked="userHasRole(role)"
                  @change="toggleRole(role)"
                />
                <div class="role-info">
                  <h4>{{ role.display_name }}</h4>
                  <p>{{ role.description }}</p>
                  <div v-if="role.permissions?.length" class="permissions-preview">
                    <span v-for="perm in role.permissions.slice(0, 3)" :key="perm.id" class="permission-tag">
                      {{ perm.display_name }}
                    </span>
                    <span v-if="role.permissions.length > 3" class="more-permissions">
                      +{{ role.permissions.length - 3 }} دسترسی دیگر
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="saveRoles" class="btn-primary">
            <Icon name="heroicons:check" />
            ذخیره تغییرات
          </button>
          <button @click="closeRoleModal" class="btn-secondary">
            انصراف
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div v-if="showAddUserModal || showEditModal" class="modal-overlay" @click.self="closeUserModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ showEditModal ? 'ویرایش کاربر' : 'افزودن کاربر جدید' }}</h2>
          <button @click="closeUserModal" class="close-btn">
            <Icon name="heroicons:x-mark" />
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveUser" class="user-form">
            <div class="form-group">
              <label for="name">نام و نام خانوادگی</label>
              <input
                v-model="userForm.name"
                type="text"
                id="name"
                required
                placeholder="نام کامل کاربر"
              />
            </div>

            <div class="form-group">
              <label for="email">ایمیل</label>
              <input
                v-model="userForm.email"
                type="email"
                id="email"
                placeholder="email@example.com"
              />
            </div>

            <div class="form-group">
              <label for="phone">شماره تلفن</label>
              <input
                v-model="userForm.phone"
                type="tel"
                id="phone"
                placeholder="09123456789"
              />
            </div>

            <div class="form-group" v-if="!showEditModal">
              <label for="password">رمز عبور</label>
              <input
                v-model="userForm.password"
                type="password"
                id="password"
                placeholder="رمز عبور (اختیاری)"
              />
            </div>

            <div class="form-group">
              <label>نقش‌های کاربر</label>
              <div class="roles-select">
                <label v-for="role in roles" :key="role.id" class="role-option">
                  <input
                    type="checkbox"
                    :value="role.id"
                    v-model="userForm.roles"
                  />
                  <span>{{ role.display_name }}</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button @click="saveUser" class="btn-primary">
            <Icon name="heroicons:check" />
            {{ showEditModal ? 'ذخیره تغییرات' : 'ایجاد کاربر' }}
          </button>
          <button @click="closeUserModal" class="btn-secondary">
            انصراف
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { debounce } from '~/utils/helpers'

// Define middleware
definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'dashboard'
})

// Types
interface User {
  id: number
  name: string
  email?: string
  phone?: string
  email_verified_at?: string
  phone_verified_at?: string
  roles?: Role[]
  locked_until?: string
  created_at: string
  avatar_url?: string
}

interface Role {
  id: number
  name: string
  display_name: string
  description?: string
  permissions?: Permission[]
  users_count?: number
}

interface Permission {
  id: number
  name: string
  display_name: string
}

interface Statistics {
  total_users: number
  verified_emails: number
  verified_phones: number
  users_with_password: number
  recent_registrations: number
  locked_accounts: number
}

interface Pagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// Composables
const { api } = useApi()
const { showToast } = useToast()

// State
const users = ref<User[]>([])
const roles = ref<Role[]>([])
const statistics = ref<Statistics | null>(null)
const pagination = ref<Pagination | null>(null)
const loading = ref(false)
const searchQuery = ref('')
const filters = ref({
  email_verified: '',
  phone_verified: '',
  role: ''
})

// Modals
const showRoleModal = ref(false)
const showAddUserModal = ref(false)
const showEditModal = ref(false)
const selectedUser = ref<User | null>(null)
const selectedUserRoles = ref<number[]>([])

// User Form
const userForm = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  roles: [] as number[]
})

// Computed
const visiblePages = computed(() => {
  if (!pagination.value) return []
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages = []
  
  for (let i = Math.max(1, current - 2); i <= Math.min(last, current + 2); i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const fetchUsers = async (page = 1) => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: '20',
      ...(searchQuery.value && { search: searchQuery.value }),
      ...(filters.value.email_verified && { email_verified: filters.value.email_verified }),
      ...(filters.value.phone_verified && { phone_verified: filters.value.phone_verified }),
      ...(filters.value.role && { role: filters.value.role })
    })

    const response = await api(`/api/auth/users?${params}`)
    
    if (response.success) {
      users.value = response.data || []
      pagination.value = response.meta || null
    }
  } catch (error) {
    showToast('خطا در دریافت لیست کاربران', 'error')
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

const fetchStatistics = async () => {
  try {
    const response = await api('/api/auth/users/statistics')
    if (response.success) {
      statistics.value = response.data
    }
  } catch (error) {
    console.error('Error fetching statistics:', error)
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

const debouncedSearch = debounce(() => {
  fetchUsers()
}, 500)

const resetFilters = () => {
  searchQuery.value = ''
  filters.value = {
    email_verified: '',
    phone_verified: '',
    role: ''
  }
  fetchUsers()
}

const changePage = (page: number) => {
  if (page >= 1 && pagination.value && page <= pagination.value.last_page) {
    fetchUsers(page)
  }
}

const editUser = (user: User) => {
  selectedUser.value = user
  userForm.value = {
    name: user.name,
    email: user.email || '',
    phone: user.phone || '',
    password: '',
    roles: user.roles?.map(r => r.id) || []
  }
  showEditModal.value = true
}

const manageRoles = (user: User) => {
  selectedUser.value = user
  selectedUserRoles.value = user.roles?.map(r => r.id) || []
  showRoleModal.value = true
}

const userHasRole = (role: Role) => {
  return selectedUserRoles.value.includes(role.id)
}

const toggleRole = (role: Role) => {
  const index = selectedUserRoles.value.indexOf(role.id)
  if (index > -1) {
    selectedUserRoles.value.splice(index, 1)
  } else {
    selectedUserRoles.value.push(role.id)
  }
}

const saveRoles = async () => {
  if (!selectedUser.value) return

  try {
    // Get current roles
    const currentRoles = selectedUser.value.roles?.map(r => r.id) || []
    
    // Find roles to add and remove
    const rolesToAdd = selectedUserRoles.value.filter(id => !currentRoles.includes(id))
    const rolesToRemove = currentRoles.filter(id => !selectedUserRoles.value.includes(id))

    // Remove roles
    for (const roleId of rolesToRemove) {
      await api(`/api/auth/roles/user/${selectedUser.value.id}/remove`, {
        method: 'POST',
        body: { role_id: roleId }
      })
    }

    // Add roles
    for (const roleId of rolesToAdd) {
      await api(`/api/auth/roles/user/${selectedUser.value.id}/assign`, {
        method: 'POST',
        body: { role_id: roleId }
      })
    }

    showToast('نقش‌های کاربر با موفقیت به‌روزرسانی شد', 'success')
    closeRoleModal()
    fetchUsers()
  } catch (error) {
    showToast('خطا در به‌روزرسانی نقش‌ها', 'error')
    console.error('Error updating roles:', error)
  }
}

const toggleLock = async (user: User) => {
  try {
    const response = await api(`/api/auth/users/${user.id}/toggle-lock`, {
      method: 'POST'
    })
    
    if (response.success) {
      showToast(
        user.locked_until ? 'حساب کاربر باز شد' : 'حساب کاربر قفل شد',
        'success'
      )
      fetchUsers()
    }
  } catch (error) {
    showToast('خطا در تغییر وضعیت قفل', 'error')
    console.error('Error toggling lock:', error)
  }
}

const deleteUser = async (user: User) => {
  if (!confirm(`آیا از حذف کاربر ${user.name} اطمینان دارید؟`)) return

  try {
    const response = await api(`/api/auth/users/${user.id}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      showToast('کاربر با موفقیت حذف شد', 'success')
      fetchUsers()
    }
  } catch (error) {
    showToast('خطا در حذف کاربر', 'error')
    console.error('Error deleting user:', error)
  }
}

const saveUser = async () => {
  try {
    const endpoint = showEditModal.value 
      ? `/api/auth/users/${selectedUser.value?.id}`
      : '/api/auth/users'
    
    const method = showEditModal.value ? 'PUT' : 'POST'
    
    const response = await api(endpoint, {
      method,
      body: userForm.value
    })
    
    if (response.success) {
      showToast(
        showEditModal.value ? 'کاربر با موفقیت ویرایش شد' : 'کاربر جدید ایجاد شد',
        'success'
      )
      closeUserModal()
      fetchUsers()
    }
  } catch (error) {
    showToast('خطا در ذخیره اطلاعات کاربر', 'error')
    console.error('Error saving user:', error)
  }
}

const closeRoleModal = () => {
  showRoleModal.value = false
  selectedUser.value = null
  selectedUserRoles.value = []
}

const closeUserModal = () => {
  showAddUserModal.value = false
  showEditModal.value = false
  selectedUser.value = null
  userForm.value = {
    name: '',
    email: '',
    phone: '',
    password: '',
    roles: []
  }
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fa-IR')
}

// Lifecycle
onMounted(() => {
  fetchUsers()
  fetchStatistics()
  fetchRoles()
})
</script>

<style scoped>
.users-container {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.users-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.users-title {
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

.users-subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.9;
}

.btn-primary {
  background: white;
  color: #667eea;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.blue {
  background: #e0e7ff;
  color: #4f46e5;
}

.stat-icon.green {
  background: #d1fae5;
  color: #10b981;
}

.stat-icon.purple {
  background: #ede9fe;
  color: #8b5cf6;
}

.stat-icon.orange {
  background: #fed7aa;
  color: #ea580c;
}

.stat-icon.teal {
  background: #ccfbf1;
  color: #14b8a6;
}

.stat-icon.red {
  background: #fee2e2;
  color: #dc2626;
}

.stat-content h3 {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0.25rem 0 0;
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0 1rem;
}

.search-box svg {
  color: #6b7280;
  width: 20px;
  height: 20px;
}

.search-box input {
  flex: 1;
  border: none;
  background: none;
  padding: 0.75rem;
  font-size: 0.95rem;
  outline: none;
}

.filter-controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.3s;
}

.filter-select:hover,
.filter-select:focus {
  border-color: #667eea;
  outline: none;
}

.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Table Container */
.table-container {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: #f9fafb;
}

.users-table th {
  padding: 1rem;
  text-align: right;
  font-weight: 600;
  color: #4b5563;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.users-table tbody tr {
  border-top: 1px solid #e5e7eb;
  transition: background 0.2s;
}

.users-table tbody tr:hover {
  background: #f9fafb;
}

.users-table td {
  padding: 1rem;
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
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

.user-name {
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.user-id {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0;
}

/* Contact Info */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4b5563;
}

.contact-item svg {
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.verified-badge {
  color: #10b981;
}

/* Roles */
.roles-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.role-badge.role-admin {
  background: #fee2e2;
  color: #dc2626;
}

.role-badge.role-editor {
  background: #dbeafe;
  color: #2563eb;
}

.role-badge.role-moderator {
  background: #fef3c7;
  color: #d97706;
}

.role-badge.role-author {
  background: #ede9fe;
  color: #7c3aed;
}

.role-badge.role-user {
  background: #f3f4f6;
  color: #4b5563;
}

.no-role {
  color: #9ca3af;
  font-size: 0.875rem;
}

/* Status */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge svg {
  width: 14px;
  height: 14px;
}

.status-badge.active {
  background: #d1fae5;
  color: #10b981;
}

.status-badge.locked {
  background: #fee2e2;
  color: #dc2626;
}

/* Date Info */
.date-info {
  font-size: 0.9rem;
  color: #6b7280;
}

/* Actions */
.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 0.375rem;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.edit {
  background: #dbeafe;
  color: #2563eb;
}

.action-btn.edit:hover {
  background: #2563eb;
  color: white;
}

.action-btn.roles {
  background: #ede9fe;
  color: #7c3aed;
}

.action-btn.roles:hover {
  background: #7c3aed;
  color: white;
}

.action-btn.lock {
  background: #fef3c7;
  color: #d97706;
}

.action-btn.lock:hover {
  background: #d97706;
  color: white;
}

.action-btn.unlock {
  background: #d1fae5;
  color: #10b981;
}

.action-btn.unlock:hover {
  background: #10b981;
  color: white;
}

.action-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #dc2626;
  color: white;
}

/* Empty State */
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
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

/* Loading State */
.loading-state {
  padding: 4rem 2rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: #6b7280;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 0.25rem;
}

.pagination-number {
  min-width: 36px;
  height: 36px;
  padding: 0 0.75rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.pagination-number:hover {
  background: #f3f4f6;
}

.pagination-number.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
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
  display: flex;
  flex-direction: column;
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
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Roles Grid in Modal */
.roles-grid {
  display: grid;
  gap: 1rem;
}

.role-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.2s;
}

.role-item:hover {
  border-color: #667eea;
}

.role-checkbox {
  display: flex;
  padding: 1rem;
  cursor: pointer;
  gap: 1rem;
}

.role-checkbox input[type="checkbox"] {
  margin-top: 0.25rem;
}

.role-info h4 {
  margin: 0 0 0.25rem;
  color: #1f2937;
}

.role-info p {
  margin: 0 0 0.75rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.permissions-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.permission-tag {
  padding: 0.125rem 0.5rem;
  background: #f3f4f6;
  color: #4b5563;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.more-permissions {
  padding: 0.125rem 0.5rem;
  color: #667eea;
  font-size: 0.75rem;
  font-weight: 500;
}

/* User Form */
.user-form {
  display: grid;
  gap: 1.25rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.roles-select {
  display: grid;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.role-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background 0.2s;
}

.role-option:hover {
  background: #f9fafb;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-section {
    flex-direction: column;
  }
  
  .search-box {
    width: 100%;
  }
  
  .filter-controls {
    width: 100%;
  }
  
  .users-table {
    font-size: 0.875rem;
  }
  
  .users-table th,
  .users-table td {
    padding: 0.75rem 0.5rem;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>