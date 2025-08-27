// utils/auth.ts

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate Iranian phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+98|0)?9\d{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Determine if identifier is email or phone
 */
export const getIdentifierType = (identifier: string): 'email' | 'phone' | 'unknown' => {
  if (isValidEmail(identifier)) return 'email'
  if (isValidPhone(identifier)) return 'phone'
  return 'unknown'
}

/**
 * Format phone number for display
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11 && cleaned.startsWith('09')) {
    return cleaned.replace(/^(\d{4})(\d{3})(\d{4})$/, '$1 $2 $3')
  }
  return phone
}

/**
 * Validate OTP code format
 */
export const isValidOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp)
}

/**
 * Format error messages from API
 */
export const formatErrorMessage = (errors: Record<string, string[]> | string | undefined): string => {
  if (!errors) return 'خطای نامشخص'

  if (typeof errors === 'string') return errors

  const firstError = Object.values(errors)[0]
  return Array.isArray(firstError) ? firstError[0] : 'خطای نامشخص'
}

/**
 * Generate a simple loading state manager
 */
export const createLoadingState = () => {
  const loading = ref(false)

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    loading.value = true
    try {
      return await fn()
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    withLoading
  }
}

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Local storage helpers with error handling
 */
export const storage = {
  get: (key: string, defaultValue: any = null) => {
    if (typeof window === 'undefined') return defaultValue

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)
      return defaultValue
    }
  },

  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
    }
  },

  remove: (key: string) => {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  },

  clear: () => {
    if (typeof window === 'undefined') return

    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

/**
 * Token expiration checker
 */
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000 // Convert to milliseconds
    return Date.now() >= exp
  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true
  }
}

/**
 * Format Persian date
 */
export const formatPersianDate = (date: string | Date): string => {
  if (!date) return ''

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}
