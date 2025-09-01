import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);
  const isAdmin = computed(() => user.value?.is_admin || false);

  const router = useRouter();
  const { showToast } = useToast();
  const { api, setTokens, clearTokens: clearStoredTokens, getAccessToken } = useApi();

  const fetchUser = async () => {
    if (!token.value && !getAccessToken()) return null;
    try {
      const result: any = await api('/api/auth/user', { method: 'GET' });
      const fetchedUser = result?.user || result?.data || null;
      if (result?.success && fetchedUser) {
        user.value = {
          ...fetchedUser,
          permissions: Array.isArray(fetchedUser.permissions) ? fetchedUser.permissions : [],
        };
        localStorage.setItem('auth_user', JSON.stringify(user.value));
      }
      return fetchedUser;
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
      // Optional: call backend logout if available
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    clearStoredTokens();
  };

  const isLoggedIn = computed(() => !!token.value && !!user.value);
  const initialized = ref(false);

  const restoreAuth = () => {
    const savedToken = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('auth_user');
    if (savedToken) {
      token.value = savedToken;
    }
    if (savedUser) {
      try { user.value = JSON.parse(savedUser); } catch {}
    }
    initialized.value = true;
  };

  const checkUserIdentifier = async (identifier: string) => {
    loading.value = true;
    try {
      const result: any = await api('/api/auth/check-identifier', {
        method: 'POST',
        body: { identifier },
        requireAuth: false
      });
      return result;
    } catch (error: any) {
      return { success: false, message: error?.message };
    } finally {
      loading.value = false;
    }
  };

  const loginPassword = async (identifier: string, password: string) => {
    loading.value = true;
    try {
      const result: any = await api('/api/auth/login', {
        method: 'POST',
        body: { identifier, password },
        requireAuth: false
      });

      if (result?.success) {
        const access = result?.tokens?.access_token || result?.access_token;
        const refresh = result?.tokens?.refresh_token || result?.refresh_token;
        if (access) {
          setTokens(access, refresh);
          token.value = access;
          localStorage.setItem('auth_token', access);
        }
        if (result?.user) {
          user.value = {
            ...result.user,
            permissions: Array.isArray(result.user.permissions) ? result.user.permissions : []
          };
          localStorage.setItem('auth_user', JSON.stringify(user.value));
        } else {
          await fetchUser();
        }
      }
      return result;
    } catch (error: any) {
      return { success: false, message: error?.message };
    } finally {
      loading.value = false;
    }
  };

  const sendOTP = async (identifier: string) => {
    loading.value = true;
    try {
      const result: any = await api('/api/auth/otp/send', {
        method: 'POST',
        body: { identifier },
        requireAuth: false
      });
      return result;
    } catch (error: any) {
      return { success: false, message: error?.message };
    } finally {
      loading.value = false;
    }
  };

  const verifyOTP = async (identifier: string, otp: string) => {
    loading.value = true;
    try {
      const result: any = await api('/api/auth/otp/verify', {
        method: 'POST',
        body: { identifier, otp },
        requireAuth: false
      });

      if (result?.success) {
        const access = result?.tokens?.access_token || result?.access_token;
        const refresh = result?.tokens?.refresh_token || result?.refresh_token;
        if (access) {
          setTokens(access, refresh);
          token.value = access;
          localStorage.setItem('auth_token', access);
        }
        if (result?.user) {
          user.value = {
            ...result.user,
            permissions: Array.isArray(result.user.permissions) ? result.user.permissions : []
          };
          localStorage.setItem('auth_user', JSON.stringify(user.value));
        } else {
          await fetchUser();
        }
      }
      return result;
    } catch (error: any) {
      return { success: false, message: error?.message };
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (payload: any) => {
    try {
      const res = await $fetch('/api/auth/profile/update', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value || getAccessToken()}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: payload
      });
      if ((res as any)?.success && (res as any)?.user) {
        user.value = (res as any).user as any;
        localStorage.setItem('auth_user', JSON.stringify(user.value));
      }
      return res as any;
    } catch (error: any) {
      return { success: false, message: error?.message };
    }
  };

  const setPassword = async (password: string, password_confirmation: string) => {
    try {
      const res = await $fetch('/api/auth/profile/password', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value || getAccessToken()}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: { action: 'set', password, password_confirmation }
      });
      return res as any;
    } catch (error: any) {
      return { success: false, message: error?.message };
    }
  };

  const updatePassword = async (
    current_password: string,
    password: string,
    password_confirmation: string
  ) => {
    try {
      const res = await $fetch('/api/auth/profile/password', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value || getAccessToken()}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: { action: 'change', current_password, password, password_confirmation }
      });
      return res as any;
    } catch (error: any) {
      return { success: false, message: error?.message };
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await fetch('/api/auth/profile/avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value || getAccessToken()}`
        },
        body: formData
      });
      const data = await res.json();
      if (data?.success && data?.avatar_url) {
        if (user.value) {
          user.value = { ...(user.value as any), avatar_url: data.avatar_url } as any;
          localStorage.setItem('auth_user', JSON.stringify(user.value));
        }
      }
      return data;
    } catch (error: any) {
      return { success: false, message: error?.message };
    }
  };

  const logoutAll = async () => {
    try {
      const res = await fetch('/api/auth/profile/logout-all', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value || getAccessToken()}`
        }
      });
      const data = await res.json();
      clearAuth();
      router.push('/auth');
      return data;
    } catch (error: any) {
      clearAuth();
      router.push('/auth');
      return { success: false, message: error?.message };
    }
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
    api,
    checkUserIdentifier,
    loginPassword,
    sendOTP,
    verifyOTP,
    updateProfile,
    setPassword,
    updatePassword,
    uploadAvatar,
    logoutAll
  };
});

// Export composable wrapper
export const useAuth = () => {
  return useAuthStore();
};
