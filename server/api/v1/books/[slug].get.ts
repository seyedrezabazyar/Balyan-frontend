export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  const user = event.context.auth?.user

  // Get the purchase status for the current user.
  // If no user, status is 'none'.
  const purchaseStatus = user ? db.getPurchaseStatus(user.id, slug) : 'none'

  // Mock book data - in a real app, this would be fetched from a database.
  const book = {
    id: 1,
    slug: slug,
    title: `کتاب با اسلاگ: ${slug}`,
    authors: [{ name: 'نویسنده آزمایشی' }],
    category: { name: 'داستانی' },
    excerpt: 'این یک خلاصه آزمایشی برای کتاب است تا نمایش داده شود.',
    language: 'fa',
    publication_year: 2023,
    pages_count: 250,
    isbn: '978-1234567890',
    price: 20000,
    // The new dynamic status field, replacing is_purchased
    purchase_status: purchaseStatus,
    image: {
      url: 'https://via.placeholder.com/400x600',
      thumbnail_url: 'https://via.placeholder.com/150x225'
    }
  }

  // Returning a wrapped response for consistency, as expected by the frontend
  return {
    success: true,
    data: {
      book: book,
      related: [] // Added for consistency with the user's new documentation
    }
  }
})
