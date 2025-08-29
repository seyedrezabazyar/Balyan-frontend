<!-- pages/users.vue -->
<template>
  <div class="users-page">
    <div class="page-header">
      <h1>مدیریت کاربران</h1>
      <button @click="showAddModal = true" class="btn btn-primary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5v14m-7-7h14"/>
        </svg>
        افزودن کاربر
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div>
          <h3>کل کاربران</h3>
          <p>{{ users.length }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div>
          <h3>فعال</h3>
          <p>{{ activeUsers }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📱</div>
        <div>
          <h3>OTP</h3>
          <p>{{ otpUsers }}</p>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        v-model="search"
        type="text"
        placeholder="جستجو کاربران..."
      />
    </div>

    <!-- Users Table -->
    <div class="table-container">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>

      <table v-else class="users-table">
        <thead>
        <tr>
          <th>کاربر</th>
          <th>تماس</th>
          <th>وضعیت</th>
          <th>روش ورود</th>
          <th>عملیات</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>
            <div class="user-cell">
              <div class="user-avatar">
                {{ getInitials(user.name) }}
              </div>
              <div>
                <div class="user-name">{{ user.name }}</div>
                <div class="user-date">{{ formatDate(user.created_at) }}</div>
              </div>
            </div>
          </td>
          <td>
            <div class="contact-cell">
              <div v-if="user.email">
                📧 {{ user.email }}
                <span v-if="user.email_verified_at" class="verified">✓</span>
              </div>
              <div v-if="user.phone">
                📱 {{ user.phone }}
                <span v-if="user.phone_verified_at" class="verified">✓</span>
              </div>
            </div>
          </td>
          <td>
              <span :class="['status', getStatus(user)]">
                {{ getStatusText(user) }}
              </span>
          </td>
          <td>
              <span class="method">
                {{ user.preferred_method === 'otp' ? 'OTP' : 'رمز عبور' }}
              </span>
          </td>
          <td>
            <div class="actions">
              <button @click="editUser(user)" class="action-btn edit" title="ویرایش">
                ✏️
              </button>
              <button @click="viewUser(user)" class="action-btn view" title="مشاهده">
                👁️
              </button>
              <button @click="toggleUser(user)" :class="['action-btn', getStatus(user) === 'inactive' ? 'activate' : 'deactivate']" :title="getStatus(user) === 'inactive' ? 'فعال کردن' : 'غیرفعال کردن'">
                {{ getStatus(user) === 'inactive' ? '🔓' : '🔒' }}
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="filteredUsers.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">👤</div>
        <h3>کاربری یافت نشد</h3>
        <p>{{ search ? 'نتیجه‌ای برای جستجوی شما یافت نشد' : 'هنوز کاربری وجود ندارد' }}</p>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>افزودن کاربر جدید</h3>
          <button @click="closeAddModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>نام و نام خانوادگی</label>
            <input v-model="newUser.name" type="text" />
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
            <select v-model="newUser.method">
              <option value="password">رمز عبور</option>
              <option value="otp">OTP</option>
            </select>
          </div>
          <div v-if="newUser.method === 'password'" class="form-group">
            <label>رمز عبور</label>
            <input v-model="newUser.password" type="password" />
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closeAddModal" class="btn btn-secondary">انصراف</button>
          <button @click="addUser" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'در حال افزودن...' : 'افزودن' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>ویرایش کاربر</h3>
          <button @click="closeEditModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>نام و نام خانوادگی</label>
            <input v-model="editingUser.name" type="text" />
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
        </div>
        <div class="modal-actions">
          <button @click="closeEditModal" class="btn btn-secondary">انصراف</button>
          <button @click="updateUser" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'در حال ویرایش...' : 'ویرایش' }}
          </button>
        </div>
      </div>
    </div>

    <!-- View User Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
      <div class="modal large" @click.stop>
        <div class="modal-header">
          <h3>جزئیات کاربر</h3>
          <button @click="closeViewModal" class="close-btn">×</button>
        </div>
        <div v-if="viewingUser" class="modal-body">
          <div class="user-details">
            <div class="detail-row">
              <label>نام:</label>
              <span>{{ viewingUser.name }}</span>
            </div>
            <div class="detail-row">
              <label>ایمیل:</label>
              <span>{{ viewingUser.email || 'تعریف نشده' }}</span>
              <span v-if="viewingUser.email_verified_at" class="verified">✓ تایید شده</span>
            </div>
            <div class="detail-row">
              <label>تلفن:</label>
              <span>{{ viewingUser.phone || 'تعریف نشده' }}</span>
              <span v-if="viewingUser.phone_verified_at" class="verified">✓ تایید شده</span>
            </div>
            <div class="detail-row">
              <label>روش احراز هویت:</label>
              <span>{{ viewingUser.preferred_method === 'otp' ? 'OTP' : 'رمز عبور' }}</span>
            </div>
            <div class="detail-row">
              <label>تاریخ عضویت:</label>
              <span>{{ formatDate(viewingUser.created_at) }}</span>
            </div>
            <div class="detail-row">
              <label>آخرین ورود:</label>
              <span>{{ formatDate(viewingUser.last_login_at) || 'هرگز' }}</span>
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

// State
const users = ref([])
const loading = ref(true)
const search = ref('')

