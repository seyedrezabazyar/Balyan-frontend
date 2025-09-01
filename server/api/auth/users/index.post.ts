// Mock create user API endpoint
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate required fields
  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'نام کاربر الزامی است'
    })
  }

  // Create mock new user
  const newUser = {
    id: Date.now(),
    name: body.name,
    username: body.name.toLowerCase().replace(/\s+/g, '_'),
    email: body.email || null,
    phone: body.phone || null,
    preferred_method: body.preferred_method || 'password',
    email_verified_at: null,
    phone_verified_at: null,
    last_login_at: null,
    created_at: new Date().toISOString(),
    status: 'active',
    locked_at: null,
    disabled: false
  }

  return {
    success: true,
    message: 'کاربر با موفقیت ایجاد شد',
    user: newUser
  }
})