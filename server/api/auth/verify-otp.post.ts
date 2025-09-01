// server/api/auth/verify-otp.post.ts

// Mock OTP storage (در محیط واقعی باید در Redis یا Database ذخیره شود)
const otpStore: { [key: string]: { otp: string, expires: number } } = {}

// Mock users database
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
    ]
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
    ]
  }
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { identifier, otp, name } = body

  if (!identifier || !otp) {
    throw createError({
      statusCode: 400,
      statusMessage: 'شناسه و کد تایید الزامی است'
    })
  }

  // For demo purposes, accept any 6-digit OTP
  if (!/^\d{6}$/.test(otp)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'کد تایید باید 6 رقم باشد'
    })
  }

  // Find or create user
  let user = users.find(u => 
    u.email === identifier || 
    u.phone === identifier
  )

  let isNewUser = false
  
  if (!user) {
    // Create new user if not exists
    isNewUser = true
    const newUserId = Math.max(...users.map(u => u.id)) + 1
    
    user = {
      id: newUserId,
      name: name || `کاربر ${newUserId}`,
      username: `user${newUserId}`,
      email: identifier.includes('@') ? identifier : undefined,
      phone: !identifier.includes('@') ? identifier : undefined,
      email_verified_at: identifier.includes('@') ? new Date().toISOString() : null,
      phone_verified_at: !identifier.includes('@') ? new Date().toISOString() : null,
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
    
    users.push(user)
  } else {
    // Update verification status
    if (identifier.includes('@')) {
      user.email_verified_at = new Date().toISOString()
    } else {
      user.phone_verified_at = new Date().toISOString()
    }
  }

  // Generate simple token (در محیط واقعی باید JWT استفاده شود)
  const tokenData = {
    userId: user.id,
    email: user.email,
    phone: user.phone,
    username: user.username,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  }
  const token = Buffer.from(JSON.stringify(tokenData)).toString('base64')

  // Return success response
  return {
    success: true,
    message: isNewUser ? 'ثبت‌نام موفقیت‌آمیز بود' : 'ورود موفقیت‌آمیز بود',
    is_new_user: isNewUser,
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