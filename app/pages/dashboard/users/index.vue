<template>
  <div class="users-page">
    <h2 class="title">
      <component :is="UsersIcon" class="title-icon" />
      مدیریت کاربران
    </h2>
    <div v-if="users.length === 0" class="empty-state">
      <component :is="LockClosedIcon" class="empty-icon" />
      <p>هیچ کاربری یافت نشد</p>
    </div>
    <div v-else class="users-list">
      <!-- Add user list rendering here -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { UsersIcon, LockClosedIcon } from '@heroicons/vue/24/outline';

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'admin'],
  permission: 'users.view',
});

const users = ref([]); // Replace with actual user fetching logic
</script>

<style scoped>
.users-page {
  padding: 1.5rem;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.title-icon {
  width: 24px;
  height: 24px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: #6b7280;
}

.empty-state p {
  margin-top: 1rem;
  font-size: 1rem;
  color: #6b7280;
}
</style>
