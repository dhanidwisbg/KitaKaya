// ============================================================
// KitaKaya — Pure Browser Storage Engine (localStorage)
// ============================================================
"use client";

import {
  User,
  Transaction,
  SavingsGoal,
  SavingsTransaction,
} from "./types/database.types";
import { setClientUserId, clearClientUserId } from "./session-client";

const KEY_USER = "kitakaya_local_user";
const KEY_TRANSACTIONS = "kitakaya_local_transactions";
const KEY_GOALS = "kitakaya_local_goals";
const KEY_SAVINGS_TX = "kitakaya_local_savings_tx";
const STORAGE_EVENT = "kitakaya_storage_change";

// ---- Default Fresh User (Blank Slate — no dummy data) ----
const DEFAULT_USER: User = {
  id: "usr_local_primary",
  email: "",
  full_name: "",
  avatar_url: null,
  monthly_income: 0,
  monthly_budget: 0,
  currency: "IDR",
  timezone: "Asia/Jakarta",
  onboarding_completed: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEFAULT_TRANSACTIONS: Transaction[] = [];
const DEFAULT_GOALS: SavingsGoal[] = [];


// ---- Event Notification Helper ----
function notifyChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }
}

export function subscribeStorage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(STORAGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(STORAGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

// ---- Safe JSON Storage Read/Write ----
function getLocal<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Gagal membaca storage key ${key}:`, e);
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Gagal menulis storage key ${key}:`, e);
  }
}

// ============================================================
// User Profile API
// ============================================================
export function getStoredUser(): User {
  if (typeof window === "undefined") return DEFAULT_USER;
  const user = getLocal<User | null>(KEY_USER, null);
  if (!user) {
    setLocal(KEY_USER, DEFAULT_USER);
    setClientUserId(DEFAULT_USER.id);
    return DEFAULT_USER;
  }

  // Migration: wipe old dummy seed data so user goes through onboarding
  if (user.email === "dhani@kitakaya.id" && user.full_name === "Dhani") {
    localStorage.removeItem(KEY_USER);
    localStorage.removeItem(KEY_TRANSACTIONS);
    localStorage.removeItem(KEY_GOALS);
    localStorage.removeItem(KEY_SAVINGS_TX);
    setLocal(KEY_USER, DEFAULT_USER);
    setClientUserId(DEFAULT_USER.id);
    return DEFAULT_USER;
  }

  setClientUserId(user.id);
  return user;
}

export function saveStoredUser(updates: Partial<User>): User {
  const current = getStoredUser();
  const updated: User = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  setLocal(KEY_USER, updated);
  setClientUserId(updated.id);
  notifyChange();
  return updated;
}

export function initUserWithName(name: string): User {
  const cleanName = name.trim();
  const current = getStoredUser();
  // Only mark fully onboarded if income is already configured (returning user after logout).
  // New users (income = 0) will still need to complete the income/budget step on dashboard.
  const isReturningUser = (current.monthly_income ?? 0) > 0;
  const updated: User = {
    ...current,
    full_name: cleanName || "Pengguna",
    onboarding_completed: isReturningUser,
    updated_at: new Date().toISOString(),
  };
  setLocal(KEY_USER, updated);
  setClientUserId(updated.id);
  notifyChange();
  return updated;
}

export function clearUserSession(): void {
  clearClientUserId();
  notifyChange();
}

// ============================================================
// Transactions API
// ============================================================
export function getStoredTransactions(): Transaction[] {
  if (typeof window === "undefined") return DEFAULT_TRANSACTIONS;
  const list = getLocal<Transaction[] | null>(KEY_TRANSACTIONS, null);
  if (!list) {
    setLocal(KEY_TRANSACTIONS, DEFAULT_TRANSACTIONS);
    return DEFAULT_TRANSACTIONS;
  }
  return list;
}

export function addStoredTransaction(
  data: Omit<Transaction, "id" | "created_at" | "updated_at" | "is_ai_generated"> & {
    is_ai_generated?: boolean;
    created_at?: string;
    updated_at?: string;
  }
): Transaction {
  const current = getStoredTransactions();
  const now = new Date().toISOString();
  const newTx: Transaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: data.user_id,
    type: data.type,
    category: data.category,
    amount: data.amount,
    description: data.description,
    note: data.note ?? null,
    date: data.date || now.split("T")[0],
    is_ai_generated: data.is_ai_generated ?? false,
    created_at: data.created_at || now,
    updated_at: data.updated_at || now,
  };
  const updated = [newTx, ...current];
  setLocal(KEY_TRANSACTIONS, updated);
  notifyChange();
  return newTx;
}

export function updateStoredTransaction(
  id: string,
  data: Partial<Omit<Transaction, "id" | "created_at">>
): Transaction | null {
  const current = getStoredTransactions();
  const idx = current.findIndex((t) => t.id === id);
  if (idx === -1) return null;

  const updatedTx: Transaction = {
    ...current[idx],
    ...data,
    updated_at: new Date().toISOString(),
  };
  current[idx] = updatedTx;
  setLocal(KEY_TRANSACTIONS, [...current]);
  notifyChange();
  return updatedTx;
}

