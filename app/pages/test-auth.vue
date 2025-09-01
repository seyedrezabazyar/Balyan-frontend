<template>
  <div class="test-container">
    <h1>تست احراز هویت</h1>
    
    <div v-if="isLoggedIn">
      <h2>اطلاعات کاربر:</h2>
      <pre>{{ JSON.stringify(user, null, 2) }}</pre>
      
      <h2>وضعیت:</h2>
      <ul>
        <li>لاگین: {{ isLoggedIn }}</li>
        <li>ادمین: {{ isAdmin }}</li>
        <li>is_admin field: {{ user?.is_admin }}</li>
        <li>نقش‌ها: {{ userRoles.map(r => r.name).join(', ') || 'هیچ نقشی ندارد' }}</li>
      </ul>
      
      <h2>تست دسترسی‌ها:</h2>
      <ul>
        <li>hasRole('admin'): {{ hasRole('admin') }}</li>
        <li>hasRole('super-admin'): {{ hasRole('super-admin') }}</li>
        <li>hasRole('super_admin'): {{ hasRole('super_admin') }}</li>
        <li>hasRole(['admin', 'super-admin', 'super_admin']): {{ hasRole(['admin', 'super-admin', 'super_admin']) }}</li>
      </ul>
      
      <button @click="fetchUserData" class="btn">بازیابی اطلاعات کاربر</button>
      <button @click="navigateTo('/dashboard/users')" class="btn">رفتن به صفحه کاربران</button>
    </div>
    
    <div v-else>
      <p>شما لاگین نکرده‌اید</p>
      <button @click="navigateTo('/auth')" class="btn">رفتن به صفحه لاگین</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, isLoggedIn, isAdmin, userRoles, hasRole, fetchUser } = useAuth()

const fetchUserData = async () => {
  const userData = await fetchUser()
  console.log('User data from API:', userData)
}

onMounted(async () => {
  console.log('Current user:', user.value)
  console.log('Is admin:', isAdmin.value)
  console.log('User roles:', userRoles.value)
})
</script>

<style scoped>
.test-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

h2 {
  color: #666;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

ul {
  list-style: disc;
  padding-left: 2rem;
}

li {
  margin: 0.5rem 0;
}

.btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  margin: 0.5rem;
  transition: background 0.3s;
}

.btn:hover {
  background: #5a67d8;
}
</style>