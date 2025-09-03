// Mock user endpoint for development
export default defineEventHandler(async (event) => {
  try {
    // Get the authorization header
    const authHeader = getHeader(event, 'authorization')
    
    // Check if authorization header exists
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authorization header is required'
      })
    }

    // Extract token from Bearer token
    const token = authHeader.replace(/^Bearer\s+/i, '')
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid authorization token'
      })
    }

    // Mock user data - در محیط واقعی این اطلاعات از دیتابیس می‌آید
    // In production, this should verify the token and fetch user from database
    const mockUser = {
      id: 1,
      name: 'کاربر تست',
      email: 'user@example.com',
      phone: '09123456789',
      permissions: ['view_dashboard', 'edit_profile'],
      roles: ['user'],
      is_admin: false
    }

    // Return user data
    return {
      user: mockUser,
      success: true
    }
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error in /api/auth/user:', error)
    
    // If it's already a createError, throw it as is
    if (error.statusCode) {
      throw error
    }
    
    // Otherwise, create a generic server error
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})