"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  getStoredUser,
  getStoredTransactions,
  getStoredGoals,
  subscribeStorage,
} from "@/lib/storage";
import { Transaction, SavingsGoal, User } from "@/lib/types/database.types";
import CategoryIcon from "@/components/ui/CategoryIcon";
import Link from "next/link";
import {
  TrendingUp,
  Plus,
  Minus,
  ArrowRight,
  Shield,
  FileDown,
  Wallet,
  PiggyBank,
  ReceiptText,
  Sparkles,
  Target,
  BarChart3,
} from "lucide-react";
import FloatingAiWidget from "@/components/dashboard/FloatingAiWidget";
import TransactionModal from "@/components/transactions/TransactionModal";
import OnboardingCard from "@/components/dashboard/OnboardingCard";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txModalType, setTxModalType] = useState<"income" | "expense">("expense");
  const [isReady, setIsReady] = useState(false);

  const loadData = () => {
    setUser(getStoredUser());
    setTransactions(getStoredTransactions());
    setGoals(getStoredGoals());
    setIsReady(true);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeStorage(() => {
      loadData();
    });
    return unsubscribe;
  }, []);

  const userName = user?.full_name?.split(" ")[0] || "";
  const isOnboarded = user?.onboarding_completed === true;

  // Live financial calculations (only real data)
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate =
    totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0;
  const budgetUsedPct =
    user?.monthly_budget && user.monthly_budget > 0
      ? Math.min(100, Math.round((totalExpense / user.monthly_budget) * 100))
      : 0;

  const todayStr = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  // Category breakdown for expenses
  const categoryExpenses: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
    });

  // ── LOADING SKELETON ──────────────────────────────────────────
  if (!isReady) {
    return (
      <div className="flex flex-col gap-6 animate-pulse pb-16">
        <div className="h-20 rounded-3xl bg-surface-container-high/40" />
        <div className="h-48 rounded-3xl bg-surface-container-high/40" />
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 rounded-3xl bg-surface-container-high/40" />
          ))}
        </div>
      </div>
    );
  }

  // ── ONBOARDING FLOW (New User) ────────────────────────────────
  if (!isOnboarded) {
    return (
      <div className="flex flex-col w-full pb-16 animate-fade-in">
        <div className="max-w-2xl mx-auto w-full pt-4 space-y-6">
          {/* Welcome hero text */}
          <div className="text-center space-y-2 pb-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high border border-surface-container-highest text-[11px] font-bold uppercase tracking-wider text-outline">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {todayStr}
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              Selamat datang di KitaKaya 👋
            </h1>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">
              Yuk lengkapi setup awal supaya dashboardmu bisa menampilkan analisis keuangan yang akurat.
            </p>
          </div>

          {/* Onboarding wizard card */}
          <OnboardingCard initialName={userName} onComplete={loadData} />

          {/* Bottom reassurance */}
          <div className="flex items-center justify-center gap-3 text-xs text-outline">
            <Shield className="w-4 h-4" />
            <span>Data tersimpan 100% di browser · Tidak ada akun · Tidak ada server</span>
          </div>
        </div>
      </div>
    );
  }

  // ── EMPTY STATE (Onboarded but no data yet) ───────────────────
  if (transactions.length === 0 && goals.length === 0) {
    return (
      <div className="flex flex-col w-full pb-16 animate-fade-in space-y-8">
        {/* Greeting */}
        <section className="relative overflow-hidden pt-2">
          <div className="absolute -top-12 -right-8 pointer-events-none select-none opacity-[0.025] font-headline text-[180px] leading-none tracking-tighter text-primary">
            KAYA
          </div>
          <div className="flex flex-col gap-3 relative z-10">
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant shadow-sm border border-surface-container-highest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider uppercase">
                {todayStr} • Data Lokal Aktif
              </span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary">
              Halo, {userName}.
            </h1>
            <p className="text-sm text-on-surface-variant">
              Dashboardmu siap. Mulai dengan mencatat transaksi pertamamu.
            </p>
          </div>
        </section>

        {/* Empty state cards grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quick summary placeholders */}
            {[
              {
                label: "Pemasukan Bulan Ini",
                value: user?.monthly_income
                  ? `Target: ${formatCurrency(user.monthly_income)}`
                  : "Belum ada catatan",
                hint: "Catat gaji atau pemasukan lainnya",
                color: "text-tertiary-on-container",
              },
              {
                label: "Pengeluaran Bulan Ini",
                value: "Rp 0",
                hint: "Belum ada pengeluaran tercatat",
                color: "text-primary",
              },
              {
                label: "Rasio Tabungan",
                value: "—",
                hint: "Muncul setelah ada transaksi",
                color: "text-outline",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 border-dashed flex flex-col gap-1.5"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
                  {card.label}
                </span>
                <span className={`font-headline text-2xl font-bold ${card.color} tabular-nums`}>
                  {card.value}
                </span>
                <span className="text-xs text-outline">{card.hint}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Action shortcuts */}
        <section>
          <p className="text-[11px] font-bold uppercase tracking-widest text-outline mb-4">
            Mulai dari sini
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => {
                setTxModalType("income");
                setIsTxModalOpen(true);
              }}
              className="group p-5 rounded-3xl bg-primary text-white flex flex-col gap-3 hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-sm text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">Catat Pemasukan</p>
                <p className="text-xs text-white/60 mt-0.5">Gaji, freelance, bonus...</p>
              </div>
            </button>

            <button
              onClick={() => {
                setTxModalType("expense");
                setIsTxModalOpen(true);
              }}
              className="group p-5 rounded-3xl bg-surface-container-lowest border border-surface-container-high/60 flex flex-col gap-3 hover:border-primary/40 hover:bg-surface-container-low active:scale-[0.98] transition-all text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center">
                <Minus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">Catat Pengeluaran</p>
                <p className="text-xs text-outline mt-0.5">Makan, transport, tagihan...</p>
              </div>
            </button>

            <Link
              href="/goals"
              className="group p-5 rounded-3xl bg-surface-container-lowest border border-surface-container-high/60 flex flex-col gap-3 hover:border-primary/40 hover:bg-surface-container-low active:scale-[0.98] transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">Buat Kantong Tabungan</p>
                <p className="text-xs text-outline mt-0.5">Dana darurat, gadget, liburan...</p>
              </div>
            </Link>

            <Link
              href="/transactions"
              className="group p-5 rounded-3xl bg-surface-container-lowest border border-surface-container-high/60 flex flex-col gap-3 hover:border-primary/40 hover:bg-surface-container-low active:scale-[0.98] transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center">
                <ReceiptText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">Input via AI</p>
                <p className="text-xs text-outline mt-0.5">"Kopi Kenangan 28rb" otomatis tercatat</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Budget reminder if set */}
        {user?.monthly_income && user.monthly_income > 0 && (
          <section className="rounded-3xl bg-surface-container-low border border-surface-container-high/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-surface-container-lowest border border-surface-container-high flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary">
                  Target Pemasukan Bulanan: {formatCurrency(user.monthly_income)}
                </p>
                {user.monthly_budget > 0 && (
                  <p className="text-[11px] text-outline mt-0.5">
                    Batas Pengeluaran: {formatCurrency(user.monthly_budget)} ·{" "}
                    Target Tabungan: {formatCurrency(user.monthly_income - user.monthly_budget)}
                  </p>
                )}
              </div>
            </div>
            <Link
              href="/settings"
              className="text-xs font-bold text-secondary hover:underline shrink-0"
            >
              Edit Profil →
            </Link>
          </section>
        )}

        <FloatingAiWidget userName={userName} />
        <TransactionModal
          isOpen={isTxModalOpen}
          onClose={() => setIsTxModalOpen(false)}
          onSuccess={loadData}
        />
      </div>
    );
  }

  // ── FULL DASHBOARD (Has Data) ─────────────────────────────────
  return (
    <div className="flex flex-col w-full pb-16 animate-fade-in space-y-8">
      {/* 1. Top Greeting */}
      <section className="relative overflow-hidden pt-2 pb-2">
        <div className="absolute -top-12 -right-8 pointer-events-none select-none opacity-[0.025] font-headline text-[180px] leading-none tracking-tighter text-primary">
          KAYA
        </div>
        <div className="flex flex-col gap-3 relative z-10">
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant shadow-sm border border-surface-container-highest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {todayStr} • Data Lokal Aktif
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary">
                Halo, {userName}.
              </h1>
              <p className="text-sm md:text-base text-on-surface-variant max-w-xl mt-1">
                Kekayaan bersih dan arus kas Anda tersimpan privat di browser ini.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-surface-container-high self-start md:self-auto">
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary text-white shadow-sm">
                Bulan Ini
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-outline">
                {transactions.length} Catatan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Master Wealth Card */}
      <section>
        <div className="relative overflow-hidden rounded-3xl bg-surface-container-lowest p-6 sm:p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-surface-container-high/60">
          <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-6 relative z-10">
            {/* Card Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">
                  Saldo Bersih (Net Cashflow)
                </span>
                {netBalance >= 0 ? (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-container text-tertiary-on-container font-bold text-[11px]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Surplus Aktif</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-apple-red/10 text-apple-red font-bold text-[11px]">
                    <span>Defisit</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-outline">
                Penyimpanan Lokal Browser • 100% Privat
              </span>
            </div>

            {/* Big Metric */}
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-xl sm:text-2xl font-medium text-outline-variant">Rp</span>
              <span className="font-headline text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-primary tabular-nums break-words">
                {netBalance.toLocaleString("id-ID")}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono">
                IDR • LOKAL
              </span>
            </div>

            {/* Secondary Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-outline">Pemasukan</span>
                  <span className="w-2 h-2 rounded-full bg-tertiary-on-container" />
                </div>
                <span className="font-headline text-2xl font-bold text-primary tabular-nums">
                  {formatCurrency(totalIncome)}
                </span>
                <span className="text-xs text-tertiary-on-container font-medium">
                  {transactions.filter((t) => t.type === "income").length} sumber pemasukan
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-outline">Pengeluaran</span>
                  <span className="w-2 h-2 rounded-full bg-apple-red/60" />
                </div>
                <span className="font-headline text-2xl font-bold text-primary tabular-nums">
                  {formatCurrency(totalExpense)}
                </span>
                {user?.monthly_budget && user.monthly_budget > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-outline">
                      <span>{budgetUsedPct}% dari pagu</span>
                      <span>{formatCurrency(user.monthly_budget)}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          budgetUsedPct > 90 ? "bg-apple-red" : budgetUsedPct > 70 ? "bg-amber-500" : "bg-primary"
                        }`}
                        style={{ width: `${budgetUsedPct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-outline">Rasio Tabungan</span>
                  <span className="text-xs font-bold text-secondary">50/30/20</span>
                </div>
                <span className="font-headline text-2xl font-bold text-primary tabular-nums">
                  {savingsRate}%
                </span>
                <span className="text-xs text-secondary font-medium">
                  {savingsRate >= 20
                    ? "Kondisi Sehat & Terkendali"
                    : savingsRate >= 10
                    ? "Perlu Peningkatan"
                    : "Perlu Optimasi Segera"}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-surface-container-high/60">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setTxModalType("income");
                    setIsTxModalOpen(true);
                  }}
                  className="group flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-white text-xs font-bold shadow-sm hover:bg-neutral-800 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                  <span>+ Pemasukan</span>
                </button>
                <button
                  onClick={() => {
                    setTxModalType("expense");
                    setIsTxModalOpen(true);
                  }}
                  className="group flex items-center gap-2 px-5 py-3 rounded-full bg-surface-container-lowest text-primary text-xs font-bold shadow-sm border border-surface-container-high hover:bg-surface-container-low active:scale-95 transition-all"
                >
                  <Minus className="w-4 h-4 text-apple-red" />
                  <span>- Pengeluaran</span>
                </button>
                <Link
                  href="/goals"
                  className="flex items-center gap-1.5 px-4 py-3 rounded-full text-on-surface-variant hover:text-primary text-xs font-semibold transition-colors"
                >
                  <span>Alokasi Impian</span>
                </Link>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                <Shield className="w-4 h-4 text-outline" />
                <span className="text-outline text-xs">Tersimpan aman di localStorage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Savings Goals */}
      {goals.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold tracking-widest text-outline uppercase">
                Alokasi & Komitmen
              </span>
              <h2 className="font-headline text-2xl font-bold text-primary tracking-tight">
                Kantong Tabungan
              </h2>
            </div>
            <Link
              href="/goals"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary text-xs font-bold transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Kelola Kantong</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {goals.slice(0, 3).map((goal) => {
              const percent = Math.min(
                100,
                Math.round((goal.current_amount / (goal.target_amount || 1)) * 100)
              );
              return (
                <div
                  key={goal.id}
                  className="group rounded-3xl bg-surface-container-lowest p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-surface-container-high/60 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: goal.color || "#009a3b" }}
                      >
                        <CategoryIcon name={goal.icon || "Shield"} size={22} className="text-white" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant">
                        {percent}% Tercapai
                      </span>
                    </div>
                    <div>
                      <h3 className="font-headline text-base font-bold text-primary">{goal.title}</h3>
                      <p className="text-xs text-outline mt-0.5 line-clamp-1">
                        {goal.description || "Alokasi target masa depan"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                      <div className="flex items-baseline justify-between">
                        <span className="font-headline text-xl font-bold text-primary tabular-nums">
                          {formatCurrency(goal.current_amount)}
                        </span>
                        <span className="text-xs text-outline">
                          dari {formatCurrency(goal.target_amount)}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden my-1">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${percent}%`, backgroundColor: goal.color || "#009a3b" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-surface-container-high/50 flex items-center justify-between">
                    <Link
                      href="/goals"
                      className="text-[11px] text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Tambah Saldo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Analytics & Cash Flow */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Expense Breakdown */}
        <div className="lg:col-span-5 rounded-3xl bg-surface-container-lowest p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-surface-container-high/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-headline text-base font-bold text-primary">Alokasi Pengeluaran</h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant">
                Lokal
              </span>
            </div>
            <p className="text-xs text-outline">Distribusi pengeluaran berdasarkan kategori.</p>

            <div className="space-y-3 my-6">
              {Object.keys(categoryExpenses).length === 0 ? (
                <div className="p-8 text-center text-xs text-outline border border-dashed border-surface-container-high rounded-2xl">
                  Belum ada pengeluaran tercatat
                </div>
              ) : (
                Object.entries(categoryExpenses)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 4)
                  .map(([catKey, amount]) => {
                    const pct = Math.round((amount / (totalExpense || 1)) * 100);
                    return (
                      <div
                        key={catKey}
                        className="p-3 rounded-2xl bg-surface-container-low/60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                            <CategoryIcon category={catKey as any} size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-primary capitalize">{catKey}</p>
                            <p className="text-[10px] text-outline">{pct}% dari total beban</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-primary tabular-nums">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-surface-container-low border border-surface-container-high/40 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">Detail lengkap grafik analitik</span>
            <Link href="/analytics" className="text-xs font-bold text-secondary hover:underline">
              Analitik Lengkap →
            </Link>
          </div>
        </div>

        {/* Right: Cash Flow Summary */}
        <div className="lg:col-span-7 rounded-3xl bg-surface-container-lowest p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-surface-container-high/60 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h2 className="font-headline text-base font-bold text-primary">Ringkasan Arus Kas</h2>
                <p className="text-xs text-outline">Korelasi komparatif pendapatan dan pengeluaran.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase">Pemasukan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-apple-red" />
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase">Pengeluaran</span>
                </div>
              </div>
            </div>

            <div className="py-8 space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-primary">Total Pemasukan</span>
                  <span className="font-bold text-tertiary-on-container">{formatCurrency(totalIncome)}</span>
                </div>
                <div className="h-4 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-primary">Total Pengeluaran</span>
                  <span className="font-bold text-apple-red">{formatCurrency(totalExpense)}</span>
                </div>
                <div className="h-4 rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    className="h-full bg-apple-red rounded-full"
                    style={{
                      width: `${Math.min(100, totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-tertiary-on-container shadow-sm border border-surface-container-high">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  Surplus Bersih Tersimpan
                </div>
                <div className="text-xs text-primary font-bold tabular-nums">
                  {formatCurrency(netBalance)}
                </div>
              </div>
            </div>
            <Link
              href="/reports"
              className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:underline cursor-pointer"
            >
              <span>Ekspor Laporan</span>
              <FileDown className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Recent Transactions */}
      <section>
        <div className="rounded-3xl bg-surface-container-lowest p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-surface-container-high/60 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-headline text-lg font-bold text-primary tracking-tight">
                Transaksi Terbaru
              </h2>
              <p className="text-xs text-outline">
                Catatan mutasi terkonsolidasi dari penyimpanan browser lokal Anda.
              </p>
            </div>
            <Link
              href="/transactions"
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-surface-container-low hover:bg-surface-container-high text-primary transition-colors"
            >
              Buka Semua Transaksi →
            </Link>
          </div>

          <div className="divide-y divide-surface-container-high/50">
            {transactions.slice(0, 5).map((tx) => {
              const isIncome = tx.type === "income";
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3.5 px-2 hover:bg-surface-container-low/60 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-surface-container-low text-primary flex items-center justify-center flex-shrink-0 border border-surface-container-high/60">
                      <CategoryIcon category={tx.category} size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-primary truncate">
                        {tx.description}
                      </span>
                      <div className="flex items-center gap-2 text-outline text-[11px] mt-0.5">
                        <span>{formatDate(tx.date)}</span>
                        {tx.note && (
                          <>
                            <span>•</span>
                            <span className="truncate">{tx.note}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 pl-3">
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        isIncome ? "text-tertiary-on-container" : "text-primary"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </span>
                    <div className="text-[10px] font-bold text-outline uppercase tracking-wider capitalize">
                      {tx.category}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Floating AI Widget */}
      <FloatingAiWidget userName={userName} />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
