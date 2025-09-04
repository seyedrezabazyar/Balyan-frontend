// ~/composables/useProfile.ts
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

export const useProfile = () => {
  const authStore = useAuthStore()
  const api = useApi(authStore.token)

  // Profile APIs
  const updateProfile = async (data: any) => {
    return await api.post('/auth/profile/update', data)
  }

  const setPassword = async (data: any) => {
    return await api.post('/auth/password/set', data)
  }

  const updatePassword = async (data: any) => {
    return await api.post('/auth/password/update', data)
  }

  // Location APIs
  const getProvinces = async () => {
    try {
      return await api.get('/locations/provinces')
    } catch (error) {
      // Fallback: some dummy data for testing
      console.warn('Province API not available, using fallback data')
      return {
        data: [
          { id: 1, name: 'تهران' },
          { id: 2, name: 'اصفهان' },
          { id: 3, name: 'شیراز' },
          { id: 4, name: 'مشهد' },
          { id: 5, name: 'تبریز' },
          { id: 6, name: 'اهواز' },
          { id: 7, name: 'کرج' },
          { id: 8, name: 'قم' },
          { id: 9, name: 'کرمان' },
          { id: 10, name: 'رشت' }
        ]
      }
    }
  }

  const getCities = async (provinceId: number) => {
    try {
      return await api.get(`/locations/provinces/${provinceId}/cities`)
    } catch (error) {
      // Fallback: some dummy data for testing
      console.warn('Cities API not available, using fallback data')
      const citiesData: Record<number, any[]> = {
        1: [
          { id: 1, name: 'تهران' },
          { id: 2, name: 'شهریار' },
          { id: 3, name: 'ورامین' }
        ],
        2: [
          { id: 4, name: 'اصفهان' },
          { id: 5, name: 'کاشان' },
          { id: 6, name: 'نجف‌آباد' }
        ],
        3: [
          { id: 7, name: 'شیراز' },
          { id: 8, name: 'مرودشت' },
          { id: 9, name: 'کازرون' }
        ]
      }
      return {
        data: citiesData[provinceId] || []
      }
    }
  }

  // Verification APIs
  const sendEmailVerification = async (email: string) => {
    return await api.post('/auth/email/send-verification', { email })
  }

  const verifyEmail = async (email: string, code: string) => {
    return await api.post('/auth/email/verify', { email, code })
  }

  const sendPhoneVerification = async (phone: string) => {
    return await api.post('/auth/phone/send-verification', { phone })
  }

  const verifyPhone = async (phone: string, code: string) => {
    return await api.post('/auth/phone/verify', { phone, code })
  }

  // User data
  const getCurrentUser = async () => {
    return await api.get('/auth/user')
  }

  return {
    // Profile
    updateProfile,
    setPassword,
    updatePassword,
    getCurrentUser,

    // Location
    getProvinces,
    getCities,

    // Verification
    sendEmailVerification,
    verifyEmail,
    sendPhoneVerification,
    verifyPhone
  }
}
