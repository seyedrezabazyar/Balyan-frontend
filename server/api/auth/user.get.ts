import jwt from 'jsonwebtoken'

// Mock database - باید با login.post.ts هماهنگ باشد
const users = [
  {
    id: 1,
    name: 'کاربر عادی',
    email: 'user@example.com',
    phone: '09123456789',
    is_admin: false,
    permissions: ['dashboard.view'],
    created_at: '2024-01-01T00:00:00.000Z',
    email_verified_at: '2024-01-01T00:00:00.000Z',
    phone_verified_at: null
  },
  {
    id: 2,
    name: 'مدیر سیستم',
    email: 'admin@example.com',
    phone: '09123456788',
    is_admin: true,
    permissions: ['dashboard.view', 'dashboard.admin', 'users.view', 'users.edit'],
    created_at: '2024-01-01T00:00:00.000Z',
    email_verified_at: '2024-01-01T00:00:00.000Z',
    phone_verified_at: '2024-01-01T00:00:00.000Z'
  }
]

export default defineEventHandler(async (event) => {
  // Get token from header
  const authorization = getHeader(event, 'authorization')
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'توکن احراز هویت یافت نشد'
    })
  }

  const token = authorization.substring(7)

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    ) as any

    // Find user
    const user = users.find(u => u.id === decoded.userId)

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'کاربر یافت نشد'
      })
    }

    return {
      success: true,
      user
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'توکن نامعتبر است'
    })
  }
})