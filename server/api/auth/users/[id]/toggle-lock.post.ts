// server/api/auth/users/[id]/toggle-lock.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://127.0.0.1:8000'
  const userId = getRouterParam(event, 'id')
  
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
    const response = await $fetch(`${apiBase}/auth/users/${userId}/toggle-lock`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    return response
  } catch (error: any) {
    console.error('Error toggling user lock status:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to toggle user lock status'
    })
  }
})