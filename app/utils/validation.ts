// utils/validation.ts

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
 * Validate OTP code format
 */
export const isValidOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp)
}

/**
 * Validate password strength
 */
export const validatePassword = (password: string): {
  isValid: boolean
  errors: string[]
} => {
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
 * Format error messages from API
 */
export const formatErrorMessage = (errors: Record<string, string[]> | string | undefined): string => {
  if (!errors) return 'خطای نامشخص'

  if (typeof errors === 'string') return errors

  const firstError = Object.values(errors)[0]
  return Array.isArray(firstError) ? firstError[0] : 'خطای نامشخص'
}

/**
 * Validate required field
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  return true
}

/**
 * Validate minimum length
 */
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min
}

/**
 * Validate maximum length
 */
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max
}

/**
 * Create form validation rules
 */
export const createValidationRules = () => {
  return {
    required: (message = 'این فیلد الزامی است') => (value: any) => {
      return isRequired(value) || message
    },

    email: (message = 'فرمت ایمیل معتبر نیست') => (value: string) => {
      return !value || isValidEmail(value) || message
    },

    phone: (message = 'فرمت شماره تلفن معتبر نیست') => (value: string) => {
      return !value || isValidPhone(value) || message
    },

    minLength: (min: number, message?: string) => (value: string) => {
      const msg = message || `حداقل ${min} کاراکتر وارد کنید`
      return !value || minLength(value, min) || msg
    },

    maxLength: (max: number, message?: string) => (value: string) => {
      const msg = message || `حداکثر ${max} کاراکتر مجاز است`
      return !value || maxLength(value, max) || msg
    },

    password: (message = 'رمز عبور قوی انتخاب کنید') => (value: string) => {
      if (!value) return true
      const validation = validatePassword(value)
      return validation.isValid || validation.errors[0]
    },

    confirmPassword: (originalPassword: string, message = 'تکرار رمز عبور مطابقت ندارد') => (value: string) => {
      return !value || value === originalPassword || message
    }
  }
}
