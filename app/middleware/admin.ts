export default defineNuxtRouteMiddleware((to) => {
  const { isAdmin, hasPermission } = useAuth();

  // Skip middleware during SSR to avoid hydration issues
  if (process.server) return;

  const permission = to.meta.permission;
  if (permission && !isAdmin.value && !hasPermission(permission as any)) {
    console.warn('Access denied. User does not have admin role or required permission:', permission);
    return navigateTo('/access-denied');
  }
});
