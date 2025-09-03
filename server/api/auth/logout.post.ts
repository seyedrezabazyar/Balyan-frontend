// Mock logout endpoint for development
export default defineEventHandler(async (event) => {
  try {
    // Get the authorization header
    const authHeader = getHeader(event, 'authorization')
    
    // Check if authorization header exists (optional for logout)
    if (!authHeader) {
      // Still allow logout even without token
      return {
        success: true,
        message: 'خروج با موفقیت انجام شد'
      }
    }

    // Extract token from Bearer token
    const token = authHeader.replace(/^Bearer\s+/i, '')
    
    // In production, you would:
    // 1. Invalidate the token in your token store/database
    // 2. Clear any server-side sessions
    // 3. Log the logout event
    
    // Return success response
    return {
      success: true,
      message: 'خروج با موفقیت انجام شد'
    }
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error in /api/auth/logout:', error)
    
    // Even if there's an error, we usually want to allow logout
    return {
      success: true,
      message: 'خروج انجام شد'
    }
  }
})