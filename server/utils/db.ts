// A mock in-memory database to simulate storing user purchases and book data.

// --- Interfaces ---
interface Purchase {
  userId: string | number;
  bookSlug: string;
  purchaseId: number;
  downloadToken: string;
}

interface Book {
  slug: string;
  title: string;
  // ... other book properties
}


// --- In-memory Data Store ---
// Using a Map for efficient lookups. Key: userId, Value: Map<bookSlug, Purchase>
const purchases = new Map<string | number, Map<string, Purchase>>();


// --- Mock Data Initialization ---
// Pre-populate with some data for a default user (e.g., user with id 1) for testing.
const initialUserPurchases = new Map<string, Purchase>();
initialUserPurchases.set('savushun', {
    userId: 1,
    bookSlug: 'savushun',
    purchaseId: 101,
    downloadToken: 'unique_download_token_for_user_1_and_book_savushun'
});
purchases.set(1, initialUserPurchases);


// --- Database Interaction Logic ---
export const db = {
  /**
   * Checks if a user has purchased a specific book.
   * @param userId - The ID of the user.
   * @param bookSlug - The slug of the book.
   * @returns True if the book has been purchased, false otherwise.
   */
  hasPurchased: (userId: string | number, bookSlug: string): boolean => {
    return purchases.get(userId)?.has(bookSlug) ?? false;
  },

  /**
   * Adds a new purchase record for a user.
   * @param userId - The ID of the user.
   * @param bookSlug - The slug of the book being purchased.
   * @returns The newly created purchase record.
   */
  addPurchase: (userId: string | number, bookSlug: string): Purchase => {
    if (!purchases.has(userId)) {
      purchases.set(userId, new Map<string, Purchase>());
    }

    const userPurchases = purchases.get(userId)!;

    // This check should be done before calling addPurchase, but it's a safeguard.
    if (userPurchases.has(bookSlug)) {
        return userPurchases.get(bookSlug)!;
    }

    const newPurchase: Purchase = {
      userId,
      bookSlug,
      purchaseId: Math.floor(Math.random() * 90000) + 10000,
      downloadToken: `token_${userId}_${bookSlug}_${Date.now()}`
    };

    userPurchases.set(bookSlug, newPurchase);
    console.log(`[DB MOCK] New purchase added for user ${userId}, book ${bookSlug}`);
    return newPurchase;
  },

  /**
   * Gets all purchases for a specific user.
   * @param userId - The ID of the user.
   * @returns An array of purchase records.
   */
  getUserPurchases: (userId: string | number): Purchase[] => {
    const userPurchasesMap = purchases.get(userId);
    return userPurchasesMap ? Array.from(userPurchasesMap.values()) : [];
  },

  /**
   * Finds a purchase record by its unique download token.
   * @param token - The download token.
   * @returns The purchase record if found, otherwise undefined.
   */
  findPurchaseByToken: (token: string): Purchase | undefined => {
      for (const userPurchases of purchases.values()) {
          for (const purchase of userPurchases.values()) {
              if (purchase.downloadToken === token) {
                  return purchase;
              }
          }
      }
      return undefined;
  }
};
