import { H3Event } from 'h3'

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

  // Step 3: Check the current purchase status
  const currentStatus = db.getPurchaseStatus(user.id, slug);

  if (currentStatus === 'active') {
    throw createError({
      statusCode: 409, // Conflict
      statusMessage: 'شما در حال حاضر یک نسخه فعال و قابل دانلود از این کتاب دارید.',
    });
  }

  // Step 4: Process the purchase for 'none' or 'expired' statuses
  try {
    const { purchase, isNew } = db.addPurchase(user.id, slug);

    // Step 5: Return a dynamic success message based on the purchase type
    const message = isNew
      ? 'خرید شما با موفقیت انجام شد.'
      : 'کتاب با موفقیت برای شما فعال شد.';

    return {
      success: true,
      message: message,
      data: {
        order_id: purchase.purchaseId,
      },
    };
  } catch (error: any) {
    // Step 6: Handle any other unexpected errors
    console.error(`Error processing purchase for book '${slug}':`, error);
    throw createError({
      statusCode: 500,
      message: 'خطا در پردازش خرید شما. لطفاً دوباره تلاش کنید.',
    });
  }
});
