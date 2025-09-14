import { H3Event } from 'h3'

// Mock function to simulate creating an order in the database
const createOrder = async (bookSlug: string, userId: string | number) => {
  console.log(`Creating order for book '${bookSlug}' for user '${userId}'...`)
  // In a real application, you would save this to the database
  const mockOrderId = Math.floor(Math.random() * 90000) + 10000
  console.log(`Order created with ID: ${mockOrderId}`)
  return { order_id: mockOrderId }
}

export default defineEventHandler(async (event: H3Event) => {
  // Step 1: Get the book slug from the URL
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Book slug is required.',
    })
  }

  // Step 2: Ensure the user is authenticated.
  // The 'auth' middleware in Nuxt should have already handled this.
  // We can access the user from the event context if the middleware adds it.
  // Example: const user = event.context.auth?.user
  // For this mock, we'll assume the user is authenticated if the call reaches here.
  // In a real app, you'd have proper user validation.
  const user = event.context.auth?.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }


  try {
    // Step 3: Process the direct purchase.
    // No request body is needed for this operation.
    const orderData = await createOrder(slug, user.id)

    // Step 4: Return the success response as per the documentation.
    return {
      success: true,
      message: 'خرید شما با موفقیت انجام شد.',
      data: {
        order_id: orderData.order_id,
      },
    }
  } catch (error: any) {
    // Step 5: Handle potential errors.
    console.error(`Error processing purchase for book '${slug}':`, error)

    // This could be a 404 if the book slug is not found,
    // or a 409 if the book is already purchased.
    // For now, we return a generic server error.
    throw createError({
      statusCode: 500,
      message: 'خطا در پردازش خرید شما. لطفاً دوباره تلاش کنید.',
    })
  }
})
