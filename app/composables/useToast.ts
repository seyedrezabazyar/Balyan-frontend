interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const add = (message: string, type: Toast['type'] = 'info', duration = 5000) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const toast: Toast = { id, message, type, duration }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }

    return id
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) toasts.value.splice(index, 1)
  }

  const clear = () => {
    toasts.value = []
  }

  return {
    toasts: readonly(toasts),
    showToast: add,
    showSuccess: (msg: string) => add(msg, 'success'),
    showError: (msg: string) => add(msg, 'error'),
    showWarning: (msg: string) => add(msg, 'warning'),
    showInfo: (msg: string) => add(msg, 'info'),
    removeToast: remove,
    clearToasts: clear
  }
}
