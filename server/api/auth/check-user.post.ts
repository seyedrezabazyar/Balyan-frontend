export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { identifier } = body

  // Log the request for debugging
  console.log(`[Mock API] /auth/check-user received request for: ${identifier}`)

  if (!identifier) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Identifier (email or phone) is required'
    })
  }

  // Simulate a real-world scenario
  // Let's say 'test@example.com' exists and has a password
  // And any other user is a new user
  if (identifier.includes('test') || identifier.includes('09')) {
    return {
      user_exists: true,
      exists: true,
      has_password: true,
      status: 'existing_user_with_password'
    }
  } else {
    return {
      user_exists: false,
      exists: false,
      has_password: false,
      status: 'new_user'
    }
  }
})
