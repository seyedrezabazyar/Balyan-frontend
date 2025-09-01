<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-icon">
        {{ error?.statusCode === 404 ? '🔍' : '⚠️' }}
      </div>

      <h1>{{ errorTitle }}</h1>
      <p>{{ errorMessage }}</p>

      <div class="error-actions">
        <button @click="handleError" class="btn btn-primary">
          تلاش مجدد
        </button>
        <NuxtLink to="/" class="btn btn-secondary">
          صفحه اصلی
        </NuxtLink>
      </div>

      <div v-if="showDetails" class="error-details">
        <p><strong>کد:</strong> {{ error?.statusCode || 'نامشخص' }}</p>
        <p><strong>URL:</strong> {{ error?.url || 'نامشخص' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const props = defineProps({ error: Object })

const errorTitle = computed(() =>
  props.error?.statusCode === 404 ? 'صفحه یافت نشد' : 'خطایی رخ داده'
)

const errorMessage = computed(() =>
  props.error?.statusCode === 404
    ? 'صفحه مورد نظر یافت نشد'
    : props.error?.message || 'خطای غیرمنتظره‌ای رخ داده است'
)

const showDetails = computed(() => props.error?.statusCode !== 404)

const handleError = async () => {
  await clearError({ redirect: '/' })
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 2rem;
  direction: rtl;
}

.error-content {
  background: white;
  padding: 3rem 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  text-align: center;
  max-width: 500px;
  width: 100%;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.error-content h1 {
  font-size: 2.5rem;
  color: var(--dark);
  margin-bottom: 1rem;
  font-weight: 700;
}

.error-content p {
  font-size: 1.25rem;
  color: var(--gray);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.error-details {
  padding: 1.5rem;
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  text-align: right;
  font-size: 0.875rem;
  color: var(--gray);
}

.error-details p {
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .error-content {
    padding: 2rem 1.5rem;
  }

  .error-content h1 {
    font-size: 2rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .error-page {
    padding: 1rem;
  }

  .error-content h1 {
    font-size: 1.75rem;
  }

  .error-icon {
    font-size: 4rem;
  }
}
</style>
