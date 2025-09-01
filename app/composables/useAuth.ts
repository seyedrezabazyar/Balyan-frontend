import { defineStore } from 'pinia';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);
  const isAdmin = computed(() => user.value?.is_admin || false);

  const router = useRouter();
  const { showToast } = useToast();

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

  const isLoggedIn = computed(() => !!token.value && !!user.value);
  const initialized = ref(false);

  const restoreAuth = () => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = JSON.parse(savedUser);
    }
    initialized.value = true;
  };

  const checkUserIdentifier = async () => {
    // TODO: Implement
    return { success: false };
  };

  const loginPassword = async () => {
    // TODO: Implement
    return { success: false };
  };

  const sendOTP = async () => {
    // TODO: Implement
    return { success: false };
  };

  const verifyOTP = async () => {
    // TODO: Implement
    return { success: false };
  };

  const loading = ref(false);

  return {
    user,
    token,
    isAdmin,
    isLoggedIn,
    initialized,
    loading,
    hasPermission,
    fetchUser,
    logout,
    clearAuth,
    restoreAuth,
    checkUserIdentifier,
    loginPassword,
    sendOTP,
    verifyOTP
  };
});

// Export composable wrapper
export const useAuth = () => {
  const store = useAuthStore();
  const { user, token, isAdmin, isLoggedIn, initialized, loading } = storeToRefs(store);

  const api = async (url: string, options: { method?: string; body?: any; headers?: Record<string, string> } = {}) => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(options.headers || {})
    };

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`;
    }

    return await $fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body
    });
  };

  const updateProfile = async (data: {
    name?: string;
    email?: string;
    phone?: string;
    username?: string;
    preferred_method?: 'password' | 'otp';
  }) => {
    const result: any = await api('/api/auth/profile/update', {
      method: 'POST',
      body: data
    });

    if (result?.success && result.user) {
      // Merge and persist updated user
      user.value = { ...(user.value || {}), ...result.user } as any;
      if (process.client) {
        localStorage.setItem('auth_user', JSON.stringify(user.value));
      }
    }

    return result;
  };

  const setPassword = async (password: string, password_confirmation: string) => {
    return await api('/api/auth/profile/password', {
      method: 'POST',
      body: { action: 'set', password, password_confirmation }
    });
  };

  const updatePassword = async (
    current_password: string,
    password: string,
    password_confirmation: string
  ) => {
    return await api('/api/auth/profile/password', {
      method: 'POST',
      body: { action: 'change', current_password, password, password_confirmation }
    });
  };

  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    // Note: $fetch handles FormData automatically
    return await $fetch('/api/auth/profile/avatar', {
      method: 'POST',
      headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
      body: formData
    });
  };

  const logoutAll = async () => {
    const result: any = await api('/api/auth/profile/logout-all', { method: 'POST' });
    // Clear local auth and rely on page flow to redirect
    store.clearAuth();
    return result;
  };

  return {
    // Refs
    user,
    token,
    isAdmin,
    isLoggedIn,
    initialized,
    loading,

    // Helpers
    api,

    // Methods from store
    hasPermission: store.hasPermission,
    fetchUser: store.fetchUser,
    logout: store.logout,
    clearAuth: store.clearAuth,
    restoreAuth: store.restoreAuth,
    checkUserIdentifier: store.checkUserIdentifier,
    loginPassword: store.loginPassword,
    sendOTP: store.sendOTP,
    verifyOTP: store.verifyOTP,

    // Profile methods
    updateProfile,
    setPassword,
    updatePassword,
    uploadAvatar,
    logoutAll
  };
};
