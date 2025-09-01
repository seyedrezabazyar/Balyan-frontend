<!-- app/pages/dashboard/users/index.vue -->
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
            @input="filterUsers"
          />
        </div>

        <div class="filter-controls">
          <select v-model="statusFilter" @change="filterUsers" class="filter-select">
            <option value="">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
            <option value="locked">قفل شده</option>
          </select>

          <select v-model="methodFilter" @change="filterUsers" class="filter-select">
            <option value="">همه روش‌ها</option>
            <option value="password">رمز عبور</option>
            <option value="otp">OTP</option>
          </select>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
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
            <p class="stat-value">{{ users.length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-content">
            <h3>کاربران فعال</h3>
            <p class="stat-value">{{ activeUsersCount }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon verified">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
              <polyline points="9 12 11 14 16 9"></polyline>
            </svg>
          </div>
          <div class="stat-content">
            <h3>تایید شده</h3>
            <p class="stat-value">{{ verifiedUsersCount }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon otp">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3>کاربران OTP</h3>
            <p class="stat-value">{{ otpUsersCount }}</p>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="table-container">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>در حال بارگذاری...</p>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="empty-state">
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
            <th>کاربر</th>
            <th>اطلاعات تماس</th>
            <th>وضعیت</th>
            <th>روش ورود</th>
            <th>آخرین ورود</th>
            <th>عملیات</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id" class="user-row">
            <td class="user-cell">
              <div class="user-info">
                <div class="user-avatar">
                  {{ getInitials(user.name) }}
                </div>
                <div class="user-details">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-username">@{{ user.username || 'نامشخص' }}</span>
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
                  <span v-if="user.email_verified_at" class="verified-badge">✓</span>
                </div>
                <div v-if="user.phone" class="contact-item phone">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>{{ user.phone }}</span>
                  <span v-if="user.phone_verified_at" class="verified-badge">✓</span>
                </div>
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
                <button
                  @click="toggleUserStatus(user)"
                  :class="['action-btn', getUserStatus(user) === 'locked' ? 'unlock' : 'lock']"
                  :title="getUserStatus(user) === 'locked' ? 'رفع قفل' : 'قفل کردن'"
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
              </div>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            @click="currentPage = 1"
            :disabled="currentPage === 1"
            class="page-btn"
          >
            اول
          </button>
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="page-btn"
          >
            قبلی
          </button>

          <div class="page-numbers">
            <span
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="['page-number', { active: page === currentPage }]"
            >
              {{ page }}
            </span>
          </div>

          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="page-btn"
          >
            بعدی
          </button>
          <button
            @click="currentPage = totalPages"
            :disabled="currentPage === totalPages"
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
          <form @submit.prevent="addUser">
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
              <button type="submit" class="btn-primary">
                افزودن
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
          <form @submit.prevent="updateUser">
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
              <button type="submit" class="btn-primary">
                ویرایش
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- User Details Modal -->
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
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const { token } = useAuth()
const showToast = inject('showToast', () => {})
const config = useRuntimeConfig()
const apiBase = '/api'

// State
const users = ref([])
const loading = ref(true)

// Filters & search
const searchQuery = ref('')
const statusFilter = ref('')
const methodFilter = ref('')

// Pagination
const currentPage = ref(1)
const pageSize = 10

// Modals & forms
const showAddModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const editingUser = ref({})
const viewingUser = ref(null)
const newUser = reactive({
  name: '',
  email: '',
  phone: '',
  preferred_method: 'password',
  password: ''
})

// Utils
const getInitials = (name) => {
  if (!name) return 'ک'
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
}

const getUserStatus = (user) => {
  // Treat locked/inactive the same visually; prefer 'locked' label if locked_at exists
  if (user?.locked_at || user?.status === 'inactive' || user?.disabled) return 'locked'
  return 'active'
}

const getUserStatusText = (user) => {
  const s = getUserStatus(user)
  if (s === 'locked') return 'قفل شده'
  if (s === 'inactive') return 'غیرفعال'
  return 'فعال'
}

const formatDate = (date) => {
  if (!date) return ''
  try {
    return new Intl.DateTimeFormat('fa-IR').format(new Date(date))
  } catch {
    return ''
  }
}

// Computed stats
const activeUsersCount = computed(() => users.value.filter(u => getUserStatus(u) === 'active').length)
const verifiedUsersCount = computed(() => users.value.filter(u => u.email_verified_at || u.phone_verified_at).length)
const otpUsersCount = computed(() => users.value.filter(u => u.preferred_method === 'otp').length)

// Filtering & pagination
const filteredUsers = computed(() => {
  let list = users.value

  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(u =>
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.username && String(u.username).toLowerCase().includes(q))
    )
  }

  if (statusFilter.value) {
    if (statusFilter.value === 'active') {
      list = list.filter(u => getUserStatus(u) === 'active')
    } else if (statusFilter.value === 'inactive' || statusFilter.value === 'locked') {
      list = list.filter(u => getUserStatus(u) !== 'active')
    } else {
      list = list.filter(u => getUserStatus(u) === statusFilter.value)
    }
  }

  if (methodFilter.value) {
    list = list.filter(u => u.preferred_method === methodFilter.value)
  }

  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / pageSize)))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2
  const pages = []
  const start = Math.max(1, current - delta)
  const end = Math.min(total, current + delta)
  for (let p = start; p <= end; p++) pages.push(p)
  if (!pages.includes(1)) pages.unshift(1)
  if (!pages.includes(total)) pages.push(total)
  return Array.from(new Set(pages)).sort((a, b) => a - b)
})

