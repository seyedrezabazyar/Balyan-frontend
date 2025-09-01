// server/api/auth/login-password.post.ts

// Mock users database
const users = [
  {
    id: 1,
    name: 'مدیر سیستم',
    username: 'admin',
    email: 'admin@example.com',
    phone: '+989121234567',
    password: 'admin123', // در محیط واقعی باید hash شده باشد
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
    ]
  },
  {
    id: 2,
    name: 'کاربر عادی',
    username: 'user',
    email: 'user@example.com',
    phone: '+989123456789',
    password: 'user123',
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
    ]
  }
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { identifier, password } = body

  if (!identifier || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'شناسه و رمز عبور الزامی است'
    })
  }

  // Find user by email, phone, or username
  const user = users.find(u => 
    u.email === identifier || 
    u.phone === identifier || 
    u.username === identifier
  )

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'نام کاربری یا رمز عبور اشتباه است'
    })
  }

  // Check password (در محیط واقعی باید با bcrypt مقایسه شود)
  if (user.password !== password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'نام کاربری یا رمز عبور اشتباه است'
    })
  }

  // Generate simple token (در محیط واقعی باید JWT استفاده شود)
  const tokenData = {
    userId: user.id,
    email: user.email,
    username: user.username,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  }
  const token = Buffer.from(JSON.stringify(tokenData)).toString('base64')

  // Return success response
  return {
    success: true,
    message: 'ورود موفقیت‌آمیز بود',
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      email_verified_at: user.email_verified_at,
      phone_verified_at: user.phone_verified_at,
      is_admin: user.is_admin,
      roles: user.roles
    },
    tokens: {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 604800 // 7 days in seconds
    }
  }
})