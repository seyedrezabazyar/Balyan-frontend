// User types
export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string | null
  avatar?: string | null
  role?: string
  permissions?: string[]
  created_at: string
  updated_at: string
}

// Authentication types
export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in: number
}

// API Response types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: 'success' | 'error'
}

export interface PaginatedResponse<T = any> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
  links?: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number
  totalRevenue: number
  totalOrders: number
  growthRate: number
}

export interface MenuItem {
  id: string
  label: string
  icon?: string
  to?: string
  badge?: string | number
  children?: MenuItem[]
  permissions?: string[]
}