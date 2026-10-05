"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Transaction,
  TransactionType,
  TransactionCategory,
} from "@/lib/types/database.types";
import { CATEGORY_CONFIG } from "@/lib/utils";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
  onSuccess?: () => void;
}

const categories = Object.entries(CATEGORY_CONFIG) as [
  TransactionCategory,
  { label: string; icon: string; color: string; type: "income" | "expense" | "both" }
][];

export default function TransactionModal({
  isOpen,
  onClose,
  transactionToEdit,
  onSuccess,
}: TransactionModalProps) {
  const router = useRouter();
  const supabase = createClient();

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

      if (transactionToEdit) {
        const { error } = await supabase
          .from("transactions")
          .update({
            type,
            category,
            amount: numAmount,
            description: description.trim(),
            note: note.trim() || null,
            date,
            updated_at: new Date().toISOString(),
          })
          .eq("id", transactionToEdit.id)
          .eq("user_id", user.id);

        if (error) throw error;
        toast.success("Transaksi berhasil diperbarui");
      } else {
        const { error } = await supabase.from("transactions").insert({
          user_id: user.id,
          type,
          category,
          amount: numAmount,
          description: description.trim(),
          note: note.trim() || null,
          date,
        });

        if (error) throw error;
        toast.success("Transaksi berhasil dicatat ✨");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-apple-subtle shadow-apple-float overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-apple-subtle">
          <h2 className="text-base font-semibold text-apple-primary">
            {transactionToEdit ? "Edit Transaksi" : "Tambah Transaksi Baru"}
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
          {/* Type Toggle */}
          <div className="grid grid-cols-2 p-1 bg-apple-surface rounded-xl border border-apple-subtle">
            <button
              type="button"
              onClick={() => {
                setType("expense");
                setCategory("food");
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                type === "expense"
                  ? "bg-white text-apple-red shadow-sm"
                  : "text-apple-secondary hover:text-apple-primary"
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => {
                setType("income");
                setCategory("salary");
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                type === "income"
                  ? "bg-white text-apple-green shadow-sm"
                  : "text-apple-secondary hover:text-apple-primary"
              }`}
            >
              Pemasukan
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">Nominal (IDR)</label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 text-lg font-bold text-apple-primary rounded-xl border border-apple-subtle bg-apple-surface/40 focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">Keterangan</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="cth. Makan Siang Padang, Kopi Kenangan"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-apple-subtle bg-apple-surface/40 text-apple-primary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-apple-subtle bg-apple-surface/40 text-apple-primary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
            >
              {filteredCategories.map(([key, item]) => (
                <option key={key} value={key}>
                  {item.icon} {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">Tanggal</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-apple-subtle bg-apple-surface/40 text-apple-primary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
            />
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">Catatan (Opsional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="cth. Dibayarin sebagian oleh kantor"
              className="w-full px-4 py-2 text-sm rounded-xl border border-apple-subtle bg-apple-surface/40 text-apple-primary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
            />
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
              {transactionToEdit ? "Simpan Perubahan" : "Catat Transaksi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
