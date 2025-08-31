<!-- app/pages/dashboard/categories.vue -->
<template>
  <div class="page">
    <div class="page-header">
      <h1>مدیریت دسته‌ها</h1>
      <div class="actions">
        <input v-model="name" type="text" placeholder="نام دسته جدید" />
        <input v-model="slug" type="text" placeholder="اسلاگ (اختیاری)" />
        <button class="btn" @click="create">افزودن</button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>در حال بارگذاری...</p>
    </div>

    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th>نام</th>
            <th>اسلاگ</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in categories" :key="c.id">
            <td>{{ c.name }}</td>
            <td class="muted">{{ c.slug }}</td>
            <td>
              <span :class="['badge', c.status === 'active' ? 'success' : 'gray']">
                {{ c.status === 'active' ? 'فعال' : 'غیرفعال' }}
              </span>
            </td>
            <td class="row-actions">
              <button class="btn" @click="toggle(c)">تغییر وضعیت</button>
              <button class="btn danger" @click="remove(c)">حذف</button>
            </td>
          </tr>
          <tr v-if="!categories.length">
            <td colspan="4" class="empty">دسته‌ای یافت نشد</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth', layout: 'default' })

const { api } = useAuth()
const { showError, showSuccess } = useToast()

const categories = ref([])
const loading = ref(false)
const name = ref('')
const slug = ref('')

const list = async () => {
  loading.value = true
  try {
    const res = await api('/api/v1/categories')
    categories.value = res.data || res.items || res || []
  } catch (e) {
    showError('خطا در دریافت دسته‌ها')
  } finally {
    loading.value = false
  }
}

const create = async () => {
  if (!name.value.trim()) return
  try {
    await api('/api/v1/categories', {
      method: 'POST',
      body: { name: name.value.trim(), ...(slug.value ? { slug: slug.value.trim() } : {}) }
    })
    name.value = ''
    slug.value = ''
    showSuccess('دسته اضافه شد')
    await list()
  } catch (e) {
    showError('ثبت دسته ناموفق بود')
  }
}

const toggle = async (c) => {
  try {
    await api(`/api/v1/categories/${c.id}/toggle-status`, { method: 'POST' })
    showSuccess('وضعیت تغییر کرد')
    await list()
  } catch (e) {
    showError('تغییر وضعیت ناموفق بود')
  }
}

const remove = async (c) => {
  if (!confirm('حذف این دسته؟')) return
  try {
    await api(`/api/v1/categories/${c.id}`, { method: 'DELETE' })
    showSuccess('حذف شد')
    await list()
  } catch (e) {
    showError('حذف ناموفق بود')
  }
}

onMounted(list)
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 1rem; }
.page-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.actions { display: flex; gap: .5rem; }
.table { width: 100%; background: white; border-collapse: collapse; border: 1px solid var(--border); }
.table th, .table td { padding: .75rem 1rem; border-bottom: 1px solid var(--border); text-align: right; }
.row-actions { display: flex; gap: .5rem; }
.badge { padding: .2rem .5rem; border-radius: .5rem; font-size: .8rem; }
.badge.success { background: #e6f7ee; color: #15803d; }
.badge.gray { background: #f3f4f6; color: #374151; }
.btn { padding: .5rem .75rem; border: 1px solid var(--border); background: var(--gray-50); border-radius: .5rem; cursor: pointer; }
.btn.danger { background: #fee2e2; border-color: #fecaca; }
.muted { color: var(--gray); }
.empty { text-align: center; color: var(--gray); }
.loading { display:flex; flex-direction:column; align-items:center; gap:.75rem; background:white; padding:2rem; border-radius:.75rem; }
.spinner { width:32px; height:32px; border:3px solid var(--gray-200); border-top-color: var(--primary); border-radius:50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg) } }
</style>