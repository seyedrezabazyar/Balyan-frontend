import { defineEventHandler, getRouterParam } from 'h3'

// A mock database of books
const books = {
  'javascript-good-parts': {
    id: 1,
    slug: 'javascript-good-parts',
    title: 'JavaScript: The Good Parts',
    publication_year: 2008,
    pages_count: 172,
    isbn: '978-0596517748',
    language: 'en',
    price: 29.99,
    sale_price: 25.00,
    excerpt: 'یک کتاب کلاسیک در مورد زبان جاوااسکریپت که بر روی ویژگی‌های خوب زبان تمرکز دارد و از ویژگی‌های بد آن دوری می‌کند.',
    image: {
      id: 1,
      url: 'https://images-na.ssl-images-amazon.com/images/I/5131OWtQRaL._SX379_BO1,204,203,200_.jpg'
    },
    authors: [
      { id: 1, name: 'داگلاس کراکفورد', slug: 'douglas-crockford' }
    ],
    category: {
      id: 1,
      name: 'برنامه‌نویسی وب'
    },
    publisher: {
        id: 1,
        name: 'O\'Reilly Media'
    }
  },
  'another-book': {
    id: 2,
    slug: 'another-book',
    title: 'کتابی دیگر برای تست',
    publication_year: 2022,
    pages_count: 300,
    isbn: '978-1234567890',
    language: 'fa',
    price: 45.00,
    sale_price: null,
    excerpt: 'توضیحاتی برای کتاب دیگر.',
    image: {
      id: 2,
      url: 'https://via.placeholder.com/400x600.png?text=Book+Cover'
    },
    authors: [
      { id: 2, name: 'نویسنده تستی', slug: 'test-author' }
    ],
    category: {
      id: 2,
      name: 'تست'
    },
     publisher: {
        id: 2,
        name: 'نشر تستی'
    }
  },
  'buf-e-kur': {
    id: 3,
    slug: 'buf-e-kur',
    title: 'بوف کور',
    publication_year: 1937,
    pages_count: 132,
    isbn: '978-964-351-012-4',
    language: 'fa',
    price: 35.00,
    sale_price: null,
    excerpt: 'رمانی نوشته صادق هدایت، نویسنده ایرانی، که از نخستین نثرهای داستانی مدرن در زبان فارسی به شمار می‌رود.',
    image: {
      id: 3,
      url: 'https://images-na.ssl-images-amazon.com/images/I/51YJ4X1QZQL._SX331_BO1,204,203,200_.jpg'
    },
    authors: [
      { id: 3, name: 'صادق هدایت', slug: 'sadegh-hedayat' }
    ],
    category: {
      id: 3,
      name: 'ادبیات داستانی'
    },
     publisher: {
        id: 3,
        name: 'نشر جامی'
    }
  }
}

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')

  const book = books[slug]

  if (book) {
    // Return the book object directly
    return book
  }

  // Set the status code and return an error object
  event.res.statusCode = 404
  return {
    error: 'کتاب مورد نظر یافت نشد.'
  }
})
