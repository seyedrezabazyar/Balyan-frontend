import { defineEventHandler, readBody, createError } from 'h3'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schema
const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^09\d{9}$/).optional(),
  username: z.string().min(3).max(50).optional(),
  preferred_method: z.enum(['password', 'otp']).optional()
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
    
    // Validate input
    const validationResult = updateProfileSchema.safeParse(body)
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'داده‌های ورودی نامعتبر هستند',
        data: validationResult.error.flatten()
      })
    }

    const updateData = validationResult.data

    // Mock database update (replace with actual database logic)
    // In a real application, you would:
    // 1. Check if email/phone/username already exists for other users
    // 2. Update the user record in the database
    // 3. Return the updated user data

    // For now, we'll return a mock response
    const updatedUser = {
      id: decoded.userId,
      name: updateData.name || decoded.name,
      email: updateData.email || decoded.email,
      phone: updateData.phone || decoded.phone,
      username: updateData.username || decoded.username,
      preferred_method: updateData.preferred_method || decoded.preferred_method,
      avatar_url: decoded.avatar_url,
      is_admin: decoded.is_admin,
      email_verified_at: decoded.email_verified_at,
      phone_verified_at: decoded.phone_verified_at,
      created_at: decoded.created_at,
      updated_at: new Date().toISOString()
    }

    return {
      success: true,
      message: 'پروفایل با موفقیت به‌روزرسانی شد',
      user: updatedUser
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'خطا در به‌روزرسانی پروفایل'
    })
  }
})