// composables/useAuth.ts
export const useAuth = () => {
  const user = useState<any>('auth.user', () => null);
  const token = useState<string | null>('auth.token', () => null);
  const isLoading = useState('auth.loading', () => false);

  const apiUrl = 'http://127.0.0.1:8000/api';

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

  // Check user existence or register
  const checkUser = async (identifier: string) => {
    try {
      isLoading.value = true;

      const response = await $fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        body: {
          email_or_phone: identifier
        }
      });

      return response;
    } catch (error) {
      console.error('Check user error:', error);
      return {
        success: false,
        message: 'خطا در ارتباط با سرور'
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Login with password
  const loginWithPassword = async (identifier: string, password: string) => {
    try {
      isLoading.value = true;

      const response = await $fetch(`${apiUrl}/auth/login`, {
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
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'خطا در ورود'
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Send OTP
  const sendOTP = async (identifier: string) => {
    try {
      isLoading.value = true;

      const response = await $fetch(`${apiUrl}/auth/otp/send`, {
        method: 'POST',
        body: {
          email_or_phone: identifier
        }
      });

      return response;
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        message: 'خطا در ارسال کد'
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Verify OTP
  const verifyOTP = async (identifier: string, code: string) => {
    try {
      isLoading.value = true;

      const response = await $fetch(`${apiUrl}/auth/otp/verify`, {
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
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        message: 'خطا در تایید کد'
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Resend OTP
  const resendOTP = async (identifier: string) => {
    try {
      isLoading.value = true;

      const response = await $fetch(`${apiUrl}/auth/otp/resend`, {
        method: 'POST',
        body: {
          email_or_phone: identifier
        }
      });

      return response;
    } catch (error) {
      console.error('Resend OTP error:', error);
      return {
        success: false,
        message: 'خطا در ارسال مجدد کد'
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (token.value) {
        await $fetch(`${apiUrl}/auth/logout`, {
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
        localStorage.removeItem('isLoggedIn'); // Legacy
        localStorage.removeItem('username'); // Legacy
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
