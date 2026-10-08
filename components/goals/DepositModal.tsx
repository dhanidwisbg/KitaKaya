"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SavingsGoal } from "@/lib/types/database.types";
import { formatCurrency } from "@/lib/utils";
import { depositToStoredGoal, addStoredTransaction, getStoredUser } from "@/lib/storage";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { X, Loader2, Plus, Check } from "lucide-react";
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

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !goal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = getStoredUser();
      const numAmount = Number(amount.replace(/\D/g, ""));
      if (!numAmount || numAmount <= 0) {
        toast.error("Nominal harus lebih dari 0");
        setIsLoading(false);
        return;
      }

      // 1. Simpan deposit ke goal lokal
      depositToStoredGoal(goal.id, numAmount, note.trim() || undefined);

      // 2. Catat juga sebagai mutasi pengeluaran alokasi tabungan
      addStoredTransaction({
        user_id: user.id,
        type: "expense",
        category: "savings",
        amount: numAmount,
        description: `Alokasi Tabungan: ${goal.title}`,
        note: note.trim() || null,
        date: new Date().toISOString().split("T")[0],
      });

      toast.success(`Berhasil menambah tabungan ${formatCurrency(numAmount)}!`);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md max-h-[92vh] flex flex-col bg-white rounded-3xl border border-surface-container-high/80 shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-surface-container-high/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary border border-surface-container-high">
              <CategoryIcon name={goal.icon || "Shield"} size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-primary font-headline">Tambah Saldo Tabungan</h2>
              <p className="text-xs text-outline">{goal.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-low text-outline hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
              Nominal Setoran (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-outline">
                Rp
              </span>
              <input
                type="text"
                required
                autoFocus
                value={
                  amount ? Number(amount.replace(/\D/g, "")).toLocaleString("id-ID") : ""
                }
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  setAmount(raw);
                }}
                placeholder="0"
                className="w-full h-12 pl-12 pr-4 bg-surface-container-low rounded-2xl text-lg font-bold text-primary focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 border border-surface-container-high transition-all tabular-nums"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Setoran bonus gaji, sisa uang jajan"
              className="w-full h-11 px-4 text-xs font-medium rounded-2xl border border-surface-container-high bg-surface-container-low text-primary focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl border border-surface-container-high text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || !amount}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-primary text-white text-xs font-bold hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-50 shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Setor Saldo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
