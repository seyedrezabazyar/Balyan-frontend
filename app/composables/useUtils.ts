export const useUtils = () => {
  /**
   * Get initials from a name string
   * @param name - Full name to extract initials from
   * @returns Initials (max 2 characters)
   */
  const getInitials = (name?: string | null): string => {
    if (!name) return '?'
    
    const parts = name.trim().split(' ').filter(Boolean)
    if (parts.length === 0) return '?'
    
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase()
    }
    
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  /**
   * Format a date to Persian locale string
   * @param date - Date string or Date object
   * @returns Formatted date string
   */
  const formatDate = (date: string | Date): string => {
    if (!date) return ''
    
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  }

  /**
   * Format a number to Persian numerals
   * @param num - Number to format
   * @returns Persian formatted number string
   */
  const toPersianNumber = (num: number | string): string => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
    return String(num).replace(/\d/g, (digit) => persianDigits[parseInt(digit)])
  }

  /**
   * Truncate text to specified length
   * @param text - Text to truncate
   * @param length - Maximum length
   * @param suffix - Suffix to add when truncated
   * @returns Truncated text
   */
  const truncate = (text: string, length: number = 50, suffix: string = '...'): string => {
    if (!text || text.length <= length) return text
    return text.substring(0, length).trim() + suffix
  }

  /**
   * Debounce a function
   * @param func - Function to debounce
   * @param wait - Wait time in milliseconds
   * @returns Debounced function
   */
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number = 300
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null
    
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  /**
   * Generate a random ID
   * @param prefix - Optional prefix for the ID
   * @returns Random ID string
   */
  const generateId = (prefix: string = ''): string => {
    const random = Math.random().toString(36).substring(2, 9)
    const timestamp = Date.now().toString(36)
    return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`
  }

  /**
   * Check if a value is empty
   * @param value - Value to check
   * @returns True if empty
   */
  const isEmpty = (value: any): boolean => {
    if (value == null) return true
    if (typeof value === 'string') return value.trim().length === 0
    if (Array.isArray(value)) return value.length === 0
    if (typeof value === 'object') return Object.keys(value).length === 0
    return false
  }

  /**
   * Deep clone an object
   * @param obj - Object to clone
   * @returns Cloned object
   */
  const deepClone = <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime()) as T
    if (obj instanceof Array) return obj.map(item => deepClone(item)) as T
    if (obj instanceof Object) {
      const clonedObj = {} as T
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = deepClone(obj[key])
        }
      }
      return clonedObj
    }
    return obj
  }

  return {
    getInitials,
    formatDate,
    toPersianNumber,
    truncate,
    debounce,
    generateId,
    isEmpty,
    deepClone
  }
}