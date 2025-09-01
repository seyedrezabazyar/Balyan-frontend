<template>
  <div v-if="hasAccess">
    <slot />
  </div>
  <div v-else-if="showFallback" class="access-denied-message">
    <Icon name="heroicons:lock-closed" class="access-icon" />
    <p>{{ fallbackMessage || 'شما دسترسی به این بخش را ندارید' }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  roles?: string | string[]
  permissions?: string | string[]
  requireAll?: boolean
  showFallback?: boolean
  fallbackMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  requireAll: false,
  showFallback: false
})

const { hasRole, hasPermission, isAdmin } = useAuth()

const hasAccess = computed(() => {
  // Admin always has access
  if (isAdmin.value) return true

  const checks: boolean[] = []

  // Check roles
  if (props.roles) {
    checks.push(hasRole(props.roles))
  }

  // Check permissions
  if (props.permissions) {
    checks.push(hasPermission(props.permissions))
  }

  // If no requirements specified, grant access
  if (checks.length === 0) return true

  // Return based on requireAll flag
  return props.requireAll ? checks.every(Boolean) : checks.some(Boolean)
})
</script>

<style scoped>
.access-denied-message {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.access-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #d1d5db;
}

.access-denied-message p {
  margin: 0;
  font-size: 0.95rem;
}
</style>