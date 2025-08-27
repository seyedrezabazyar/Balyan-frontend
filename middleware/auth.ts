export default defineNuxtRouteMiddleware((to, from) => {
  // چک کردن وضعیت لاگین از localStorage
  if (typeof window !== 'undefined') {
    const isLoggedIn = localStorage.getItem('isLoggedIn')

    if (!isLoggedIn || isLoggedIn !== 'true') {
      return navigateTo('/login')
    }
  }
})
