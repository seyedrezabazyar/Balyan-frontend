// server/api/auth/users/[id].put.ts
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
  
  // Get the request body
  const body = await readBody(event)
  
  try {
    // Forward the request to the backend API
    const response = await $fetch(`${apiBase}/auth/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body
    })
    
    return response
  } catch (error: any) {
    console.error('Error updating user:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to update user'
    })
  }
})