import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { id } from "date-fns/locale";
import { TransactionCategory } from "./types/database.types";

// ---- Tailwind className merge ----
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---- Currency Formatting ----
export function formatCurrency(amount: number, compact = false): string {
  if (compact && amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}jt`;
  }
  if (compact && amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}rb`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ---- Date helpers ----
export function thisMonthRange() {
  const now = new Date();
  return {
    start: format(startOfMonth(now), "yyyy-MM-dd"),
    end: format(endOfMonth(now), "yyyy-MM-dd"),
  };
}

export function formatDate(date: string | Date, fmt = "d MMM yyyy"): string {
  return format(new Date(date), fmt, { locale: id });
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), "d MMM", { locale: id });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat pagi ☀️";
  if (hour < 15) return "Selamat siang 🌤️";
  if (hour < 18) return "Selamat sore 🌇";
  return "Selamat malam 🌙";
}

// ---- Category helpers ----
export const CATEGORY_CONFIG: Record<
  TransactionCategory,
  { label: string; icon: string; color: string; type: "income" | "expense" | "both" }
> = {
  // Income
  salary:         { label: "Gaji",         icon: "💼", color: "#34C759", type: "income" },
  freelance:      { label: "Freelance",    icon: "💻", color: "#30D158", type: "income" },
  investment:     { label: "Investasi",    icon: "📈", color: "#007AFF", type: "income" },
  gift:           { label: "Hadiah",       icon: "🎁", color: "#FF9500", type: "income" },
  other_income:   { label: "Lainnya",      icon: "💰", color: "#AF52DE", type: "income" },
  // Expense
  food:           { label: "Makanan",      icon: "🍜", color: "#FF3B30", type: "expense" },
  transport:      { label: "Transport",    icon: "🚗", color: "#FF9500", type: "expense" },
  shopping:       { label: "Belanja",      icon: "🛍️", color: "#AF52DE", type: "expense" },
  entertainment:  { label: "Hiburan",      icon: "🎮", color: "#FF2D55", type: "expense" },
  health:         { label: "Kesehatan",    icon: "🏥", color: "#34C759", type: "expense" },
  education:      { label: "Pendidikan",   icon: "📚", color: "#007AFF", type: "expense" },
  utilities:      { label: "Tagihan",      icon: "⚡", color: "#FFD60A", type: "expense" },
  rent:           { label: "Sewa/Kos",     icon: "🏠", color: "#8E8E93", type: "expense" },
  insurance:      { label: "Asuransi",     icon: "🛡️", color: "#636366", type: "expense" },
  savings:        { label: "Tabungan",     icon: "🏦", color: "#007AFF", type: "both" },
  other_expense:  { label: "Lainnya",      icon: "📦", color: "#8E8E93", type: "expense" },
};

export function getCategoryConfig(category: TransactionCategory) {
  return CATEGORY_CONFIG[category] ?? {
    label: category,
    icon: "📦",
    color: "#8E8E93",
    type: "expense",
  };
}

// ---- Number helpers ----
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function progressPercent(current: number, target: number) {
  if (target <= 0) return 0;
  return clamp(Math.round((current / target) * 100), 0, 100);
}

// ---- String helpers ----
export function truncate(str: string, length = 30) {
  return str.length > length ? str.slice(0, length) + "…" : str;
}

export function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
