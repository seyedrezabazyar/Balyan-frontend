export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')

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
    price: 50000,
    sale_price: 45000,
    is_purchased: false,
    image: {
      url: 'https://via.placeholder.com/400x600',
      thumbnail_url: 'https://via.placeholder.com/150x225'
    }
  }

  // Returning a wrapped response for consistency
  return {
    success: true,
    data: {
      book: book
    }
  }
})
