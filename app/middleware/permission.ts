export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return;

  const { user, isLoggedIn, hasPermission } = useAuth();
  const { showToast } = useToast();

  if (!isLoggedIn.value) {
    showToast('لطفا ابتدا وارد شوید', 'error');
    return navigateTo('/auth', { replace: true });
  }

  const requiredPermission = to.meta.permission as string | string[] | undefined;
  if (!requiredPermission) return;

  const hasRequiredPermission = Array.isArray(requiredPermission)
    ? requiredPermission.some(perm => hasPermission(perm))
    : hasPermission(requiredPermission);

  if (!hasRequiredPermission) {
    showToast('شما دسترسی لازم برای این عملیات را ندارید', 'error');
    return navigateTo('/access-denied', { replace: true });
  }
});
