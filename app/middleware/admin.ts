import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return;

  const { isLoggedIn, isAdmin, hasPermission } = useAuth();

  // Must be authenticated (auth middleware should handle this too)
  if (!isLoggedIn.value) {
    return navigateTo('/auth', { replace: true });
  }

  const requiredPermission = to.meta.permission as string | string[] | undefined;

  // If explicit permission is set, allow if admin or has that permission
  if (requiredPermission) {
    if (!isAdmin.value && !hasPermission(requiredPermission)) {
      return navigateTo('/access-denied', { replace: true });
    }
    return;
  }

  // No explicit permission provided: treat this middleware as admin-only
  if (!isAdmin.value) {
    return navigateTo('/access-denied', { replace: true });
  }
});
