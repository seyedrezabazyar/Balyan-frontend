// composables/useAuth.ts
export const useAuth = () => {
  const user = useState<any>('auth.user', () => null);
  const token = useState<string | null>('auth.token', () => null);
  const isLoading = useState('auth.loading', () => false);

  // استفاده از runtime config برای API URL
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiBase;

  // Initialize from localStorage
  const initialize = () => {
    if (process.client) {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          token.value = storedToken;
          user.value = JSON.parse(storedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    }
  };

  // Check if logged in
  const isLoggedIn = computed(() => {
    return !!(user.value && token.value);
  });

  // Helper function برای handle کردن API calls
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
      return response;
    } catch (error: any) {
      console.error(`API call failed for ${endpoint}:`, error);

      // بررسی نوع خطا و ارسال پیام مناسب
      if (error.status === 404) {
        return {
          success: false,
          message: 'سرور در دسترس نیست. لطفاً مطمئن شوید که API در حال اجرا است.'
        };
      } else if (error.status === 500) {
        return {
          success: false,
          message: 'خطای داخلی سرور'
        };
      } else if (error.message?.includes('fetch')) {
        return {
          success: false,
          message: 'عدم اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.'
        };
      }

      return {
        success: false,
        message: error.data?.message || 'خطا در ارتباط با سرور'
      };
    }
  };

  // Check user existence or register
  const checkUser = async (identifier: string) => {
    isLoading.value = true;
    try {
      const response = await makeApiCall('/auth/register', {
        method: 'POST',
        body: {
          email_or_phone: identifier
        }
      });
      return response;
    } finally {
      isLoading.value = false;
    }
  };

  // Login with password
  const loginWithPassword = async (identifier: string, password: string) => {
    isLoading.value = true;
    try {
      const response = await makeApiCall('/auth/login', {
        method: 'POST',
        body: {
          email_or_phone: identifier,
          password: password
        }
      });

      if (response.success && response.data?.user && response.data?.token) {
        user.value = response.data.user;
        token.value = response.data.token;

        if (process.client) {
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('auth_user', JSON.stringify(response.data.user));
        }
      }

      return response;
    } finally {
      isLoading.value = false;
    }
  };

  // Send OTP
  const sendOTP = async (identifier: string) => {
    isLoading.value = true;
    try {
      const response = await makeApiCall('/auth/otp/send', {
        method: 'POST',
        body: {
          email_or_phone: identifier
        }
      });
      return response;
    } finally {
      isLoading.value = false;
    }
  };

  // Verify OTP
  const verifyOTP = async (identifier: string, code: string) => {
    isLoading.value = true;
    try {
      const response = await makeApiCall('/auth/otp/verify', {
        method: 'POST',
        body: {
          email_or_phone: identifier,
          otp_code: code
        }
      });

      if (response.success && response.data?.user && response.data?.token) {
        user.value = response.data.user;
        token.value = response.data.token;

        if (process.client) {
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('auth_user', JSON.stringify(response.data.user));
        }
      }

      return response;
    } finally {
      isLoading.value = false;
    }
  };

  // Resend OTP
  const resendOTP = async (identifier: string) => {
    isLoading.value = true;
    try {
      const response = await makeApiCall('/auth/otp/resend', {
        method: 'POST',
        body: {
          email_or_phone: identifier
        }
      });
      return response;
    } finally {
      isLoading.value = false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (token.value) {
        await makeApiCall('/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      user.value = null;
      token.value = null;

      if (process.client) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('isLoggedIn'); // Legacy cleanup
        localStorage.removeItem('username'); // Legacy cleanup
      }
    }
  };

  return {
    user: readonly(user),
    token: readonly(token),
    isLoading: readonly(isLoading),
    isLoggedIn,
    initialize,
    checkUser,
    loginWithPassword,
    sendOTP,
    verifyOTP,
    resendOTP,
    logout
  };
};
