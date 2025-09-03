// Mock login endpoint for development
export default defineEventHandler(async (event) => {
  try {
    // Get the request body
    const body = await readBody(event)
    
    // Validate required fields
    if (!body || !body.email || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    const { email, password } = body

    // Mock authentication - در محیط واقعی این اطلاعات با دیتابیس چک می‌شود
    // In production, this should validate credentials against database
    // For development, accept any email/password combination
    if (!email || !password) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Generate mock tokens
    const mockAccessToken = 'mock_access_token_' + Date.now()
    const mockRefreshToken = 'mock_refresh_token_' + Date.now()

    // Mock user data
    const mockUser = {
      id: 1,
      name: 'کاربر تست',
      email: email,
      phone: '09123456789',
      permissions: ['view_dashboard', 'edit_profile'],
      roles: ['user'],
      is_admin: false
    }

    // Return authentication response
    return {
      success: true,
      message: 'ورود موفقیت‌آمیز بود',
      access_token: mockAccessToken,
      refresh_token: mockRefreshToken,
      user: mockUser
    }
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error in /api/auth/login:', error)
    
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