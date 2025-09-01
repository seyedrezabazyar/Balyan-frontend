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
definePageMeta({ layout: false })

const { showToast } = useToast()
const { isLoggedIn } = useAuth()

const contactSupport = () => {
  showToast('برای تماس با پشتیبانی از بخش تماس با ما استفاده کنید', 'info')
}

// Check if user is logged in
onMounted(() => {
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
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
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
  color: var(--dark);
  margin-bottom: 1rem;
  font-weight: 700;
}

.error-message {
  font-size: 1.25rem;
  color: var(--gray);
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
  background: var(--gray-50);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  text-align: right;
}

.detail-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.detail-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--dark);
  font-size: 1.1rem;
}

.detail-content p {
  margin: 0;
  color: var(--gray);
  font-size: 0.95rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.help-section {
  padding: 1.5rem;
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.help-section h4 {
  color: var(--dark);
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.help-section p {
  color: var(--gray);
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
}

.contact-btn {
  background: var(--warning);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
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
