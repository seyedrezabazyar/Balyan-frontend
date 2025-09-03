import { mockUser, updateMockUser } from '../mock-data'

// Update user profile
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')
  const body = await readBody(event)

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    // Try to forward request to Laravel backend
    const response = await $fetch('http://localhost:8000/api/auth/profile/update', {
      method: 'POST',
      headers: {
        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })

    return response
  } catch (error: any) {
    // If backend is not available, use mock data for development
    if (error.statusCode === undefined || error.code === 'ECONNREFUSED') {
      console.log('Backend not available, using mock update')
      
      // Simulate validation
      const errors: any = {}
      if (body.email && !body.email.includes('@')) {
        errors.email = ['ایمیل معتبر نیست']
      }
      if (body.username && !/^[a-zA-Z0-9_-]+$/.test(body.username)) {
        errors.username = ['نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد، _ و - باشد']
      }
      if (body.phone && !/^09\d{9}$/.test(body.phone)) {
        errors.phone = ['شماره موبایل باید با 09 شروع شود و 11 رقم باشد']
      }
      if (body.national_id && !/^\d{10}$/.test(body.national_id)) {
        errors.national_id = ['کد ملی باید 10 رقم باشد']
      }
      
      if (Object.keys(errors).length > 0) {
        throw createError({
          statusCode: 422,
          statusMessage: 'Validation failed',
          data: { errors }
        })
      }
      
      const updatedUser = updateMockUser(body)
      return {
        message: 'Profile updated successfully',
        user: updatedUser,
        profile: updatedUser.profile
      }
    }

    // Handle validation errors
    if (error.statusCode === 422) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Validation failed',
        data: error.data
      })
    }

    // Handle other errors
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || 'Failed to update profile'
    })
  }
})