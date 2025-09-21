export default defineEventHandler((event) => {
  // This is a mock response. In a real application, you would fetch this from a database.
  const books = [
    {
      id: 1,
      slug: 'mock-book-1',
      title: 'کتاب آزمایشی اول',
      authors: [{ name: 'نویسنده اول' }],
      price: 10000,
      sale_price: 8000,
      discount_percent: 20,
      is_purchased: false,
      image: { thumbnail_url: 'https://via.placeholder.com/150' }
    },
    {
      id: 2,
      slug: 'mock-book-2',
      title: 'کتاب آزمایشی دوم',
      authors: [{ name: 'نویسنده دوم' }],
      price: 15000,
      sale_price: null,
      discount_percent: 0,
      is_purchased: true,
      image: { thumbnail_url: 'https://via.placeholder.com/150' }
    }
  ];

  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const perPage = parseInt(query.per_page as string) || 10;

  return {
    data: books,
    meta: {
      current_page: page,
      last_page: 1,
      per_page: perPage,
      total: books.length,
      from: 1,
      to: books.length
    }
  }
})
