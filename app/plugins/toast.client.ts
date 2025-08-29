// plugins/toast.client.ts
export default defineNuxtPlugin(() => {
  const { showToast, showSuccess, showError, showWarning, showInfo } = useToast()

  // Provide toast methods globally
  return {
    provide: {
      toast: {
        show: showToast,
        success: showSuccess,
        error: showError,
        warning: showWarning,
        info: showInfo
      }
    }
  }
})
