import { defineEventHandler, readBody } from 'h3'

// This utility function will help manage the cart in the session
// In a real application, this should be in a shared utility file.
async function getCart(sessionId: string) {
  const storage = useStorage('session')
  const cartKey = `cart:${sessionId}`
  let cart: any = await storage.getItem(cartKey)

  if (!cart) {
    cart = {
      cart_id: sessionId,
      items: [],
      total: 0,
      coupon: null
    }
  }
  return cart
}

async function saveCart(sessionId: string, cart: any) {
  const storage = useStorage('session')
  const cartKey = `cart:${sessionId}`
  await storage.setItem(cartKey, cart)
}

// CORRECTED: Use the same mock data as the other endpoints for consistency.
const mockBooks = [
  {
    id: 1,
    title: 'کتاب آزمایشی اول',
    slug: 'first-test-book',
    thumbnail_url: 'https://via.placeholder.com/150x225.png?text=Book'
  },
  {
    id: 2,
    title: 'کتاب آزمایشی دوم: ماجراهای ناکس',
    slug: 'second-test-book',
    thumbnail_url: 'https://via.placeholder.com/150x225.png?text=Book+2'
  },
];

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { product_id, price } = body

  if (!product_id || price === undefined) {
    event.node.res.statusCode = 400
    return { error: 'Product ID and price are required' }
  }

  // This should be a dynamic session ID in a real application
  const sessionId = 'user123'
  const cart = await getCart(sessionId)

  // Check if item is already in cart
  const existingItem = cart.items.find((item: any) => item.product.id === product_id)

  if (existingItem) {
    event.node.res.statusCode = 409
    return { error: 'Item already in cart' }
  }

  // Get product details from our mock DB
  const product = mockBooks.find(b => b.id === product_id)
  if (!product) {
      event.node.res.statusCode = 404
      return { error: 'Product not found' }
  }

  // Add new item to cart
  const newItem = {
    id: Date.now(), // Mock cart item ID
    price: price,
    product: { // Ensure the product object in the cart has the necessary fields
        id: product.id,
        title: product.title,
        slug: product.slug,
        thumbnail_url: product.thumbnail_url
    }
  }
  cart.items.push(newItem)
  cart.total = cart.items.reduce((acc, item) => acc + item.price, 0)

  await saveCart(sessionId, cart)

  return {
    success: true,
    message: 'Item added to cart successfully',
    data: cart
  }
})
