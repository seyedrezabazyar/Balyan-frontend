<template>
  <div class="users-container">
    <!-- Header -->
    <header class="users-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="users-title">مدیریت کاربران</h1>
          <p class="users-subtitle">مدیریت کاربران سیستم و مجوزهای آنها</p>
        </div>
        <div class="header-actions">
          <button @click="showAddModal = true" class="add-user-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            افزودن کاربر
          </button>
        </div>
      </div>
    </header>

    <main class="users-main">
      <!-- Filters -->
      <div class="filters-section">
        <div class="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو کاربران..."
            @input="debouncedSearch"
          />
        </div>

        <div class="filter-controls">
          <select v-model="filters.emailVerified" @change="applyFilters" class="filter-select">
            <option value="">همه ایمیل‌ها</option>
            <option value="true">تایید شده</option>
            <option value="false">تایید نشده</option>
          </select>

          <select v-model="filters.phoneVerified" @change="applyFilters" class="filter-select">
            <option value="">همه تلفن‌ها</option>
            <option value="true">تایید شده</option>
            <option value="false">تایید نشده</option>
          </select>

          <select v-model="filters.preferredMethod" @change="applyFilters" class="filter-select">
            <option value="">همه روش‌ها</option>
            <option value="password">رمز عبور</option>
            <option value="otp">OTP</option>
          </select>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid" v-if="userStats">
        <div class="stat-card">
          <div class="stat-icon total">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3>کل کاربران</h3>
            <p class="stat-value">{{ userStats.total_users.toLocaleString() }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon verified">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-content">
            <h3>ایمیل تایید شده</h3>
            <p class="stat-value">{{ userStats.verified_emails.toLocaleString() }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon otp">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3>تلفن تایید شده</h3>
            <p class="stat-value">{{ userStats.verified_phones.toLocaleString() }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
              <path d="M9 12l2 2 4-4"></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3>اکانت‌های قفل شده</h3>
            <p class="stat-value">{{ userStats.locked_accounts.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="table-container">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>در حال بارگذاری...</p>
        </div>

        <div v-else-if="users.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
          <h3>کاربری یافت نشد</h3>
          <p>{{ searchQuery ? 'نتیجه‌ای برای جستجوی شما یافت نشد' : 'هنوز کاربری وجود ندارد' }}</p>
        </div>

        <table v-else class="users-table">
          <thead>
          <tr>
            <th @click="sortBy('name')" class="sortable">
              کاربر
              <span v-if="sortField === 'name'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th>اطلاعات تماس</th>
            <th>نقش‌ها</th>
            <th>وضعیت</th>
            <th>روش ورود</th>
            <th @click="sortBy('last_login_at')" class="sortable">
              آخرین ورود
              <span v-if="sortField === 'last_login_at'" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th>عملیات</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in users" :key="user.id" class="user-row">
            <td class="user-cell">
              <div class="user-info">
                <div class="user-avatar">
                  {{ getInitials(user.name) }}
                </div>
                <div class="user-details">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-username">@{{ user.username || 'نامشخص' }}</span>
                  <span v-if="user.is_admin" class="admin-badge">مدیر</span>
                </div>
              </div>
            </td>
            <td class="contact-cell">
              <div class="contact-info">
                <div v-if="user.email" class="contact-item email">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22 6 12 13 2 6"></polyline>
                  </svg>
                  <span>{{ user.email }}</span>
                  <button
                    v-if="user.email_verified_at"
                    class="verified-badge"
                    title="تایید شده"
                  >✓</button>
                  <button
                    v-else
                    @click="verifyEmail(user)"
                    class="verify-btn"
                    title="تایید کنید"
                  >!</button>
                </div>
                <div v-if="user.phone" class="contact-item phone">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>{{ user.phone }}</span>
                  <button
                    v-if="user.phone_verified_at"
                    class="verified-badge"
                    title="تایید شده"
                  >✓</button>
                  <button
                    v-else
                    @click="verifyPhone(user)"
                    class="verify-btn"
                    title="تایید کنید"
                  >!</button>
                </div>
              </div>
            </td>
            <td>
              <div class="roles-list">
                <span v-for="role in user.roles || []" :key="role.id" class="role-badge">{{ role.display_name || role.name }}</span>
                <span v-if="!user.roles || user.roles.length === 0" class="role-badge empty">-</span>
              </div>
            </td>
            <td class="status-cell">
              <span :class="['status-badge', getUserStatus(user)]">
                {{ getUserStatusText(user) }}
              </span>
            </td>
            <td class="method-cell">
              <span :class="['method-badge', user.preferred_method]">
                {{ user.preferred_method === 'otp' ? 'OTP' : 'رمز عبور' }}
              </span>
            </td>
            <td class="date-cell">
              {{ formatDate(user.last_login_at) || 'هرگز' }}
            </td>
            <td class="actions-cell">
              <div class="action-buttons">
                <button @click="editUser(user)" class="action-btn edit" title="ویرایش">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button @click="viewUser(user)" class="action-btn view" title="مشاهده">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
                <button @click="manageRoles(user)" class="action-btn" title="مدیریت نقش‌ها">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 7H4" />
                    <path d="M14 17H4" />
                    <circle cx="17" cy="17" r="3" />
                    <circle cx="7" cy="7" r="3" />
                  </svg>
                </button>
                <button
                  @click="toggleUserStatus(user)"
                  :class="['action-btn', getUserStatus(user) === 'locked' ? 'unlock' : 'lock']"
                  :title="getUserStatus(user) === 'locked' ? 'رفع قفل' : 'قفل کردن'"
                  :disabled="user.is_admin"
                >
                  <svg v-if="getUserStatus(user) === 'locked'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </button>
                <button
                  @click="resetPassword(user)"
                  class="action-btn reset"
                  title="بازنشانی رمز عبور"
                  :disabled="user.is_admin"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 3l18 18"></path>
                    <path d="M21 9a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 5"></path>
                    <path d="M21 5v4h-4"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="pagination.total > pagination.per_page" class="pagination">
          <button
            @click="goToPage(1)"
            :disabled="pagination.current_page === 1"
            class="page-btn"
          >
            اول
          </button>
          <button
            @click="goToPage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="page-btn"
          >
            قبلی
          </button>

          <div class="page-numbers">
            <span
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="['page-number', { active: page === pagination.current_page }]"
            >
              {{ page }}
            </span>
          </div>

          <button
            @click="goToPage(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="page-btn"
          >
            بعدی
          </button>
          <button
            @click="goToPage(pagination.last_page)"
            :disabled="pagination.current_page === pagination.last_page"
            class="page-btn"
          >
            آخر
          </button>
        </div>
      </div>
    </main>

    <!-- Add User Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>افزودن کاربر جدید</h3>
          <button @click="closeAddModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleCreateUser">
            <div class="form-group">
              <label>نام و نام خانوادگی *</label>
              <input v-model="newUser.name" type="text" required />
            </div>
            <div class="form-group">
              <label>ایمیل</label>
              <input v-model="newUser.email" type="email" />
            </div>
            <div class="form-group">
              <label>شماره تلفن</label>
              <input v-model="newUser.phone" type="text" />
            </div>
            <div class="form-group">
              <label>روش احراز هویت</label>
              <select v-model="newUser.preferred_method">
                <option value="password">رمز عبور</option>
                <option value="otp">OTP</option>
              </select>
            </div>
            <div v-if="newUser.preferred_method === 'password'" class="form-group">
              <label>رمز عبور *</label>
              <input v-model="newUser.password" type="password" required />
            </div>
            <div class="form-actions">
              <button type="button" @click="closeAddModal" class="btn-secondary">
                انصراف
              </button>
              <button type="submit" class="btn-primary" :disabled="isProcessing">
                {{ isProcessing ? 'در حال انجام...' : 'افزودن' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>ویرایش کاربر</h3>
          <button @click="closeEditModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleUpdateUser">
            <div class="form-group">
              <label>نام و نام خانوادگی *</label>
              <input v-model="editingUser.name" type="text" required />
            </div>
            <div class="form-group">
              <label>ایمیل</label>
              <input v-model="editingUser.email" type="email" />
            </div>
            <div class="form-group">
              <label>شماره تلفن</label>
              <input v-model="editingUser.phone" type="text" />
            </div>
            <div class="form-group">
              <label>روش احراز هویت</label>
              <select v-model="editingUser.preferred_method">
                <option value="password">رمز عبور</option>
                <option value="otp">OTP</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" @click="closeEditModal" class="btn-secondary">
                انصراف
              </button>
              <button type="submit" class="btn-primary" :disabled="isProcessing">
                {{ isProcessing ? 'در حال انجام...' : 'ویرایش' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View User Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>جزئیات کاربر</h3>
          <button @click="closeViewModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div v-if="viewingUser" class="user-details-grid">
            <div class="detail-item">
              <label>نام:</label>
              <span>{{ viewingUser.name }}</span>
            </div>
            <div class="detail-item">
              <label>نام کاربری:</label>
              <span>{{ viewingUser.username || 'تعریف نشده' }}</span>
            </div>
            <div class="detail-item">
              <label>ایمیل:</label>
              <span>{{ viewingUser.email || 'تعریف نشده' }}</span>
            </div>
            <div class="detail-item">
              <label>تلفن:</label>
              <span>{{ viewingUser.phone || 'تعریف نشده' }}</span>
            </div>
            <div class="detail-item">
              <label>روش احراز هویت:</label>
              <span>{{ viewingUser.preferred_method === 'otp' ? 'OTP' : 'رمز عبور' }}</span>
            </div>
            <div class="detail-item">
              <label>وضعیت ایمیل:</label>
              <span :class="viewingUser.email_verified_at ? 'verified' : 'unverified'">
                {{ viewingUser.email_verified_at ? 'تایید شده' : 'تایید نشده' }}
              </span>
            </div>
            <div class="detail-item">
              <label>وضعیت تلفن:</label>
              <span :class="viewingUser.phone_verified_at ? 'verified' : 'unverified'">
                {{ viewingUser.phone_verified_at ? 'تایید شده' : 'تایید نشده' }}
              </span>
            </div>
            <div class="detail-item">
              <label>تاریخ عضویت:</label>
              <span>{{ formatDate(viewingUser.created_at) }}</span>
            </div>
            <div class="detail-item">
              <label>آخرین ورود:</label>
              <span>{{ formatDate(viewingUser.last_login_at) || 'هرگز' }}</span>
            </div>
            <div class="detail-item">
              <label>تعداد تلاش‌های ناموفق:</label>
              <span>{{ viewingUser.failed_attempts || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <div v-if="showResetPasswordModal" class="modal-overlay" @click="closeResetPasswordModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>بازنشانی رمز عبور</h3>
          <button @click="closeResetPasswordModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleResetPassword">
            <div class="form-group">
              <label>رمز عبور جدید *</label>
              <input v-model="resetPasswordForm.password" type="password" required minlength="8" />
            </div>
            <div class="form-group">
              <label>تأیید رمز عبور *</label>
              <input v-model="resetPasswordForm.confirmPassword" type="password" required minlength="8" />
            </div>
            <div class="form-actions">
              <button type="button" @click="closeResetPasswordModal" class="btn-secondary">
                انصراف
              </button>
              <button type="submit" class="btn-primary" :disabled="isProcessing || !isValidPassword">
                {{ isProcessing ? 'در حال انجام...' : 'تغییر رمز عبور' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Role Management Modal -->
    <div v-if="showRoleModal" class="modal-overlay" @click="closeRoleModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>مدیریت نقش‌های {{ selectedUser?.name }}</h3>
          <button @click="closeRoleModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div v-if="rolesLoading" class="loading-state">
            <div class="spinner"></div>
            <p>در حال بارگذاری نقش‌ها...</p>
          </div>
          <div v-else>
            <div class="roles-grid">
              <label v-for="role in allRoles" :key="role.id" class="role-item">
                <input type="checkbox" :checked="userHasRole(role)" @change="toggleRole(role)" />
                <span>{{ role.display_name || role.name }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { debounce } from 'lodash-es'

definePageMeta({
  middleware: 'admin',
  layout: 'default'
})

const {
  users,
  loading,
  stats,
  fetchUsers,
  fetchUserStats,
  createUser,
  updateUser,
  toggleUserLock,
  verifyUserEmail,
  verifyUserPhone,
  resetUserPassword
} = useUsers()

const { roles: rolesRef, fetchRoles, assignRoleToUser, removeRoleFromUser } = useRoles()

// State
const searchQuery = ref('')
const sortField = ref('created_at')
const sortOrder = ref('desc')
const isProcessing = ref(false)

const filters = reactive({
  emailVerified: '',
  phoneVerified: '',
  preferredMethod: ''
})

const pagination = reactive({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
})

// Modals
const showAddModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const showResetPasswordModal = ref(false)
const showRoleModal = ref(false)

const editingUser = ref({})
const viewingUser = ref(null)
const resetingUser = ref(null)
const selectedUser = ref(null)
const rolesLoading = ref(false)

const newUser = reactive({
  name: '',
  email: '',
  phone: '',
  preferred_method: 'password',
  password: ''
})

const resetPasswordForm = reactive({
  password: '',
  confirmPassword: ''
})

// Computed
const userStats = computed(() => stats.value)
const allRoles = computed(() => rolesRef.value || [])

const visiblePages = computed(() => {
  const total = pagination.last_page
  const current = pagination.current_page
  const delta = 2
  const pages = []
  const start = Math.max(1, current - delta)
  const end = Math.min(total, current + delta)

  for (let p = start; p <= end; p++) pages.push(p)
  if (!pages.includes(1)) pages.unshift(1)
  if (!pages.includes(total)) pages.push(total)

  return Array.from(new Set(pages)).sort((a, b) => a - b)
})

const isValidPassword = computed(() => {
  return resetPasswordForm.password === resetPasswordForm.confirmPassword &&
    resetPasswordForm.password.length >= 8
})

// Methods
const getInitials = (name) => {
  if (!name) return 'ک'
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const getUserStatus = (user) => {
  if (user?.locked_until && new Date(user.locked_until) > new Date()) return 'locked'
  return 'active'
}

const getUserStatusText = (user) => {
  const status = getUserStatus(user)
  if (status === 'locked') return 'قفل شده'
  return 'فعال'
}

const formatDate = (date) => {
  if (!date) return ''
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  } catch {
    return ''
  }
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  loadUsers()
}

const goToPage = (page) => {
  pagination.current_page = page
  loadUsers()
}

// API calls
const loadUsers = async () => {
  const params = {
    search: searchQuery.value || undefined,
    email_verified: filters.emailVerified === '' ? undefined : filters.emailVerified === 'true',
    phone_verified: filters.phoneVerified === '' ? undefined : filters.phoneVerified === 'true',
    sort_by: sortField.value,
    sort_order: sortOrder.value,
    per_page: pagination.per_page,
    page: pagination.current_page
  }

  // Remove undefined values
  Object.keys(params).forEach(key => {
    if (params[key] === undefined) delete params[key]
  })

  const response = await fetchUsers(params)
  if (response && response.meta) {
    Object.assign(pagination, response.meta)
  }
}

const debouncedSearch = debounce(() => {
  pagination.current_page = 1
  loadUsers()
}, 500)

const applyFilters = () => {
  pagination.current_page = 1
  loadUsers()
}

// CRUD Operations
const handleCreateUser = async () => {
  if (!newUser.name.trim()) return

  if (newUser.preferred_method === 'password' && !newUser.password) {
    return
  }

  if (!newUser.email && !newUser.phone) {
    return
  }

  isProcessing.value = true
  const success = await createUser(newUser)
  isProcessing.value = false

  if (success) {
    closeAddModal()
    await loadUsers()
  }
}

const handleUpdateUser = async () => {
  if (!editingUser.value.name?.trim()) return

  isProcessing.value = true
  const success = await updateUser(editingUser.value.id, {
    name: editingUser.value.name,
    email: editingUser.value.email || undefined,
    phone: editingUser.value.phone || undefined,
    preferred_method: editingUser.value.preferred_method
  })
  isProcessing.value = false

  if (success) {
    closeEditModal()
    await loadUsers()
  }
}

const editUser = (user) => {
  editingUser.value = { ...user }
  showEditModal.value = true
}

const viewUser = (user) => {
  viewingUser.value = user
  showViewModal.value = true
}

const toggleUserStatus = async (user) => {
  if (user.is_admin) return

  const success = await toggleUserLock(user.id)
  if (success) {
    await loadUsers()
  }
}

const verifyEmail = async (user) => {
  const success = await verifyUserEmail(user.id)
  if (success) {
    await loadUsers()
  }
}

const verifyPhone = async (user) => {
  const success = await verifyUserPhone(user.id)
  if (success) {
    await loadUsers()
  }
}

const resetPassword = (user) => {
  if (user.is_admin) return

  resetingUser.value = user
  resetPasswordForm.password = ''
  resetPasswordForm.confirmPassword = ''
  showResetPasswordModal.value = true
}

const manageRoles = (user) => {
  selectedUser.value = user
  showRoleModal.value = true
}

const closeRoleModal = () => {
  showRoleModal.value = false
  selectedUser.value = null
}

const userHasRole = (role) => {
  if (!selectedUser.value?.roles) return false
  return selectedUser.value.roles.some(r => r.id === role.id)
}

const toggleRole = async (role) => {
  if (!selectedUser.value) return
  const hasRole = userHasRole(role)
  const ok = hasRole
    ? await removeRoleFromUser(selectedUser.value.id, role.id)
    : await assignRoleToUser(selectedUser.value.id, role.id)
  if (ok) {
    await loadUsers()
    // update selectedUser from refreshed list
    const updated = users.value.find(u => u.id === selectedUser.value.id)
    if (updated) selectedUser.value = updated
  }
}

const handleResetPassword = async () => {
  if (!isValidPassword.value || !resetingUser.value) return

  isProcessing.value = true
  const success = await resetUserPassword(resetingUser.value.id, resetPasswordForm.password)
  isProcessing.value = false

  if (success) {
    closeResetPasswordModal()
    await loadUsers()
  }
}

// Modal handlers
const closeAddModal = () => {
  showAddModal.value = false
  Object.assign(newUser, { name: '', email: '', phone: '', preferred_method: 'password', password: '' })
}

const closeEditModal = () => {
  showEditModal.value = false
  editingUser.value = {}
}

const closeViewModal = () => {
  showViewModal.value = false
  viewingUser.value = null
}

const closeResetPasswordModal = () => {
  showResetPasswordModal.value = false
  resetingUser.value = null
  resetPasswordForm.password = ''
  resetPasswordForm.confirmPassword = ''
}

// Lifecycle
onMounted(async () => {
  rolesLoading.value = true
  await Promise.all([
    loadUsers(),
    fetchUserStats(),
    fetchRoles(true)
  ])
  rolesLoading.value = false
})
</script>

<style scoped>
@import '@/assets/css/users-dashboard.css';

.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.sortable:hover {
  background: rgba(102, 126, 234, 0.1);
}

.sort-indicator {
  position: absolute;
  right: 5px;
  font-size: 0.8rem;
  color: var(--primary);
}

.admin-badge {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.25rem;
  display: inline-block;
}

.verify-btn {
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.75rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.verify-btn:hover {
  background: #d97706;
  transform: scale(1.1);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.reset {
  background: #6366f1;
  color: white;
}

.action-btn.reset:hover:not(:disabled) {
  background: #4f46e5;
}

.stat-card .stat-icon.warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.warning .stat-value {
  color: #f59e0b;
}

.roles-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.role-badge {
  background: var(--gray-100);
  color: var(--dark);
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.75rem;
}

.role-badge.empty {
  opacity: 0.6;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.role-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
