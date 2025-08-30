<!-- components/AppButton.vue -->
<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-else-if="icon" class="icon">{{ icon }}</span>
    <span class="button-text">
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  rounded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
  return [
    'app-button',
    `btn-${props.variant}`,
    `btn-${props.size}`,
    {
      'btn-disabled': props.disabled,
      'btn-loading': props.loading,
      'btn-full': props.fullWidth,
      'btn-rounded': props.rounded,
      'btn-icon-only': props.icon && !props.text && !props.$slots.default
    }
  ]
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.app-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  overflow: hidden;
}

.app-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.app-button:hover::before {
  transform: translateX(100%);
}

.app-button::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
}

.app-button:active::after {
  opacity: 1;
}

/* Size variants */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  min-height: 36px;
}

.btn-md {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  min-height: 44px;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  min-height: 52px;
}

.btn-xl {
  padding: 1.25rem 2.5rem;
  font-size: 1.25rem;
  min-height: 60px;
}

/* Color variants */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #374151;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.btn-secondary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
}

.btn-ghost {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  box-shadow: none;
}

.btn-ghost:hover:not(:disabled) {
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
  border-color: #764ba2;
  color: #764ba2;
}

/* States */
.btn-disabled,
.app-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-loading {
  pointer-events: none;
  position: relative;
}

.btn-full {
  width: 100%;
}

.btn-rounded {
  border-radius: 50px;
}

.btn-icon-only {
  padding: 0.75rem;
  aspect-ratio: 1;
}

/* Spinner */
.spinner {
  width: 1.2em;
  height: 1.2em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Icon */
.icon {
  font-size: 1.2em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Button text */
.button-text {
  position: relative;
  z-index: 1;
}

/* Ripple effect */
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.app-button:not(:disabled):active {
  position: relative;
}

.app-button:not(:disabled):active::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  animation: ripple 0.6s ease-out;
}

/* Focus styles for accessibility */
.app-button:focus-visible {
  outline: 3px solid rgba(102, 126, 234, 0.5);
  outline-offset: 2px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .btn-secondary {
    background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
    color: #f3f4f6;
  }
  
  .btn-secondary:hover:not(:disabled) {
    background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  }
  
  .btn-ghost {
    color: #a5b4fc;
    border-color: #a5b4fc;
  }
  
  .btn-ghost:hover:not(:disabled) {
    background: rgba(165, 180, 252, 0.1);
    border-color: #c7d2fe;
    color: #c7d2fe;
  }
}
</style>