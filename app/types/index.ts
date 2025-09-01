// app/types/index.ts

// Core entities
export interface User {
  id: number
  name: string
  email?: string | null
  phone?: string | null
  username?: string | null
  preferred_method?: 'password' | 'otp'
  avatar_url?: string | null
  is_admin?: boolean
  email_verified_at?: string | null
  phone_verified_at?: string | null
  last_login_at?: string | null
  locked_until?: string | null
  failed_attempts?: number
  created_at: string
  updated_at?: string
  roles?: string[] | Role[]
  permissions?: string[]
}

export interface Role {
  id: number
  name: string
  display_name: string
  description?: string | null
  permissions?: Permission[]
  users_count?: number
}

export interface Permission {
  id: number
  name: string
  display_name: string
  description?: string | null
}

// Auth related
export interface Tokens {
  access_token: string
  refresh_token?: string
  token_type?: string
  expires_in?: number
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  user?: User
  tokens?: Tokens
  meta?: Pagination
  errors?: Record<string, string[]>
  is_new_user?: boolean
  status?: string
  type?: string
  debug_code?: string
}

// Pagination
export interface Pagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

// Statistics
export interface Statistics {
  total_users?: number
  verified_emails?: number
  verified_phones?: number
  users_with_password?: number
  recent_registrations?: number
  locked_accounts?: number
}

// Forms
export interface LoginForm {
  identifier: string
  password: string
}

export interface OTPForm {
  identifier: string
  otp: string
  name?: string
}

export interface ProfileForm {
  name?: string
  email?: string
  phone?: string
  preferred_method?: 'password' | 'otp'
}

// Component props
export interface DashboardStat {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: string
  color: 'primary' | 'success' | 'warning' | 'info' | 'danger'
}
