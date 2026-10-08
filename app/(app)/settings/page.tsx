"use client";

import { useState, useEffect, useRef } from "react";
import { User } from "@/lib/types/database.types";
import {
  getStoredUser,
  saveStoredUser,
  clearUserSession,
  exportAllDataToJson,
  importAllDataFromJson,
  resetAllStorageToDefault,
} from "@/lib/storage";
import {
  User as UserIcon,
  Wallet,
  Mail,
  LogOut,
  Save,
  Loader2,
  CheckCircle2,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  HardDrive,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [currency, setCurrency] = useState("IDR");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
      setMonthlyIncome(String(user.monthly_income || 0));
      setMonthlyBudget(String(user.monthly_budget || 0));
      setCurrency(user.currency || "IDR");
    }
    setIsLoading(false);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      saveStoredUser({
        full_name: fullName.trim(),
        email: email.trim() || null,
        monthly_income: Number(monthlyIncome.replace(/\D/g, "")),
        monthly_budget: Number(monthlyBudget.replace(/\D/g, "")),
        currency,
      });

      toast.success("Pengaturan profil berhasil disimpan di peramban!");
    } catch {
      toast.error("Gagal menyimpan profil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    try {
      const json = exportAllDataToJson();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kitakaya_backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("File cadangan JSON berhasil diunduh 📁");
    } catch {
      toast.error("Gagal mengekspor data");
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importAllDataFromJson(content);
      if (ok) {
        toast.success("Data berhasil dipulihkan dari cadangan JSON! 🎉");
        // Reload settings fields
        const user = getStoredUser();
        setFullName(user.full_name || "");
        setEmail(user.email || "");
        setMonthlyIncome(String(user.monthly_income || 0));
        setMonthlyBudget(String(user.monthly_budget || 0));
      } else {
        toast.error("Format file cadangan tidak valid");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleResetData = () => {
    if (
      !confirm(
        "Hapus semua data? Seluruh transaksi, kantong tabungan, dan profil akan dihapus. Kamu akan diminta mengisi ulang preferensi awal."
      )
    )
      return;

    resetAllStorageToDefault();
    toast.success("Data berhasil dihapus. Silakan isi ulang preferensimu.");
    router.push("/dashboard");
    router.refresh();
  };

  const handleLogout = async () => {
    clearUserSession();
    await fetch("/api/auth/session", { method: "DELETE" });
    toast.success("Sesi telah keluar");
    router.push("/welcome");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-outline">
        Memuat preferensi pengguna...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary font-headline">
          Pengaturan & Data.
        </h1>
        <p className="text-xs sm:text-sm text-outline mt-1">
          Kelola profil finansial dan kelola cadangan data langsung di browser Anda.
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/60 p-6 sm:p-8 shadow-apple-card space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-surface-container-high/60">
          <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary border border-surface-container-high">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-primary font-headline">Profil Finansial</h2>
            <p className="text-xs text-outline">Informasi target dan alokasi anggaran bulanan</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
                Nama Pengguna
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dhani"
                className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low rounded-2xl border border-surface-container-high focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 text-primary transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
                Alamat Email (Untuk Laporan PDF)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low rounded-2xl border border-surface-container-high focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 text-primary transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
                Estimasi Gaji / Pemasukan Bulanan (Rp)
              </label>
              <input
                type="text"
                value={
                  monthlyIncome
                    ? Number(monthlyIncome.replace(/\D/g, "")).toLocaleString("id-ID")
                    : ""
                }
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  setMonthlyIncome(raw);
                }}
                placeholder="0"
                className="w-full h-11 px-4 text-xs font-bold bg-surface-container-low rounded-2xl border border-surface-container-high focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 text-primary transition-all tabular-nums"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wider text-[11px]">
                Target Pagu Pengeluaran Bulanan (Rp)
              </label>
              <input
                type="text"
                value={
                  monthlyBudget
                    ? Number(monthlyBudget.replace(/\D/g, "")).toLocaleString("id-ID")
                    : ""
                }
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  setMonthlyBudget(raw);
                }}
                placeholder="0"
                className="w-full h-11 px-4 text-xs font-bold bg-surface-container-low rounded-2xl border border-surface-container-high focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 text-primary transition-all tabular-nums"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-full bg-primary text-white text-xs font-bold hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Data Management Section (Browser Storage Control) */}
      <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/60 p-6 sm:p-8 shadow-apple-card space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-surface-container-high/60">
          <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary border border-surface-container-high">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-primary font-headline">Manajemen Data Browser</h2>
            <p className="text-xs text-outline">
              Data Anda 100% tersimpan di browser ini. Cadangkan atau pulihkan kapan saja.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleExport}
            className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container-high text-left border border-surface-container-high/60 transition-colors group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-primary mb-3 shadow-sm group-hover:scale-105 transition-transform">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary">Ekspor ke JSON</p>
              <p className="text-[11px] text-outline mt-0.5">
                Unduh seluruh riwayat transaksi & kantong tabungan.
              </p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container-high text-left border border-surface-container-high/60 transition-colors group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-primary mb-3 shadow-sm group-hover:scale-105 transition-transform">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary">Impor dari JSON</p>
              <p className="text-[11px] text-outline mt-0.5">
                Pulihkan data dari file cadangan sebelumnya.
              </p>
            </div>
          </button>

          <button
            onClick={handleResetData}
            className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container-high text-left border border-surface-container-high/60 transition-colors group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-apple-red mb-3 shadow-sm group-hover:scale-105 transition-transform">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-apple-red">Reset Data Awal</p>
              <p className="text-[11px] text-outline mt-0.5">
                Kembalikan buku kas ke data contoh default.
              </p>
            </div>
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleImportFile}
          className="hidden"
        />
      </div>

      {/* Session Management */}
      <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/60 p-6 sm:p-8 shadow-apple-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-primary">Keluar dari Sesi Ini</h3>
          <p className="text-xs text-outline mt-0.5">
            Menghapus cookie aktif peramban (data lokal tetap tersimpan di browser).
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 rounded-full border border-apple-red/30 text-apple-red hover:bg-apple-red/10 text-xs font-bold transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </div>
  );
}
