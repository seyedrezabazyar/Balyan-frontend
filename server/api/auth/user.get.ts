// server/api/auth/user.get.ts

// Mock users database with roles
const users = [
  {
    id: 1,
    name: 'مدیر سیستم',
    username: 'admin',
    email: 'admin@example.com',
    phone: '+989121234567',
    email_verified_at: '2024-01-01T00:00:00Z',
    phone_verified_at: '2024-01-01T00:00:00Z',
    is_admin: true,
    roles: [
      {
        id: 1,
        name: 'admin',
        display_name: 'مدیر سیستم',
        permissions: [
          { id: 1, name: 'manage_users', display_name: 'مدیریت کاربران' },
          { id: 2, name: 'manage_roles', display_name: 'مدیریت نقش‌ها' },
          { id: 3, name: 'manage_settings', display_name: 'مدیریت تنظیمات' },
          { id: 4, name: 'view_reports', display_name: 'مشاهده گزارشات' }
        ]
      }
    ],
    created_at: '2024-01-01T00:00:00Z',
    last_login_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'کاربر عادی',
    username: 'user',
    email: 'user@example.com',
    phone: '+989123456789',
    email_verified_at: '2024-01-15T00:00:00Z',
    phone_verified_at: null,
    is_admin: false,
    roles: [
      {
        id: 3,
        name: 'user',
        display_name: 'کاربر',
        permissions: [
          { id: 5, name: 'view_profile', display_name: 'مشاهده پروفایل' },
          { id: 6, name: 'edit_profile', display_name: 'ویرایش پروفایل' }
        ]
      }
    ],
    created_at: '2024-01-15T00:00:00Z',
    last_login_at: new Date().toISOString()
  }
]

export default defineEventHandler(async (event) => {
  // Get authorization header
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const token = authHeader.substring(7)
  
  try {
    // Simple token validation (در محیط واقعی باید JWT استفاده شود)
    // For demo, we'll use a simple base64 encoded JSON
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    
    // Find user by ID from token
    const user = users.find(u => u.id === decoded.userId)
    
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }
    
    // Return user data with roles
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        email_verified_at: user.email_verified_at,
        phone_verified_at: user.phone_verified_at,
        is_admin: user.is_admin,
        roles: user.roles,
        created_at: user.created_at,
        last_login_at: user.last_login_at
      }
    }
  } catch (error) {
    // Token is invalid or expired
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    })
  }
})