export function deleteStoredTransaction(id: string): boolean {
  const current = getStoredTransactions();
  const filtered = current.filter((t) => t.id !== id);
  if (filtered.length === current.length) return false;
  setLocal(KEY_TRANSACTIONS, filtered);
  notifyChange();
  return true;
}

// ============================================================
// Savings Goals API
// ============================================================
export function getStoredGoals(): SavingsGoal[] {
  if (typeof window === "undefined") return DEFAULT_GOALS;
  const list = getLocal<SavingsGoal[] | null>(KEY_GOALS, null);
  if (!list) {
    setLocal(KEY_GOALS, DEFAULT_GOALS);
    return DEFAULT_GOALS;
  }
  return list;
}

export function addStoredGoal(
  data: Omit<SavingsGoal, "id" | "created_at" | "updated_at">
): SavingsGoal {
  const current = getStoredGoals();
  const now = new Date().toISOString();
  const newGoal: SavingsGoal = {
    id: `goal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...data,
    is_completed: data.is_completed ?? false,
    created_at: now,
    updated_at: now,
  };
  const updated = [newGoal, ...current];
  setLocal(KEY_GOALS, updated);
  notifyChange();
  return newGoal;
}

export function updateStoredGoal(
  id: string,
  data: Partial<Omit<SavingsGoal, "id" | "created_at">>
): SavingsGoal | null {
  const current = getStoredGoals();
  const idx = current.findIndex((g) => g.id === id);
  if (idx === -1) return null;

  const updatedGoal: SavingsGoal = {
    ...current[idx],
    ...data,
    updated_at: new Date().toISOString(),
  };
  current[idx] = updatedGoal;
  setLocal(KEY_GOALS, [...current]);
  notifyChange();
  return updatedGoal;
}

export function deleteStoredGoal(id: string): boolean {
  const current = getStoredGoals();
  const filtered = current.filter((g) => g.id !== id);
  if (filtered.length === current.length) return false;
  setLocal(KEY_GOALS, filtered);
  notifyChange();
  return true;
}

export function depositToStoredGoal(
  goalId: string,
  amount: number,
  note?: string
): { goal: SavingsGoal | null; tx: SavingsTransaction } {
  const goals = getStoredGoals();
  const idx = goals.findIndex((g) => g.id === goalId);
  const now = new Date().toISOString();
  const user = getStoredUser();

  const savingsTx: SavingsTransaction = {
    id: `stx_${Date.now()}`,
    goal_id: goalId,
    user_id: user.id,
    amount,
    note: note || null,
    created_at: now,
  };

  const currentSavingsTx = getLocal<SavingsTransaction[]>(KEY_SAVINGS_TX, []);
  setLocal(KEY_SAVINGS_TX, [savingsTx, ...currentSavingsTx]);

  if (idx === -1) {
    return { goal: null, tx: savingsTx };
  }

  const newCurrentAmount = goals[idx].current_amount + amount;
  const isCompleted = newCurrentAmount >= goals[idx].target_amount;

  const updatedGoal: SavingsGoal = {
    ...goals[idx],
    current_amount: newCurrentAmount,
    is_completed: isCompleted,
    updated_at: now,
  };

  goals[idx] = updatedGoal;
  setLocal(KEY_GOALS, [...goals]);
  notifyChange();

  return { goal: updatedGoal, tx: savingsTx };
}

// ============================================================
// Backup, Import & Reset API
// ============================================================
export function resetAllStorageToDefault(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_USER, JSON.stringify(DEFAULT_USER));
  localStorage.setItem(KEY_TRANSACTIONS, JSON.stringify(DEFAULT_TRANSACTIONS));
  localStorage.setItem(KEY_GOALS, JSON.stringify(DEFAULT_GOALS));
  localStorage.removeItem(KEY_SAVINGS_TX);
  setClientUserId(DEFAULT_USER.id);
  notifyChange();
}

export function exportAllDataToJson(): string {
  const backup = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    user: getStoredUser(),
    transactions: getStoredTransactions(),
    goals: getStoredGoals(),
    savingsTransactions: getLocal<SavingsTransaction[]>(KEY_SAVINGS_TX, []),
  };
  return JSON.stringify(backup, null, 2);
}

export function importAllDataFromJson(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== "object") return false;

    if (parsed.user) setLocal(KEY_USER, parsed.user);
    if (Array.isArray(parsed.transactions)) setLocal(KEY_TRANSACTIONS, parsed.transactions);
    if (Array.isArray(parsed.goals)) setLocal(KEY_GOALS, parsed.goals);
    if (Array.isArray(parsed.savingsTransactions)) {
      setLocal(KEY_SAVINGS_TX, parsed.savingsTransactions);
    }

    const user = getStoredUser();
    if (user?.id) setClientUserId(user.id);

    notifyChange();
    return true;
  } catch (e) {
    console.error("Gagal mengimpor data JSON:", e);
    return false;
  }
}
