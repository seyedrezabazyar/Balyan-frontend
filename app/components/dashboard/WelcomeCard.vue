<!-- components/dashboard/WelcomeCard.vue -->
<template>
  <div class="welcome-card">
    <div class="welcome-content">
      <h1>{{ displayName }}! 👋</h1>
      <p>{{ welcomeMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  user: {
    type: Object,
    default: () => ({})
  },
  displayName: {
    type: String,
    default: 'کاربر عزیز'
  },
  welcomeMessage: {
    type: String,
    default: 'به داشبورد خود خوش آمدید'
  }
})
</script>

<style scoped>
.welcome-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
  text-align: center;
}

.welcome-content h1 {
  color: var(--dark);
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.welcome-content p {
  color: var(--gray);
  margin: 0;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .welcome-card {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .welcome-content h1 {
    font-size: 1.5rem;
  }

  .welcome-content p {
    font-size: 1rem;
  }
}
</style>
