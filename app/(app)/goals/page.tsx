"use client";

import { useState, useEffect } from "react";
import { SavingsGoal } from "@/lib/types/database.types";
import { formatCurrency, formatDate, progressPercent } from "@/lib/utils";
import { getStoredGoals, deleteStoredGoal, subscribeStorage } from "@/lib/storage";
import GoalModal from "@/components/goals/GoalModal";
import DepositModal from "@/components/goals/DepositModal";
import CategoryIcon from "@/components/ui/CategoryIcon";
import {
  Plus,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  Calendar,
  PiggyBank,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function GoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  const fetchGoals = () => {
    setIsLoading(true);
    const data = getStoredGoals();
    setGoals(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGoals();
    const unsubscribe = subscribeStorage(() => {
      fetchGoals();
    });
    return unsubscribe;
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kantong tabungan ini?")) return;
    deleteStoredGoal(id);
    toast.success("Kantong tabungan berhasil dihapus");
    fetchGoals();
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.current_amount, 0);
  const overallPercent = progressPercent(totalSaved, totalTarget);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-bold uppercase tracking-wider mb-2">
            <PiggyBank className="w-3.5 h-3.5 text-primary" />
            <span>Pemisahan Saldo & Kantong Impian</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary font-headline">
            Kantong Tabungan & Target.
          </h1>
          <p className="text-xs sm:text-sm text-outline mt-1">
            Wujudkan impian finansialmu dengan alokasi terencana yang tersimpan langsung di browser lokal.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedGoal(null);
            setIsGoalModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-white text-xs font-bold hover:bg-neutral-800 active:scale-[0.99] transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Kantong Baru</span>
        </button>
      </div>

      {/* Overview Card */}
      <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/60 p-6 sm:p-8 shadow-apple-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
              Total Tabungan Terkumpul
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-bold text-primary font-headline tabular-nums">
                {formatCurrency(totalSaved)}
              </span>
              <span className="text-xs text-outline">
                dari target {formatCurrency(totalTarget)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-tertiary-container/40 px-3.5 py-1.5 rounded-full border border-tertiary-on-container/20">
            <span className="text-sm font-bold text-tertiary-on-container">{overallPercent}%</span>
            <span className="text-xs text-on-surface-variant font-medium">tercapai</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-surface-container-high rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-tertiary-on-container rounded-full transition-all duration-700"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {/* Goals Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-outline">
          Memuat kantong tabungan...
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl border border-dashed border-surface-container-high p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-low text-primary flex items-center justify-center mx-auto shadow-sm">
            <PiggyBank className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-primary">Belum ada kantong tabungan</p>
          <p className="text-xs text-outline max-w-sm mx-auto">
            Buat kantong seperti Dana Darurat, Liburan, Beli Gadget, atau Rumah Impian untuk
            memotivasi tabunganmu.
          </p>
          <button
            onClick={() => {
              setSelectedGoal(null);
              setIsGoalModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Buat Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const percent = progressPercent(goal.current_amount, goal.target_amount);
            const isFinished = goal.is_completed || percent >= 100;

            return (
              <div
                key={goal.id}
                className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/60 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-sm"
                        style={{ backgroundColor: goal.color || "#009a3b" }}
                      >
                        <CategoryIcon name={goal.icon || "Shield"} size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-primary flex items-center gap-1.5 font-headline">
                          {goal.title}
                          {isFinished && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                        </h3>
                        {goal.deadline && (
                          <p className="text-[11px] text-outline flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" /> Target: {formatDate(goal.deadline)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedGoal(goal);
                          setIsGoalModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container-low transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-1.5 rounded-lg text-outline hover:text-apple-red hover:bg-apple-red/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-xs text-outline mt-3 line-clamp-2">
                      {goal.description}
                    </p>
                  )}
                </div>

                {/* Progress */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-primary tabular-nums">
                      {formatCurrency(goal.current_amount)}
                    </span>
                    <span className="text-outline text-[11px]">
                      {percent}% dari {formatCurrency(goal.target_amount)}
                    </span>
                  </div>

                  <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: goal.color || "#009a3b",
                      }}
                    />
                  </div>
                </div>

                {/* Deposit Action */}
                <button
                  onClick={() => {
                    setSelectedGoal(goal);
                    setIsDepositModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-2xl bg-surface-container-low hover:bg-surface-container-high text-primary font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-surface-container-high/60"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>Tambah Tabungan</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        goalToEdit={selectedGoal}
        onSuccess={fetchGoals}
      />

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        goal={selectedGoal}
        onSuccess={fetchGoals}
      />
    </div>
  );
}
