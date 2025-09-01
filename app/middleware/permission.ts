// app/middleware/permission.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.server) return

  const { user, isLoggedIn } = useAuth()
  const { showToast } = useToast()

  // Check if user is authenticated
  if (!isLoggedIn.value) {
    showToast('لطفا ابتدا وارد شوید', 'error')
    return navigateTo('/auth', { replace: true })
  }

  // Get required permission from route meta
  const requiredPermission = to.meta.permission as string | string[] | undefined
  
  if (!requiredPermission) return // No specific permission required

  // Get user permissions through roles
  const userPermissions: string[] = []
  user.value?.roles?.forEach(role => {
    role.permissions?.forEach(permission => {
      if (!userPermissions.includes(permission.name)) {
        userPermissions.push(permission.name)
      }
    })
  })

  // Check if user has required permission
  const hasRequiredPermission = Array.isArray(requiredPermission)
    ? requiredPermission.some(perm => userPermissions.includes(perm))
    : userPermissions.includes(requiredPermission)

  if (!hasRequiredPermission) {
    showToast('شما دسترسی لازم برای این عملیات را ندارید', 'error')
    return navigateTo('/access-denied', { replace: true })
  }
})