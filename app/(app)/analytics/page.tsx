"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Transaction } from "@/lib/types/database.types";
import { formatCurrency, getCategoryConfig } from "@/lib/utils";
import { getClientUserId } from "@/lib/session-client";
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
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, PieChart as PieIcon, ArrowUpRight } from "lucide-react";

export default function AnalyticsPage() {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const userId = getClientUserId();

      if (userId) {
        const { data } = await supabase
          .from("transactions")
          .select("id,type,amount,category,description,date")
          .eq("user_id", userId);

        if (data) setTransactions(data as any);
      }
      setIsLoading(false);
    }
    loadData();
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
        value,
        color: conf.color,
      };
    })
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-apple-primary">
          Analitik & Laporan Keuangan
        </h1>
        <p className="text-xs text-apple-secondary">
          Evaluasi pola pengeluaran, rasio tabungan, dan performa finansialmu.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-apple-subtle p-5 shadow-apple-card space-y-1">
          <span className="text-[11px] font-semibold text-apple-secondary uppercase tracking-wider">
            Total Pemasukan
          </span>
          <p className="text-xl font-bold text-apple-green">{formatCurrency(totalIncome)}</p>
          <p className="text-[10px] text-apple-secondary">Sepanjang waktu</p>
        </div>

        <div className="bg-white rounded-2xl border border-apple-subtle p-5 shadow-apple-card space-y-1">
          <span className="text-[11px] font-semibold text-apple-secondary uppercase tracking-wider">
            Total Pengeluaran
          </span>
          <p className="text-xl font-bold text-apple-red">{formatCurrency(totalExpense)}</p>
          <p className="text-[10px] text-apple-secondary">Sepanjang waktu</p>
        </div>

        <div className="bg-white rounded-2xl border border-apple-subtle p-5 shadow-apple-card space-y-1">
          <span className="text-[11px] font-semibold text-apple-secondary uppercase tracking-wider">
            Rasio Tabungan
          </span>
          <p className="text-xl font-bold text-apple-primary">{savingsRate}%</p>
          <p className="text-[10px] text-apple-secondary">
            {savingsRate >= 20 ? "Kondisi sangat sehat ✅" : "Tingkatkan tabungan ⚠️"}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown (Pie Chart) */}
        <div className="bg-white rounded-3xl border border-apple-subtle p-6 shadow-apple-card space-y-4">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-apple-blue" />
            <h2 className="text-sm font-semibold text-apple-primary">
              Distribusi Pengeluaran
            </h2>
          </div>

          {categoryData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-xs text-apple-secondary border border-dashed border-apple-subtle rounded-2xl">
              Belum ada data pengeluaran
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => formatCurrency(Number(val))}
                      contentStyle={{
                        borderRadius: "12px",
                        fontSize: "11px",
                        border: "1px solid #E5E5EA",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="flex-1 space-y-2 w-full">
                {categoryData.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-apple-secondary">{item.name}</span>
                    </div>
                    <span className="font-semibold text-apple-primary">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 50/30/20 Budgeting Rule Analysis */}
        <div className="bg-white rounded-3xl border border-apple-subtle p-6 shadow-apple-card space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-apple-primary">
              Penerapan Kaidah 50/30/20
            </h2>
            <p className="text-xs text-apple-secondary mt-1">
              Standar baku alokasi keuangan sehat untuk stabilitas jangka panjang.
            </p>
          </div>

          <div className="space-y-4">
            {/* Needs (50%) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-apple-primary">Kebutuhan Pokok (Needs) — Max 50%</span>
                <span className="text-apple-secondary">Target: 50%</span>
              </div>
              <div className="w-full bg-apple-subtle/50 rounded-full h-2.5 overflow-hidden">
                <div className="h-full bg-apple-blue rounded-full w-1/2" />
              </div>
            </div>

            {/* Wants (30%) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-apple-primary">Keinginan & Lifestyle (Wants) — Max 30%</span>
                <span className="text-apple-secondary">Target: 30%</span>
              </div>
              <div className="w-full bg-apple-subtle/50 rounded-full h-2.5 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[30%]" />
              </div>
            </div>

            {/* Savings (20%) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-apple-primary">Tabungan & Investasi (Savings) — Min 20%</span>
                <span className="text-apple-secondary">Target: 20%</span>
              </div>
              <div className="w-full bg-apple-subtle/50 rounded-full h-2.5 overflow-hidden">
                <div className="h-full bg-apple-green rounded-full w-1/5" />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-apple-surface/80 border border-apple-subtle text-xs text-apple-secondary leading-relaxed">
            💡 <strong>Saran Finansial:</strong> Alokasikan tabungan segera setelah gajian
            sebelum membelanjakan pos keinginan (Wants).
          </div>
        </div>
      </div>
    </div>
  );
}
