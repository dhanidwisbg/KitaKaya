// IndexedDB Database for KitaKaya
// Local storage with export/import capabilities

const DB_NAME = "kitakaya_db";
const DB_VERSION = 1;

// Database stores
export const STORES = {
  USERS: "users",
  TRANSACTIONS: "transactions",
  GOALS: "goals",
  SAVINGS: "savings",
  CATEGORIES: "categories",
  SETTINGS: "settings",
} as const;

// Types
export interface User {
  id: string;
  name: string;
  email?: string;
  currency: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  category: string;
  status: "active" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface Saving {
  id: string;
  user_id: string;
  goal_id: string;
  amount: number;
  date: string;
  note?: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
  created_at: string;
}

export interface Settings {
  id: string;
  user_id: string;
  theme: "light" | "dark";
  currency: string;
  language: string;
  notifications: boolean;
  created_at: string;
  updated_at: string;
}

// Database class
class KitaKayaDB {
  private db: IDBDatabase | null = null;

  // Initialize database (only in browser)
  async init(): Promise<IDBDatabase> {
    // Check if running in browser
    if (typeof window === "undefined" || typeof indexedDB === "undefined") {
      throw new Error("IndexedDB is only available in browser environment");
    }

    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Users store
        if (!db.objectStoreNames.contains(STORES.USERS)) {
          const userStore = db.createObjectStore(STORES.USERS, { keyPath: "id" });
          userStore.createIndex("email", "email", { unique: false });
        }

        // Transactions store
        if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
          const txStore = db.createObjectStore(STORES.TRANSACTIONS, { keyPath: "id" });
          txStore.createIndex("user_id", "user_id", { unique: false });
          txStore.createIndex("date", "date", { unique: false });
          txStore.createIndex("category", "category", { unique: false });
        }

        // Goals store
        if (!db.objectStoreNames.contains(STORES.GOALS)) {
          const goalStore = db.createObjectStore(STORES.GOALS, { keyPath: "id" });
          goalStore.createIndex("user_id", "user_id", { unique: false });
          goalStore.createIndex("status", "status", { unique: false });
        }

        // Savings store
        if (!db.objectStoreNames.contains(STORES.SAVINGS)) {
          const savingStore = db.createObjectStore(STORES.SAVINGS, { keyPath: "id" });
          savingStore.createIndex("user_id", "user_id", { unique: false });
          savingStore.createIndex("goal_id", "goal_id", { unique: false });
        }

        // Categories store
        if (!db.objectStoreNames.contains(STORES.CATEGORIES)) {
          const catStore = db.createObjectStore(STORES.CATEGORIES, { keyPath: "id" });
          catStore.createIndex("user_id", "user_id", { unique: false });
        }

        // Settings store
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: "id" });
        }
      };
    });
  }

  // Generic add
  async add<T>(storeName: string, data: T): Promise<T> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  }

  // Generic get
  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Generic get all
  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get by index
  async getByIndex<T>(
    storeName: string,
    indexName: string,
    value: string
  ): Promise<T[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Generic update
  async update<T>(storeName: string, data: T): Promise<T> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  }

  // Generic delete
  async delete(storeName: string, id: string): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Clear store
  async clear(storeName: string): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Export all data
  async exportAll(): Promise<{
    users: User[];
    transactions: Transaction[];
    goals: Goal[];
    savings: Saving[];
    categories: Category[];
    settings: Settings[];
  }> {
    return {
      users: await this.getAll<User>(STORES.USERS),
      transactions: await this.getAll<Transaction>(STORES.TRANSACTIONS),
      goals: await this.getAll<Goal>(STORES.GOALS),
      savings: await this.getAll<Saving>(STORES.SAVINGS),
      categories: await this.getAll<Category>(STORES.CATEGORIES),
      settings: await this.getAll<Settings>(STORES.SETTINGS),
    };
  }

  // Import data
  async importData(data: {
    users?: User[];
    transactions?: Transaction[];
    goals?: Goal[];
    savings?: Saving[];
    categories?: Category[];
    settings?: Settings[];
  }): Promise<void> {
    if (data.users) {
      for (const user of data.users) {
        await this.update(STORES.USERS, user);
      }
    }
    if (data.transactions) {
      for (const tx of data.transactions) {
        await this.update(STORES.TRANSACTIONS, tx);
      }
    }
    if (data.goals) {
      for (const goal of data.goals) {
        await this.update(STORES.GOALS, goal);
      }
    }
    if (data.savings) {
      for (const saving of data.savings) {
        await this.update(STORES.SAVINGS, saving);
      }
    }
    if (data.categories) {
      for (const cat of data.categories) {
        await this.update(STORES.CATEGORIES, cat);
      }
    }
    if (data.settings) {
      for (const setting of data.settings) {
        await this.update(STORES.SETTINGS, setting);
      }
    }
  }
}

// Export singleton instance
export const db = new KitaKayaDB();

// Helper functions
export function generateId(): string {
  return ${Date.now()}-;
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
