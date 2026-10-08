"use client";

import { useState, useEffect } from "react";
import { Transaction, TransactionType, TransactionCategory } from "@/lib/types/database.types";
import { formatCurrency, formatDate, getCategoryConfig } from "@/lib/utils";
import TransactionModal from "@/components/transactions/TransactionModal";
import CategoryIcon from "@/components/ui/CategoryIcon";
import {
  getStoredTransactions,
  addStoredTransaction,
  deleteStoredTransaction,
  getStoredUser,
  subscribeStorage,
} from "@/lib/storage";
import {
  Sparkles,
  Edit3,
  Search,
  Plus,
  Trash2,
  Edit2,
  Check,
  Loader2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputMode, setInputMode] = useState<"ai" | "manual">("ai");

  // AI Omnibar State
  const [promptText, setPromptText] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<{
    description: string;
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    date: string;
    note?: string | null;
    latency?: string;
  } | null>(null);

  // Manual Input State
  const [manualTitle, setManualTitle] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualType, setManualType] = useState<TransactionType>("expense");
  const [manualCategory, setManualCategory] = useState<TransactionCategory>("food");
  const [manualDate, setManualDate] = useState(new Date().toISOString().split("T")[0]);

  // List & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const fetchTransactions = () => {
    setIsLoading(true);
    const data = getStoredTransactions();
    setTransactions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    const unsubscribe = subscribeStorage(() => {
      fetchTransactions();
    });
    return unsubscribe;
  }, []);

  const handleAiProcess = async (textToProcess?: string) => {
    const text = textToProcess || promptText;
    if (!text.trim() || isAiProcessing) return;

    setIsAiProcessing(true);
    try {
      const res = await fetch("/api/ai/parse-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setParsedData({
          ...json.data,
          latency: json.latency,
        });
        toast.success("Transaksi berhasil diekstrak secara otomatis!");
      } else {
        throw new Error(json.error || "Gagal mengekstrak transaksi");
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memproses transaksi dengan AI");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const commitAiTransaction = async () => {
    if (!parsedData) return;

    try {
      const user = getStoredUser();
      addStoredTransaction({
        user_id: user.id,
        type: parsedData.type,
        category: parsedData.category,
        amount: parsedData.amount,
        description: parsedData.description,
        note: parsedData.note || null,
        date: parsedData.date || new Date().toISOString().split("T")[0],
      });

      toast.success("Transaksi tersimpan di buku kas lokal!");
      setParsedData(null);
      setPromptText("");
      fetchTransactions();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan transaksi");
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = getStoredUser();
      const numAmount = Number(manualAmount.replace(/\D/g, ""));
      if (!numAmount || numAmount <= 0) {
        toast.error("Nominal harus lebih dari 0");
        return;
      }

      addStoredTransaction({
        user_id: user.id,
        type: manualType,
        category: manualCategory,
        amount: numAmount,
        description: manualTitle.trim(),
        date: manualDate,
        note: null,
      });

      toast.success("Transaksi manual berhasil dicatat!");
      setManualTitle("");
      setManualAmount("");
      fetchTransactions();
    } catch (err: any) {
      toast.error(err.message || "Gagal mencatat transaksi");
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;
    deleteStoredTransaction(id);
    toast.success("Transaksi berhasil dihapus");
    fetchTransactions();
  };

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.note && t.note.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Editorial Header & Watermark */}
      <div className="relative overflow-hidden rounded-3xl bg-surface-container-low p-6 sm:p-8 md:p-10 border border-surface-container-high/60 shadow-apple-card">
        <div className="absolute -right-6 -bottom-10 select-none pointer-events-none opacity-[0.03] font-headline text-[160px] leading-none text-primary uppercase font-bold tracking-tighter">
          CATAT
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container-lowest shadow-sm mb-3 border border-surface-container-high/50">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Penyimpanan Lokal Browser • Privat
              </span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              Buku Kas & Transaksi.
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
              Catat pemasukan dan pengeluaran secara terstruktur dengan asisten cepat atau form manual.
            </p>
          </div>

          {/* Mode Toggle Pill */}
          <div className="flex items-center bg-surface-container-highest p-1 rounded-full self-start md:self-auto shadow-inner border border-surface-container-high/60">
            <button
              onClick={() => setInputMode("ai")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                inputMode === "ai"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Input Cepat Natural</span>
            </button>
            <button
              onClick={() => setInputMode("manual")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                inputMode === "manual"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Input Form</span>
            </button>
          </div>
        </div>

        {/* AI Omnibar */}
        {inputMode === "ai" ? (
          <div className="mt-8 relative z-10 space-y-4">
            <div className="relative bg-surface-container-lowest rounded-2xl p-2 border border-surface-container-high/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <div className="flex items-center gap-3 px-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0" />
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isAiProcessing) {
                      handleAiProcess();
                    }
                  }}
                  placeholder='Ketik natural: "Kopi Kenangan 28rb", "Gaji proyek 5jt", "Bensin 150rb"...'
                  className="w-full py-2.5 text-xs sm:text-sm font-medium bg-transparent border-0 focus:outline-none text-primary placeholder:text-outline"
                />
                <button
                  onClick={() => handleAiProcess()}
                  disabled={isAiProcessing || !promptText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  {isAiProcessing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <span>Proses</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Parsed Result Confirmation Card */}
              {parsedData && (
                <div className="mt-3 p-4 rounded-xl bg-surface-container-low border border-surface-container-high/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-scale-up">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                      <CategoryIcon category={parsedData.category} size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">
                          {parsedData.description}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            parsedData.type === "income"
                              ? "bg-tertiary-container text-tertiary-on-container"
                              : "bg-apple-red/10 text-apple-red"
                          }`}
                        >
                          {parsedData.type === "income" ? "+ Pemasukan" : "- Pengeluaran"}
                        </span>
                      </div>
                      <div className="text-[11px] text-outline mt-0.5">
                        <span>Rp {parsedData.amount.toLocaleString("id-ID")}</span>
                        <span> • </span>
                        <span>{getCategoryConfig(parsedData.category).label}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setParsedData(null)}
                      className="px-3 py-1.5 text-xs font-semibold text-outline hover:text-primary transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={commitAiTransaction}
                      className="px-4 py-1.5 text-xs font-bold bg-primary text-white rounded-full hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Manual Input Container */
          <form
            onSubmit={handleManualSubmit}
            className="mt-6 bg-surface-container-lowest rounded-3xl p-6 border border-surface-container-high/70 shadow-sm space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                  Judul Transaksi
                </label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Deskripsi transaksi..."
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-xs text-primary border border-surface-container-high focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                  Nominal (IDR)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-xs text-primary font-bold border border-surface-container-high focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                  Kategori
                </label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as TransactionCategory)}
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-xs text-primary border border-surface-container-high focus:outline-none focus:bg-white"
                >
                  <option value="food">Makanan & Minuman</option>
                  <option value="transport">Transportasi</option>
                  <option value="shopping">Belanja</option>
                  <option value="utilities">Tagihan & Utilitas</option>
                  <option value="salary">Gaji & Pemasukan</option>
                  <option value="freelance">Freelance</option>
                  <option value="health">Kesehatan</option>
                  <option value="other_expense">Lainnya</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                  Tanggal
                </label>
                <input
                  type="date"
                  required
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-xs text-primary border border-surface-container-high focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-xs hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Simpan Transaksi Manual
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi berdasarkan nama atau catatan..."
            className="w-full pl-11 pr-4 py-2.5 text-xs rounded-full border border-surface-container-high bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
        </div>

        {/* Filter Pills and Add Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-full border border-surface-container-high">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                filterType === "all"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType("expense")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                filterType === "expense"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Pengeluaran
            </button>
            <button
              onClick={() => setFilterType("income")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                filterType === "income"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Pemasukan
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedTx(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/60 shadow-apple-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-outline">
            Memuat buku kas transaksi...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <p className="text-sm font-bold text-primary">Belum ada transaksi</p>
            <p className="text-xs text-outline">
              Gunakan pencatat cepat di atas untuk mencatat pengeluaran atau pemasukan pertamamu.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-container-high/60">
            {filtered.map((tx) => {
              const conf = getCategoryConfig(tx.category);
              const isIncome = tx.type === "income";

              return (
                <div
                  key={tx.id}
                  className="p-4 sm:px-6 flex items-center justify-between hover:bg-surface-container-low/40 transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-surface-container-low border border-surface-container-high/60 text-primary flex-shrink-0">
                      <CategoryIcon category={tx.category} size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-primary truncate">
                          {tx.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-outline mt-0.5">
                        <span>{conf.label}</span>
                        <span>•</span>
                        <span>{formatDate(tx.date)}</span>
                        {tx.note && (
                          <>
                            <span>•</span>
                            <span className="italic truncate">{tx.note}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        isIncome ? "text-tertiary-on-container" : "text-primary"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedTx(tx);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container-low transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-1.5 rounded-lg text-outline hover:text-apple-red hover:bg-apple-red/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionToEdit={selectedTx}
        onSuccess={fetchTransactions}
      />
    </div>
  );
}
