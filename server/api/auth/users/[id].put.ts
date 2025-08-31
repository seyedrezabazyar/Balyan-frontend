// Mock update user API endpoint
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  // Mock updated user
  const updatedUser = {
    id: parseInt(id),
    name: body.name,
    email: body.email || null,
    phone: body.phone || null,
    preferred_method: body.preferred_method || 'password',
    updated_at: new Date().toISOString()
  }

  return {
    success: true,
    message: 'کاربر با موفقیت بروزرسانی شد',
    user: updatedUser
  }
})