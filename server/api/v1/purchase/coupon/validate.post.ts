export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const code = body.code

  // In a real app, you would look up the coupon code in the database.
  if (code && code.toUpperCase() === 'TEST10') {
    return {
      success: true,
      data: {
        type: 'coupon',
        percentage: 10,
        code: 'TEST10'
      }
    }
  }

  if (code && code.toUpperCase() === 'INVALID') {
    throw createError({
      statusCode: 422,
      statusMessage: 'Invalid Coupon',
      data: {
        message: 'کد تخفیف وارد شده معتبر نیست.'
      }
    })
  }

  // Default mock response for other codes
  return {
    success: true,
    data: {
      type: 'coupon',
      percentage: 15,
      code: code
    }
  }
})
