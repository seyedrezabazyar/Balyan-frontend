import { mockUser } from './mock-data'

// Get authenticated user profile
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    // Try to forward request to Laravel backend
    const response = await $fetch('http://localhost:8000/api/auth/user', {
      method: 'GET',
      headers: {
        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    // If backend is not available, return mock data for development
    if (error.statusCode === undefined || error.code === 'ECONNREFUSED') {
      console.log('Backend not available, using mock data')
      return {
        user: mockUser,
        profile: mockUser.profile
      }
    }

    // Handle backend errors
    if (error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || 'Failed to fetch user data'
    })
  }
})