// Email validation
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Phone validation
export const isValidPhone = (phone: string): boolean => {
  return /^(\+98|0)?9\d{9}$/.test(phone.replace(/\s/g, ''))
}

// Identifier type detection
export const getIdentifierType = (identifier: string): 'email' | 'phone' | 'unknown' => {
  if (isValidEmail(identifier)) return 'email'
  if (isValidPhone(identifier)) return 'phone'
  return 'unknown'
}

// Format phone number
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11 && cleaned.startsWith('09')) {
    return cleaned.replace(/^(\d{4})(\d{3})(\d{4})$/, '$1 $2 $3')
  }
  return phone
}

// OTP validation
export const isValidOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp)
}

// Password validation
export const validatePassword = (password: string) => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('رمز عبور باید حداقل 8 کاراکتر باشد')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('رمز عبور باید شامل حروف بزرگ انگلیسی باشد')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('رمز عبور باید شامل حروف کوچک انگلیسی باشد')
  }
  if (!/\d/.test(password)) {
    errors.push('رمز عبور باید شامل عدد باشد')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Format Persian date
export const formatPersianDate = (date: string | Date | null): string => {
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
  } catch {
    return ''
  }
}

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Storage helpers
export const storage = {
  get: (key: string, defaultValue: any = null) => {
    if (!process.client) return defaultValue

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set: (key: string, value: any) => {
    if (!process.client) return

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Storage set error for key "${key}":`, error)
    }
  },

  remove: (key: string) => {
    if (!process.client) return
    localStorage.removeItem(key)
  },

  clear: () => {
    if (!process.client) return
    localStorage.clear()
  }
}
