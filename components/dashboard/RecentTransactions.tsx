"use client";

import Link from "next/link";
import { Transaction } from "@/lib/types/database.types";
import { formatCurrency, formatDateShort, getCategoryConfig } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="rounded-3xl bg-surface-container-lowest p-6 border border-surface-container-high/60 shadow-apple-card flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-base font-bold text-primary">Transaksi Terbaru</h2>
          <p className="text-xs text-outline">Catatan transaksi harian terkini.</p>
        </div>
        <Link
          href="/transactions"
          className="text-xs text-secondary font-semibold flex items-center gap-1 hover:underline transition-all"
        >
          Lihat semua
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-10 space-y-2 border border-dashed border-surface-container-high rounded-2xl">
          <p className="text-3xl">📝</p>
          <p className="text-xs text-outline">Belum ada transaksi tercatat</p>
          <Link
            href="/transactions"
            className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
          >
            + Catat transaksi pertama
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-surface-container-high/60">
          {transactions.slice(0, 5).map((tx) => {
            const cat = getCategoryConfig(tx.category);
            const isIncome = tx.type === "income";

            return (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between hover:bg-surface-container-low/40 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    {cat.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-primary truncate">
                      {tx.description}
                    </p>
                    <p className="text-[11px] text-outline">
                      {cat.label} • {formatDateShort(tx.date)}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold tabular-nums ${
                    isIncome ? "text-tertiary-on-container" : "text-primary"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-2">
        <Link
          href="/transactions"
          className="w-full py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-primary font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>Kelola Semua Transaksi</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-outline" />
        </Link>
      </div>
    </div>
  );
}
