import { defineStore } from 'pinia'
import { useApiAuth } from '~/composables/useApiAuth'

export const usePurchaseStore = defineStore('purchase', {
  state: () => ({
    purchasedBooks: [],
    loading: false,
    error: null,
  }),

  getters: {
    hasPurchases: (state) => state.purchasedBooks.length > 0,
  },

  actions: {
    async fetchPurchasedBooks() {
      if (this.hasPurchases) {
        // Data is already loaded
        return;
      }

      this.loading = true;
      this.error = null;
      const api = useApiAuth();

      try {
        const response = await api.get('/books/my-purchases');
        if (response.success && Array.isArray(response.data)) {
          this.purchasedBooks = response.data;
        } else {
          // Handle cases where response.data is not as expected
          this.purchasedBooks = [];
          console.warn('API response for my-purchases was not in the expected format.', response);
        }
      } catch (error) {
        console.error('Failed to fetch purchased books:', error);
        this.error = error.response?._data?.message || 'An unexpected error occurred.';
        this.purchasedBooks = []; // Clear data on error
      } finally {
        this.loading = false;
      }
    },
  },
})
