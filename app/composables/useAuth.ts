// composables/useAuth.ts
export const useAuth = () => {
  const user = useState<any>('auth.user', () => null);
  const accessToken = useState<string | null>('auth.access_token', () => null);
  const refreshToken = useState<string | null>('auth.refresh_token', () => null);
  const isLoading = useState('auth.loading', () => false);

  // Runtime config برای API URL
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiBase;

  // Initialize from localStorage
  const initialize = () => {
    if (process.client) {
      try {
        const storedAccessToken = localStorage.getItem('auth_access_token');
        const storedRefreshToken = localStorage.getItem('auth_refresh_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedAccessToken && storedUser) {
          accessToken.value = storedAccessToken;
          refreshToken.value = storedRefreshToken;
          user.value = JSON.parse(storedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
      }
    }
  };

  // Check if logged in
  const isLoggedIn = computed(() => {
    return !!(user.value && accessToken.value);
  });

  // API call helper
  const makeApiCall = async (endpoint: string, options: any = {}) => {
    try {
      const response = await $fetch(`${apiUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });

      console.log(`✅ API Response for ${endpoint}:`, response);
      return response;
    } catch (error: any) {
      console.error(`❌ API call failed for ${endpoint}:`, error);

      // Handle different error types
      if (error.status === 404) {
        return {
          success: false,
          message: 'سرور در دسترس نیست. لطفاً مطمئن شوید که Laravel API در حال اجرا است.'
        };
      } else if (error.status === 500) {
        return {
          success: false,
          message: 'خطای داخلی سرور'
        };
      } else if (error.status === 422 || error.status === 400) {
        return {
          success: false,
          message: error.data?.message || 'داده‌های ارسالی نامعتبر است',
          errors: error.data?.errors
        };
      } else if (error.status === 429) {
        return {
          success: false,
          message: error.data?.message || 'تعداد درخواست‌ها بیش از حد مجاز'
        };
      } else if (error.message?.includes('fetch')) {
        return {
          success: false,
          message: 'عدم اتصال به سرور. لطفاً اتصال اینترنت و وضعیت سرور را بررسی کنید.'
        };
      }

      return {
        success: false,
        message: error.data?.message || 'خطا در ارتباط با سرور'
      };
    }
  };

  // Clear auth data
  const clearAuthData = () => {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;

    if (process.client) {
      localStorage.removeItem('auth_access_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_user');
    }
  };

  // Save auth data
  const saveAuthData = (userData: any, tokens: any) => {
    user.value = userData;
    accessToken.value = tokens.access_token;
    refreshToken.value = tokens.refresh_token;

    if (process.client) {
      localStorage.setItem('auth_access_token', tokens.access_token);
      localStorage.setItem('auth_refresh_token', tokens.refresh_token);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    }
  };

  // ✨ Step 1: Check user (unified entry point)
  const checkUser = async (identifier: string) => {
    isLoading.value = true;
    try {
      const response = await makeApiCall('/auth/check-user', {
        method: 'POST',
        body: { identifier: identifier.trim() }
      });

      console.log('📋 Check User Response:', response);
      return response;
    } finally {
      isLoading.value = false;
    }
  };

  // 🔑 Step 2a: Login with password
  const loginWithPassword = async (identifier: string, password: string) => {
    isLoading.value = true;
    try {
      const response = await makeApiCall('/auth/login-password', {
        method: 'POST',
        body: {
          identifier: identifier.trim(),
          password: password
        }
      });

      console.log('🔑 Password Login Response:', response);

      if (response.success && response.tokens && response.user) {
        saveAuthData(response.user, response.tokens);
      }

      return response;
    } finally {
      isLoading.value = false;
    }
  };

  // 📱 Step 2b: Send OTP
  const sendOTP = async (identifier: string) => {
    isLoading.value = true;
    try {
      const response = await makeApiCall('/auth/send-otp', {
        method: 'POST',
        body: { identifier: identifier.trim() }
      });

      console.log('📱 Send OTP Response:', response);
      return response;
    } finally {
      isLoading.value = false;
    }
  };

  // ✅ Step 3: Verify OTP
  const verifyOTP = async (identifier: string, otp: string, name?: string) => {
    isLoading.value = true;
    try {
      const requestBody: any = {
        identifier: identifier.trim(),
        otp: otp.trim()
      };

      // اگر نام داده شده برای ثبت‌نام جدید
      if (name) {
        requestBody.name = name.trim();
      }

      const response = await makeApiCall('/auth/verify-otp', {
        method: 'POST',
        body: requestBody
      });

      console.log('✅ Verify OTP Response:', response);

      // اگر موفق بود و توکن‌ها آمدند
      if (response.success && response.tokens && response.user) {
        saveAuthData(response.user, response.tokens);
      }

      return response;
    } finally {
      isLoading.value = false;
    }
  };

  // 🔄 Refresh tokens
  const refreshTokens = async () => {
    if (!refreshToken.value) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await makeApiCall('/auth/refresh', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken.value}`
        }
      });

      if (response.success && response.tokens) {
        const currentUser = user.value;
        saveAuthData(currentUser, response.tokens);
      }

      return response;
    } catch (error) {
      // اگر refresh token معتبر نیست، کاربر رو logout کن
      clearAuthData();
      throw error;
    }
  };

  // 👤 Get user info
  const fetchUser = async () => {
    if (!accessToken.value) return null;

    try {
      const response = await makeApiCall('/auth/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      });

      if (response.success && response.user) {
        user.value = response.user;
        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(response.user));
        }
      }

      return response;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      if (accessToken.value) {
        await makeApiCall('/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
    }
  };

  // 🚪 Logout from all devices
  const logoutAll = async () => {
    try {
      if (accessToken.value) {
        await makeApiCall('/auth/logout-all', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        });
      }
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      clearAuthData();
    }
  };

  // 📝 Update profile
  const updateProfile = async (profileData: any) => {
    if (!accessToken.value) throw new Error('Not authenticated');

    isLoading.value = true;
    try {
      const response = await makeApiCall('/auth/profile/update', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: profileData
      });

      if (response.success && response.user) {
        user.value = response.user;
        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(response.user));
        }
      }

      return response;
    } finally {
      isLoading.value = false;
    }
  };

  // 🔐 Set password (for OTP-only users)
  const setPassword = async (password: string, passwordConfirmation: string) => {
    if (!accessToken.value) throw new Error('Not authenticated');

    isLoading.value = true;
    try {
      const response = await makeApiCall('/auth/password/set', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: {
          password,
          password_confirmation: passwordConfirmation
        }
      });

      return response;
    } finally {
      isLoading.value = false;
    }
  };

  // 🔐 Update password
  const updatePassword = async (currentPassword: string, newPassword: string, passwordConfirmation: string) => {
    if (!accessToken.value) throw new Error('Not authenticated');

    isLoading.value = true;
    try {
      const response = await makeApiCall('/auth/password/update', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: {
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: passwordConfirmation
        }
      });

      return response;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    user: readonly(user),
    accessToken: readonly(accessToken),
    refreshToken: readonly(refreshToken),
    isLoading: readonly(isLoading),
    isLoggedIn,

    // Methods
    initialize,
    checkUser,
    loginWithPassword,
    sendOTP,
    verifyOTP,
    refreshTokens,
    fetchUser,
    logout,
    logoutAll,
    updateProfile,
    setPassword,
    updatePassword
  };
};
