// Mock toggle user status API endpoint
export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id') || '0'
  
  return {
    success: true,
    message: 'وضعیت کاربر با موفقیت تغییر کرد',
    user: {
      id: parseInt(idParam),
      status: 'active', // Mock toggle result
      locked_at: null
    }
  }
})