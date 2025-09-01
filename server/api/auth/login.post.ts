import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock database - این داده‌ها باید با register.post.ts هماهنگ باشند
// در محیط واقعی از دیتابیس مشترک استفاده کنید
const users = [
  {
    id: 1,
    name: 'کاربر عادی',
    email: 'user@example.com',
    phone: '09123456789',
    password: '$2a$10$YourHashedPasswordHere', // password: 123456
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
    password: '$2a$10$YourHashedPasswordHere', // password: 123456
    is_admin: true,
    permissions: ['dashboard.view', 'dashboard.admin', 'users.view', 'users.edit'],
    created_at: '2024-01-01T00:00:00.000Z',
    email_verified_at: '2024-01-01T00:00:00.000Z',
    phone_verified_at: '2024-01-01T00:00:00.000Z'
  }
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validation
  if (!body.identifier) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ایمیل یا شماره موبایل الزامی است'
    })
  }

  if (!body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'رمز عبور الزامی است'
    })
  }

  // Check identifier type
  const isEmail = body.identifier.includes('@')
  const isPhone = /^09\d{9}$/.test(body.identifier)

  // Find user
  const user = users.find(u => 
    (isEmail && u.email === body.identifier) || 
    (isPhone && u.phone === body.identifier)
  )

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'نام کاربری یا رمز عبور اشتباه است'
    })
  }

  // For demo purposes, accept any password
  // In production, use: const isValidPassword = await bcrypt.compare(body.password, user.password)
  const isValidPassword = body.password === '123456'

  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'نام کاربری یا رمز عبور اشتباه است'
    })
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      phone: user.phone,
      is_admin: user.is_admin
    },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    { expiresIn: '7d' }
  )

  // Update last login
  user.last_login_at = new Date().toISOString()

  // Return user without password
  const { password, ...userWithoutPassword } = user

  return {
    success: true,
    message: 'ورود با موفقیت انجام شد',
    user: userWithoutPassword,
    token
  }
})