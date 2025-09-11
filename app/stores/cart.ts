import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/auth'

interface CartItem {
  id: number;
  price: number;
  product: {
    id: number;
    title: string;
    slug: string;
    thumbnail_url: string;
  };
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    total: 0,
    coupon: null as any,
    loading: false,
    paymentLoading: false,
  }),

  getters: {
    uniqueItemCount: (state) => state.items.length,
    // itemCount is now the same as uniqueItemCount since quantity is always 1
    itemCount: (state) => state.items.length,
    cartTotal: (state) => state.items.reduce((acc, item) => acc + item.price, 0),
    finalTotal: (state) => {
      let total = state.items.reduce((acc, item) => acc + item.price, 0)
      if (state.coupon) {
        total = total - (state.coupon.discount_amount || 0)
      }
      return total
    }
  },

  actions: {
    async fetchCart() {
      const api = useApi()
      this.loading = true
      try {
        const response = await api.get('/v1/cart')
        this.items = response.data?.items || []
        this.total = response.data?.total || 0
        this.coupon = response.coupon
        return response
      } catch (error) {
        console.error('Error fetching cart:', error)
      } finally {
        this.loading = false
      }
    },

    async addToCart(item: { product_id: number, product_type: string, price: number }) {
      const api = useApi()
      try {
        await api.post('/v1/cart/add', item)
      } catch (error: any) {
        // If the error is 409 Conflict, it means the item is already in the cart.
        // This is not a real error for the user, so we can suppress it.
        // For any other error, we let it propagate to the component.
        if (error.response?.status !== 409) {
          throw error;
        }
      } finally {
        // No matter if it was a success or a 409 conflict, we want to sync the cart state.
        await this.fetchCart();
      }
    },

    async removeFromCart(itemId: number) {
      const api = useApi()
      try {
        await api.delete(`/v1/cart/remove/${itemId}`)
        await this.fetchCart()
      } catch (error) {
        throw error
      }
    },

    async clearCart() {
      const api = useApi()
      try {
        await api.delete('/v1/cart/clear')
        this.items = []
        this.total = 0
        this.coupon = null
      } catch (error) {
        throw error
      }
    },

    async verifyPayment(payload: { status?: string, order_id?: string, authority?: string }) {
      const api = useApi()
      // The backend expects `payment_id` and `authority`.
      // We are assuming the order_id from the URL can be used as payment_id.
      // This might need adjustment based on the final backend implementation.
      const response = await api.post('/v1/payment/verify', {
        payment_id: payload.order_id,
        authority: payload.authority,
      })
      // After successful verification, the cart should be empty. Let's refetch it.
      await this.fetchCart()
      return response
    },

    async initiatePayment() {
      const api = useApi() // Reverted: Do not send token, rely on session cookie
      this.paymentLoading = true
      try {
        const response = await api.post('/v1/purchase/payment/initiate')
        if (response.payment_url) {
          window.location.href = response.payment_url
        }
        return response
      } catch (error) {
        throw error
      } finally {
        this.paymentLoading = false
      }
    }
  }
})
