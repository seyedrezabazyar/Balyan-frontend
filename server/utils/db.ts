// A mock in-memory database to simulate storing user purchases and book data.

// --- Types ---
type PurchaseStatus = 'active' | 'expired' | 'none';

interface Purchase {
  userId: string | number;
  bookSlug: string;
  purchaseId: number;
  downloadToken: string;
  status: 'active' | 'expired'; // 'none' is a derived status, not stored
}

// --- In-memory Data Store ---
// Using a Map for efficient lookups. Key: userId, Value: Map<bookSlug, Purchase>
const purchases = new Map<string | number, Map<string, Purchase>>();


// --- Mock Data Initialization ---
// We'll use user ID 1 for our mock user
const user1Purchases = new Map<string, Purchase>();
// An active purchase for user 1
user1Purchases.set('savushun', {
    userId: 1,
    bookSlug: 'savushun',
    purchaseId: 101,
    downloadToken: 'token_user_1_savushun_active',
    status: 'active'
});
// An expired purchase for user 1
user1Purchases.set('kelidar', {
    userId: 1,
    bookSlug: 'kelidar',
    purchaseId: 102,
    downloadToken: 'token_user_1_kelidar_expired',
    status: 'expired'
});
purchases.set(1, user1Purchases);


// --- Database Interaction Logic ---
export const db = {
  /**
   * Gets the purchase status for a specific user and book.
   * @param userId - The ID of the user.
   * @param bookSlug - The slug of the book.
   * @returns The purchase status: 'active', 'expired', or 'none'.
   */
  getPurchaseStatus: (userId: string | number, bookSlug: string): PurchaseStatus => {
    const purchase = purchases.get(userId)?.get(bookSlug);
    return purchase ? purchase.status : 'none';
  },

  /**
   * Adds a new purchase or re-activates an expired one.
   * @param userId - The ID of the user.
   * @param bookSlug - The slug of the book.
   * @returns The purchase record and a flag indicating if it was a new purchase.
   */
  addPurchase: (userId: string | number, bookSlug: string): { purchase: Purchase, isNew: boolean } => {
    if (!purchases.has(userId)) {
      purchases.set(userId, new Map<string, Purchase>());
    }
    const userPurchases = purchases.get(userId)!;
    const existingPurchase = userPurchases.get(bookSlug);

    // Case 1: Re-activating an expired purchase
    if (existingPurchase && existingPurchase.status === 'expired') {
      existingPurchase.status = 'active';
      // It's good practice to issue a new download token on re-purchase
      existingPurchase.downloadToken = `token_${userId}_${bookSlug}_${Date.now()}`;
      console.log(`[DB MOCK] Re-activated purchase for user ${userId}, book ${bookSlug}`);
      return { purchase: existingPurchase, isNew: false };
    }

    // Case 2: Creating a new purchase
    const newPurchase: Purchase = {
      userId,
      bookSlug,
      purchaseId: Math.floor(Math.random() * 90000) + 10000,
      downloadToken: `token_${userId}_${bookSlug}_${Date.now()}`,
      status: 'active'
    };
    userPurchases.set(bookSlug, newPurchase);
    console.log(`[DB MOCK] New purchase added for user ${userId}, book ${bookSlug}`);
    return { purchase: newPurchase, isNew: true };
  },

  /**
   * Gets all active purchases for a specific user.
   * @param userId - The ID of the user.
   * @returns An array of active purchase records.
   */
  getUserPurchases: (userId: string | number): Purchase[] => {
    const userPurchasesMap = purchases.get(userId);
    if (!userPurchasesMap) return [];
    // Only return active books to the "My Books" page
    return Array.from(userPurchasesMap.values()).filter(p => p.status === 'active');
  },

  /**
   * Finds an active purchase record by its unique download token.
   * @param token - The download token.
   * @returns The purchase record if found and active, otherwise undefined.
   */
  findPurchaseByToken: (token: string): Purchase | undefined => {
      for (const userPurchases of purchases.values()) {
          for (const purchase of userPurchases.values()) {
              if (purchase.downloadToken === token && purchase.status === 'active') {
                  return purchase;
              }
          }
      }
      return undefined;
  }
};
