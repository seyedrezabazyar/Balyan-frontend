<!-- components/AppToast.vue -->
<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
          @click="removeToast(toast.id)"
        >
          <div class="toast-icon">
            <component :is="getIcon(toast.type)" />
          </div>
          <div class="toast-content">
            <p class="toast-message">{{ toast.message }}</p>
          </div>
          <button @click.stop="removeToast(toast.id)" class="toast-close">
            <XIcon />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
const { toasts, removeToast } = useToast()

// Icons (render functions to avoid runtime template compilation)
import { h } from 'vue'

const CheckIcon = {
  render() {
    return h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '20 6 9 17 4 12' })
    ])
  }
}

const XCircleIcon = {
  render() {
    return h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'm15 9-6 6' }),
      h('path', { d: 'm9 9 6 6' })
    ])
  }
}

const AlertTriangleIcon = {
  render() {
    return h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' }),
      h('path', { d: 'M12 9v4' }),
      h('path', { d: 'm12 17 .01 0' })
    ])
  }
}

const InfoIcon = {
  render() {
    return h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'm9 12 2 2 4-4' })
    ])
  }
}

const XIcon = {
  render() {
    return h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'm18 6-12 12' }),
      h('path', { d: 'm6 6 12 12' })
    ])
  }
}

const getIcon = (type) => {
  switch (type) {
    case 'success': return CheckIcon
    case 'error': return XCircleIcon
    case 'warning': return AlertTriangleIcon
    case 'info': return InfoIcon
    default: return InfoIcon
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  min-width: 300px;
  max-width: 400px;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toast:hover {
  transform: translateX(8px);
}

.toast-success {
  background: rgba(16, 185, 129, 0.95);
  color: white;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.toast-error {
  background: rgba(239, 68, 68, 0.95);
  color: white;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.toast-warning {
  background: rgba(245, 158, 11, 0.95);
  color: white;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.toast-info {
  background: rgba(59, 130, 246, 0.95);
  color: white;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.toast-content {
  flex: 1;
}

.toast-message {
  margin: 0;
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

/* Transitions */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-100%) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-100%) scale(0.8);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .toast-container {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
  }

  .toast {
    min-width: auto;
    max-width: none;
  }
}
</style>
