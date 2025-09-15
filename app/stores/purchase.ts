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
        const response = await api.get('/downloads');
        // The API returns a paginated response, so the book list is in `response.data`
        if (response && Array.isArray(response.data)) {
          this.purchasedBooks = response.data;
        } else {
          this.purchasedBooks = [];
          console.warn('API response for downloads was not in the expected paginated format.', response);
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
