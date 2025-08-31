import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  User,
  Tokens,
  CheckUserResponse,
  SendOTPResponse,
  AuthResponse,
  ApiResponse,
  ProfileUpdateData,
  PasswordUpdateData,
  UserListResponse,
} from '../types/auth.types';

class AuthService {
  private api: AxiosInstance;
  private baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load tokens from localStorage
    this.loadTokens();

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        if (this.accessToken && !config.headers.skipAuth) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest: any = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // If we're already refreshing, wait for it to complete
          if (this.refreshPromise) {
            await this.refreshPromise;
            originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
            return this.api(originalRequest);
          }

          try {
            this.refreshPromise = this.refreshTokens();
            await this.refreshPromise;
            this.refreshPromise = null;
            originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private loadTokens(): void {
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  private storeTokens(tokens: Tokens): void {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem('expires_at', tokens.expires_at);
    if (tokens.refresh_expires_at) {
      localStorage.setItem('refresh_expires_at', tokens.refresh_expires_at);
    }
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('refresh_expires_at');
  }

  // Authentication endpoints
  async checkUser(identifier: string): Promise<CheckUserResponse> {
    const response = await this.api.post<CheckUserResponse>('/auth/check-user', {
      identifier,
    });
    return response.data;
  }

  async sendOTP(identifier: string): Promise<SendOTPResponse> {
    const response = await this.api.post<SendOTPResponse>('/auth/send-otp', {
      identifier,
    });
    return response.data;
  }

  async verifyOTP(identifier: string, otp: string, name?: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/verify-otp', {
      identifier,
      otp,
      ...(name && { name }),
    });
    
    if (response.data.success) {
      this.storeTokens(response.data.tokens);
    }
    
    return response.data;
  }

  async loginWithPassword(identifier: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login-password', {
      identifier,
      password,
    });
    
    if (response.data.success) {
      this.storeTokens(response.data.tokens);
    }
    
    return response.data;
  }

  async refreshTokens(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.api.post<AuthResponse>(
      '/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${this.refreshToken}`,
          skipAuth: true,
        },
      }
    );

    if (response.data.success) {
      this.storeTokens(response.data.tokens);
    } else {
      throw new Error('Token refresh failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  async logoutAll(): Promise<void> {
    try {
      await this.api.post('/auth/logout-all');
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      this.clearTokens();
    }
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<ApiResponse<User>>('/auth/user');
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to get user');
    }
    return response.data.data;
  }

  async updateProfile(data: ProfileUpdateData): Promise<User> {
    const response = await this.api.post<ApiResponse<User>>('/auth/profile/update', data);
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update profile');
    }
    return response.data.data;
  }

  async setPassword(password: string, passwordConfirmation: string): Promise<void> {
    const response = await this.api.post<ApiResponse>('/auth/password/set', {
      password,
      password_confirmation: passwordConfirmation,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to set password');
    }
  }

  async updatePassword(data: PasswordUpdateData): Promise<void> {
    const response = await this.api.post<ApiResponse>('/auth/password/update', data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update password');
    }
  }

  // Admin endpoints
  async getUsers(params?: {
    search?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }): Promise<UserListResponse> {
    const response = await this.api.get<UserListResponse>('/auth/users', { params });
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await this.api.get<ApiResponse<User>>(`/auth/users/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to get user');
    }
    return response.data.data;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await this.api.put<ApiResponse<User>>(`/auth/users/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update user');
    }
    return response.data.data;
  }

  async deleteUser(id: number): Promise<void> {
    const response = await this.api.delete<ApiResponse>(`/auth/users/${id}`);
    if (!response.data.success) {
      throw new Error('Failed to delete user');
    }
  }

  async toggleUserLock(id: number): Promise<void> {
    const response = await this.api.post<ApiResponse>(`/auth/users/${id}/toggle-lock`);
    if (!response.data.success) {
      throw new Error('Failed to toggle user lock');
    }
  }

  async resetUserPassword(id: number): Promise<{ password: string }> {
    const response = await this.api.post<ApiResponse<{ password: string }>>(`/auth/users/${id}/reset-password`);
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to reset password');
    }
    return response.data.data;
  }

  async getUserStatistics(): Promise<any> {
    const response = await this.api.get<ApiResponse>('/auth/users/statistics');
    return response.data.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }
}

export default new AuthService();