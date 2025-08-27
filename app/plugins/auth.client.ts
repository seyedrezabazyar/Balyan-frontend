// plugins/auth.client.ts
export default defineNuxtPlugin(async () => {
  const { initialize, isLoggedIn } = useAuth()

  // بارگذاری اطلاعات احراز هویت از localStorage
  initialize()

  // اگر کاربر لاگین است، اطلاعات کاربر را از سرور دریافت کن
  if (isLoggedIn.value) {
    try {
      await nextTick()
      // اختیاری: می‌توانید اطلاعات کاربر را از سرور بروزرسانی کنید
      // await fetchUser()
    } catch (error) {
      console.error('Auth initialization error:', error)
    }
  }
})
