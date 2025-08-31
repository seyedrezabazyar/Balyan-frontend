// server/api/auth/users/[id].put.ts
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
  
  // Get the request body
  const body = await readBody(event)
  
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
  
  // Check for duplicate email or phone (excluding current user)
  if (body.email && mockData.users.some((u: any) => u.id !== userId && u.email === body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email already taken'
    })
  }
  
  if (body.phone && mockData.users.some((u: any) => u.id !== userId && u.phone === body.phone)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Phone already taken'
    })
  }
  
  // Update user
  if (body.name !== undefined) mockData.users[userIndex].name = body.name
  if (body.email !== undefined) mockData.users[userIndex].email = body.email
  if (body.phone !== undefined) mockData.users[userIndex].phone = body.phone
  if (body.preferred_method !== undefined) mockData.users[userIndex].preferred_method = body.preferred_method
  
  // Save updated mock data
  writeFileSync(mockFilePath, JSON.stringify(mockData, null, 2))
  
  return mockData.users[userIndex]
})