// Modals
const showAddModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const editingUser = ref({})
const viewingUser = ref(null)
const newUser = reactive({
  name: '',
  email: '',
  phone: '',
  method: 'password',
  password: ''
})

// Computed
const filteredUsers = computed(() => {
  if (!search.value) return users.value
  const query = search.value.toLowerCase()
  return users.value.filter(user =>
    user.name?.toLowerCase().includes(query) ||
    user.email?.toLowerCase().includes(query) ||
    user.phone?.includes(query)
  )
})

const activeUsers = computed(() => users.value.filter(u => getStatus(u) === 'active').length)
const otpUsers = computed(() => users.value.filter(u => u.preferred_method === 'otp').length)

// Methods
const fetchUsers = async () => {
  try {
    loading.value = true
    const response = await fetch('http://127.0.0.1:8000/api/users', {
      headers: { 'Authorization': `Bearer ${token.value}` }
    })

    if (response.ok) {
      const data = await response.json()
      users.value = data.users || []
    }
  } catch (error) {
    showToast('خطا در بارگذاری کاربران', 'error')
  } finally {
    loading.value = false
  }
}

const getInitials = (name) => {
  if (!name) return 'ک'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2)
}

const getStatus = (user) => {
  if (user.locked_at) return 'inactive'
  return 'active'
}

const getStatusText = (user) => {
  return getStatus(user) === 'active' ? 'فعال' : 'غیرفعال'
}

const formatDate = (date) => {
  if (!date) return ''
  try {
    return new Intl.DateTimeFormat('fa-IR').format(new Date(date))
  } catch {
    return ''
  }
}

const addUser = async () => {
  if (!newUser.name.trim()) {
    showToast('نام کاربر الزامی است', 'error')
    return
  }

  try {
    loading.value = true
    const response = await fetch('http://127.0.0.1:8000/api/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newUser.name,
        email: newUser.email || null,
        phone: newUser.phone || null,
        preferred_method: newUser.method,
        password: newUser.method === 'password' ? newUser.password : null
      })
    })

    if (response.ok) {
      showToast('کاربر با موفقیت افزوده شد', 'success')
      closeAddModal()
      await fetchUsers()
    } else {
      const error = await response.json()
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
    const response = await fetch(`http://127.0.0.1:8000/api/users/${editingUser.value.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
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
      const error = await response.json()
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

const toggleUser = async (user) => {
  const action = getStatus(user) === 'active' ? 'deactivate' : 'activate'

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/users/${user.id}/${action}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token.value}` }
    })

    if (response.ok) {
      showToast(`کاربر ${action === 'activate' ? 'فعال' : 'غیرفعال'} شد`, 'success')
      await fetchUsers()
    }
  } catch {
    showToast('خطا در تغییر وضعیت کاربر', 'error')
  }
}

const closeAddModal = () => {
  showAddModal.value = false
  Object.assign(newUser, { name: '', email: '', phone: '', method: 'password', password: '' })
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
.users-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-header h1 {
  color: var(--dark);
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--primary), #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-card h3 {
  font-size: 0.9rem;
  color: var(--gray);
  margin: 0 0 4px 0;
}

.stat-card p {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--dark);
  margin: 0;
}

.search-bar {
  position: relative;
  margin-bottom: 32px;
}

.search-bar svg {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
}

.search-bar input {
  padding-right: 48px;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.table-container {
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 16px;
  text-align: right;
  border-bottom: 1px solid #f3f4f6;
}

.users-table th {
  background: var(--light);
  font-weight: 600;
  color: var(--dark);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--primary), #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.user-name {
  font-weight: 600;
  color: var(--dark);
}

.user-date {
  font-size: 0.8rem;
  color: var(--gray);
}

.contact-cell div {
  font-size: 0.9rem;
  margin: 2px 0;
}

.verified {
  color: var(--success);
  font-weight: bold;
  margin-right: 8px;
}

.status {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status.active {
  background: #d1fae5;
  color: #065f46;
}

.status.inactive {
  background: #fee2e2;
  color: #dc2626;
}

.method {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #e0e7ff;
  color: #3730a3;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition);
  background: var(--light);
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn.edit:hover { background: #fef3c7; }
.action-btn.view:hover { background: #e0e7ff; }
.action-btn.activate:hover { background: #d1fae5; }
.action-btn.deactivate:hover { background: #fee2e2; }

.empty-state {
  text-align: center;
  padding: 64px 32px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  color: var(--dark);
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--gray);
  margin: 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: var(--radius);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal.large {
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: var(--dark);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--gray);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.close-btn:hover {
  background: var(--light);
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--dark);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--primary);
  outline: none;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row label {
  font-weight: 600;
  color: var(--gray);
  min-width: 120px;
}

.detail-row span {
  color: var(--dark);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .users-table {
    font-size: 0.9rem;
  }

  .users-table th,
  .users-table td {
    padding: 12px 8px;
  }

  .user-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .actions {
    flex-wrap: wrap;
  }

  .modal {
    margin: 20px;
    max-height: calc(100vh - 40px);
  }

  .modal-body {
    padding: 16px;
  }

  .modal-actions {
    flex-direction: column;
    padding: 16px;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .detail-row label {
    min-width: auto;
    font-size: 0.9rem;
  }
}
</style>
