// app/plugins/auth.client.ts
export default defineNuxtPlugin(async () => {
  const { restoreAuth, fetchUser, token } = useAuth()

  // بازیابی اطلاعات از localStorage
  restoreAuth()

  // اگر توکن داریم، اطلاعات کاربر رو از سرور بگیریم
  if (token.value) {
    try {
      await fetchUser()
    } catch {
      // ignore errors
    }
  }
})