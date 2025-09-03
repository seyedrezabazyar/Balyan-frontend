import { mockUser } from '../mock-data'

// Set password for users without password
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
    const response = await $fetch('http://localhost:8000/api/auth/password/set', {
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
      console.log('Backend not available, simulating password set')
      
      // Simulate password validation
      if (!body.password || body.password.length < 8) {
        throw createError({
          statusCode: 400,
          statusMessage: 'رمز عبور باید حداقل 8 کاراکتر باشد'
        })
      }
      
      // Simulate successful password set
      mockUser.password = 'hashed_password_here'
      return {
        message: 'رمز عبور با موفقیت تنظیم شد'
      }
    }

    // Handle validation errors
    if (error.statusCode === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: error.data?.message || 'Invalid password format'
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || 'Failed to set password'
    })
  }
})