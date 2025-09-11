export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { identifier, otp, name } = body

  console.log(`[Mock API] /auth/verify-otp received request for: ${identifier} with OTP: ${otp}`)

  if (!identifier || !otp) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Identifier and OTP are required',
    })
  }

  // Simulate an OTP check. In a real app, you'd verify the code.
  // For the mock, any 6-digit code will do, or the test code from the UI.
  if (otp !== '123456' && otp.length !== 6) {
     throw createError({
      statusCode: 401,
      statusMessage: 'Invalid OTP',
    })
  }

  // If OTP is "correct", return a mock user and token.
  // If a name is provided (for new user registration), use it.
  return {
    token: `mock-jwt-token-for-${identifier}-${Date.now()}`,
    access_token: `mock-jwt-token-for-${identifier}-${Date.now()}`,
    user: {
      id: 2, // Different ID from password login for clarity
      name: name || 'OTP User',
      email: identifier.includes('@') ? identifier : 'otp.user@example.com',
      phone: identifier.includes('@') ? '09876543210' : identifier,
      is_admin: false,
      roles: [{ id: 2, name: 'user', display_name: 'User' }],
    }
  }
})
