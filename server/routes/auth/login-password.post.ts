export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { identifier, password } = body

  console.log(`[Mock API] /auth/login-password received request for: ${identifier}`)

  if (!identifier || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Identifier and password are required',
    })
  }

  // Simulate a password check
  if (password !== 'password') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    })
  }

  // If credentials are "correct", return a mock user and token
  return {
    token: `mock-jwt-token-for-${identifier}-${Date.now()}`,
    access_token: `mock-jwt-token-for-${identifier}-${Date.now()}`, // for compatibility
    user: {
      id: 1,
      name: 'Test User',
      email: identifier.includes('@') ? identifier : 'test.user@example.com',
      phone: identifier.includes('@') ? '09123456789' : identifier,
      is_admin: true,
      roles: [{ id: 1, name: 'admin', display_name: 'Administrator' }],
    }
  }
})
