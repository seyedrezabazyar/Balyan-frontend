import { defineEventHandler, createError } from 'h3'
import jwt from 'jsonwebtoken'
import formidable from 'formidable'
import { promises as fs } from 'fs'
import path from 'path'

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

    // Parse multipart form data
    const form = formidable({
      uploadDir: './public/uploads/avatars',
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: function ({ mimetype }) {
        // Only allow images
        return mimetype && mimetype.includes('image')
      }
    })

    // Ensure upload directory exists
    const uploadDir = './public/uploads/avatars'
    await fs.mkdir(uploadDir, { recursive: true })

    return new Promise((resolve, reject) => {
      form.parse(event.node.req, async (err, fields, files) => {
        if (err) {
          reject(createError({
            statusCode: 400,
            statusMessage: 'خطا در آپلود فایل'
          }))
          return
        }

        const file = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar
        
        if (!file) {
          reject(createError({
            statusCode: 400,
            statusMessage: 'فایلی انتخاب نشده است'
          }))
          return
        }

        // Generate unique filename
        const ext = path.extname(file.originalFilename || '.jpg')
        const filename = `avatar_${decoded.userId}_${Date.now()}${ext}`
        const newPath = path.join(uploadDir, filename)

        try {
          // Move file to final location
          await fs.rename(file.filepath, newPath)

          // In a real application, you would:
          // 1. Delete the old avatar file if exists
          // 2. Update the user's avatar_url in the database
          // 3. Return the updated user data

          const avatarUrl = `/uploads/avatars/${filename}`

          resolve({
            success: true,
            message: 'تصویر پروفایل با موفقیت آپلود شد',
            avatar_url: avatarUrl
          })
        } catch (error) {
          reject(createError({
            statusCode: 500,
            statusMessage: 'خطا در ذخیره فایل'
          }))
        }
      })
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'خطا در آپلود تصویر'
    })
  }
})