"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Transaction, TransactionType, TransactionCategory } from "@/lib/types/database.types";
import { formatCurrency, formatDate, getCategoryConfig } from "@/lib/utils";
import TransactionModal from "@/components/transactions/TransactionModal";
import {
  Sparkles,
  Edit3,
  Search,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export default function TransactionsPage() {
  const supabase = createClient();

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

  const fetchTransactions = async () => {
    setIsLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const { data, error } = await supabase
        .from("transactions")
        .select("id,type,amount,category,description,date,note,created_at")
        .eq("user_id", session.user.id)
        .order("date", { ascending: false });

      if (!error && data) {
        setTransactions(data as any);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
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
        toast.success("Transaksi berhasil diekstrak oleh AI! ✨");
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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Silakan masuk terlebih dahulu");
        return;
      }

      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        type: parsedData.type,
        category: parsedData.category,
        amount: parsedData.amount,
        description: parsedData.description,
        note: parsedData.note || null,
        date: parsedData.date || new Date().toISOString().split("T")[0],
        is_ai_generated: true,
      });

      if (error) throw error;

      toast.success("Transaksi tersimpan ke buku kas! 🚀");
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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const numAmount = Number(manualAmount.replace(/\D/g, ""));
      if (!numAmount || numAmount <= 0) {
        toast.error("Nominal harus lebih dari 0");
        return;
      }

      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        type: manualType,
        category: manualCategory,
        amount: numAmount,
        description: manualTitle.trim(),
        date: manualDate,
        is_ai_generated: false,
      });

      if (error) throw error;

      toast.success("Transaksi manual berhasil dicatat!");
      setManualTitle("");
      setManualAmount("");
      fetchTransactions();
    } catch (err: any) {
      toast.error(err.message || "Gagal mencatat transaksi");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;

    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus transaksi");
    } else {
      toast.success("Transaksi berhasil dihapus");
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
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
                Active Natural Language AI
              </span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              Transaksi & Pencatatan Cerdas.
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
              AI Gemini mengubah kalimat alami Anda menjadi transaksi terstruktur seketika dengan
              kategori dan nominal otomatis.
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
              <span>Input Natural AI</span>
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
              <span>Input Manual</span>
            </button>
          </div>
        </div>

        {/* AI Omnibar */}
        {inputMode === "ai" ? (
          <div className="mt-6">
            <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 border border-surface-container-high/70 shadow-sm space-y-4">
              <div className="relative flex items-center">
                <Sparkles className="w-5 h-5 absolute left-4 text-secondary pointer-events-none" />
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAiProcess();
                  }}
                  placeholder='Contoh: "Beli kopi 25rb pakai Gopay" atau "Terima freelance 3.5jt Jenius"'
                  className="w-full pl-12 pr-28 py-3.5 bg-surface-container-low text-primary text-xs sm:text-sm rounded-2xl border border-surface-container-high focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleAiProcess()}
                  disabled={!promptText.trim() || isAiProcessing}
                  className="absolute right-2 bg-primary hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm disabled:opacity-40"
                >
                  {isAiProcessing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Proses</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Quick Example Chips */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                    CONTOH CEPAT:
                  </span>
                  {[
                    "Beli bensin Shell 200rb BCA",
                    "Gaji bulanan 12jt masuk BCA",
                    "Langganan Netflix 186rb",
                  ].map((sample, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setPromptText(sample);
                        handleAiProcess(sample);
                      }}
                      className="px-3 py-1 bg-surface-container-low hover:bg-surface-container-high rounded-full text-primary text-[11px] font-medium border border-surface-container-high transition-colors"
                    >
                      &ldquo;{sample}&rdquo;
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-outline">
                  <ShieldCheck className="w-3.5 h-3.5 text-tertiary-on-container" />
                  <span>Google Gemini 1.5 Flash • Terenkripsi</span>
                </div>
              </div>

              {/* Live AI Structured Entity Card */}
              {parsedData && (
                <div className="mt-4 p-4 rounded-2xl bg-surface-container border border-surface-container-high flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-scale-up">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-tertiary-container text-tertiary-on-container flex items-center justify-center font-bold flex-shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="font-bold text-tertiary-on-container uppercase tracking-wider">
                          AI Structured Entity
                        </span>
                        <span className="w-1 h-1 rounded-full bg-outline" />
                        <span className="text-outline">Latency: {parsedData.latency}</span>
                      </div>
                      <div className="font-headline text-base font-bold text-primary mt-0.5">
                        {parsedData.description}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[11px] font-medium text-on-surface-variant bg-surface-container-lowest px-2.5 py-0.5 rounded-md border border-surface-container-high">
                          Kategori: {getCategoryConfig(parsedData.category).label}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                            parsedData.type === "income"
                              ? "text-tertiary-on-container bg-tertiary-container/60"
                              : "text-apple-red bg-apple-red/10"
                          }`}
                        >
                          {parsedData.type === "income" ? "+" : "-"}
                          {formatCurrency(parsedData.amount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => setParsedData(null)}
                      className="px-4 py-2 text-xs font-semibold text-outline hover:text-primary transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={commitAiTransaction}
                      className="px-5 py-2 text-xs font-bold bg-primary text-white rounded-full hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Konfirmasi Simpan</span>
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
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-xs text-primary border border-surface-container-high focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary/20"
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
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-xs text-primary font-bold border border-surface-container-high focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                  Tipe & Kategori
                </label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as TransactionCategory)}
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-xs text-primary border border-surface-container-high focus:outline-none focus:bg-white"
                >
                  <option value="food">🍜 Makanan & Minuman</option>
                  <option value="transport">🚗 Transportasi</option>
                  <option value="shopping">🛍️ Belanja</option>
                  <option value="utilities">⚡ Tagihan & Utilitas</option>
                  <option value="salary">💼 Gaji & Pemasukan</option>
                  <option value="freelance">💻 Freelance</option>
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
            className="w-full pl-11 pr-4 py-2.5 text-xs rounded-full border border-surface-container-high bg-white text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-full border border-surface-container-high w-full sm:w-auto">
          <button
            onClick={() => setFilterType("all")}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              filterType === "all"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterType("expense")}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              filterType === "expense"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Pengeluaran
          </button>
          <button
            onClick={() => setFilterType("income")}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              filterType === "income"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Pemasukan
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
              Gunakan Omnibar AI di atas untuk mencatat pengeluaran atau pemasukan pertamamu.
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
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ backgroundColor: `${conf.color}15` }}
                    >
                      {conf.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-primary truncate">
                          {tx.description}
                        </p>
                        {tx.is_ai_generated && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-secondary-fixed text-secondary">
                            AI
                          </span>
                        )}
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
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
