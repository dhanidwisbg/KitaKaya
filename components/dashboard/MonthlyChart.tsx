"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Transaction } from "@/lib/types/database.types";
import { formatCurrency, formatDateShort } from "@/lib/utils";

interface MonthlyChartProps {
  transactions: Transaction[];
}

export default function MonthlyChart({ transactions }: MonthlyChartProps) {
  const dayMap = new Map<string, { date: string; income: number; expense: number }>();

  transactions.forEach((tx) => {
    const d = tx.date;
    const existing = dayMap.get(d) || { date: d, income: 0, expense: 0 };
    if (tx.type === "income") {
      existing.income += tx.amount;
    } else {
      existing.expense += tx.amount;
    }
    dayMap.set(d, existing);
  });

  const chartData = Array.from(dayMap.values())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7)
    .map((item) => ({
      ...item,
      label: formatDateShort(item.date),
    }));

  return (
    <div className="rounded-3xl bg-surface-container-lowest p-6 border border-surface-container-high/60 shadow-apple-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-headline text-base font-bold text-primary">
            Arus Kas 7 Hari Terakhir
          </h2>
          <p className="text-xs text-outline">
            Korelasi komparatif antara pendapatan dan beban operasional.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
            <span className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider">
              Pemasukan
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-outline-variant" />
            <span className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider">
              Pengeluaran
            </span>
          </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-xs text-outline border border-dashed border-surface-container-high rounded-2xl">
          Belum ada aktivitas arus kas untuk periode ini
        </div>
      ) : (
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeedf3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#77767b" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "#77767b" }}
                tickFormatter={(val) => formatCurrency(val, true)}
              />
              <Tooltip
                formatter={(value: any) => [formatCurrency(Number(value) || 0), ""]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "16px",
                  border: "1px solid #e9e7ed",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="income" name="Pemasukan" fill="#030304" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="Pengeluaran" fill="#c7c6ca" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
