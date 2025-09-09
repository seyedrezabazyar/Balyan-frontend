// ~/composables/useProfile.ts
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

/**
 * A composable that provides functions for interacting with the user profile API endpoints.
 */
export const useProfile = () => {
  const authStore = useAuthStore()
  const api = useApi(authStore.token)

  /**
   * Fetches the data for the currently authenticated user.
   * @returns {Promise<object>} The API response containing the user object.
   */
  const getCurrentUser = async () => {
    try {
      return await api.get('/auth/user')
    } catch (error) {
      console.error('Error fetching current user:', error)
      throw error
    }
  }

  /**
   * Updates the user's profile with the given data.
   * @param {object} data - The profile data to update.
   * @returns {Promise<object>} The API response, expected to contain the updated user object.
   */
  const updateProfile = async (data: {
    name?: string
    email?: string
    phone?: string
    username?: string
    province_id?: number | null
    city_id?: number | null
    address?: string | null
  }) => {
    try {
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== '' && value !== undefined)
      )
      return await api.post('/auth/profile/update', cleanData)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  /**
   * Sets a password for a user for the first time.
   * @param {object} data - The password and password_confirmation.
   * @returns {Promise<object>} The API response, expected to contain the updated user object.
   */
  const setPassword = async (data: {
    password: string
    password_confirmation: string
  }) => {
    try {
      return await api.post('/auth/password/set', data)
    } catch (error) {
      console.error('Error setting password:', error)
      throw error
    }
  }

  /**
   * Updates the password for a user who already has one.
   * @param {object} data - The current_password, new password, and password_confirmation.
   * @returns {Promise<object>} The API response, expected to contain the updated user object.
   */
  const updatePassword = async (data: {
    current_password: string
    password: string
    password_confirmation: string
  }) => {
    try {
      return await api.post('/auth/password/update', data)
    } catch (error) {
      console.error('Error updating password:', error)
      throw error
    }
  }

  /**
   * Sends a verification OTP to a new email address for the current user.
   * @param {string} email - The new email address to verify.
   * @returns {Promise<object>} The API response.
   */
  const sendEmailVerification = async (email: string) => {
    try {
      return await api.post('/auth/email/send-verification', { email })
    } catch (error) {
      console.error('Error sending email verification:', error)
      throw error
    }
  }

  /**
   * Verifies the OTP for a new email address.
   * @param {string} email - The new email address.
   * @param {string} code - The OTP code.
   * @returns {Promise<object>} The API response, expected to contain the updated user object.
   */
  const verifyEmail = async (email: string, code: string) => {
    try {
      return await api.post('/auth/email/verify', { email, otp: code })
    } catch (error) {
      console.error('Error verifying email:', error)
      throw error
    }
  }

  /**
   * Sends a verification OTP to a new phone number for the current user.
   * @param {string} phone - The new phone number to verify.
   * @returns {Promise<object>} The API response.
   */
  const sendPhoneVerification = async (phone: string) => {
    try {
      return await api.post('/auth/phone/send-verification', { phone })
    } catch (error) {
      console.error('Error sending phone verification:', error)
      throw error
    }
  }

  /**
   * Verifies the OTP for a new phone number.
   * @param {string} phone - The new phone number.
   * @param {string} code - The OTP code.
   * @returns {Promise<object>} The API response, expected to contain the updated user object.
   */
  const verifyPhone = async (phone: string, code: string) => {
    try {
      return await api.post('/auth/phone/verify', { phone, otp: code })
    } catch (error) {
      console.error('Error verifying phone:', error)
      throw error
    }
  }

  /**
   * Fetches the list of provinces.
   * @returns {Promise<object>} A list of provinces.
   */
  const getProvinces = async () => {
    try {
      // سعی می‌کنیم از API استفاده کنیم
      try {
        return await api.get('/locations/provinces')
      } catch (apiError) {
        console.warn('Province API not available, using fallback data')
        // داده‌های fallback برای استان‌ها
        return {
          success: true,
          data: [
            { id: 1, name: 'آذربایجان شرقی' }, { id: 2, name: 'آذربایجان غربی' }, { id: 3, name: 'اردبیل' }, { id: 4, name: 'اصفهان' }, { id: 5, name: 'ایلام' }, { id: 6, name: 'بوشهر' }, { id: 7, name: 'تهران' }, { id: 8, name: 'چهارمحال و بختیاری' }, { id: 9, name: 'خراسان جنوبی' }, { id: 10, name: 'خراسان رضوی' }, { id: 11, name: 'خراسان شمالی' }, { id: 12, name: 'خوزستان' }, { id: 13, name: 'زنجان' }, { id: 14, name: 'سمنان' }, { id: 15, name: 'سیستان و بلوچستان' }, { id: 16, name: 'فارس' }, { id: 17, name: 'قزوین' }, { id: 18, name: 'قم' }, { id: 19, name: 'کردستان' }, { id: 20, name: 'کرمان' }, { id: 21, name: 'کرمانشاه' }, { id: 22, name: 'کهگیلویه و بویراحمد' }, { id: 23, name: 'گلستان' }, { id: 24, name: 'گیلان' }, { id: 25, name: 'لرستان' }, { id: 26, name: 'مازندران' }, { id: 27, name: 'مرکزی' }, { id: 28, name: 'هرمزگان' }, { id: 29, name: 'همدان' }, { id: 30, name: 'یزد' }, { id: 31, name: 'البرز' }
          ]
        }
      }
    } catch (error) {
      console.error('Error getting provinces:', error)
      throw error
    }
  }

  /**
   * Fetches the list of cities for a given province.
   * @param {number} provinceId - The ID of the province.
   * @returns {Promise<object>} A list of cities.
   */
  const getCities = async (provinceId: number) => {
    try {
      // سعی می‌کنیم از API استفاده کنیم
      try {
        return await api.get(`/locations/provinces/${provinceId}/cities`)
      } catch (apiError) {
        console.warn('Cities API not available, using fallback data')
        // داده‌های fallback برای شهرها - چند استان پرکاربرد
        const citiesData: Record<number, Array<{id: number, name: string}>> = {
          7: [ { id: 1, name: 'تهران' }, { id: 2, name: 'شهریار' }, { id: 3, name: 'ورامین' }, { id: 4, name: 'پردیس' }, { id: 5, name: 'دماوند' }, { id: 6, name: 'فیروزکوه' }, { id: 7, name: 'پاکدشت' }, { id: 8, name: 'ری' }, { id: 9, name: 'اسلامشهر' }, { id: 10, name: 'کرج' } ],
          4: [ { id: 11, name: 'اصفهان' }, { id: 12, name: 'کاشان' }, { id: 13, name: 'نجف‌آباد' }, { id: 14, name: 'خمینی‌شهر' }, { id: 15, name: 'شاهین‌شهر' }, { id: 16, name: 'فولادشهر' }, { id: 17, name: 'زرین‌شهر' }, { id: 18, name: 'نطنز' } ],
          16: [ { id: 19, name: 'شیراز' }, { id: 20, name: 'مرودشت' }, { id: 21, name: 'کازرون' }, { id: 22, name: 'جهرم' }, { id: 23, name: 'لار' }, { id: 24, name: 'آباده' }, { id: 25, name: 'داراب' }, { id: 26, name: 'فسا' } ],
          10: [ { id: 27, name: 'مشهد' }, { id: 28, name: 'نیشابور' }, { id: 29, name: 'سبزوار' }, { id: 30, name: 'تربت حیدریه' }, { id: 31, name: 'کاشمر' }, { id: 32, name: 'تایباد' }, { id: 33, name: 'قوچان' } ],
          1: [ { id: 34, name: 'تبریز' }, { id: 35, name: 'مراغه' }, { id: 36, name: 'میانه' }, { id: 37, name: 'مرند' }, { id: 38, name: 'اهر' }, { id: 39, name: 'بناب' }, { id: 40, name: 'سراب' } ],
          12: [ { id: 41, name: 'اهواز' }, { id: 42, name: 'آبادان' }, { id: 43, name: 'خرمشهر' }, { id: 44, name: 'دزفول' }, { id: 45, name: 'شوشتر' }, { id: 46, name: 'بهبهان' }, { id: 47, name: 'ماهشهر' }, { id: 48, name: 'اندیمشک' } ]
        }
        return { success: true, data: citiesData[provinceId] || [] }
      }
    } catch (error) {
      console.error('Error getting cities:', error)
      throw error
    }
  }

  /**
   * Uploads a new avatar for the user.
   * @param {File} file - The avatar image file.
   * @returns {Promise<object>} The API response.
   */
  const uploadAvatar = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      return await $fetch('/auth/profile/avatar', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authStore.token}`, 'Accept': 'application/json' },
        body: formData
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  }

  /**
   * Deletes the user's current avatar.
   * @returns {Promise<object>} The API response.
   */
  const deleteAvatar = async () => {
    try {
      return await api.delete('/auth/profile/avatar')
    } catch (error) {
      console.error('Error deleting avatar:', error)
      throw error
    }
  }

  /**
   * Updates the user's preferred login method.
   * @param {'password' | 'otp'} method - The new preferred method.
   * @returns {Promise<object>} The API response.
   */
  const updatePreferredMethod = async (method: 'password' | 'otp') => {
    try {
      return await api.post('/auth/profile/preferred-method', { preferred_method: method })
    } catch (error) {
      console.error('Error updating preferred method:', error)
      throw error
    }
  }

  /**
   * Fetches the user's login history.
   * @param {number} [page=1] - The page number for pagination.
   * @param {number} [perPage=10] - The number of items per page.
   * @returns {Promise<object>} A paginated list of login history entries.
   */
  const getLoginHistory = async (page: number = 1, perPage: number = 10) => {
    try {
      return await api.get('/auth/profile/login-history', {
        query: { page, per_page: perPage }
      })
    } catch (error) {
      console.error('Error fetching login history:', error)
      return { success: true, data: [], message: 'تاریخچه ورود در دسترس نیست' }
    }
  }

  /**
   * Toggles two-factor authentication for the user.
   * @param {boolean} enable - Whether to enable or disable 2FA.
   * @returns {Promise<object>} The API response.
   */
  const toggle2FA = async (enable: boolean) => {
    try {
      return await api.post('/auth/profile/2fa-toggle', { enable })
    } catch (error) {
      console.error('Error toggling 2FA:', error)
      throw error
    }
  }

  /**
   * Validates profile data on the client side.
   * @param {object} data - The form data to validate.
   * @returns {{valid: boolean, errors: string[]}} An object indicating if the data is valid and a list of errors.
   */
  const validateProfileData = (data: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    if (!data.name || data.name.trim().length < 2) {
      errors.push('نام باید حداقل 2 کاراکتر باشد')
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('فرمت ایمیل معتبر نیست')
    }
    if (data.phone && !/^09[0-9]{9}$/.test(data.phone)) {
      errors.push('شماره تلفن باید با 09 شروع شود و 11 رقم باشد')
    }
    if (data.username) {
      if (data.username.length < 3) {
        errors.push('نام کاربری باید حداقل 3 کاراکتر باشد')
      }
      if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
        errors.push('نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و _ باشد')
      }
    }
    return { valid: errors.length === 0, errors }
  }

  /**
   * Validates password strength on the client side.
   * @param {string} password - The password to validate.
   * @returns {{valid: boolean, errors: string[]}} An object indicating if the password is valid and a list of unmet criteria.
   */
  const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    if (password.length < 8) {
      errors.push('رمز عبور باید حداقل 8 کاراکتر باشد')
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('رمز عبور باید حداقل یک حرف کوچک داشته باشد')
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('رمز عبور باید حداقل یک حرف بزرگ داشته باشد')
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('رمز عبور باید حداقل یک عدد داشته باشد')
    }
    return { valid: errors.length === 0, errors }
  }

  // بازگرداندن تمام توابع
  return {
    getCurrentUser,
    updateProfile,
    setPassword,
    updatePassword,
    sendEmailVerification,
    verifyEmail,
    sendPhoneVerification,
    verifyPhone,
    getProvinces,
    getCities,
    uploadAvatar,
    deleteAvatar,
    updatePreferredMethod,
    getLoginHistory,
    toggle2FA,
    validateProfileData,
    validatePassword
  }
}
