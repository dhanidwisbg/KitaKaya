import { useState, useEffect, useCallback } from "react";
import { db, generateId, formatDate } from "./indexeddb";
import type { User, Transaction, Goal, Saving, Category, Settings } from "./indexeddb";

// Check if running in browser
const isBrowser = typeof window !== "undefined";

// Hook for User operations
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isBrowser) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    if (!isBrowser) return;
    try {
      const users = await db.getAll<User>("users");
      if (users.length > 0) {
        setUser(users[0]);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (name: string, email?: string): Promise<User> => {
    const newUser: User = {
      id: generateId(),
      name,
      email,
      currency: "IDR",
      onboarding_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isBrowser) {
      await db.add("users", newUser);
    }
    setUser(newUser);
    return newUser;
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
    if (isBrowser) {
      await db.update("users", updated);
    }
    setUser(updated);
  };

  return { user, loading, createUser, updateUser, reloadUser: loadUser };
}

// Hook for Transactions
export function useTransactions(userId: string | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && isBrowser) {
      loadTransactions();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadTransactions = async () => {
    if (!userId || !isBrowser) return;
    try {
      const all = await db.getByIndex<Transaction>("transactions", "user_id", userId);
      setTransactions(all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (data: Omit<Transaction, "id" | "user_id" | "created_at">) => {
    if (!userId) return;
    const newTx: Transaction = {
      ...data,
      id: generateId(),
      user_id: userId,
      created_at: new Date().toISOString(),
    };
    if (isBrowser) {
      await db.add("transactions", newTx);
      await loadTransactions();
    }
    return newTx;
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;
    const updated = { ...tx, ...updates };
    if (isBrowser) {
      await db.update("transactions", updated);
      await loadTransactions();
    }
  };

  const deleteTransaction = async (id: string) => {
    if (isBrowser) {
      await db.delete("transactions", id);
      await loadTransactions();
    }
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    reload: loadTransactions,
  };
}

// Hook for Goals
export function useGoals(userId: string | undefined) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && isBrowser) {
      loadGoals();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadGoals = async () => {
    if (!userId || !isBrowser) return;
    try {
      const all = await db.getByIndex<Goal>("goals", "user_id", userId);
      setGoals(all.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime()));
    } catch (error) {
      console.error("Failed to load goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (data: Omit<Goal, "id" | "user_id" | "current_amount" | "status" | "created_at" | "updated_at">) => {
    if (!userId) return;
    const newGoal: Goal = {
      ...data,
      id: generateId(),
      user_id: userId,
      current_amount: 0,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isBrowser) {
      await db.add("goals", newGoal);
      await loadGoals();
    }
    return newGoal;
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    const updated = { ...goal, ...updates, updated_at: new Date().toISOString() };
    if (isBrowser) {
      await db.update("goals", updated);
      await loadGoals();
    }
  };

  const deleteGoal = async (id: string) => {
    if (isBrowser) {
      await db.delete("goals", id);
      await loadGoals();
    }
  };

  return { goals, loading, addGoal, updateGoal, deleteGoal, reload: loadGoals };
}

// Hook for Savings
export function useSavings(goalId: string | undefined) {
  const [savings, setSavings] = useState<Saving[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (goalId && isBrowser) {
      loadSavings();
    } else {
      setLoading(false);
    }
  }, [goalId]);

  const loadSavings = async () => {
    if (!goalId || !isBrowser) return;
    try {
      const all = await db.getByIndex<Saving>("savings", "goal_id", goalId);
      setSavings(all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error("Failed to load savings:", error);
    } finally {
      setLoading(false);
    }
  };

  const addSaving = async (userId: string, amount: number, note?: string) => {
    if (!goalId) return;
    const newSaving: Saving = {
      id: generateId(),
      user_id: userId,
      goal_id: goalId,
      amount,
      date: formatDate(new Date()),
      note,
      created_at: new Date().toISOString(),
    };
    if (isBrowser) {
      await db.add("savings", newSaving);
      await loadSavings();
    }
    return newSaving;
  };

  return { savings, loading, addSaving, reload: loadSavings };
}

// Hook for Categories
export function useCategories(userId: string | undefined) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && isBrowser) {
      loadCategories();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadCategories = async () => {
    if (!userId || !isBrowser) return;
    try {
      const all = await db.getByIndex<Category>("categories", "user_id", userId);
      setCategories(all);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (data: Omit<Category, "id" | "user_id" | "created_at">) => {
    if (!userId) return;
    const newCat: Category = {
      ...data,
      id: generateId(),
      user_id: userId,
      created_at: new Date().toISOString(),
    };
    if (isBrowser) {
      await db.add("categories", newCat);
      await loadCategories();
    }
    return newCat;
  };

  return { categories, loading, addCategory, reload: loadCategories };
}

// Hook for Settings
export function useSettings(userId: string | undefined) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && isBrowser) {
      loadSettings();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadSettings = async () => {
    if (!userId || !isBrowser) return;
    try {
      const all = await db.getAll<Settings>("settings");
      const userSettings = all.find(s => s.user_id === userId);
      if (userSettings) {
        setSettings(userSettings);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    if (!userId || !settings) return;
    const updated = { ...settings, ...updates, updated_at: new Date().toISOString() };
    if (isBrowser) {
      await db.update("settings", updated);
    }
    setSettings(updated);
  };

  const createSettings = async (): Promise<Settings> => {
    if (!userId) throw new Error("User ID required");
    const newSettings: Settings = {
      id: generateId(),
      user_id: userId,
      theme: "light",
      currency: "IDR",
      language: "id",
      notifications: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isBrowser) {
      await db.add("settings", newSettings);
    }
    setSettings(newSettings);
    return newSettings;
  };

  return { settings, loading, updateSettings, createSettings };
}

// Hook for Export/Import
export function useDatabase() {
  const exportData = useCallback(async () => {
    if (!isBrowser) return;
    const data = await db.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = kitakaya-backup-.json;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importData = useCallback(async (file: File) => {
    return new Promise((resolve, reject) => {
      if (!isBrowser) {
        reject(new Error("Import only available in browser"));
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          await db.importData(data);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  }, []);

  return { exportData, importData };
}
