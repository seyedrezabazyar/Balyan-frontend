import { defineEventHandler } from 'h3'

// Mock data to simulate a database
const mockBooks = [
  {
    id: 1,
    title: 'کتاب آزمایشی اول',
    slug: 'first-test-book',
    price: 150000,
    sale_price: 120000,
    publication_year: 2023,
    pages_count: 250,
    isbn: '978-1234567890',
    language: 'fa',
    excerpt: 'این یک خلاصه کوتاه از کتاب آزمایشی اول است که برای تست نمایش داده می‌شود.',
    is_purchased: false,
    authors: [{ id: 1, name: 'نویسنده آزمایشی' }],
    category: { id: 1, name: 'داستانی' },
    image: { url: 'https://via.placeholder.com/400x600.png?text=Book+Cover' },
    thumbnail_url: 'https://via.placeholder.com/150x225.png?text=Book'
  },
  {
    id: 2,
    title: 'کتاب آزمایشی دوم: ماجراهای ناکس',
    slug: 'second-test-book',
    price: 200000,
    sale_price: null,
    publication_year: 2024,
    pages_count: 320,
    isbn: '978-0987654321',
    language: 'fa',
    excerpt: 'خلاصه‌ای از کتاب دوم که در مورد ماجراهای هیجان‌انگیز است.',
    is_purchased: false,
    authors: [{ id: 2, name: 'جی. کی. رولینگ' }],
    category: { id: 2, name: 'فانتزی' },
    image: { url: 'https://via.placeholder.com/400x600.png?text=Book+Cover+2' },
    thumbnail_url: 'https://via.placeholder.com/150x225.png?text=Book+2'
  },
];

export default defineEventHandler((event) => {
  // The frontend component expects a specific structure with `data` and `meta` properties.
  return {
    success: true,
    data: mockBooks,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: mockBooks.length
    },
    links: {},
    error: null,
    error_code: null
  }
})
