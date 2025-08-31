// server/api/auth/users.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://127.0.0.1:8000'

  // Get the authorization header from the request
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization header is missing'
    })
  }

  const body = await readBody(event)

  try {
    const response = await $fetch(`${apiBase}/auth/users`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body
    })

    return response
  } catch (error: any) {
    console.error('Error creating user:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to create user'
    })
  }
})

