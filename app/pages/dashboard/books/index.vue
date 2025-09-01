<!-- app/pages/dashboard/books/index.vue -->
<template>
  <div class="page">
    <div class="page-header">
      <h1>مدیریت کتاب‌ها</h1>
      <div class="actions">
        <input v-model="q" type="text" placeholder="جستجو کتاب..." />
        <button class="btn" @click="fetchBooks">جستجو</button>
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
            <th>کتاب</th>
            <th>دسته</th>
            <th>نویسنده</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td>
              <div class="cell-title">
                <strong>{{ book.title }}</strong>
                <small class="muted">{{ book.slug }}</small>
              </div>
            </td>
            <td>{{ book.category?.name || '-' }}</td>
            <td>{{ book.author?.name || '-' }}</td>
            <td>
              <NuxtLink class="link" :to="`/dashboard/books/${book.slug}`">جزئیات</NuxtLink>
            </td>
          </tr>
          <tr v-if="!books.length">
            <td colspan="4" class="empty">کتابی یافت نشد</td>
          </tr>
        </tbody>
      </table>

      <div class="pagination" v-if="meta.total > meta.per_page">
        <button class="btn" :disabled="page <= 1" @click="changePage(page - 1)">قبلی</button>
        <span>صفحه {{ page }} از {{ totalPages }}</span>
        <button class="btn" :disabled="page >= totalPages" @click="changePage(page + 1)">بعدی</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'dashboard' })

const { api } = useAuth()
const { showError } = useToast()

const books = ref([])
const loading = ref(false)
const q = ref('')
const page = ref(1)
const meta = reactive({ total: 0, per_page: 24 })

const totalPages = computed(() => Math.max(1, Math.ceil(meta.total / meta.per_page)))

const fetchBooks = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: String(page.value),
      ...(q.value ? { q: q.value } : {})
    })

    const res = await api(`/api/v1/books?${params.toString()}`)
    
    // Handle different response structures
    if (res.data && Array.isArray(res.data)) {
      books.value = res.data
    } else if (Array.isArray(res)) {
      books.value = res
    } else if (res.items && Array.isArray(res.items)) {
      books.value = res.items
    } else if (res.results && Array.isArray(res.results)) {
      books.value = res.results
    } else {
      books.value = []
    }

    // try common meta shapes
    const m = res.meta || res.pagination || res.links || {}
    meta.total = m.total || m.total_items || m.total_count || books.value.length
    meta.per_page = m.per_page || m.perPage || m.limit || 24
    
    console.log('Books API Response:', res)
    console.log('Extracted books:', books.value)
  } catch (e) {
    console.error('Error fetching books:', e)
    showError(`خطا در دریافت لیست کتاب‌ها: ${e.message || 'خطای ناشناخته'}`)
  } finally {
    loading.value = false
  }
}

const changePage = async (p) => {
  page.value = p
  await fetchBooks()
}

onMounted(fetchBooks)
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.actions {
  display: flex;
  gap: .5rem;
}
.table {
  width: 100%;
  background: white;
  border-collapse: collapse;
  border: 1px solid var(--border);
}
.table th, .table td {
  padding: .75rem 1rem;
  border-bottom: 1px solid var(--border);
  text-align: right;
}
.cell-title { display: flex; flex-direction: column; }
.muted { color: var(--gray); }
.empty { text-align: center; color: var(--gray); }
.pagination { display: flex; align-items: center; gap: .75rem; justify-content: center; margin-top: 1rem; }
.btn { padding: .5rem .75rem; border: 1px solid var(--border); background: var(--gray-50); border-radius: .5rem; cursor: pointer; }
.btn:disabled { opacity: .5; cursor: default; }
.loading { display:flex; flex-direction:column; align-items:center; gap:.75rem; background:white; padding:2rem; border-radius:.75rem; }
.spinner { width:32px; height:32px; border:3px solid var(--gray-200); border-top-color: var(--primary); border-radius:50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg) } }
.link { color: var(--primary); text-decoration: none; }
</style>