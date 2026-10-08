"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SavingsGoal } from "@/lib/types/database.types";
import { addStoredGoal, updateStoredGoal, getStoredUser } from "@/lib/storage";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { X, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: SavingsGoal | null;
  onSuccess?: () => void;
}

const availableIcons = [
  { name: "Shield", label: "Proteksi / Darurat" },
  { name: "Laptop", label: "Gadget / Kerja" },
  { name: "Plane", label: "Liburan / Travel" },
  { name: "Home", label: "Rumah / Properti" },
  { name: "Car", label: "Kendaraan" },
  { name: "Target", label: "Target Finansial" },
  { name: "PiggyBank", label: "Tabungan Umum" },
  { name: "Gift", label: "Hadiah / Wishlist" },
];

const colors = ["#009a3b", "#005ab7", "#1d1d1f", "#d97706", "#7c3aed", "#e11d48"];

export default function GoalModal({
  isOpen,
  onClose,
  goalToEdit,
  onSuccess,
}: GoalModalProps) {
  const router = useRouter();

  const [title, setTitle] = useState(goalToEdit?.title || "");
  const [description, setDescription] = useState(goalToEdit?.description || "");
  const [targetAmount, setTargetAmount] = useState(
    goalToEdit ? String(goalToEdit.target_amount) : ""
  );
  const [deadline, setDeadline] = useState(goalToEdit?.deadline || "");
  const [icon, setIcon] = useState(goalToEdit?.icon || "Shield");
  const [color, setColor] = useState(goalToEdit?.color || "#009a3b");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = getStoredUser();
      const numTarget = Number(targetAmount.replace(/\D/g, ""));
      if (!numTarget || numTarget <= 0) {
        toast.error("Target nominal harus lebih dari 0");
        setIsLoading(false);
        return;
      }

      if (!title.trim()) {
        toast.error("Nama kantong tabungan harus diisi");
        setIsLoading(false);
        return;
      }

      if (goalToEdit) {
        updateStoredGoal(goalToEdit.id, {
          title: title.trim(),
          description: description.trim() || null,
          target_amount: numTarget,
          deadline: deadline || null,
          icon,
          color,
        });
        toast.success("Target tabungan berhasil diperbarui");
      } else {
        addStoredGoal({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          target_amount: numTarget,
          current_amount: 0,
          deadline: deadline || null,
          icon,
          color,
          is_completed: false,
        });
        toast.success("Kantong tabungan baru berhasil dibuat");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg max-h-[92vh] flex flex-col bg-white rounded-3xl border border-surface-container-high/80 shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-surface-container-high/60 shrink-0">
          <div>
            <h2 className="text-base font-bold text-primary font-headline">
              {goalToEdit ? "Edit Kantong Tabungan" : "Buat Kantong Tabungan Baru"}
            </h2>
            <p className="text-xs text-outline">
              Target dan alokasi tersimpan aman di browser Anda
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-low text-outline hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          {/* Target Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
              Nama Kantong Tabungan
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Dana Darurat, MacBook Pro, Liburan Jepang"
              className="w-full h-11 px-4 bg-surface-container-low rounded-2xl text-xs font-medium text-primary focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 border border-surface-container-high transition-all"
            />
          </div>

          {/* Target Nominal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
              Target Nominal (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-outline">
                Rp
              </span>
              <input
                type="text"
                required
                value={
                  targetAmount
                    ? Number(targetAmount.replace(/\D/g, "")).toLocaleString("id-ID")
                    : ""
                }
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  setTargetAmount(raw);
                }}
                placeholder="0"
                className="w-full h-12 pl-12 pr-4 bg-surface-container-low rounded-2xl text-lg font-bold text-primary focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 border border-surface-container-high transition-all tabular-nums"
              />
            </div>
          </div>

          {/* Description & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
                Keterangan / Tujuan
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Jaring pengaman likuid 6x pengeluaran"
                className="w-full h-11 px-4 bg-surface-container-low rounded-2xl text-xs font-medium text-primary focus:outline-none focus:bg-white border border-surface-container-high transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
                Target Selesai (Deadline)
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full h-11 px-4 bg-surface-container-low rounded-2xl text-xs font-medium text-primary focus:outline-none focus:bg-white border border-surface-container-high transition-all"
              />
            </div>
          </div>

          {/* Icon Selector (Lucide Icons) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
              Pilih Ikon Vektor
            </label>
            <div className="grid grid-cols-4 gap-2">
              {availableIcons.map((item) => {
                const isSelected = icon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIcon(item.name)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? "bg-primary text-white shadow-sm"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <CategoryIcon name={item.name} size={18} />
                    <span className="text-[10px] font-semibold truncate w-full text-center">
                      {item.label.split("/")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
              Aksen Warna
            </label>
            <div className="flex items-center gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? "scale-125 ring-2 ring-primary ring-offset-2" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !targetAmount || !title.trim()}
              className="w-full py-3.5 rounded-2xl bg-primary text-white text-xs font-bold hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{goalToEdit ? "Simpan Perubahan" : "Buat Kantong Tabungan"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
