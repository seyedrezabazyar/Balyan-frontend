// Mock profile update endpoint for development
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

    // Get the request body
    const body = await readBody(event)
    
    // Validate required fields
    if (!body || typeof body !== 'object') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request body'
      })
    }

    // Extract profile data
    const { name, phone } = body

    // Basic validation
    if (name && typeof name !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name must be a string'
      })
    }

    if (phone && typeof phone !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Phone must be a string'
      })
    }

    // Mock updated user data - در محیط واقعی این اطلاعات در دیتابیس ذخیره می‌شود
    // In production, this should verify the token, update the user in database
    const updatedUser = {
      id: 1,
      name: name || 'کاربر تست',
      email: 'user@example.com',
      phone: phone || '09123456789',
      permissions: ['view_dashboard', 'edit_profile'],
      roles: ['user'],
      is_admin: false
    }

    // Return success response with updated user data
    return {
      success: true,
      message: 'پروفایل با موفقیت به‌روزرسانی شد',
      user: updatedUser
    }
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error in /api/auth/profile/update:', error)
    
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