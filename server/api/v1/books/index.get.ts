export default defineEventHandler((event) => {
  // This is a mock response. In a real application, you would fetch this from a database.
  // This mock data is enhanced to include fields expected by the admin books page.
  const allBooks = [
    {
      id: 1,
      slug: 'mock-book-1',
      title: 'کتاب دستی قفل شده',
      authors: [{ name: 'نویسنده اول' }],
      price: 10000,
      sale_price: 8000,
      discount_percent: 20,
      is_purchased: false,
      image: { thumbnail_url: 'https://via.placeholder.com/150' },
      is_master: true,
      master_book_id: null,
      hidden_level: 1,
      content_filter_status: 'manually_blocked',
      override: { id: 1, user_id: 1, book_id: 1, created_at: '2023-01-01T12:00:00Z' } // This book is manually managed
    },
    {
      id: 2,
      slug: 'mock-book-2',
      title: 'کتاب معمولی',
      authors: [{ name: 'نویسنده دوم' }],
      price: 15000,
      sale_price: null,
      discount_percent: 0,
      is_purchased: true,
      image: { thumbnail_url: 'https://via.placeholder.com/150' },
      is_master: true,
      master_book_id: null,
      hidden_level: 0,
      content_filter_status: 'approved',
      override: null // This book is not manually managed
    },
    {
      id: 3,
      slug: 'mock-book-3',
      title: 'کتاب بلاک شده خودکار',
      authors: [{ name: 'نویسنده سوم' }],
      price: 20000,
      sale_price: null,
      discount_percent: 0,
      is_purchased: false,
      image: { thumbnail_url: 'https://via.placeholder.com/150' },
      is_master: true,
      master_book_id: null,
      hidden_level: 0,
      content_filter_status: 'auto_blocked',
      override: null
    },
    {
      id: 4,
      slug: 'mock-book-4',
      title: 'کتاب متصل به اصلی',
      authors: [{ name: 'نویسنده چهارم' }],
      price: 25000,
      sale_price: null,
      discount_percent: 0,
      is_purchased: false,
      image: { thumbnail_url: 'https://via.placeholder.com/150' },
      is_master: false,
      master_book_id: 2,
      hidden_level: 0,
      content_filter_status: 'approved',
      override: null
    }
  ];

  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const perPage = parseInt(query.per_page as string) || 10;

  let books = allBooks;

  // Mock search
  if (query.search) {
    const search = (query.search as string).toLowerCase();
    books = books.filter(b => b.title.toLowerCase().includes(search));
  }

  // Mock status filter
  if (query.status) {
    switch(query.status) {
      case 'published':
        books = books.filter(b => b.hidden_level === 0);
        break;
      case 'draft':
        books = books.filter(b => b.hidden_level > 0);
        break;
      // 'archived' is not implemented in this mock
    }
  }

  const total = books.length;
  const paginatedBooks = books.slice((page - 1) * perPage, page * perPage);

  return {
    data: paginatedBooks,
    current_page: page,
    last_page: Math.ceil(total / perPage),
    per_page: perPage,
    total: total,
    from: (page - 1) * perPage + 1,
    to: (page - 1) * perPage + paginatedBooks.length,
  }
})
