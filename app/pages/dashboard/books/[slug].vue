<!-- app/pages/dashboard/books/[slug].vue -->
<template>
  <div class="page">
    <div class="page-header">
      <h1>جزئیات کتاب</h1>
      <NuxtLink class="link" to="/dashboard/books">⬅ بازگشت</NuxtLink>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>در حال بارگذاری...</p>
    </div>

    <div v-else-if="book">
      <div class="card">
        <h2>{{ book.title }}</h2>
        <p class="muted">اسلاگ: {{ book.slug }}</p>
        <p>دسته: {{ book.category?.name || '-' }}</p>
        <p>نویسنده: {{ book.author?.name || '-' }}</p>
        <p>ناشر: {{ book.publisher?.name || '-' }}</p>
        <p>توضیحات: {{ book.description || '-' }}</p>
      </div>

      <div class="actions">
        <button class="btn" @click="refresh">بروزرسانی اطلاعات</button>
        <NuxtLink class="btn" :to="`/dashboard/gallery/books`">مدیریت تصاویر</NuxtLink>
      </div>

      <div class="card">
        <h3>کتاب‌های مرتبط</h3>
        <ul class="related">
          <li v-for="b in related" :key="b.id">
            <NuxtLink class="link" :to="`/dashboard/books/${b.slug}`">{{ b.title }}</NuxtLink>
          </li>
          <li v-if="!related.length" class="muted">موردی نیست</li>
        </ul>
      </div>
    </div>

    <div v-else class="empty">کتاب پیدا نشد</div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth', layout: 'default' })

const route = useRoute()
const { api } = useAuth()
const { showError } = useToast()

const slug = computed(() => String(route.params.slug || ''))
const book = ref(null)
const related = ref([])
const loading = ref(false)

const fetchBook = async () => {
  if (!slug.value) return
  loading.value = true
  try {
    const res = await api(`/api/v1/books/${slug.value}`)
    book.value = res.data || res.book || res

    const rel = await api(`/api/v1/books/${slug.value}/related`)
    related.value = rel.data || rel.items || []
  } catch (e) {
    showError('خطا در دریافت اطلاعات کتاب')
  } finally {
    loading.value = false
  }
}

const refresh = fetchBook

onMounted(fetchBook)
watch(slug, fetchBook)
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 1rem; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.card { background: white; border: 1px solid var(--border); border-radius: .75rem; padding: 1rem; }
.actions { display: flex; gap: .5rem; }
.btn { padding: .5rem .75rem; border: 1px solid var(--border); background: var(--gray-50); border-radius: .5rem; cursor: pointer; text-decoration: none; color: inherit; }
.link { color: var(--primary); text-decoration: none; }
.muted { color: var(--gray); }
.loading { display:flex; flex-direction:column; align-items:center; gap:.75rem; background:white; padding:2rem; border-radius:.75rem; }
.spinner { width:32px; height:32px; border:3px solid var(--gray-200); border-top-color: var(--primary); border-radius:50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg) } }
.related { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: .5rem; padding: 0; list-style: none; }
</style>