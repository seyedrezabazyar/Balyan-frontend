<!-- layouts/default.vue - نسخه ساده برای تست -->
<template>
  <div class="layout">
    <!-- Header -->
    <header class="simple-header">
      <div class="header-container">
        <h1>سیستم مدیریت</h1>
        <nav>
          <NuxtLink to="/">خانه</NuxtLink>
          <NuxtLink to="/auth">ورود</NuxtLink>
          <NuxtLink to="/dashboard">داشبورد</NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="container">
        <NuxtPage />
      </div>
    </main>

    <!-- Footer -->
    <footer class="simple-footer">
      <p>&copy; ۲۰۲۵ سیستم مدیریت</p>
    </footer>
  </div>
</template>

<script setup>
// هیچ composable استفاده نمیکنیم - فقط یک layout ساده
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
}

.simple-header {
  background: #667eea;
  color: white;
  padding: 1rem 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-container h1 {
  margin: 0;
  font-size: 1.5rem;
}

.header-container nav {
  display: flex;
  gap: 1rem;
}

.header-container nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background 0.3s;
}

.header-container nav a:hover {
  background: rgba(255, 255, 255, 0.2);
}

.main-content {
  flex: 1;
  padding: 2rem 0;
  background: #f9fafb;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.simple-footer {
  background: #1f2937;
  color: white;
  text-align: center;
  padding: 1rem 0;
}

.simple-footer p {
  margin: 0;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .main-content {
    padding: 1rem 0;
  }

  .container {
    padding: 0 0.75rem;
  }
}
</style>
