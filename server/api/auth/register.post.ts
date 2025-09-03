// Mock register endpoint for development
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

    const { email, password, name, phone } = body

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // Validate password length
    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters'
      })
    }

    // Mock registration - در محیط واقعی این اطلاعات در دیتابیس ذخیره می‌شود
    // In production, this should:
    // 1. Check if email already exists
    // 2. Hash the password
    // 3. Create user in database
    // 4. Generate tokens

    // Generate mock tokens
    const mockAccessToken = 'mock_access_token_' + Date.now()
    const mockRefreshToken = 'mock_refresh_token_' + Date.now()

    // Mock user data
    const newUser = {
      id: Date.now(), // Generate a unique ID
      name: name || email.split('@')[0],
      email: email,
      phone: phone || null,
      permissions: ['view_dashboard', 'edit_profile'],
      roles: ['user'],
      is_admin: false
    }

    // Return registration response
    return {
      success: true,
      message: 'ثبت‌نام با موفقیت انجام شد',
      access_token: mockAccessToken,
      refresh_token: mockRefreshToken,
      user: newUser
    }
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error in /api/auth/register:', error)
    
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