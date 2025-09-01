import type { User } from '~/types';
import { usePermissions } from './usePermissions';

interface CreateUserData {
  name: string;
  email?: string;
  phone?: string;
  preferred_method: 'password' | 'otp';
  password?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  preferred_method?: 'password' | 'otp';
}

interface UsersResponse {
  success: boolean;
  data: User[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

interface UserStats {
  total_users: number;
  verified_emails: number;
  verified_phones: number;
  users_with_password: number;
  recent_registrations: number;
  locked_accounts: number;
}

export const useUsers = () => {
  const { api } = useAuth();
  const { showToast } = useToast();
  const { canViewUsers } = usePermissions();

  const users = ref<User[]>([]);
  const loading = ref(false);
  const stats = ref<UserStats | null>(null);

  const fetchUsers = async (params?: {
    search?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }): Promise<UsersResponse | null> => {
    if (!canViewUsers.value) {
      showToast('شما اجازه دسترسی به لیست کاربران را ندارید', 'error');
      return null;
    }

    loading.value = true;
    try {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.email_verified !== undefined) searchParams.append('email_verified', params.email_verified.toString());
      if (params?.phone_verified !== undefined) searchParams.append('phone_verified', params.phone_verified.toString());
      if (params?.sort_by) searchParams.append('sort_by', params.sort_by);
      if (params?.sort_order) searchParams.append('sort_order', params.sort_order);
      if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
      if (params?.page) searchParams.append('page', params.page.toString());

      const queryString = searchParams.toString();
      const url = `/api/auth/users${queryString ? `?${queryString}` : ''}`;

      const response = await api(url, { method: 'GET' });

      if (response?.success) {
        users.value = response.data || [];
        return response;
      } else {
        showToast('خطا در دریافت لیست کاربران', 'error');
        return null;
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      showToast(error.message || 'خطا در دریافت لیست کاربران', 'error');
      return null;
    } finally {
      loading.value = false;
    }
  };

  const fetchUserStats = async (): Promise<UserStats | null> => {
    if (!canViewUsers.value) {
      showToast('شما اجازه دسترسی به آمار کاربران را ندارید', 'error');
      return null;
    }

    try {
      const response = await api('/api/auth/users/statistics', { method: 'GET' });
      if (response?.success) {
        stats.value = response.data;
        return response.data;
      } else {
        console.error('Failed to fetch user stats');
        return null;
      }
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  };

  const createUser = async (userData: CreateUserData): Promise<boolean> => {
    try {
      const response = await api('/api/auth/users', {
        method: 'POST',
        body: userData
      });

      if (response?.success) {
        showToast('کاربر با موفقیت ایجاد شد', 'success');
        return true;
      } else {
        showToast(response?.message || 'خطا در ایجاد کاربر', 'error');
        return false;
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      showToast(error.message || 'خطا در ایجاد کاربر', 'error');
      return false;
    }
  };

  const updateUser = async (userId: number, userData: UpdateUserData): Promise<boolean> => {
    try {
      const response = await api(`/api/auth/users/${userId}`, {
        method: 'PUT',
        body: userData
      });

      if (response?.success) {
        showToast('کاربر با موفقیت به‌روزرسانی شد', 'success');
        return true;
      } else {
        showToast(response?.message || 'خطا در به‌روزرسانی کاربر', 'error');
        return false;
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      showToast(error.message || 'خطا در به‌روزرسانی کاربر', 'error');
      return false;
    }
  };

  const deleteUser = async (userId: number): Promise<boolean> => {
    try {
      const response = await api(`/api/auth/users/${userId}`, {
        method: 'DELETE'
      });

      if (response?.success) {
        showToast('کاربر با موفقیت حذف شد', 'success');
        return true;
      } else {
        showToast(response?.message || 'خطا در حذف کاربر', 'error');
        return false;
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      showToast(error.message || 'خطا در حذف کاربر', 'error');
      return false;
    }
  };

  const toggleUserLock = async (userId: number): Promise<boolean> => {
    try {
      const response = await api(`/api/auth/users/${userId}/toggle-lock`, {
        method: 'POST'
      });

      if (response?.success) {
        showToast(response.message || 'وضعیت کاربر تغییر کرد', 'success');
        return true;
      } else {
        showToast(response?.message || 'خطا در تغییر وضعیت کاربر', 'error');
        return false;
      }
    } catch (error: any) {
      console.error('Error toggling user lock:', error);
      showToast(error.message || 'خطا در تغییر وضعیت کاربر', 'error');
      return false;
    }
  };

  const verifyUserEmail = async (userId: number): Promise<boolean> => {
    try {
      const response = await api(`/api/auth/users/${userId}/verify-email`, {
        method: 'POST'
      });

      if (response?.success) {
        showToast('ایمیل کاربر تایید شد', 'success');
        return true;
      } else {
        showToast(response?.message || 'خطا در تایید ایمیل', 'error');
        return false;
      }
    } catch (error: any) {
      console.error('Error verifying email:', error);
      showToast(error.message || 'خطا در تایید ایمیل', 'error');
      return false;
    }
  };

  const verifyUserPhone = async (userId: number): Promise<boolean> => {
    try {
      const response = await api(`/api/auth/users/${userId}/verify-phone`, {
        method: 'POST'
      });

      if (response?.success) {
        showToast('شماره تلفن کاربر تایید شد', 'success');
        return true;
      } else {
        showToast(response?.message || 'خطا در تایید شماره تلفن', 'error');
        return false;
      }
    } catch (error: any) {
      console.error('Error verifying phone:', error);
      showToast(error.message || 'خطا در تایید شماره تلفن', 'error');
      return false;
    }
  };

  const resetUserPassword = async (userId: number, newPassword: string): Promise<boolean> => {
    try {
      const response = await api(`/api/auth/users/${userId}/reset-password`, {
        method: 'POST',
        body: { password: newPassword, password_confirmation: newPassword }
      });

      if (response?.success) {
        showToast('رمز عبور کاربر بازنشانی شد', 'success');
        return true;
      } else {
        showToast(response?.message || 'خطا در بازنشانی رمز عبور', 'error');
        return false;
      }
    } catch (error: any) {
      console.error('Error resetting password:', error);
      showToast(error.message || 'خطا در بازنشانی رمز عبور', 'error');
      return false;
    }
  };

  const getUserById = async (userId: number): Promise<User | null> => {
    try {
      const response = await api(`/api/auth/users/${userId}`, { method: 'GET' });

      if (response?.success) {
        return response.data;
      } else {
        showToast('خطا در دریافت اطلاعات کاربر', 'error');
        return null;
      }
    } catch (error: any) {
      console.error('Error fetching user:', error);
      showToast(error.message || 'خطا در دریافت اطلاعات کاربر', 'error');
      return null;
    }
  };

  return {
    users: readonly(users),
    loading: readonly(loading),
    stats: readonly(stats),
    fetchUsers,
    fetchUserStats,
    createUser,
    updateUser,
    deleteUser,
    toggleUserLock,
    verifyUserEmail,
    verifyUserPhone,
    resetUserPassword,
    getUserById
  };
};
