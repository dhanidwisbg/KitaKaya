"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Transaction,
  TransactionType,
  TransactionCategory,
} from "@/lib/types/database.types";
import { CATEGORY_CONFIG } from "@/lib/utils";
import {
  addStoredTransaction,
  updateStoredTransaction,
  getStoredUser,
} from "@/lib/storage";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { X, Loader2, Plus, Check } from "lucide-react";
import { toast } from "sonner";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
  onSuccess?: () => void;
}

const categories = Object.entries(CATEGORY_CONFIG) as [
  TransactionCategory,
  (typeof CATEGORY_CONFIG)[TransactionCategory]
][];

export default function TransactionModal({
  isOpen,
  onClose,
  transactionToEdit,
  onSuccess,
}: TransactionModalProps) {
  const router = useRouter();

  const [type, setType] = useState<TransactionType>(
    transactionToEdit?.type || "expense"
  );
  const [amount, setAmount] = useState<string>(
    transactionToEdit ? String(transactionToEdit.amount) : ""
  );
  const [category, setCategory] = useState<TransactionCategory>(
    transactionToEdit?.category || "food"
  );
  const [description, setDescription] = useState<string>(
    transactionToEdit?.description || ""
  );
  const [date, setDate] = useState<string>(
    transactionToEdit?.date || new Date().toISOString().split("T")[0]
  );
  const [note, setNote] = useState<string>(transactionToEdit?.note || "");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const filteredCategories = categories.filter(
    ([, conf]) => conf.type === type || conf.type === "both"
  );

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

      if (!description.trim()) {
        toast.error("Deskripsi transaksi harus diisi");
        setIsLoading(false);
        return;
      }

      if (transactionToEdit) {
        updateStoredTransaction(transactionToEdit.id, {
          type,
          category,
          amount: numAmount,
          description: description.trim(),
          note: note.trim() || null,
          date,
        });
        toast.success("Transaksi berhasil diperbarui");
      } else {
        addStoredTransaction({
          user_id: user.id,
          type,
          category,
          amount: numAmount,
          description: description.trim(),
          note: note.trim() || null,
          date,
        });
        toast.success("Transaksi berhasil dicatat");
      }

      onClose();
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan transaksi");
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
              {transactionToEdit ? "Edit Catatan Transaksi" : "Tambah Transaksi Baru"}
            </h2>
            <p className="text-xs text-outline">
              Tersimpan langsung di memori browser lokal Anda
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
          {/* Tipe: Pemasukan / Pengeluaran Pill Switcher */}
          <div className="flex bg-surface-container-low p-1 rounded-2xl border border-surface-container-high/50">
            <button
              type="button"
              onClick={() => {
                setType("expense");
                setCategory("food");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                type === "expense"
                  ? "bg-white text-apple-red shadow-sm"
                  : "text-outline hover:text-primary"
              }`}
            >
              - Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => {
                setType("income");
                setCategory("salary");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                type === "income"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-outline hover:text-primary"
              }`}
            >
              + Pemasukan
            </button>
          </div>

          {/* Nominal Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
              Nominal (Rp)
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

          {/* Deskripsi & Kategori Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
                Deskripsi
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Kopi Kenangan"
                className="w-full h-11 px-4 bg-surface-container-low rounded-2xl text-xs font-medium text-primary focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 border border-surface-container-high transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
                Tanggal
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-4 bg-surface-container-low rounded-2xl text-xs font-medium text-primary focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 border border-surface-container-high transition-all"
              />
            </div>
          </div>

          {/* Kategori Selector dengan Lucide Icon */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
              Kategori
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1 border border-surface-container-high/40 rounded-2xl bg-surface-container-lowest">
              {filteredCategories.map(([key, conf]) => {
                const isSelected = category === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                      isSelected
                        ? "bg-primary text-white shadow-sm"
                        : "bg-surface-container-low/70 text-on-surface-variant hover:bg-surface-container-high/60"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1 ${
                        isSelected ? "text-white" : "text-primary"
                      }`}
                    >
                      <CategoryIcon category={key} size={15} />
                    </div>
                    <span className="text-[10px] font-semibold truncate w-full">
                      {conf.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Catatan Tambahan (Opsional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
              Catatan / Akun (Opsional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: QRIS BCA, Jenius, Cash"
              className="w-full h-10 px-4 bg-surface-container-low rounded-2xl text-xs font-medium text-primary focus:outline-none focus:bg-white border border-surface-container-high transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !amount || !description.trim()}
              className="w-full py-3.5 rounded-2xl bg-primary text-white text-xs font-bold hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{transactionToEdit ? "Simpan Perubahan" : "Catat Transaksi"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
