import { defineEventHandler, readBody, createError } from 'h3'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schemas
const setPasswordSchema = z.object({
  password: z.string().min(8).max(100),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "رمز عبور و تکرار آن یکسان نیستند",
  path: ["password_confirmation"]
})

const changePasswordSchema = z.object({
  current_password: z.string(),
  password: z.string().min(8).max(100),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "رمز عبور جدید و تکرار آن یکسان نیستند",
  path: ["password_confirmation"]
})

export default defineEventHandler(async (event) => {
  try {
    // Get token from header
    const authorization = getHeader(event, 'authorization')
    if (!authorization?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'توکن احراز هویت یافت نشد'
      })
    }

    const token = authorization.substring(7)
    
    // Verify token
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: 'توکن نامعتبر است'
      })
    }

    // Get request body
    const body = await readBody(event)
    const action = body.action // 'set' or 'change'

    if (action === 'set') {
      // For users who logged in with OTP and want to set a password
      const validationResult = setPasswordSchema.safeParse(body)
      if (!validationResult.success) {
        throw createError({
          statusCode: 400,
          statusMessage: 'داده‌های ورودی نامعتبر هستند',
          data: validationResult.error.flatten()
        })
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(validationResult.data.password, 10)

      // In a real application, you would:
      // 1. Check if user doesn't already have a password
      // 2. Update the user's password in the database
      // 3. Update preferred_method to 'password'

      return {
        success: true,
        message: 'رمز عبور با موفقیت تنظیم شد'
      }
    } else if (action === 'change') {
      // For users who want to change their existing password
      const validationResult = changePasswordSchema.safeParse(body)
      if (!validationResult.success) {
        throw createError({
          statusCode: 400,
          statusMessage: 'داده‌های ورودی نامعتبر هستند',
          data: validationResult.error.flatten()
        })
      }

      // In a real application, you would:
      // 1. Fetch the user's current password hash from database
      // 2. Verify the current password
      // 3. Hash and save the new password

      // Mock verification (replace with actual database logic)
      const isValidPassword = true // Should check against database

      if (!isValidPassword) {
        throw createError({
          statusCode: 400,
          statusMessage: 'رمز عبور فعلی صحیح نیست'
        })
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(validationResult.data.password, 10)

      return {
        success: true,
        message: 'رمز عبور با موفقیت تغییر یافت'
      }
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'عملیات نامعتبر'
      })
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'خطا در تغییر رمز عبور'
    })
  }
})