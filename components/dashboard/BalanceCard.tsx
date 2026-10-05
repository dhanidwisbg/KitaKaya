"use client";

import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  netBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export default function BalanceCard({
  netBalance,
  totalIncome,
  totalExpense,
}: BalanceCardProps) {
  const isPositive = netBalance >= 0;

  return (
    <div
      className={cn(
        "squircle-xl p-7 text-white shadow-apple-lg animate-slide-up",
        isPositive
          ? "bg-foreground"
          : "bg-gradient-to-br from-expense to-red-600"
      )}
    >
      {/* Label */}
      <p className="text-white/60 text-sm font-medium">Saldo Bulan Ini</p>

      {/* Big balance number */}
      <div className="mt-2 mb-6">
        <span className="text-[2.8rem] font-black tracking-tight leading-none font-mono-nums">
          {formatCurrency(Math.abs(netBalance))}
        </span>
        {netBalance < 0 && (
          <span className="text-white/60 text-sm ml-2">(defisit)</span>
        )}
      </div>

      {/* Income & Expense row */}
      <div className="flex gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/60 text-xs">Pemasukan</p>
            <p className="text-white font-bold text-sm font-mono-nums">
              {formatCurrency(totalIncome, true)}
            </p>
          </div>
        </div>

        <div className="w-px bg-white/10" />

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/60 text-xs">Pengeluaran</p>
            <p className="text-white font-bold text-sm font-mono-nums">
              {formatCurrency(totalExpense, true)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
