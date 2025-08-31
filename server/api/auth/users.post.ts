// server/api/auth/users.post.ts
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
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
  
  // Check for duplicate email or phone
  if (body.email && mockData.users.some((u: any) => u.email === body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email already registered'
    })
  }
  
  if (body.phone && mockData.users.some((u: any) => u.phone === body.phone)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Phone already registered'
    })
  }
  
  // Create new user
  const newUser = {
    id: mockData.next_id,
    name: body.name || '',
    email: body.email || null,
    phone: body.phone || null,
    username: body.username || `user${mockData.next_id}`,
    preferred_method: body.preferred_method || 'password',
    email_verified_at: null,
    phone_verified_at: null,
    created_at: new Date().toISOString(),
    last_login_at: null,
    locked_at: null,
    failed_attempts: 0,
    status: 'active'
  }
  
  // Add user to mock data
  mockData.users.push(newUser)
  mockData.next_id++
  
  // Save updated mock data
  writeFileSync(mockFilePath, JSON.stringify(mockData, null, 2))
  
  return newUser
})