<template>
  <div class="layout-container">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <NuxtLink to="/">سایت من</NuxtLink>
        </div>
        <nav class="navigation">
          <NuxtLink to="/" class="nav-link">صفحه اصلی</NuxtLink>
          <NuxtLink to="/dashboard" class="nav-link">داشبورد</NuxtLink>
          <div v-if="!isLoggedIn">
            <NuxtLink to="/login" class="nav-link login-link">ورود</NuxtLink>
          </div>
          <div v-else class="user-menu">
            <span class="welcome-text">خوش آمدید، {{ username }}</span>
            <button @click="handleLogout" class="logout-button">خروج</button>
          </div>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <NuxtPage />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 سایت من. تمامی حقوق محفوظ است.</p>
        <div class="footer-links">
          <NuxtLink to="/">صفحه اصلی</NuxtLink>
          <NuxtLink to="/dashboard">داشبورد</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const isLoggedIn = ref(false)
const username = ref('')

onMounted(() => {
  if (typeof window !== 'undefined') {
    isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
    username.value = localStorage.getItem('username') || 'کاربر'
  }
})

// مشاهده تغییرات route برای بروزرسانی وضعیت لاگین
const route = useRoute()
watch(() => route.path, () => {
  if (typeof window !== 'undefined') {
    isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
    username.value = localStorage.getItem('username') || 'کاربر'
  }
})

const handleLogout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    isLoggedIn.value = false
  }
  navigateTo('/login')
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo a {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  text-decoration: none;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover {
  background-color: #f0f0f0;
  color: #667eea;
}

.login-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
}

.login-link:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome-text {
  color: #666;
  font-size: 14px;
}

.logout-button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.logout-button:hover {
  background: #c0392b;
}

.main-content {
  flex: 1;
  padding: 0;
}

.footer {
  background: #333;
  color: white;
  padding: 30px 0;
  margin-top: 50px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-content p {
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: white;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
    gap: 15px;
  }

  .navigation {
    flex-wrap: wrap;
    justify-content: center;
  }

  .footer-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .user-menu {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
