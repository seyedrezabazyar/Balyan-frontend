import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const token = getRouterParam(event, 'token');

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Download token is required.',
    });
  }

  // Validate the token against our mock database
  const purchase = db.findPurchaseByToken(token);

  if (!purchase) {
    throw createError({
      statusCode: 404, // Using 404 to not reveal the existence of a token
      statusMessage: 'Invalid or expired download link.',
    });
  }

  // --- Simulate File Download ---
  // In a real application, you would fetch a file from storage (e.g., S3)
  // and stream it back to the user.

  // 1. Set the appropriate headers for a file download.
  const bookFileName = `${purchase.bookSlug}.epub`; // Example file name
  setResponseHeaders(event, {
    'Content-Type': 'application/epub+zip', // Example MIME type for an e-book
    'Content-Disposition': `attachment; filename="${bookFileName}"`,
  });

  // 2. Return the file content.
  // For this mock, we'll just return a simple string as the file content.
  return `This is the content of the mock e-book "${purchase.bookSlug}". Happy reading!`;
});
