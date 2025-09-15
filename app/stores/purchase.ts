import { defineStore } from 'pinia'
import { useApiAuth } from '~/composables/useApiAuth'

export const usePurchaseStore = defineStore('purchase', {
  state: () => ({
    purchases: [], // Renamed from purchasedBooks
    loading: false,
    error: null,
  }),

  getters: {
    hasPurchases: (state) => state.purchases.length > 0,
  },

  actions: {
    async fetchPurchases() { // Renamed from fetchPurchasedBooks
      if (this.hasPurchases) {
        // Data is already loaded
        return;
      }

      this.loading = true;
      this.error = null;
      const api = useApiAuth();

      try {
        // By adding `?include=order`, we ask the API to include the full order details
        // with each purchase item. This is a common pattern in JSON:API or similar APIs.
        const response = await api.get('/downloads?include=order');
        // The API returns a paginated response, so the list is in `response.data`
        if (response && Array.isArray(response.data)) {
          this.purchases = response.data;
        } else {
          this.purchases = [];
          console.warn('API response for downloads was not in the expected paginated format.', response);
        }
      } catch (error) {
        console.error('Failed to fetch purchases:', error);
        this.error = error.response?._data?.message || 'An unexpected error occurred.';
        this.purchases = []; // Clear data on error
      } finally {
        this.loading = false;
      }
    },

    clearPurchases() {
      this.purchases = [];
    },
  },
})
