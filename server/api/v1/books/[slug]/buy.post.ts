import { H3Event } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event: H3Event) => {
  // Step 1: Get the book slug from the URL
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Book slug is required.',
    })
  }

  // Step 2: Ensure the user is authenticated
  const user = event.context.auth?.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized. Please log in to purchase.',
    })
  }

  // Step 3: Check if the book has already been purchased
  if (db.hasPurchased(user.id, slug)) {
    throw createError({
      statusCode: 409, // Conflict
      statusMessage: 'شما قبلاً این کتاب را خریداری کرده‌اید.',
    })
  }

  try {
    // Step 4: Process the direct purchase by adding it to our mock DB
    const newPurchase = db.addPurchase(user.id, slug)

    // Step 5: Return the success response
    return {
      success: true,
      message: 'خرید شما با موفقیت انجام شد.',
      data: {
        order_id: newPurchase.purchaseId,
      },
    }
  } catch (error: any) {
    // Step 6: Handle any other unexpected errors
    console.error(`Error processing purchase for book '${slug}':`, error)
    throw createError({
      statusCode: 500,
      message: 'خطا در پردازش خرید شما. لطفاً دوباره تلاش کنید.',
    })
  }
})
