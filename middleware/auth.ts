export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.server) return

  // Check login status from localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  
  // If not logged in, redirect to login page
  if (!isLoggedIn || isLoggedIn !== 'true') {
    return navigateTo('/login')
  }
})