const filterUsers = () => {
  currentPage.value = 1
}

// API calls
const fetchUsers = async () => {
  try {
    loading.value = true
    const response = await fetch(`${apiBase}/auth/users`, {
      headers: {
        'Accept': 'application/json',
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
      }
    })

    if (response.ok) {
      const data = await response.json()
      users.value = data.users || data.data || []
    } else {
      const error = await response.json().catch(() => ({}))
      showToast(error.message || 'خطا در بارگذاری کاربران', 'error')
    }
  } catch (e) {
    console.error('Error fetching users:', e)
    showToast('خطا در ارتباط با سرور', 'error')
  } finally {
    loading.value = false
  }
}

const addUser = async () => {
  if (!newUser.name.trim()) {
    showToast('نام کاربر الزامی است', 'error')
    return
  }

  try {
    loading.value = true
    const response = await fetch(`${apiBase}/auth/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
      },
      body: JSON.stringify({
        name: newUser.name,
        email: newUser.email || null,
        phone: newUser.phone || null,
        preferred_method: newUser.preferred_method,
        password: newUser.preferred_method === 'password' ? newUser.password : null
      })
    })

    if (response.ok) {
      showToast('کاربر با موفقیت افزوده شد', 'success')
      closeAddModal()
      await fetchUsers()
    } else {
      const error = await response.json().catch(() => ({}))
      showToast(error.message || 'خطا در افزودن کاربر', 'error')
    }
  } catch {
    showToast('خطا در ارتباط با سرور', 'error')
  } finally {
    loading.value = false
  }
}

const editUser = (user) => {
  editingUser.value = { ...user }
  showEditModal.value = true
}

const updateUser = async () => {
  try {
    loading.value = true
    const response = await fetch(`${apiBase}/auth/users/${editingUser.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
      },
      body: JSON.stringify({
        name: editingUser.value.name,
        email: editingUser.value.email || null,
        phone: editingUser.value.phone || null,
        preferred_method: editingUser.value.preferred_method
      })
    })

    if (response.ok) {
      showToast('کاربر با موفقیت ویرایش شد', 'success')
      closeEditModal()
      await fetchUsers()
    } else {
      const error = await response.json().catch(() => ({}))
      showToast(error.message || 'خطا در ویرایش کاربر', 'error')
    }
  } catch {
    showToast('خطا در ارتباط با سرور', 'error')
  } finally {
    loading.value = false
  }
}

const viewUser = (user) => {
  viewingUser.value = user
  showViewModal.value = true
}

const toggleUserStatus = async (user) => {
  const wasLocked = getUserStatus(user) !== 'active'

  try {
    const response = await fetch(`${apiBase}/auth/users/${user.id}/toggle-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
      }
    })

    if (response.ok) {
      showToast(`کاربر ${wasLocked ? 'فعال' : 'غیرفعال'} شد`, 'success')
      await fetchUsers()
    } else {
      const error = await response.json().catch(() => ({}))
      showToast(error.message || 'خطا در تغییر وضعیت کاربر', 'error')
    }
  } catch {
    showToast('خطا در ارتباط با سرور', 'error')
  }
}

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

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
@import '@/assets/css/users-dashboard.css';
</style>
