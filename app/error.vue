<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-icon">
        <span v-if="error?.statusCode === 404">🔍</span>
        <span v-else>⚠️</span>
      </div>

      <h1 class="error-title">
        {{ error?.statusCode === 404 ? 'صفحه یافت نشد' : 'خطایی رخ داده است' }}
      </h1>

      <p class="error-message">
        {{ error?.statusCode === 404
        ? 'متأسفانه صفحه‌ای که دنبال آن می‌گردید یافت نشد.'
        : error?.message || 'خطای غیرمنتظره‌ای رخ داده است.'
        }}
      </p>

      <div class="error-actions">
        <button @click="handleError" class="btn-primary">
          تلاش مجدد
        </button>
        <NuxtLink to="/" class="btn-secondary">
          بازگشت به صفحه اصلی
        </NuxtLink>
      </div>

      <div v-if="error?.statusCode !== 404" class="error-details">
        <p><strong>کد خطا:</strong> {{ error?.statusCode || 'نامشخص' }}</p>
        <p><strong>URL:</strong> {{ error?.url || 'نامشخص' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

definePageMeta({
  layout: false
})

const handleError = async () => {
  await clearError({ redirect: '/' })
}
</script>

<style scoped>
.error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.error-content {
  background: white;
  padding: 50px 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.error-title {
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
}

.error-message {
  font-size: 18px;
  color: #666;
  margin-bottom: 40px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  cursor: pointer;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #f8f9fa;
  color: #333;
  border: 2px solid #ddd;
}

.btn-primary:hover, .btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.error-details {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: right;
  font-size: 14px;
  color: #666;
}

.error-details p {
  margin: 5px 0;
}

@media (max-width: 768px) {
  .error-content {
    padding: 30px 20px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-message {
    font-size: 16px;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary, .btn-secondary {
    width: 200px;
  }
}
</style>
