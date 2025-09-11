export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { identifier } = body

  console.log(`[Mock API] /auth/send-otp received request for: ${identifier}`)

  if (!identifier) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Identifier is required',
    })
  }

  // In a real app, you would send an SMS or email here.
  // For this mock, we just return a success message.
  return {
    success: true,
    message: `OTP sent to ${identifier}`,
  }
})
