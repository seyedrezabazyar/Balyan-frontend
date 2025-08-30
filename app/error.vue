<!-- error.vue -->
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
const props = defineProps({ error: Object });

// definePageMeta({ layout: false });

const errorTitle = computed(() =>
  props.error?.statusCode === 404 ? 'صفحه یافت نشد' : 'خطایی رخ داده'
);

const errorMessage = computed(() =>
  props.error?.statusCode === 404
    ? 'صفحه مورد نظر یافت نشد'
    : props.error?.message || 'خطای غیرمنتظره'
);

const showDetails = computed(() => props.error?.statusCode !== 404);

const handleError = async () => {
  await clearError({ redirect: '/' });
};
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
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.error-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
}

.error-content h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.error-content p {
  font-size: 1.125rem;
  color: #666;
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

.btn {
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-secondary {
  background: #f8f9fa;
  color: #333;
  border: 2px solid #ddd;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.error-details {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  text-align: right;
  font-size: 0.875rem;
  color: #666;
}

.error-details p {
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .error-content {
    padding: 2rem 1.5rem;
  }

  .error-content h1 {
    font-size: 1.5rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 200px;
  }
}
</style>
