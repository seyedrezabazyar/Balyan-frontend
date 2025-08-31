// Mock toggle user status API endpoint
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  return {
    success: true,
    message: 'وضعیت کاربر با موفقیت تغییر کرد',
    user: {
      id: parseInt(id),
      status: 'active', // Mock toggle result
      locked_at: null
    }
  }
})