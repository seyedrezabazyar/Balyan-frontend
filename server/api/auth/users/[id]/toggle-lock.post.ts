// server/api/auth/users/[id]/toggle-lock.post.ts
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  const userId = parseInt(getRouterParam(event, 'id') || '0')
  
  // Get the authorization header from the request
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization header is missing'
    })
  }
  
  // Load current mock data
  const mockFilePath = resolve('./server/api/auth/mock_users.json')
  const mockData = JSON.parse(readFileSync(mockFilePath, 'utf-8'))
  
  // Find user
  const userIndex = mockData.users.findIndex((u: any) => u.id === userId)
  
  if (userIndex === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }
  
  // Toggle lock status
  const user = mockData.users[userIndex]
  if (user.locked_at || user.status === 'inactive') {
    // Unlock user
    user.locked_at = null
    user.status = 'active'
    user.failed_attempts = 0
  } else {
    // Lock user
    user.locked_at = new Date().toISOString()
    user.status = 'inactive'
  }
  
  // Save updated mock data
  writeFileSync(mockFilePath, JSON.stringify(mockData, null, 2))
  
  return {
    message: 'User status toggled',
    user: user
  }
})