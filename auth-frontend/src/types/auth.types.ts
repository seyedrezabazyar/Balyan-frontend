// User types
export interface User {
  id: number;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  email_verified_at?: string;
  phone_verified_at?: string;
  preferred_method: 'password' | 'otp';
  avatar_url?: string;
  last_login_at?: string;
  created_at?: string;
}

// Token types
export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: string;
  refresh_expires_in?: number;
  refresh_expires_at?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface CheckUserResponse {
  success: boolean;
  status: 'new_user' | 'existing_user_with_password' | 'existing_user_otp_only';
  user_exists: boolean;
  has_password?: boolean;
  requires_password?: boolean;
  requires_otp: boolean;
  requires_name: boolean;
  identifier: string;
  user_name?: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  expires_in: number;
  identifier: string;
  type: 'email' | 'phone';
  debug_code?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  is_new_user?: boolean;
  tokens: Tokens;
  user: User;
}

export interface UserListResponse {
  success: boolean;
  data: User[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

// Form types
export interface LoginFormData {
  identifier: string;
  password?: string;
  otp?: string;
  name?: string;
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  email?: string;
}

export interface PasswordUpdateData {
  password: string;
  password_confirmation: string;
  current_password?: string;
}