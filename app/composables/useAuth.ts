import { defineStore } from 'pinia';
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

  const checkUserIdentifier = async (identifier: string) => {
    try {
      // For demo, we'll check if user exists
      return { 
        success: true, 
        exists: true,
        method: 'password'
      };
    } catch (error) {
      return { success: false };
    }
  };

  const loginPassword = async (identifier: string, password: string) => {
    try {
      loading.value = true;
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.statusMessage || 'خطا در ورود');
      }
      
      if (result.success) {
        token.value = result.token;
        user.value = result.user;
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('auth_user', JSON.stringify(result.user));
        showToast('ورود با موفقیت انجام شد', 'success');
        return { success: true };
      }
      
      throw new Error(result.message || 'خطا در ورود');
    } catch (error: any) {
      showToast(error.message || 'خطا در ورود', 'error');
      return { success: false, message: error.message };
    } finally {
      loading.value = false;
    }
  };

  const register = async (identifier: string, password: string, name: string) => {
    try {
      loading.value = true;
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password, name }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.statusMessage || 'خطا در ثبت نام');
      }
      
      if (result.success) {
        token.value = result.token;
        user.value = result.user;
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('auth_user', JSON.stringify(result.user));
        showToast('ثبت نام با موفقیت انجام شد', 'success');
        return { success: true };
      }
      
      throw new Error(result.message || 'خطا در ثبت نام');
    } catch (error: any) {
      showToast(error.message || 'خطا در ثبت نام', 'error');
      return { success: false, message: error.message };
    } finally {
      loading.value = false;
    }
  };

  const sendOTP = async () => {
    // TODO: Implement OTP
    showToast('ارسال کد یکبار مصرف در حال حاضر غیرفعال است', 'info');
    return { success: false };
  };

  const verifyOTP = async () => {
    // TODO: Implement OTP verification
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
    register,
    sendOTP,
    verifyOTP
  };
});

// Export composable wrapper
export const useAuth = () => {
  return useAuthStore();
};
