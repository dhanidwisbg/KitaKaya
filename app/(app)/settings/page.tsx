"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/lib/types/database.types";
import { getClientUserId, clearClientUserId } from "@/lib/session-client";
import {
  User as UserIcon,
  Wallet,
  Mail,
  LogOut,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [profile, setProfile] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [currency, setCurrency] = useState("IDR");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const userId = getClientUserId();

      if (userId) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (data && !error) {
          setProfile(data);
          setFullName(data.full_name || "");
          setEmail(data.email || "");
          setMonthlyIncome(String(data.monthly_income || 0));
          setMonthlyBudget(String(data.monthly_budget || 0));
          setCurrency(data.currency || "IDR");
        }
      }
      setIsLoading(false);
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const userId = getClientUserId();
      if (!userId) {
        toast.error("Sesi tidak ditemukan, silakan masukkan nama Anda kembali");
        router.push("/welcome");
        return;
      }

      const cleanName = fullName.trim();
      if (!cleanName) {
        toast.error("Nama lengkap tidak boleh kosong");
        setIsSaving(false);
        return;
      }

      const incomeNum = Number(monthlyIncome.replace(/\D/g, "")) || 0;
      const budgetNum = Number(monthlyBudget.replace(/\D/g, "")) || 0;
      const cleanEmail = email.trim() || null;

      const { error } = await supabase
        .from("users")
        .update({
          full_name: cleanName,
          email: cleanEmail,
          monthly_income: incomeNum,
          monthly_budget: budgetNum,
          currency,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      toast.success("Pengaturan profil berhasil disimpan! ✨");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan pengaturan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    clearClientUserId();
    await fetch("/api/auth/session", { method: "DELETE" });
    toast.success("Sesi telah dihapus");
    router.push("/welcome");
    router.refresh();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-apple-primary">
          Pengaturan Akun & Profil
        </h1>
        <p className="text-xs text-apple-secondary">
          Kelola profil nama, email pengiriman laporan keuangan, dan target anggaran bulananmu.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-apple-secondary">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-apple-blue" />
          Memuat pengaturan...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl border border-apple-subtle p-6 shadow-apple-card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-apple-subtle">
              <UserIcon className="w-4 h-4 text-apple-blue" />
              <h2 className="text-sm font-semibold text-apple-primary">Informasi Pribadi</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-apple-primary">Nama Kamu</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Dhani"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-apple-subtle bg-apple-surface/40 text-apple-primary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-apple-primary flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-apple-blue" />
                    Email Pengiriman Laporan
                  </span>
                  <span className="text-[10px] text-apple-secondary font-normal">
                    (Untuk terima rekap & PDF)
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="namaanda@gmail.com"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-apple-subtle bg-white text-apple-primary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue"
                />
                <p className="text-[11px] text-apple-secondary">
                  Laporan bulanan atau unduhan PDF akan dikirimkan ke alamat email ini.
                </p>
              </div>
            </div>
          </div>

          {/* Financial Target Card */}
          <div className="bg-white rounded-3xl border border-apple-subtle p-6 shadow-apple-card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-apple-subtle">
              <Wallet className="w-4 h-4 text-apple-green" />
              <h2 className="text-sm font-semibold text-apple-primary">
                Pemasukan & Batas Budget
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-apple-primary">
                  Estimasi Pemasukan Bulanan (IDR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-apple-subtle bg-apple-surface/40 text-apple-primary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-apple-primary">
                  Target Maksimal Pengeluaran (IDR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-apple-subtle bg-apple-surface/40 text-apple-primary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-apple-red/30 text-apple-red hover:bg-apple-red/10 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Ganti Nama / Reset Sesi
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-apple-primary text-white text-xs font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 shadow-sm cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan Pengaturan
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
