import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock database - در محیط واقعی از دیتابیس استفاده کنید
const users: any[] = []

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

  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'نام الزامی است'
    })
  }

  // Check identifier type
  const isEmail = body.identifier.includes('@')
  const isPhone = /^09\d{9}$/.test(body.identifier)

  if (!isEmail && !isPhone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'فرمت ایمیل یا شماره موبایل نامعتبر است'
    })
  }

  // Check if user already exists
  const existingUser = users.find(u => 
    (isEmail && u.email === body.identifier) || 
    (isPhone && u.phone === body.identifier)
  )

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'کاربر با این مشخصات قبلا ثبت نام کرده است'
    })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(body.password, 10)

  // Create new user
  const newUser = {
    id: Date.now(),
    name: body.name,
    email: isEmail ? body.identifier : null,
    phone: isPhone ? body.identifier : null,
    password: hashedPassword,
    is_admin: false,
    permissions: [],
    created_at: new Date().toISOString(),
    email_verified_at: null,
    phone_verified_at: null
  }

  users.push(newUser)

  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: newUser.id,
      email: newUser.email,
      phone: newUser.phone
    },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    { expiresIn: '7d' }
  )

  // Return user without password
  const { password, ...userWithoutPassword } = newUser

  return {
    success: true,
    message: 'ثبت نام با موفقیت انجام شد',
    user: userWithoutPassword,
    token
  }
})