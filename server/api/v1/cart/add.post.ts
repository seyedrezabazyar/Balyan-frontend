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

// Mock database of products to get product details
const products = {
  1: { id: 1, title: 'JavaScript: The Good Parts', slug: 'javascript-good-parts', thumbnail_url: 'https://images-na.ssl-images-amazon.com/images/I/5131OWtQRaL._SX379_BO1,204,203,200_.jpg' },
  2: { id: 2, title: 'کتابی دیگر برای تست', slug: 'another-book', thumbnail_url: 'https://via.placeholder.com/400x600.png?text=Book+Cover' }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { product_id, price } = body

  if (!product_id || price === undefined) {
    event.res.statusCode = 400
    return { error: 'Product ID and price are required' }
  }

  // This should be a dynamic session ID in a real application
  const sessionId = 'user123'
  const cart = await getCart(sessionId)

  // Check if item is already in cart
  const existingItem = cart.items.find((item: any) => item.product.id === product_id)

  if (existingItem) {
    // As per the frontend code, we should return a 409 Conflict
    event.res.statusCode = 409
    return { error: 'Item already in cart' }
  }

  // Get product details from our mock DB
  const product = products[product_id]
  if (!product) {
      event.res.statusCode = 404
      return { error: 'Product not found' }
  }

  // Add new item to cart
  const newItem = {
    id: Date.now(), // Mock cart item ID
    price: price,
    product: product
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
