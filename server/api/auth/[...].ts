// Mock API Handler برای تست
import { defineEventHandler, readBody, getCookie, setCookie } from 'h3'

// Mock user data
const mockUser = {
  id: 1,
  name: 'کاربر تست',
  email: 'test@example.com',
  phone: '09123456789',
  username: 'testuser',
  preferred_method: 'otp',
  email_verified_at: null,
  phone_verified_at: '2024-01-01T00:00:00.000000Z',
  password: true,
  is_admin: false,
  created_at: '2024-01-01T00:00:00.000000Z',
  last_login_at: new Date().toISOString()
}

// Mock token
const mockToken = 'mock_access_token_123456789'

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || ''
  const method = event.node.req.method
  
  // Remove /api/auth prefix to get the actual endpoint
  const endpoint = url.replace(/^\/api\/auth\/?/, '').split('?')[0]
  
  console.log(`Mock API: ${method} /api/auth/${endpoint}`)
  
  // Handle different endpoints
  switch (endpoint) {
    case 'health':
      return {
        status: 'ok',
        service: 'Auth Module (Mock)',
        timestamp: new Date().toISOString()
      }
      
    case 'check-user':
      if (method === 'POST') {
        const body = await readBody(event)
        return {
          exists: true,
          has_password: true,
          identifier: body.identifier
        }
      }
      break
      
    case 'login-password':
      if (method === 'POST') {
        const body = await readBody(event)
        return {
          access_token: mockToken,
          refresh_token: 'mock_refresh_token',
          user: mockUser,
          message: 'ورود موفقیت‌آمیز بود'
        }
      }
      break
      
    case 'send-otp':
      if (method === 'POST') {
        const body = await readBody(event)
        return {
          message: 'کد تایید ارسال شد',
          identifier: body.identifier
        }
      }
      break
      
    case 'verify-otp':
      if (method === 'POST') {
        const body = await readBody(event)
        return {
          access_token: mockToken,
          refresh_token: 'mock_refresh_token',
          user: mockUser,
          message: 'ورود موفقیت‌آمیز بود'
        }
      }
      break
      
    case 'user':
      if (method === 'GET') {
        // Check for authorization header
        const authHeader = event.node.req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          event.node.res.statusCode = 401
          return {
            message: 'Unauthenticated.'
          }
        }
        return {
          user: mockUser
        }
      }
      break
      
    case 'profile/update':
      if (method === 'POST') {
        // Check for authorization header
        const authHeader = event.node.req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          event.node.res.statusCode = 401
          return {
            message: 'Unauthenticated.'
          }
        }
        
        const body = await readBody(event)
        // Update mock user with new data
        if (body.name) mockUser.name = body.name
        if (body.email) mockUser.email = body.email
        if (body.phone) mockUser.phone = body.phone
        if (body.preferred_method) mockUser.preferred_method = body.preferred_method
        
        return {
          user: mockUser,
          message: 'پروفایل با موفقیت به‌روزرسانی شد'
        }
      }
      break
      
    case 'password/set':
    case 'password/update':
      if (method === 'POST') {
        // Check for authorization header
        const authHeader = event.node.req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          event.node.res.statusCode = 401
          return {
            message: 'Unauthenticated.'
          }
        }
        
        return {
          message: 'رمز عبور با موفقیت ذخیره شد'
        }
      }
      break
      
    case 'logout':
      if (method === 'POST') {
        return {
          message: 'خروج موفقیت‌آمیز بود'
        }
      }
      break
  }
  
  // Default 404 response
  event.node.res.statusCode = 404
  return {
    message: 'Endpoint not found'
  }
})