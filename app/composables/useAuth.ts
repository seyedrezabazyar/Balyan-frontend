import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from './useToast';
import { defineStore } from 'pinia';

export const useAuth = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);
  const isAdmin = computed(() => user.value?.is_admin || false);

  const { showToast } = useToast();
  const router = useRouter();

  const fetchUser = async () => {
    if (!token.value) return null;
    try {
      const response = await fetch('/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      const result = await response.json();
      console.log('Fetched user data from API:', result);
      if (result.success && result.user) {
        user.value = {
          ...result.user,
          permissions: Array.isArray(result.user.permissions) ? result.user.permissions : [], // Ensure permissions is an array
        };
        localStorage.setItem('auth_user', JSON.stringify(user.value));
        console.log('User data saved with permissions:', user.value.permissions);
      }
      return result.user;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      clearAuth();
      return null;
    }
  };

  const hasPermission = (permission: string | string[]) => {
    if (isAdmin.value) return true;
    const permissions = user.value?.permissions || [];
    if (Array.isArray(permission)) {
      return permission.some((p) => permissions.includes(p));
    }
    return permissions.includes(permission);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    clearAuth();
    router.push('/auth');
  };

  const clearAuth = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  };

  return { user, token, isAdmin, hasPermission, fetchUser, logout };
});
