<!-- pages/access-denied.vue -->
<template>
  <div class="access-denied-page">
    <div class="access-denied-content">
      <div class="error-icon">🔒</div>

      <h1>دسترسی محدود</h1>
      <p class="error-message">شما دسترسی لازم برای مشاهده این صفحه را ندارید.</p>

      <div class="error-details">
        <div class="detail-card">
          <div class="detail-icon">👑</div>
          <div class="detail-content">
            <h3>دسترسی مدیریتی مورد نیاز</h3>
            <p>این بخش فقط برای مدیران سیستم در دسترس است.</p>
          </div>
        </div>
      </div>

      <div class="error-actions">
        <NuxtLink to="/dashboard" class="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          بازگشت به داشبورد
        </NuxtLink>

        <NuxtLink to="/" class="btn btn-secondary">
          صفحه اصلی
        </NuxtLink>
      </div>

      <div class="help-section">
        <h4>نیاز به دسترسی بیشتر دارید؟</h4>
        <p>برای درخواست دسترسی مدیریتی با پشتیبانی تماس بگیرید.</p>
        <button @click="contactSupport" class="contact-btn">
          تماس با پشتیبانی
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const { showToast } = useToast()

const contactSupport = () => {
  showToast('برای تماس با پشتیبانی از بخش تماس با ما استفاده کنید', 'info')
}

// Check if user is logged in, redirect if not
onMounted(() => {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn.value) {
    navigateTo('/auth')
  }
})
</script>

<style scoped>
.access-denied-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 2rem;
  direction: rtl;
}

.access-denied-content {
  background: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 600px;
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

.access-denied-content h1 {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 1rem;
  font-weight: 700;
}

.error-message {
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-details {
  margin-bottom: 2rem;
}

.detail-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f3f4f6;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: right;
}

.detail-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.detail-content h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-size: 1.1rem;
}

.detail-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f8f9fa;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #e9ecef;
  border-color: #d1d5db;
}

.help-section {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.help-section h4 {
  color: #374151;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.help-section p {
  color: #6b7280;
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
}

.contact-btn {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.contact-btn:hover {
  background: #d97706;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .access-denied-content {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }

  .access-denied-content h1 {
    font-size: 2rem;
  }

  .error-message {
    font-size: 1.1rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
  }

  .detail-card {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .access-denied-page {
    padding: 1rem;
  }

  .access-denied-content h1 {
    font-size: 1.75rem;
  }

  .error-icon {
    font-size: 4rem;
  }
}
</style>
