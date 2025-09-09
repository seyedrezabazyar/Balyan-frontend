/**
 * Converts Persian and Arabic numerals in a string to English numerals.
 * @param {string | number} str The string or number to convert.
 * @returns {string} The converted string with English numerals.
 */
const toEnglishDigits = (str: string | number): string => {
  if (typeof str !== 'string') {
    str = String(str);
  }

  const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persian[i], 'g'), english[i]);
    result = result.replace(new RegExp(arabic[i], 'g'), english[i]);
  }
  return result;
};

/**
 * Normalizes various Iranian phone number formats to the '09...' standard.
 * @param {string} phone The phone number to normalize.
 * @returns {string} The normalized phone number.
 */
const normalizePhone = (phone: string): string => {
  if (!phone) return '';
  let normalized = toEnglishDigits(phone);
  normalized = normalized.replace(/[^0-9]/g, ''); // Remove all non-digit characters

  if (normalized.startsWith('98')) {
    normalized = normalized.substring(2);
  } else if (normalized.startsWith('+98')) {
    normalized = normalized.substring(3);
  }

  if (normalized.length === 10 && normalized.startsWith('9')) {
    return '0' + normalized;
  }

  if (normalized.length === 11 && normalized.startsWith('09')) {
    return normalized;
  }

  // Return the partially processed string for other cases (e.g., user is still typing)
  return normalized;
};


/**
 * Composable providing various formatting and utility functions.
 */
export const useFormatters = () => {
  return {
    toEnglishDigits,
    normalizePhone,
  };
};
