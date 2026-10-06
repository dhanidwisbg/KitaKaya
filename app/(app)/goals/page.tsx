"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { SavingsGoal } from "@/lib/types/database.types";
import { formatCurrency, formatDate, progressPercent } from "@/lib/utils";
import { getClientUserId } from "@/lib/session-client";
import GoalModal from "@/components/goals/GoalModal";
import DepositModal from "@/components/goals/DepositModal";
import {
  Plus,
  Target,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

export default function GoalsPage() {
  const supabase = createClient();

  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  const fetchGoals = async () => {
    setIsLoading(true);
    const userId = getClientUserId();

    if (userId) {
      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setGoals(data);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus target ini?")) return;

    const { error } = await supabase.from("savings_goals").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus target");
    } else {
      toast.success("Target berhasil dihapus");
      setGoals((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.current_amount, 0);
  const overallPercent = progressPercent(totalSaved, totalTarget);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-apple-primary">
            Target & Impian Finansial
          </h1>
          <p className="text-xs text-apple-secondary">
            Wujudkan impian masa depanmu dengan tabungan terencana dan terukur.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedGoal(null);
            setIsGoalModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-apple-primary text-white text-xs font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Buat Target Baru
        </button>
      </div>

      {/* Overview Card */}
      <div className="bg-white rounded-3xl border border-apple-subtle p-6 shadow-apple-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-semibold text-apple-secondary uppercase tracking-wider">
              Total Tabungan Terkumpul
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-apple-primary">
                {formatCurrency(totalSaved)}
              </span>
              <span className="text-xs text-apple-secondary">
                dari target {formatCurrency(totalTarget)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-apple-green">{overallPercent}%</span>
            <span className="text-xs text-apple-secondary">tercapai</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-apple-subtle/50 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-apple-green rounded-full transition-all duration-700"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {/* Goals Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-apple-secondary">
          Memuat target impian...
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-apple-subtle p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-apple-green/10 text-apple-green flex items-center justify-center mx-auto text-xl">
            🎯
          </div>
          <p className="text-sm font-semibold text-apple-primary">Belum ada target impian</p>
          <p className="text-xs text-apple-secondary max-w-sm mx-auto">
            Buat target seperti Dana Darurat, Liburan, Beli Gadget, atau Rumah Impian untuk
            memotivasi tabunganmu.
          </p>
          <button
            onClick={() => {
              setSelectedGoal(null);
              setIsGoalModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-apple-primary text-white text-xs font-semibold hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Buat Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const percent = progressPercent(goal.current_amount, goal.target_amount);
            const isFinished = goal.is_completed || percent >= 100;

            return (
              <div
                key={goal.id}
                className="bg-white rounded-2xl border border-apple-subtle p-5 shadow-apple-card flex flex-col justify-between space-y-4 hover:border-apple-subtle/80 transition-all"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: `${goal.color}15` }}
                      >
                        {goal.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-apple-primary flex items-center gap-1.5">
                          {goal.title}
                          {isFinished && (
                            <CheckCircle2 className="w-4 h-4 text-apple-green" />
                          )}
                        </h3>
                        {goal.deadline && (
                          <p className="text-[10px] text-apple-secondary flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Target: {formatDate(goal.deadline)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedGoal(goal);
                          setIsGoalModalOpen(true);
                        }}
                        className="p-1 rounded-lg text-apple-secondary hover:text-apple-primary hover:bg-apple-surface"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-1 rounded-lg text-apple-secondary hover:text-apple-red hover:bg-apple-red/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-xs text-apple-secondary mt-2 line-clamp-2">
                      {goal.description}
                    </p>
                  )}
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-apple-primary">
                      {formatCurrency(goal.current_amount)}
                    </span>
                    <span className="text-apple-secondary">
                      {percent}% dari {formatCurrency(goal.target_amount)}
                    </span>
                  </div>

                  <div className="w-full bg-apple-subtle/50 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: goal.color || "#30D158",
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
                  className="w-full py-2.5 px-3 rounded-xl bg-apple-surface hover:bg-apple-subtle text-apple-primary font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-apple-green" /> Tambah Tabungan
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
