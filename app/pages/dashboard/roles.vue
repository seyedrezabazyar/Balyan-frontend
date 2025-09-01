<template>
  <div class="roles-container">
    <!-- Header -->
    <header class="roles-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="roles-title">
            <Icon name="heroicons:shield-check" class="title-icon" />
            مدیریت نقش‌ها
          </h1>
          <p class="roles-subtitle">تعریف و مدیریت نقش‌ها و دسترسی‌های سیستم</p>
        </div>
        <div class="header-actions">
          <button @click="showCreateModal = true" class="btn-primary">
            <Icon name="heroicons:plus" />
            ایجاد نقش جدید
          </button>
        </div>
      </div>
    </header>

    <!-- Roles Grid -->
    <div class="roles-grid">
      <div v-for="role in roles" :key="role.id" class="role-card">
        <div class="role-header">
          <div class="role-icon" :class="`role-${role.name}`">
            <Icon :name="getRoleIcon(role.name)" />
          </div>
          <div class="role-info">
            <h3>{{ role.display_name }}</h3>
            <p class="role-name">{{ role.name }}</p>
          </div>
          <div class="role-actions">
            <button @click="editRole(role)" class="action-btn edit" title="ویرایش">
              <Icon name="heroicons:pencil" />
            </button>
            <button 
              @click="deleteRole(role)" 
              class="action-btn delete" 
              title="حذف"
              :disabled="isSystemRole(role.name)"
            >
              <Icon name="heroicons:trash" />
            </button>
          </div>
        </div>

        <p class="role-description">{{ role.description }}</p>

        <div class="role-stats">
          <div class="stat">
            <Icon name="heroicons:users" />
            <span>{{ role.users_count || 0 }} کاربر</span>
          </div>
          <div class="stat">
            <Icon name="heroicons:key" />
            <span>{{ role.permissions?.length || 0 }} دسترسی</span>
          </div>
        </div>

        <div class="permissions-section">
          <h4>دسترسی‌های این نقش:</h4>
          <div class="permissions-grid">
            <div 
              v-for="group in groupPermissions(role.permissions)" 
              :key="group.name"
              class="permission-group"
            >
              <h5>{{ getGroupDisplayName(group.name) }}</h5>
              <div class="permission-list">
                <span 
                  v-for="perm in group.permissions" 
                  :key="perm.id"
                  class="permission-badge"
                >
                  {{ perm.display_name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button @click="managePermissions(role)" class="manage-permissions-btn">
          <Icon name="heroicons:adjustments-horizontal" />
          مدیریت دسترسی‌ها
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>در حال بارگذاری...</p>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && roles.length === 0" class="empty-state">
      <Icon name="heroicons:shield-exclamation" class="empty-icon" />
      <h3>نقشی تعریف نشده است</h3>
      <p>برای شروع، یک نقش جدید ایجاد کنید</p>
    </div>

    <!-- Create/Edit Role Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click.self="closeRoleModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ showEditModal ? 'ویرایش نقش' : 'ایجاد نقش جدید' }}</h2>
          <button @click="closeRoleModal" class="close-btn">
            <Icon name="heroicons:x-mark" />
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveRole" class="role-form">
            <div class="form-group">
              <label for="name">شناسه نقش (انگلیسی)</label>
              <input
                v-model="roleForm.name"
                type="text"
                id="name"
                required
                pattern="[a-z_]+"
                placeholder="مثال: content_manager"
                :disabled="showEditModal"
              />
              <small>فقط حروف کوچک انگلیسی و _ مجاز است</small>
            </div>

            <div class="form-group">
              <label for="display_name">نام نمایشی</label>
              <input
                v-model="roleForm.display_name"
                type="text"
                id="display_name"
                required
                placeholder="مثال: مدیر محتوا"
              />
            </div>

            <div class="form-group">
              <label for="description">توضیحات</label>
              <textarea
                v-model="roleForm.description"
                id="description"
                rows="3"
                placeholder="توضیحات مربوط به این نقش..."
              ></textarea>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button @click="saveRole" class="btn-primary">
            <Icon name="heroicons:check" />
            {{ showEditModal ? 'ذخیره تغییرات' : 'ایجاد نقش' }}
          </button>
          <button @click="closeRoleModal" class="btn-secondary">
            انصراف
          </button>
        </div>
      </div>
    </div>

    <!-- Permissions Management Modal -->
    <div v-if="showPermissionsModal" class="modal-overlay" @click.self="closePermissionsModal">
      <div class="modal-content large">
        <div class="modal-header">
          <h2>مدیریت دسترسی‌های {{ selectedRole?.display_name }}</h2>
          <button @click="closePermissionsModal" class="close-btn">
            <Icon name="heroicons:x-mark" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="permissions-manager">
            <div class="search-permissions">
              <Icon name="heroicons:magnifying-glass" />
              <input
                v-model="permissionSearch"
                type="text"
                placeholder="جستجو در دسترسی‌ها..."
              />
            </div>

            <div class="all-permissions-grid">
              <div 
                v-for="group in filteredPermissionGroups" 
                :key="group.name"
                class="permission-category"
              >
                <div class="category-header">
                  <h3>{{ getGroupDisplayName(group.name) }}</h3>
                  <button @click="toggleGroupPermissions(group)" class="toggle-group-btn">
                    {{ isGroupFullySelected(group) ? 'حذف همه' : 'انتخاب همه' }}
                  </button>
                </div>
                <div class="category-permissions">
                  <label 
                    v-for="perm in group.permissions" 
                    :key="perm.id"
                    class="permission-checkbox"
                  >
                    <input
                      type="checkbox"
                      :value="perm.id"
                      v-model="selectedPermissions"
                    />
                    <span class="permission-label">
                      <span class="permission-display-name">{{ perm.display_name }}</span>
                      <span class="permission-technical-name">{{ perm.name }}</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="selected-count">
            {{ selectedPermissions.length }} دسترسی انتخاب شده
          </div>
          <div class="footer-actions">
            <button @click="savePermissions" class="btn-primary">
              <Icon name="heroicons:check" />
              ذخیره دسترسی‌ها
            </button>
            <button @click="closePermissionsModal" class="btn-secondary">
              انصراف
            </button>
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

interface PermissionGroup {
  name: string
  permissions: Permission[]
}

// Composables
const { api } = useApi()
const { showToast } = useToast()

// State
const roles = ref<Role[]>([])
const allPermissions = ref<Permission[]>([])
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showPermissionsModal = ref(false)
const selectedRole = ref<Role | null>(null)
const selectedPermissions = ref<number[]>([])
const permissionSearch = ref('')

// Role Form
const roleForm = ref({
  name: '',
  display_name: '',
  description: ''
})

// System roles that cannot be deleted
const systemRoles = ['admin', 'user']

// Computed
const filteredPermissionGroups = computed(() => {
  const groups = groupAllPermissions(allPermissions.value)
  
  if (!permissionSearch.value) return groups
  
  const search = permissionSearch.value.toLowerCase()
  
  return groups.map(group => ({
    ...group,
    permissions: group.permissions.filter(perm => 
      perm.display_name.toLowerCase().includes(search) ||
      perm.name.toLowerCase().includes(search)
    )
  })).filter(group => group.permissions.length > 0)
})

// Methods
const fetchRoles = async () => {
  loading.value = true
  try {
    const response = await api('/api/auth/roles?with_permissions=true')
    if (response.success) {
      roles.value = response.data || []
    }
  } catch (error) {
    showToast('خطا در دریافت لیست نقش‌ها', 'error')
    console.error('Error fetching roles:', error)
  } finally {
    loading.value = false
  }
}

const fetchPermissions = async () => {
  try {
    const response = await api('/api/auth/permissions')
    if (response.success) {
      // Flatten permissions from grouped response
      const permissions: Permission[] = []
      Object.values(response.data).forEach((group: any) => {
        permissions.push(...group)
      })
      allPermissions.value = permissions
    }
  } catch (error) {
    console.error('Error fetching permissions:', error)
  }
}

const getRoleIcon = (roleName: string) => {
  const icons: Record<string, string> = {
    admin: 'heroicons:shield-exclamation',
    editor: 'heroicons:pencil-square',
    moderator: 'heroicons:eye',
    author: 'heroicons:document-text',
    user: 'heroicons:user',
    content_manager: 'heroicons:document-duplicate'
  }
  return icons[roleName] || 'heroicons:user-group'
}

const isSystemRole = (roleName: string) => {
  return systemRoles.includes(roleName)
}

const groupPermissions = (permissions?: Permission[]) => {
  if (!permissions) return []
  
  const groups: Record<string, Permission[]> = {}
  
  permissions.forEach(perm => {
    const groupName = perm.name.split('.')[0]
    if (!groups[groupName]) {
      groups[groupName] = []
    }
    groups[groupName].push(perm)
  })
  
  return Object.entries(groups).map(([name, perms]) => ({
    name,
    permissions: perms
  }))
}

const groupAllPermissions = (permissions: Permission[]) => {
  const groups: Record<string, Permission[]> = {}
  
  permissions.forEach(perm => {
    const groupName = perm.name.split('.')[0]
    if (!groups[groupName]) {
      groups[groupName] = []
    }
    groups[groupName].push(perm)
  })
  
  return Object.entries(groups).map(([name, perms]) => ({
    name,
    permissions: perms
  }))
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
    reports: 'گزارش‌ها'
  }
  return names[groupName] || groupName
}

const editRole = (role: Role) => {
  selectedRole.value = role
  roleForm.value = {
    name: role.name,
    display_name: role.display_name,
    description: role.description || ''
  }
  showEditModal.value = true
}

const deleteRole = async (role: Role) => {
  if (isSystemRole(role.name)) {
    showToast('این نقش سیستمی است و قابل حذف نیست', 'error')
    return
  }

  if (!confirm(`آیا از حذف نقش ${role.display_name} اطمینان دارید؟`)) return

  try {
    const response = await api(`/api/auth/roles/${role.id}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      showToast('نقش با موفقیت حذف شد', 'success')
      fetchRoles()
    }
  } catch (error) {
    showToast('خطا در حذف نقش', 'error')
    console.error('Error deleting role:', error)
  }
}

const managePermissions = (role: Role) => {
  selectedRole.value = role
  selectedPermissions.value = role.permissions?.map(p => p.id) || []
  showPermissionsModal.value = true
}

const isGroupFullySelected = (group: PermissionGroup) => {
  return group.permissions.every(perm => selectedPermissions.value.includes(perm.id))
}

const toggleGroupPermissions = (group: PermissionGroup) => {
  if (isGroupFullySelected(group)) {
    // Remove all permissions from this group
    group.permissions.forEach(perm => {
      const index = selectedPermissions.value.indexOf(perm.id)
      if (index > -1) {
        selectedPermissions.value.splice(index, 1)
      }
    })
  } else {
    // Add all permissions from this group
    group.permissions.forEach(perm => {
      if (!selectedPermissions.value.includes(perm.id)) {
        selectedPermissions.value.push(perm.id)
      }
    })
  }
}

const saveRole = async () => {
  try {
    const endpoint = showEditModal.value 
      ? `/api/auth/roles/${selectedRole.value?.id}`
      : '/api/auth/roles'
    
    const method = showEditModal.value ? 'PUT' : 'POST'
    
    const body = {
      ...roleForm.value,
      permission_ids: showEditModal.value ? undefined : []
    }
    
    const response = await api(endpoint, {
      method,
      body
    })
    
    if (response.success) {
      showToast(
        showEditModal.value ? 'نقش با موفقیت ویرایش شد' : 'نقش جدید ایجاد شد',
        'success'
      )
      closeRoleModal()
      fetchRoles()
    }
  } catch (error) {
    showToast('خطا در ذخیره نقش', 'error')
    console.error('Error saving role:', error)
  }
}

const savePermissions = async () => {
  if (!selectedRole.value) return

  try {
    const response = await api(`/api/auth/permissions/role/${selectedRole.value.id}`, {
      method: 'PUT',
      body: {
        permission_ids: selectedPermissions.value
      }
    })
    
    if (response.success) {
      showToast('دسترسی‌های نقش با موفقیت به‌روزرسانی شد', 'success')
      closePermissionsModal()
      fetchRoles()
    }
  } catch (error) {
    showToast('خطا در به‌روزرسانی دسترسی‌ها', 'error')
    console.error('Error updating permissions:', error)
  }
}

const closeRoleModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedRole.value = null
  roleForm.value = {
    name: '',
    display_name: '',
    description: ''
  }
}

const closePermissionsModal = () => {
  showPermissionsModal.value = false
  selectedRole.value = null
  selectedPermissions.value = []
  permissionSearch.value = ''
}

// Lifecycle
onMounted(() => {
  fetchRoles()
  fetchPermissions()
})
</script>

<style scoped>
.roles-container {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.roles-header {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
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

.roles-title {
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

.roles-subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.9;
}

.btn-primary {
  background: white;
  color: #8b5cf6;
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

.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Roles Grid */
.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.role-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.role-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.role-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.role-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.role-icon.role-admin {
  background: #fee2e2;
  color: #dc2626;
}

.role-icon.role-editor {
  background: #dbeafe;
  color: #2563eb;
}

.role-icon.role-moderator {
  background: #fef3c7;
  color: #d97706;
}

.role-icon.role-author {
  background: #ede9fe;
  color: #7c3aed;
}

.role-icon.role-user {
  background: #f3f4f6;
  color: #4b5563;
}

.role-info {
  flex: 1;
}

.role-info h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #1f2937;
}

.role-name {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #6b7280;
  font-family: monospace;
}

.role-actions {
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

.action-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn.delete:hover:not(:disabled) {
  background: #dc2626;
  color: white;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.role-description {
  margin: 0 0 1rem;
  color: #4b5563;
  font-size: 0.9rem;
}

.role-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.stat svg {
  width: 16px;
  height: 16px;
}

/* Permissions Section */
.permissions-section {
  margin-bottom: 1rem;
}

.permissions-section h4 {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 600;
}

.permissions-grid {
  display: grid;
  gap: 0.75rem;
}

.permission-group h5 {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.permission-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.permission-badge {
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  color: #4b5563;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.manage-permissions-btn {
  width: 100%;
  padding: 0.75rem;
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.manage-permissions-btn:hover {
  background: #e5e7eb;
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
  border-top-color: #8b5cf6;
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
  display: flex;
  flex-direction: column;
}

.modal-content.large {
  max-width: 900px;
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
  justify-content: space-between;
  align-items: center;
}

.footer-actions {
  display: flex;
  gap: 0.75rem;
}

.selected-count {
  font-size: 0.9rem;
  color: #6b7280;
}

/* Role Form */
.role-form {
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

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8b5cf6;
}

.form-group input:disabled {
  background: #f9fafb;
  color: #6b7280;
}

.form-group small {
  font-size: 0.8rem;
  color: #6b7280;
}

/* Permissions Manager */
.permissions-manager {
  display: grid;
  gap: 1.5rem;
}

.search-permissions {
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0 1rem;
}

.search-permissions svg {
  width: 20px;
  height: 20px;
  color: #6b7280;
}

.search-permissions input {
  flex: 1;
  border: none;
  background: none;
  padding: 0.75rem;
  font-size: 0.95rem;
  outline: none;
}

.all-permissions-grid {
  display: grid;
  gap: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
}

.permission-category {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.category-header {
  background: #f9fafb;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.category-header h3 {
  margin: 0;
  font-size: 0.95rem;
  color: #374151;
  font-weight: 600;
}

.toggle-group-btn {
  padding: 0.25rem 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-group-btn:hover {
  background: #f3f4f6;
}

.category-permissions {
  padding: 0.75rem;
  display: grid;
  gap: 0.5rem;
}

.permission-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background 0.2s;
}

.permission-checkbox:hover {
  background: #f9fafb;
}

.permission-checkbox input[type="checkbox"] {
  margin-top: 0.125rem;
}

.permission-label {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.permission-display-name {
  color: #1f2937;
  font-size: 0.9rem;
}

.permission-technical-name {
  color: #9ca3af;
  font-size: 0.75rem;
  font-family: monospace;
}

/* Responsive */
@media (max-width: 768px) {
  .roles-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content.large {
    max-width: 100%;
  }
  
  .modal-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .footer-actions {
    flex-direction: column;
  }
}
</style>