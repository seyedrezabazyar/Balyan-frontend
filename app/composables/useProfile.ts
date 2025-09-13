import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'

export const useProfile = () => {
  const authStore = useAuthStore()
  const api = useApi(authStore.token)

  const getCurrentUser = () => {
    return api.get('/auth/user')
  }

  const updateProfile = (data: any) => {
    return api.post('/auth/profile/update', data)
  }

  const setPassword = (data: any) => {
    return api.post('/auth/password/set', data)
  }

  const updatePassword = (data: any) => {
    return api.post('/auth/password/update', data)
  }

  const getProvinces = () => {
    // This call does not require auth
    return useApi().get('/locations/provinces')
  }

  const getCities = (provinceId: number) => {
    // This call does not require auth
    return useApi().get(`/locations/provinces/${provinceId}/cities`)
  }

  const sendEmailVerification = (email: string) => {
    return api.post('/auth/email/send-verification', { email })
  }

  const verifyEmail = (email: string, code: string) => {
    return api.post('/auth/email/verify', { email, code })
  }

  const sendPhoneVerification = (phone: string) => {
    return api.post('/auth/phone/send-verification', { phone })
  }

  const verifyPhone = (phone: string, code: string) => {
    return api.post('/auth/phone/verify', { phone, code })
  }

  return {
    getCurrentUser,
    updateProfile,
    setPassword,
    updatePassword,
    getProvinces,
    getCities,
    sendEmailVerification,
    verifyEmail,
    sendPhoneVerification,
    verifyPhone,
  }
}
