// Shared type definitions

export interface Permission {
  id: number
  name: string
  display_name: string
  description?: string
}

export interface Role {
  id: number
  name: string
  display_name: string
  description?: string
  permissions?: Permission[]
  users_count?: number
}

export interface User {
  id: number
  name: string
  email?: string
  phone?: string
  username?: string
  email_verified_at?: string
  phone_verified_at?: string
  preferred_method?: 'password' | 'otp'
  avatar_url?: string
  last_login_at?: string
  created_at?: string
  updated_at?: string
  roles?: Role[]
  is_admin?: boolean
  locked_until?: string
}

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
  meta?: any
  errors?: Record<string, string[]>
  is_new_user?: boolean
  status?: string
  type?: string
  debug_code?: string
}

export interface Pagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface Statistics {
  total_users?: number
  verified_emails?: number
  verified_phones?: number
  users_with_password?: number
  recent_registrations?: number
  locked_accounts?: number
}