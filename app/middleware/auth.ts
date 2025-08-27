export default defineNuxtRouteMiddleware((to, from) => {
  // Check if we're on the client side
  if (import.meta.client) {
    // Check login status from localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    
    // If not logged in, redirect to login page
    if (!isLoggedIn || isLoggedIn !== 'true') {
      return navigateTo('/login')
    }
  }
})