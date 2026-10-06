"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SavingsGoal } from "@/lib/types/database.types";
import { getClientUserId } from "@/lib/session-client";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: SavingsGoal | null;
  onSuccess?: () => void;
}

const icons = ["🎯", "🏖️", "🚗", "🏠", "💻", "💍", "🛡️", "👶", "🚀", "📱"];
const colors = ["#30D158", "#0A84FF", "#FF9F0A", "#BF5AF2", "#FF375F", "#64D2FF"];

export default function GoalModal({
  isOpen,
  onClose,
  goalToEdit,
  onSuccess,
}: GoalModalProps) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(goalToEdit?.title || "");
  const [description, setDescription] = useState(goalToEdit?.description || "");
  const [targetAmount, setTargetAmount] = useState(
    goalToEdit ? String(goalToEdit.target_amount) : ""
  );
  const [deadline, setDeadline] = useState(goalToEdit?.deadline || "");
  const [icon, setIcon] = useState(goalToEdit?.icon || "🎯");
  const [color, setColor] = useState(goalToEdit?.color || "#30D158");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userId = getClientUserId();

      if (!userId) {
        toast.error("Sesi tidak ditemukan");
        return;
      }

      const numTarget = Number(targetAmount.replace(/\D/g, ""));
      if (!numTarget || numTarget <= 0) {
        toast.error("Target nominal harus lebih dari 0");
        setIsLoading(false);
        return;
      }

      if (goalToEdit) {
        const { error } = await supabase
          .from("savings_goals")
          .update({
            title: title.trim(),
            description: description.trim() || null,
            target_amount: numTarget,
            deadline: deadline || null,
            icon,
            color,
            updated_at: new Date().toISOString(),
          })
          .eq("id", goalToEdit.id)
          .eq("user_id", userId);

        if (error) throw error;
        toast.success("Target impian berhasil diubah");
      } else {
        const { error } = await supabase.from("savings_goals").insert({
          user_id: userId,
          title: title.trim(),
          description: description.trim() || null,
          target_amount: numTarget,
          deadline: deadline || null,
          icon,
          color,
        });

        if (error) throw error;
        toast.success("Target impian baru dibuat! 🎯");
      }

      onClose();
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan target");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-apple-subtle shadow-apple-float overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-apple-subtle">
          <h2 className="text-base font-semibold text-apple-primary">
            {goalToEdit ? "Edit Target Impian" : "Target Impian Baru"}
          </h2>
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
            <label className="text-xs font-semibold text-apple-primary">Nama Impian</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="cth. Dana Darurat 6 Bulan, Liburan ke Jepang"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-apple-subtle bg-apple-surface/40 text-apple-primary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">Target Nominal (IDR)</label>
            <input
              type="number"
              required
              min="1000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 text-lg font-bold text-apple-primary rounded-xl border border-apple-subtle bg-apple-surface/40 focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">
              Target Tanggal Tercapai (Opsional)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-apple-subtle bg-apple-surface/40 text-apple-primary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
            />
          </div>

          {/* Icon Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">Ikon</label>
            <div className="flex items-center gap-2 flex-wrap">
              {icons.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base border transition-all ${
                    icon === ic
                      ? "border-apple-blue bg-apple-blue/10 scale-110"
                      : "border-apple-subtle hover:bg-apple-surface"
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">Warna Tag</label>
            <div className="flex items-center gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? "scale-125 ring-2 ring-offset-2 ring-apple-primary" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
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
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-apple-primary text-white text-xs font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {goalToEdit ? "Simpan Perubahan" : "Buat Impian"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
