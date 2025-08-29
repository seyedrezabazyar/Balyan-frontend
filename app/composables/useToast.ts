// composables/useToast.ts
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const addToast = (message: string, type: Toast['type'] = 'info', duration: number = 5000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)

    const toast: Toast = {
      id,
      message,
      type,
      duration
    }

    toasts.value.push(toast)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  // Convenience methods
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    return addToast(message, type)
  }

  const showSuccess = (message: string) => {
    return addToast(message, 'success')
  }

  const showError = (message: string) => {
    return addToast(message, 'error')
  }

  const showWarning = (message: string) => {
    return addToast(message, 'warning')
  }

  const showInfo = (message: string) => {
    return addToast(message, 'info')
  }

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    clearAllToasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
