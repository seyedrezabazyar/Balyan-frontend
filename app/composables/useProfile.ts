// ~/composables/useProfile.ts
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

export const useProfile = () => {
  const authStore = useAuthStore()
  const api = useApi(authStore.token)

  /**
   * دریافت اطلاعات کاربر فعلی
   */
  const getCurrentUser = async () => {
    try {
      console.log('Fetching current user...')
      const response = await api.get('/auth/user')
      console.log('User response:', response)
      return response
    } catch (error) {
      console.error('Error fetching current user:', error)
      throw error
    }
  }

  /**
   * بروزرسانی پروفایل کاربر
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
      console.log('Updating profile with data:', data)

      // پاک کردن فیلدهای خالی
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== '' && value !== undefined)
      )

      console.log('Clean data to send:', cleanData)

      const response = await api.post('/auth/profile/update', cleanData)
      console.log('Profile update response:', response)

      return response
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  /**
   * تنظیم رمز عبور (اولین بار)
   */
  const setPassword = async (data: {
    password: string
    password_confirmation: string
  }) => {
    try {
      console.log('Setting password...')
      const response = await api.post('/auth/password/set', data)
      console.log('Password set response:', response)
      return response
    } catch (error) {
      console.error('Error setting password:', error)
      throw error
    }
  }

  /**
   * تغییر رمز عبور
   */
  const updatePassword = async (data: {
    current_password: string
    password: string
    password_confirmation: string
  }) => {
    try {
      console.log('Updating password...')
      const response = await api.post('/auth/password/update', data)
      console.log('Password update response:', response)
      return response
    } catch (error) {
      console.error('Error updating password:', error)
      throw error
    }
  }

  /**
   * ارسال کد تایید ایمیل
   */
  const sendEmailVerification = async (email: string) => {
    try {
      console.log('Sending email verification to:', email)
      const response = await api.post('/auth/email/send-verification', { email })
      console.log('Email verification sent:', response)
      return response
    } catch (error) {
      console.error('Error sending email verification:', error)
      throw error
    }
  }

  /**
   * تایید ایمیل با کد
   */
  const verifyEmail = async (email: string, code: string) => {
    try {
      console.log('Verifying email:', email, 'with code:', code)
      const response = await api.post('/auth/email/verify', { email, otp: code })
      console.log('Email verification response:', response)
      return response
    } catch (error) {
      console.error('Error verifying email:', error)
      throw error
    }
  }

  /**
   * ارسال کد تایید موبایل
   */
  const sendPhoneVerification = async (phone: string) => {
    try {
      console.log('Sending phone verification to:', phone)
      const response = await api.post('/auth/phone/send-verification', { phone })
      console.log('Phone verification sent:', response)
      return response
    } catch (error) {
      console.error('Error sending phone verification:', error)
      throw error
    }
  }

  /**
   * تایید موبایل با کد
   */
  const verifyPhone = async (phone: string, code: string) => {
    try {
      console.log('Verifying phone:', phone, 'with code:', code)
      const response = await api.post('/auth/phone/verify', { phone, otp: code })
      console.log('Phone verification response:', response)
      return response
    } catch (error) {
      console.error('Error verifying phone:', error)
      throw error
    }
  }

  /**
   * دریافت لیست استان‌ها
   */
  const getProvinces = async () => {
    try {
      console.log('Fetching provinces...')

      // سعی می‌کنیم از API استفاده کنیم
      try {
        const response = await api.get('/locations/provinces')
        console.log('Provinces response:', response)
        return response
      } catch (apiError) {
        console.warn('Province API not available, using fallback data')

        // داده‌های fallback برای استان‌ها
        return {
          success: true,
          data: [
            { id: 1, name: 'آذربایجان شرقی' },
            { id: 2, name: 'آذربایجان غربی' },
            { id: 3, name: 'اردبیل' },
            { id: 4, name: 'اصفهان' },
            { id: 5, name: 'ایلام' },
            { id: 6, name: 'بوشهر' },
            { id: 7, name: 'تهران' },
            { id: 8, name: 'چهارمحال و بختیاری' },
            { id: 9, name: 'خراسان جنوبی' },
            { id: 10, name: 'خراسان رضوی' },
            { id: 11, name: 'خراسان شمالی' },
            { id: 12, name: 'خوزستان' },
            { id: 13, name: 'زنجان' },
            { id: 14, name: 'سمنان' },
            { id: 15, name: 'سیستان و بلوچستان' },
            { id: 16, name: 'فارس' },
            { id: 17, name: 'قزوین' },
            { id: 18, name: 'قم' },
            { id: 19, name: 'کردستان' },
            { id: 20, name: 'کرمان' },
            { id: 21, name: 'کرمانشاه' },
            { id: 22, name: 'کهگیلویه و بویراحمد' },
            { id: 23, name: 'گلستان' },
            { id: 24, name: 'گیلان' },
            { id: 25, name: 'لرستان' },
            { id: 26, name: 'مازندران' },
            { id: 27, name: 'مرکزی' },
            { id: 28, name: 'هرمزگان' },
            { id: 29, name: 'همدان' },
            { id: 30, name: 'یزد' },
            { id: 31, name: 'البرز' }
          ]
        }
      }
    } catch (error) {
      console.error('Error getting provinces:', error)
      throw error
    }
  }

  /**
   * دریافت لیست شهرهای یک استان
   */
  const getCities = async (provinceId: number) => {
    try {
      console.log('Fetching cities for province:', provinceId)

      // سعی می‌کنیم از API استفاده کنیم
      try {
        const response = await api.get(`/locations/provinces/${provinceId}/cities`)
        console.log('Cities response:', response)
        return response
      } catch (apiError) {
        console.warn('Cities API not available, using fallback data')

        // داده‌های fallback برای شهرها - چند استان پرکاربرد
        const citiesData: Record<number, Array<{id: number, name: string}>> = {
          7: [ // تهران
            { id: 1, name: 'تهران' },
            { id: 2, name: 'شهریار' },
            { id: 3, name: 'ورامین' },
            { id: 4, name: 'پردیس' },
            { id: 5, name: 'دماوند' },
            { id: 6, name: 'فیروزکوه' },
            { id: 7, name: 'پاکدشت' },
            { id: 8, name: 'ری' },
            { id: 9, name: 'اسلامشهر' },
            { id: 10, name: 'کرج' }
          ],
          4: [ // اصفهان
            { id: 11, name: 'اصفهان' },
            { id: 12, name: 'کاشان' },
            { id: 13, name: 'نجف‌آباد' },
            { id: 14, name: 'خمینی‌شهر' },
            { id: 15, name: 'شاهین‌شهر' },
            { id: 16, name: 'فولادشهر' },
            { id: 17, name: 'زرین‌شهر' },
            { id: 18, name: 'نطنز' }
          ],
          16: [ // فارس
            { id: 19, name: 'شیراز' },
            { id: 20, name: 'مرودشت' },
            { id: 21, name: 'کازرون' },
            { id: 22, name: 'جهرم' },
            { id: 23, name: 'لار' },
            { id: 24, name: 'آباده' },
            { id: 25, name: 'داراب' },
            { id: 26, name: 'فسا' }
          ],
          10: [ // خراسان رضوی
            { id: 27, name: 'مشهد' },
            { id: 28, name: 'نیشابور' },
            { id: 29, name: 'سبزوار' },
            { id: 30, name: 'تربت حیدریه' },
            { id: 31, name: 'کاشمر' },
            { id: 32, name: 'تایباد' },
            { id: 33, name: 'قوچان' }
          ],
          1: [ // آذربایجان شرقی
            { id: 34, name: 'تبریز' },
            { id: 35, name: 'مراغه' },
            { id: 36, name: 'میانه' },
            { id: 37, name: 'مرند' },
            { id: 38, name: 'اهر' },
            { id: 39, name: 'بناب' },
            { id: 40, name: 'سراب' }
          ],
          12: [ // خوزستان
            { id: 41, name: 'اهواز' },
            { id: 42, name: 'آبادان' },
            { id: 43, name: 'خرمشهر' },
            { id: 44, name: 'دزفول' },
            { id: 45, name: 'شوشتر' },
            { id: 46, name: 'بهبهان' },
            { id: 47, name: 'ماهشهر' },
            { id: 48, name: 'اندیمشک' }
          ]
        }

        return {
          success: true,
          data: citiesData[provinceId] || []
        }
      }
    } catch (error) {
      console.error('Error getting cities:', error)
      throw error
    }
  }

  /**
   * آپلود آواتار کاربر (در صورت پشتیبانی API)
   */
  const uploadAvatar = async (file: File) => {
    try {
      console.log('Uploading avatar...')

      const formData = new FormData()
      formData.append('avatar', file)

      // استفاده از fetch برای آپلود فایل
      const response = await $fetch('/auth/profile/avatar', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Accept': 'application/json'
        },
        body: formData
      })

      console.log('Avatar upload response:', response)
      return response
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  }

  /**
   * حذف آواتار کاربر
   */
  const deleteAvatar = async () => {
    try {
      console.log('Deleting avatar...')
      const response = await api.delete('/auth/profile/avatar')
      console.log('Avatar delete response:', response)
      return response
    } catch (error) {
      console.error('Error deleting avatar:', error)
      throw error
    }
  }

  /**
   * تغییر روش ورود ترجیحی کاربر
   */
  const updatePreferredMethod = async (method: 'password' | 'otp') => {
    try {
      console.log('Updating preferred method to:', method)
      const response = await api.post('/auth/profile/preferred-method', {
        preferred_method: method
      })
      console.log('Preferred method update response:', response)
      return response
    } catch (error) {
      console.error('Error updating preferred method:', error)
      throw error
    }
  }

  /**
   * دریافت تاریخچه ورود کاربر
   */
  const getLoginHistory = async (page: number = 1, perPage: number = 10) => {
    try {
      console.log('Fetching login history...')
      const response = await api.get('/auth/profile/login-history', {
        query: { page, per_page: perPage }
      })
      console.log('Login history response:', response)
      return response
    } catch (error) {
      console.error('Error fetching login history:', error)
      // در صورت عدم وجود API، داده‌های نمونه برگردان
      return {
        success: true,
        data: [],
        message: 'تاریخچه ورود در دسترس نیست'
      }
    }
  }

  /**
   * فعال/غیرفعال کردن احراز هویت دو مرحله‌ای
   */
  const toggle2FA = async (enable: boolean) => {
    try {
      console.log('Toggling 2FA to:', enable)
      const response = await api.post('/auth/profile/2fa-toggle', {
        enable
      })
      console.log('2FA toggle response:', response)
      return response
    } catch (error) {
      console.error('Error toggling 2FA:', error)
      throw error
    }
  }

  /**
   * اعتبارسنجی داده‌های فرم
   */
  const validateProfileData = (data: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = []

    // نام الزامی است
    if (!data.name || data.name.trim().length < 2) {
      errors.push('نام باید حداقل 2 کاراکتر باشد')
    }

    // اعتبارسنجی ایمیل
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('فرمت ایمیل معتبر نیست')
    }

    // اعتبارسنجی شماره تلفن
    if (data.phone && !/^09[0-9]{9}$/.test(data.phone)) {
      errors.push('شماره تلفن باید با 09 شروع شود و 11 رقم باشد')
    }

    // اعتبارسنجی نام کاربری
    if (data.username) {
      if (data.username.length < 3) {
        errors.push('نام کاربری باید حداقل 3 کاراکتر باشد')
      }
      if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
        errors.push('نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و _ باشد')
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * اعتبارسنجی رمز عبور
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

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // بازگرداندن تمام توابع
  return {
    // Profile management
    getCurrentUser,
    updateProfile,

    // Password management
    setPassword,
    updatePassword,

    // Verification
    sendEmailVerification,
    verifyEmail,
    sendPhoneVerification,
    verifyPhone,

    // Location data
    getProvinces,
    getCities,

    // Avatar management
    uploadAvatar,
    deleteAvatar,

    // Settings
    updatePreferredMethod,
    getLoginHistory,
    toggle2FA,

    // Validation utilities
    validateProfileData,
    validatePassword
  }
}
