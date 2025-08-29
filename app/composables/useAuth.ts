// composables/useAuth.ts
export const useAuth = () => {
  const user = useState<any>('auth.user', () => null);
  const accessToken = useState<string | null>('auth.access_token', () => null);
  const refreshToken = useState<string | null>('auth.refresh_token', () => null);
  const isLoading = useState('auth.loading', () => false);

  // Runtime config
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

  // API call helper with better error handling
  const makeApiCall = async (endpoint: string, options: any = {}) => {
    try {
      // تنظیم headers پیش‌فرض
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // اگر body وجود دارد، آن را stringify کنیم
      let body = options.body;
      if (body && typeof body === 'object') {
        body = JSON.stringify(body);
      }

      const response = await $fetch(`${apiUrl}${endpoint}`, {
        ...options,
        body,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      });

      console.log(`✅ API Success [${endpoint}]:`, response);
      return response;
    } catch (error: any) {
      console.error(`❌ API Error [${endpoint}]:`, error);

      // Handle different error types based on status
      const status = error.response?.status || error.status;
      const data = error.response?._data || error.data;

      if (status === 404) {
        return {
          success: false,
          message: 'سرور در دسترس نیست. لطفاً مطمئن شوید که Laravel API در حال اجرا است.'
        };
      } else if (status === 500) {
        return {
          success: false,
          message: 'خطای داخلی سرور',
          details: data?.message || error.message
        };
      } else if (status === 422 || status === 400) {
        return {
          success: false,
          message: data?.message || 'داده‌های ارسالی نامعتبر است',
          errors: data?.errors
        };
      } else if (status === 429) {
        return {
          success: false,
          message: data?.message || 'تعداد درخواست‌ها بیش از حد مجاز'
        };
      } else if (status === 401) {
        return {
          success: false,
          message: data?.message || 'عدم احراز هویت'
        };
      }

      // Network or unknown errors
      if (error.message?.includes('fetch') || !status) {
        return {
          success: false,
          message: 'عدم اتصال به سرور. لطفاً اتصال اینترنت و وضعیت سرور را بررسی کنید.'
        };
      }

      return {
        success: false,
        message: data?.message || error.message || 'خطا در ارتباط با سرور'
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

    console.log('💾 Auth data saved:', { user: userData, hasTokens: !!tokens.access_token });
  };

  // ✨ Step 1: Check user (based on API docs)
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

  // 🔑 Step 2a: Login with password (based on API docs)
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

  // 📱 Step 2b: Send OTP (based on API docs)
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

  // ✅ Step 3: Verify OTP (based on API docs) - اصلاح شده
  const verifyOTP = async (identifier: string, otp: string, name?: string) => {
    isLoading.value = true;
    try {
      const requestBody: any = {
        identifier: identifier.trim(),
        otp: otp.trim()
      };

      // Add name for registration ONLY if provided
      if (name && name.trim()) {
        requestBody.name = name.trim();
      }

      console.log('🔍 Sending verify-otp request:', {
        endpoint: '/auth/verify-otp',
        body: requestBody
      });

      const response = await makeApiCall('/auth/verify-otp', {
        method: 'POST',
        body: requestBody
      });

      console.log('✅ Verify OTP Response:', response);

      // Save auth data if successful
      if (response.success && response.tokens && response.user) {
        saveAuthData(response.user, response.tokens);
      }

      return response;
    } catch (error) {
      console.error('❌ Verify OTP Error:', error);
      return {
        success: false,
        message: 'خطا در تایید کد'
      };
    } finally {
      isLoading.value = false;
    }
  };

  // 🔄 Refresh tokens (based on API docs)
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
      // If refresh token is invalid, logout user
      clearAuthData();
      throw error;
    }
  };

  // 👤 Get user info (based on API docs)
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

  // 🚪 Logout (based on API docs)
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

  // 🚪 Logout from all devices (based on API docs)
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

  // 📝 Update profile (based on API docs)
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

  // 🔐 Set password (for OTP-only users, based on API docs)
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

  // 🔐 Update password (based on API docs)
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

  // 🔍 Health check (based on API docs)
  const healthCheck = async () => {
    try {
      const response = await makeApiCall('/auth/health');
      console.log('🏥 Health Check:', response);
      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      return { success: false, message: 'سرور در دسترس نیست' };
    }
  };

  return {
    // State
    user: readonly(user),
    accessToken: readonly(accessToken),
    refreshToken: readonly(refreshToken),
    isLoading: readonly(isLoading),
    isLoggedIn,

    // Methods - Core Flow
    initialize,
    checkUser,
    loginWithPassword,
    sendOTP,
    verifyOTP,

    // Methods - Token Management
    refreshTokens,

    // Methods - User Management
    fetchUser,
    updateProfile,
    setPassword,
    updatePassword,

    // Methods - Session Management
    logout,
    logoutAll,

    // Methods - Utilities
    healthCheck
  };
};
