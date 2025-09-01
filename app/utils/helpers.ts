// app/utils/helpers.ts

// Validation helpers
export const validators = {
  email: (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  phone: (phone: string): boolean => /^(\+98|0)?9\d{9}$/.test(phone.replace(/\s/g, '')),
  otp: (otp: string): boolean => /^\d{6}$/.test(otp)
}

// Format helpers
export const formatters = {
  phone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 11 && cleaned.startsWith('09')
      ? cleaned.replace(/^(\d{4})(\d{3})(\d{4})$/, '$1 $2 $3')
      : phone
  },

  date: (date: string | Date | null): string => {
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
}

// Utility functions
export const utils = {
  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  // Get identifier type
  getIdentifierType: (identifier: string): 'email' | 'phone' | 'unknown' => {
    if (validators.email(identifier)) return 'email'
    if (validators.phone(identifier)) return 'phone'
    return 'unknown'
  },

  // Get user initials
  getInitials: (name?: string): string => {
    if (!name) return 'ک'
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  },

  // Storage wrapper
  storage: {
    get: <T = any>(key: string, defaultValue: T | null = null): T | null => {
      if (!process.client) return defaultValue
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
      } catch {
        return defaultValue
      }
    },

    set: (key: string, value: any): void => {
      if (process.client) {
        try {
          localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
          console.error(`Storage error for ${key}:`, error)
        }
      }
    },

    remove: (key: string): void => {
      if (process.client) localStorage.removeItem(key)
    },

    clear: (): void => {
      if (process.client) localStorage.clear()
    }
  }
}
