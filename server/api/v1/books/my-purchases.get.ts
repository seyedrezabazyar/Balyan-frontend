import { H3Event } from 'h3'
import { db } from '~/server/utils/db'

// Mock function to get book details. In a real app, this would query a database.
const getBookDetails = (slug: string) => {
    return {
        title: `کتاب ${slug}`,
        slug: slug,
        cover_image_url: 'https://via.placeholder.com/150x225'
    };
};

export default defineEventHandler(async (event: H3Event) => {
  const user = event.context.auth?.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized. Please log in to see your purchases.',
    });
  }

  const userPurchases = db.getUserPurchases(user.id);

  const responseData = userPurchases.map(purchase => {
    // Add a mock expiration date, e.g., one year from now.
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    return {
      purchase_id: purchase.purchaseId,
      book: getBookDetails(purchase.bookSlug),
      download_token: purchase.downloadToken,
      expires_at: expiresAt.toISOString(),
    };
  });

  return {
    success: true,
    data: responseData,
  };
});
