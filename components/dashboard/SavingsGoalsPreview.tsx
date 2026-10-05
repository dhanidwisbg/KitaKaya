import Link from "next/link";
import { ArrowRight, Plus, Target, CheckCircle2 } from "lucide-react";
import { SavingsGoal } from "@/lib/types/database.types";
import { formatCurrency, progressPercent } from "@/lib/utils";

interface SavingsGoalsPreviewProps {
  goals: SavingsGoal[];
}

export default function SavingsGoalsPreview({ goals }: SavingsGoalsPreviewProps) {
  if (goals.length === 0) {
    return (
      <div className="rounded-3xl bg-surface-container-lowest p-8 border border-surface-container-high/60 shadow-apple-card text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center mx-auto text-xl font-bold">
          🎯
        </div>
        <div>
          <h3 className="text-sm font-bold text-primary">Belum ada Kantong Tabungan</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto mt-1">
            Pisahkan tabungan untuk Dana Darurat, Gadget, atau Liburan agar arus kas lebih terarah.
          </p>
        </div>
        <Link
          href="/goals"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" /> Buat Kantong Impian
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {goals.slice(0, 3).map((goal) => {
        const percent = progressPercent(goal.current_amount, goal.target_amount);
        const remaining = Math.max(0, goal.target_amount - goal.current_amount);
        const isCompleted = goal.is_completed || percent >= 100;

        return (
          <div
            key={goal.id}
            className="group rounded-3xl bg-surface-container-lowest p-6 border border-surface-container-high/60 shadow-apple-card hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-tertiary-container flex items-center justify-center text-xl">
                  {goal.icon || "🎯"}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant">
                  {isCompleted ? "Tercapai ✅" : `${percent}% Target`}
                </span>
              </div>

              <div>
                <h3 className="font-headline text-base font-bold text-primary flex items-center gap-1.5">
                  {goal.title}
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-tertiary-on-container" />}
                </h3>
                <p className="text-xs text-outline line-clamp-1 mt-0.5">
                  {goal.description || "Alokasi tabungan masa depan"}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 pt-2">
                <div className="flex items-baseline justify-between">
                  <span className="font-headline text-lg font-bold text-primary tabular-nums">
                    {formatCurrency(goal.current_amount)}
                  </span>
                  <span className="text-xs text-outline">
                    dari {formatCurrency(goal.target_amount, true)}
                  </span>
                </div>

                {/* Progress Track */}
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden my-1">
                  <div
                    className="h-full bg-tertiary-on-container rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-tertiary-on-container font-semibold">
                    {percent}% Tercapai
                  </span>
                  <span className="text-outline">
                    {remaining > 0 ? `Kurang ${formatCurrency(remaining, true)}` : "Selesai"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-surface-container-high/50 flex items-center justify-between">
              <Link
                href="/goals"
                className="text-[11px] font-semibold text-secondary hover:underline flex items-center gap-1"
              >
                Setor Tabungan
              </Link>
              <ArrowRight className="w-3.5 h-3.5 text-outline-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
