"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SavingsGoal } from "@/lib/types/database.types";
import { formatCurrency } from "@/lib/utils";
import { X, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal | null;
  onSuccess?: () => void;
}

export default function DepositModal({
  isOpen,
  onClose,
  goal,
  onSuccess,
}: DepositModalProps) {
  const router = useRouter();
  const supabase = createClient();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !goal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Silakan masuk terlebih dahulu");
        return;
      }

      const numAmount = Number(amount.replace(/\D/g, ""));
      if (!numAmount || numAmount <= 0) {
        toast.error("Nominal harus lebih dari 0");
        setIsLoading(false);
        return;
      }

      // 1. Insert into savings_transactions
      const { error: txError } = await supabase.from("savings_transactions").insert({
        goal_id: goal.id,
        user_id: user.id,
        amount: numAmount,
        note: note.trim() || null,
      });

      if (txError) throw txError;

      // 2. Also record in transactions as savings expense
      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "expense",
        category: "savings",
        amount: numAmount,
        description: `Nabung: ${goal.title}`,
        note: note.trim() || null,
        date: new Date().toISOString().split("T")[0],
      });

      toast.success(`Berhasil menambah tabungan ${formatCurrency(numAmount)}! 🎉`);
      setAmount("");
      setNote("");
      onClose();
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal menambah tabungan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl border border-apple-subtle shadow-apple-float overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-apple-subtle">
          <div className="flex items-center gap-2">
            <span className="text-xl">{goal.icon}</span>
            <div>
              <h2 className="text-sm font-semibold text-apple-primary">Nabung ke Impian</h2>
              <p className="text-[11px] text-apple-secondary">{goal.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-apple-secondary hover:text-apple-primary hover:bg-apple-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">
              Nominal Setoran (IDR)
            </label>
            <input
              type="number"
              required
              min="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 text-lg font-bold text-apple-primary rounded-xl border border-apple-subtle bg-apple-surface/40 focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="cth. Sisa uang jajan mingguan"
              className="w-full px-4 py-2 text-sm rounded-xl border border-apple-subtle bg-apple-surface/40 text-apple-primary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
            />
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-apple-subtle text-xs font-semibold text-apple-secondary hover:bg-apple-surface transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-apple-green text-white text-xs font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Setor Tabungan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
