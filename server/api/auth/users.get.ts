// server/api/auth/users.get.ts
import mockData from './mock_users.json'

export default defineEventHandler(async (event) => {
  // Get the authorization header from the request
  const authHeader = getHeader(event, 'authorization')
  
  // For now, we'll use mock data instead of calling backend
  // Just check if there's an auth header
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization header is missing'
    })
  }
  
  // Return mock users data
  return {
    users: mockData.users,
    total: mockData.users.length
  }
})