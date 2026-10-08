"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveStoredUser } from "@/lib/storage";
import { Sparkles, ArrowRight, Wallet, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function OnboardingPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const incomeNum = Number(monthlyIncome.replace(/\D/g, "")) || 0;
      const budgetNum = Number(monthlyBudget.replace(/\D/g, "")) || 0;

      saveStoredUser({
        full_name: fullName.trim() || "Pengguna",
        monthly_income: incomeNum,
        monthly_budget: budgetNum || Math.round(incomeNum * 0.8),
        onboarding_completed: true,
      });

      toast.success("Selamat datang di KitaKaya!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-apple-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white squircle-xl border border-apple-subtle shadow-apple-float p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-black mx-auto mb-3 shadow-sm">
            <Image
              src="/icon.png"
              alt="KitaKaya"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold text-apple-primary">Atur Profil Keuangan</h1>
          <p className="text-xs text-apple-secondary mt-1">
            Data tersimpan aman di browser Anda. Bisa diubah kapan saja.
          </p>
        </div>

        <form onSubmit={handleFinish} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">Nama Kamu</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Dhani"
              className="w-full px-4 py-2.5 bg-apple-surface rounded-xl text-sm border border-apple-subtle focus:outline-none focus:ring-2 focus:ring-apple-blue/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">
              Estimasi Pemasukan Bulanan (IDR)
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
              placeholder="cth. 15.000.000"
              className="w-full px-4 py-2.5 bg-apple-surface rounded-xl text-sm border border-apple-subtle focus:outline-none focus:ring-2 focus:ring-apple-blue/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">
              Target Budget Pengeluaran Bulanan (IDR)
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
              placeholder="cth. 7.500.000"
              className="w-full px-4 py-2.5 bg-apple-surface rounded-xl text-sm border border-apple-subtle focus:outline-none focus:ring-2 focus:ring-apple-blue/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !fullName.trim()}
            className="w-full py-3 bg-apple-primary text-white rounded-xl font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>Mulai Gunakan Dasbor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </main>
  );
}
