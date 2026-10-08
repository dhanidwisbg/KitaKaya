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

export type LucideIconName =
  | "Briefcase"
  | "Laptop"
  | "TrendingUp"
  | "Gift"
  | "Coins"
  | "UtensilsCrossed"
  | "Car"
  | "ShoppingBag"
  | "Gamepad2"
  | "HeartPulse"
  | "GraduationCap"
  | "Zap"
  | "Home"
  | "ShieldCheck"
  | "PiggyBank"
  | "Package";

// ---- Category helpers ----
export const CATEGORY_CONFIG: Record<
  TransactionCategory,
  {
    label: string;
    icon: string;
    lucideIcon: LucideIconName;
    color: string;
    type: "income" | "expense" | "both";
  }
> = {
  // Income
  salary:        { label: "Gaji",         icon: "💼", lucideIcon: "Briefcase",       color: "#009a3b", type: "income" },
  freelance:     { label: "Freelance",    icon: "💻", lucideIcon: "Laptop",          color: "#005ab7", type: "income" },
  investment:    { label: "Investasi",    icon: "📈", lucideIcon: "TrendingUp",      color: "#005ab7", type: "income" },
  gift:          { label: "Hadiah",       icon: "🎁", lucideIcon: "Gift",            color: "#d97706", type: "income" },
  other_income:  { label: "Lainnya",      icon: "💰", lucideIcon: "Coins",           color: "#1d1d1f", type: "income" },
  // Expense
  food:          { label: "Makanan & Minuman", icon: "🍜", lucideIcon: "UtensilsCrossed", color: "#e11d48", type: "expense" },
  transport:     { label: "Transportasi",      icon: "🚗", lucideIcon: "Car",             color: "#d97706", type: "expense" },
  shopping:      { label: "Belanja",           icon: "🛍️", lucideIcon: "ShoppingBag",     color: "#7c3aed", type: "expense" },
  entertainment: { label: "Hiburan & Rekreasi",icon: "🎮", lucideIcon: "Gamepad2",        color: "#db2777", type: "expense" },
  health:        { label: "Kesehatan",         icon: "🏥", lucideIcon: "HeartPulse",      color: "#059669", type: "expense" },
  education:     { label: "Pendidikan & Buku", icon: "📚", lucideIcon: "GraduationCap",   color: "#2563eb", type: "expense" },
  utilities:     { label: "Tagihan & Utilitas",icon: "⚡", lucideIcon: "Zap",             color: "#ca8a04", type: "expense" },
  rent:          { label: "Sewa / Properti",   icon: "🏠", lucideIcon: "Home",            color: "#4b5563", type: "expense" },
  insurance:     { label: "Asuransi & Proteksi",icon: "🛡️", lucideIcon: "ShieldCheck",    color: "#475569", type: "expense" },
  savings:       { label: "Kantong Tabungan",  icon: "🏦", lucideIcon: "PiggyBank",      color: "#005ab7", type: "both" },
  other_expense: { label: "Lainnya",           icon: "📦", lucideIcon: "Package",        color: "#6b7280", type: "expense" },
};

export function getCategoryConfig(category: TransactionCategory) {
  return (
    CATEGORY_CONFIG[category] ?? {
      label: category,
      icon: "📦",
      lucideIcon: "Package" as LucideIconName,
      color: "#6b7280",
      type: "expense" as const,
    }
  );
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
