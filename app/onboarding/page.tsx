"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, ArrowRight, Wallet, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Sesi telah berakhir, silakan masuk kembali");
        router.push("/login");
        return;
      }

      const incomeNum = Number(monthlyIncome.replace(/\D/g, "")) || 0;
      const budgetNum = Number(monthlyBudget.replace(/\D/g, "")) || 0;

      const { error } = await supabase
        .from("users")
        .update({
          full_name: fullName.trim() || user.email?.split("@")[0],
          monthly_income: incomeNum,
          monthly_budget: budgetNum || Math.round(incomeNum * 0.8),
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Selamat datang di KitaKaya! 🚀");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan data onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-apple-subtle p-8 shadow-apple-float animate-scale-up space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-apple-primary text-white font-bold text-xl mx-auto shadow-sm">
            K
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-apple-primary">
            Siapkan Keuanganmu
          </h1>
          <p className="text-xs text-apple-secondary">
            Personalisasi KitaKaya untuk membantu mencapai kebebasan finansialmu.
          </p>
        </div>

        {/* Steps */}
        <form onSubmit={handleFinish} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">Nama Lengkap</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="cth. Dhani Dwi"
              className="w-full px-4 py-3 rounded-xl border border-apple-subtle bg-apple-surface/40 text-sm text-apple-primary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">
              Estimasi Pemasukan Bulanan (IDR)
            </label>
            <input
              type="number"
              required
              min="0"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="cth. 10000000"
              className="w-full px-4 py-3 rounded-xl border border-apple-subtle bg-apple-surface/40 text-sm text-apple-primary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-apple-primary">
              Target Budget Pengeluaran Bulanan (Opsional)
            </label>
            <input
              type="number"
              min="0"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              placeholder="cth. 7000000 (default 80% pemasukan)"
              className="w-full px-4 py-3 rounded-xl border border-apple-subtle bg-apple-surface/40 text-sm text-apple-primary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-apple-primary text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              "Menyimpan..."
            ) : (
              <>
                Mulai Gunakan KitaKaya <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
