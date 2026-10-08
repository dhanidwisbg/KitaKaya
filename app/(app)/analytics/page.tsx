"use client";

import { useState, useEffect } from "react";
import { Transaction } from "@/lib/types/database.types";
import { formatCurrency, getCategoryConfig } from "@/lib/utils";
import { getStoredTransactions, subscribeStorage } from "@/lib/storage";
import CategoryIcon from "@/components/ui/CategoryIcon";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { TrendingUp, TrendingDown, PieChart as PieIcon, ArrowUpRight, BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = () => {
    setIsLoading(true);
    const data = getStoredTransactions();
    setTransactions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeStorage(() => {
      loadData();
    });
    return unsubscribe;
  }, []);

  const incomeTx = transactions.filter((t) => t.type === "income");
  const expenseTx = transactions.filter((t) => t.type === "expense");

  const totalIncome = incomeTx.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTx.reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Category breakdown for expenses
  const categoryMap = new Map<string, number>();
  expenseTx.forEach((t) => {
    categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
  });

  const categoryData = Array.from(categoryMap.entries())
    .map(([category, value]) => {
      const conf = getCategoryConfig(category as any);
      return {
        name: conf.label,
        categoryKey: category,
        value,
        color: conf.color,
      };
    })
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-bold uppercase tracking-wider mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-primary" />
          <span>Statistik Keuangan Lokal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary font-headline">
          Analitik & Arus Kas.
        </h1>
        <p className="text-xs sm:text-sm text-outline mt-1">
          Visualisasi mendalam rasio tabungan, alokasi pengeluaran, dan pola cashflow Anda.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/60 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
              Total Pemasukan
            </span>
            <div className="w-8 h-8 rounded-xl bg-tertiary-container flex items-center justify-center text-tertiary-on-container">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-primary font-headline tabular-nums">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-[11px] text-tertiary-on-container mt-1 font-medium">
            {incomeTx.length} transaksi tercatat
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/60 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
              Total Pengeluaran
            </span>
            <div className="w-8 h-8 rounded-xl bg-apple-red/10 flex items-center justify-center text-apple-red">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-primary font-headline tabular-nums">
            {formatCurrency(totalExpense)}
          </div>
          <p className="text-[11px] text-outline mt-1">
            {expenseTx.length} transaksi operasional
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/60 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
              Rasio Tabungan
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary">
              50/30/20
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-primary font-headline tabular-nums">
            {savingsRate}%
          </div>
          <p className="text-[11px] text-outline mt-1">
            Surplus: {formatCurrency(netSavings)}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Doughnut Chart */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-3xl border border-surface-container-high/60 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-headline text-base font-bold text-primary">
                Breakdown Pengeluaran
              </h2>
              <PieIcon className="w-4 h-4 text-outline" />
            </div>
            <p className="text-xs text-outline">Proporsi per kategori pengeluaran</p>

            {categoryData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-outline">
                Belum ada data pengeluaran
              </div>
            ) : (
              <div className="h-64 my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => formatCurrency(Number(value))}
                      contentStyle={{
                        borderRadius: "16px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {categoryData.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low/60 text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium text-primary">{cat.name}</span>
                </div>
                <span className="font-bold text-primary tabular-nums">
                  {formatCurrency(cat.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Cashflow */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl border border-surface-container-high/60 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-headline text-base font-bold text-primary">
                Perbandingan Arus Kas
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                Bulan Ini
              </span>
            </div>
            <p className="text-xs text-outline">Komparasi total masuk vs total keluar</p>

            <div className="h-64 my-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Pemasukan", amount: totalIncome, fill: "#009a3b" },
                    { name: "Pengeluaran", amount: totalExpense, fill: "#e11d48" },
                    { name: "Surplus Bersih", amount: Math.max(0, netSavings), fill: "#005ab7" },
                  ]}
                  margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    tickFormatter={(v) => `Rp ${(v / 1_000_000).toFixed(0)}jt`}
                  />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(Number(value))}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/60 flex items-center justify-between text-xs">
            <span className="text-outline">
              Status Arus Kas:{" "}
              <strong className="text-primary font-bold">
                {netSavings >= 0 ? "Surplus Positif" : "Defisit"}
              </strong>
            </span>
            <span className="text-tertiary-on-container font-bold tabular-nums">
              {netSavings >= 0 ? "+" : ""}
              {formatCurrency(netSavings)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
