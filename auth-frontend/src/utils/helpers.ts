/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as Iranian number
  if (cleaned.startsWith('98')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  // Format as local Iranian number
  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 * Validate Iranian phone number
 */
export const isValidIranianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  
  // Check for Iranian mobile patterns
  const patterns = [
    /^(\+98|0098|98|0)?9\d{9}$/,  // Iranian mobile
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
};

/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

/**
 * Detect input type (email or phone)
 */
export const detectInputType = (input: string): 'email' | 'phone' | 'unknown' => {
  if (isValidEmail(input)) return 'email';
  if (isValidIranianPhone(input)) return 'phone';
  return 'unknown';
};

/**
 * Format date in Persian locale
 */
export const formatPersianDate = (date: string | Date): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Get relative time in Persian
 */
export const getRelativeTime = (date: string | Date): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) return `${years} سال پیش`;
  if (months > 0) return `${months} ماه پیش`;
  if (days > 0) return `${days} روز پیش`;
  if (hours > 0) return `${hours} ساعت پیش`;
  if (minutes > 0) return `${minutes} دقیقه پیش`;
  return 'همین الان';
};

/**
 * Generate avatar URL from name
 */
export const generateAvatarUrl = (name: string): string => {
  const colors = ['3b82f6', '10b981', 'f59e0b', 'ef4444', '8b5cf6', 'ec4899'];
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const colorIndex = name.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=fff&size=128&font-size=0.33&bold=true`;
};

/**
 * Normalize phone number for API
 */
export const normalizePhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  // Convert Iranian numbers to international format
  if (cleaned.startsWith('0')) {
    return '+98' + cleaned.slice(1);
  }
  
  if (cleaned.startsWith('98')) {
    return '+' + cleaned;
  }
  
  return phone;
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (expiresAt: string): boolean => {
  if (!expiresAt) return true;
  
  const expiry = new Date(expiresAt);
  const now = new Date();
  
  // Add 1 minute buffer
  return expiry.getTime() - now.getTime() < 60000;
};

/**
 * Get error message from API response
 */
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.errors) {
    const firstError = Object.values(error.response.data.errors)[0];
    if (Array.isArray(firstError)) {
      return firstError[0];
    }
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'خطای ناشناخته رخ داده است';
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};