import { defineStore } from 'pinia'

interface CartItem {
  id: number
  book_id: number
  title: string
  price: number
  quantity: number
  thumbnail?: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    total: 0,
    coupon: null as any
  }),

  getters: {
    itemCount: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0),
    cartTotal: (state) => state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    finalTotal: (state) => {
      let total = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
      if (state.coupon) {
        total = total - (state.coupon.discount_amount || 0)
      }
      return total
    }
  },

  actions: {
    async fetchCart() {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.get('/api/v1/cart')
        this.items = response.data.items
        this.total = response.data.total
        this.coupon = response.data.coupon
        return response.data
      } catch (error) {
        console.error('Error fetching cart:', error)
      }
    },

    async addToCart(bookId: number, quantity: number = 1) {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.post('/api/v1/cart/add', {
          book_id: bookId,
          quantity
        })
        await this.fetchCart()
        return response.data
      } catch (error) {
        throw error
      }
    },

    async removeFromCart(itemId: number) {
      const { $api } = useNuxtApp()
      try {
        await $api.delete(`/api/v1/cart/remove/${itemId}`)
        await this.fetchCart()
      } catch (error) {
        throw error
      }
    },

    async updateQuantity(itemId: number, quantity: number) {
      const { $api } = useNuxtApp()
      try {
        await $api.put(`/api/v1/cart/update/${itemId}`, {
          quantity
        })
        await this.fetchCart()
      } catch (error) {
        throw error
      }
    },

    async clearCart() {
      const { $api } = useNuxtApp()
      try {
        await $api.delete('/api/v1/cart/clear')
        this.items = []
        this.total = 0
        this.coupon = null
      } catch (error) {
        throw error
      }
    },

    async applyCoupon(code: string) {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.post('/api/v1/cart/coupon/apply', {
          code
        })
        this.coupon = response.data.coupon
        await this.fetchCart()
        return response.data
      } catch (error) {
        throw error
      }
    }
  }
})
