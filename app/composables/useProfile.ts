import { useApi } from '~/composables/useApi'

export const useProfile = () => {
  const api = useApi()

  // Note: The endpoints have been updated for better RESTful practices.
  // The old /auth/user is now just /user
  const getCurrentUser = () => {
    return api.get('/user')
  }

  // POST /auth/profile/update is now PUT /profile
  const updateProfile = (data: any) => {
    return api.put('/profile', data)
  }

  const setPassword = (data: any) => {
    return api.post('/password/set', data)
  }

  const updatePassword = (data: any) => {
    return api.put('/password', data)
  }

  const getProvinces = () => {
    return api.get('/locations/provinces')
  }

  const getCities = (provinceId: number) => {
    return api.get(`/locations/provinces/${provinceId}/cities`)
  }

  const sendEmailVerification = (email: string) => {
    return api.post('/email/send-verification', { email })
  }

  const verifyEmail = (email: string, code: string) => {
    return api.post('/email/verify', { email, code })
  }

  const sendPhoneVerification = (phone: string) => {
    return api.post('/phone/send-verification', { phone })
  }

  const verifyPhone = (phone: string, code: string) => {
    return api.post('/phone/verify', { phone, code })
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
