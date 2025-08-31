import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '../services/AuthService';
import { User, CheckUserResponse, AuthResponse } from '../types/auth.types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  checkUser: (identifier: string) => Promise<CheckUserResponse>;
  sendOTP: (identifier: string) => Promise<void>;
  verifyOTP: (identifier: string, otp: string, name?: string) => Promise<void>;
  loginWithPassword: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setPassword: (password: string, passwordConfirmation: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string, passwordConfirmation: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        AuthService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const checkUser = async (identifier: string): Promise<CheckUserResponse> => {
    try {
      const response = await AuthService.checkUser(identifier);
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در بررسی کاربر');
      throw error;
    }
  };

  const sendOTP = async (identifier: string): Promise<void> => {
    try {
      const response = await AuthService.sendOTP(identifier);
      if (response.success) {
        toast.success(response.message);
        // In development, show debug code
        if (response.debug_code) {
          toast.success(`کد تست: ${response.debug_code}`, { duration: 10000 });
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'خطا در ارسال کد';
      toast.error(message);
      throw error;
    }
  };

  const verifyOTP = async (identifier: string, otp: string, name?: string): Promise<void> => {
    try {
      const response = await AuthService.verifyOTP(identifier, otp, name);
      if (response.success) {
        setUser(response.user);
        toast.success(response.message || 'ورود موفق');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'کد وارد شده نامعتبر است';
      toast.error(message);
      throw error;
    }
  };

  const loginWithPassword = async (identifier: string, password: string): Promise<void> => {
    try {
      const response = await AuthService.loginWithPassword(identifier, password);
      if (response.success) {
        setUser(response.user);
        toast.success('ورود موفق');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'اطلاعات ورود نامعتبر';
      toast.error(message);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      setUser(null);
      toast.success('خروج موفق');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await AuthService.updateProfile(data);
      setUser(updatedUser);
      toast.success('پروفایل با موفقیت به‌روزرسانی شد');
    } catch (error: any) {
      const message = error.response?.data?.message || 'خطا در به‌روزرسانی پروفایل';
      toast.error(message);
      throw error;
    }
  };

  const setPassword = async (password: string, passwordConfirmation: string): Promise<void> => {
    try {
      await AuthService.setPassword(password, passwordConfirmation);
      toast.success('رمز عبور با موفقیت تنظیم شد');
    } catch (error: any) {
      const message = error.response?.data?.message || 'خطا در تنظیم رمز عبور';
      toast.error(message);
      throw error;
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string,
    passwordConfirmation: string
  ): Promise<void> => {
    try {
      await AuthService.updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: passwordConfirmation,
      });
      toast.success('رمز عبور با موفقیت به‌روزرسانی شد');
    } catch (error: any) {
      const message = error.response?.data?.message || 'خطا در به‌روزرسانی رمز عبور';
      toast.error(message);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    checkUser,
    sendOTP,
    verifyOTP,
    loginWithPassword,
    logout,
    updateProfile,
    setPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};