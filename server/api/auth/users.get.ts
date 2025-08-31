// server/api/auth/users.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://127.0.0.1:8000'
  
  // Get the authorization header from the request
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization header is missing'
    })
  }
  
  try {
    // Forward the request to the backend API
    const response = await $fetch(`${apiBase}/auth/users`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    return response
  } catch (error: any) {
    console.error('Error fetching users from backend:', error)
    
    // Handle specific error cases
    if (error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Invalid or expired token'
      })
    }
    
    if (error.statusCode === 403) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden - You do not have permission to access this resource'
      })
    }
    
    // Generic error
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch users'
    })
  }
})