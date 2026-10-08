"use client";

import { useState } from "react";
import { saveStoredUser } from "@/lib/storage";
import {
  User,
  Wallet,
  Target,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface OnboardingCardProps {
  initialName?: string;
  onComplete: () => void;
}

type Step = "name" | "income" | "budget" | "done";

const STEPS: Step[] = ["name", "income", "budget", "done"];

function formatRupiah(val: string): string {
  const num = val.replace(/\D/g, "");
  if (!num) return "";
  return parseInt(num, 10).toLocaleString("id-ID");
}

function parseRupiah(val: string): number {
  return parseInt(val.replace(/\D/g, ""), 10) || 0;
}

export default function OnboardingCard({
  initialName = "",
  onComplete,
}: OnboardingCardProps) {
  // If name is already known (from welcome page), skip straight to income step
  const startStep: Step = initialName.trim() ? "income" : "name";
  const [step, setStep] = useState<Step>(startStep);
  const [name, setName] = useState(initialName);
  const [incomeRaw, setIncomeRaw] = useState("");
  const [budgetRaw, setBudgetRaw] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const totalSteps = STEPS.length - 1; // exclude "done"

  const handleNextFromName = () => {
    if (!name.trim()) {
      toast.error("Isi nama kamu dulu ya 😊");
      return;
    }
    setStep("income");
  };

  const handleNextFromIncome = () => {
    if (parseRupiah(incomeRaw) <= 0) {
      toast.error("Masukkan jumlah pemasukan bulanan");
      return;
    }
    // Auto-suggest budget as 70% of income
    const suggested = Math.round((parseRupiah(incomeRaw) * 0.7) / 100000) * 100000;
    setBudgetRaw(formatRupiah(String(suggested)));
    setStep("budget");
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      saveStoredUser({
        full_name: name.trim(),
        monthly_income: parseRupiah(incomeRaw),
        monthly_budget: parseRupiah(budgetRaw),
        currency: "IDR",
        onboarding_completed: true,
      });
      setStep("done");
      setTimeout(() => {
        onComplete();
      }, 1800);
    } catch {
      toast.error("Gagal menyimpan, coba lagi");
    } finally {
      setIsSaving(false);
    }
  };

  // ── DONE SCREEN ──────────────────────────────────────────────
  if (step === "done") {
    return (
      <div className="rounded-3xl bg-primary text-white p-8 sm:p-10 flex flex-col items-center text-center gap-4 animate-scale-up shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="font-headline text-2xl font-bold tracking-tight">
            Siap, {name.trim()}! 🎉
          </h2>
          <p className="text-white/70 text-sm mt-1">
            Dashboard keuanganmu sudah aktif. Mulai catat transaksi pertamamu.
          </p>
        </div>
        <div className="flex items-center gap-2 text-white/50 text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Menyiapkan dashboard untukmu...</span>
        </div>
      </div>
    );
  }

  // ── PROGRESS BAR ─────────────────────────────────────────────
  const progress = ((stepIndex) / totalSteps) * 100;

  return (
    <div className="rounded-3xl bg-surface-container-lowest border border-surface-container-high/60 shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden animate-fade-in">
      {/* Top gradient accent */}
      <div className="h-1 bg-surface-container-high rounded-t-3xl overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-6 sm:p-8 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-outline">
                Setup Awal • Langkah {stepIndex + 1} dari {totalSteps}
              </p>
              <h2 className="font-headline text-xl font-bold text-primary tracking-tight">
                {step === "name" && "Halo! Siapa nama kamu?"}
                {step === "income" && "Berapa pemasukan bulananmu?"}
                {step === "budget" && "Tentukan batas pengeluaranmu"}
              </h2>
            </div>
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-1.5 self-center">
            {["name", "income", "budget"].map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= stepIndex ? "w-6 bg-primary" : "w-2 bg-surface-container-high"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── STEP: NAME ────────────────────────────── */}
        {step === "name" && (
          <div className="space-y-6">
            <p className="text-sm text-on-surface-variant">
              Nama akan ditampilkan di dashboard dan dipakai oleh Asisten Finansial untuk personalisasi saran.
            </p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNextFromName()}
                placeholder="Contoh: Budi, Sari, Rizki..."
                className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-surface-container-high rounded-2xl text-base font-semibold text-primary placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/25 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {["Budi", "Sari", "Rizki", "Anya", "Dika", "Nisa"].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setName(suggestion)}
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-surface-container-low hover:bg-primary hover:text-white text-on-surface-variant border border-surface-container-high transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextFromName}
              disabled={!name.trim()}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <span>Lanjut</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* ── STEP: INCOME ──────────────────────────── */}
        {step === "income" && (
          <div className="space-y-6">
            <p className="text-sm text-on-surface-variant">
              Masukkan estimasi total pemasukan per bulan (gaji, freelance, dll). Ini dipakai untuk menghitung rasio keuangan 50/30/20 kamu.
            </p>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-sm font-bold text-outline">Rp</span>
              </div>
              <input
                type="text"
                autoFocus
                inputMode="numeric"
                value={incomeRaw}
                onChange={(e) => setIncomeRaw(formatRupiah(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && handleNextFromIncome()}
                placeholder="0"
                className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-surface-container-high rounded-2xl text-xl font-bold text-primary placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/25 focus:bg-white transition-all tabular-nums"
              />
            </div>

            {/* Quick-pick presets */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-outline mb-2">Pilih Cepat</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Rp 5jt", value: 5000000 },
                  { label: "Rp 10jt", value: 10000000 },
                  { label: "Rp 15jt", value: 15000000 },
                  { label: "Rp 20jt", value: 20000000 },
                ].map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setIncomeRaw(formatRupiah(String(p.value)))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      parseRupiah(incomeRaw) === p.value
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-surface-container-low text-on-surface-variant border-surface-container-high hover:border-primary hover:text-primary"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Income info card */}
            {parseRupiah(incomeRaw) > 0 && (
              <div className="p-4 rounded-2xl bg-tertiary-container/30 border border-surface-container-high/60 flex items-center gap-3 animate-scale-up">
                <TrendingUp className="w-5 h-5 text-tertiary-on-container shrink-0" />
                <div>
                  <p className="text-xs font-bold text-primary">
                    Pemasukan: Rp {parseRupiah(incomeRaw).toLocaleString("id-ID")}/bulan
                  </p>
                  <p className="text-[11px] text-outline">
                    Rekomendasi tabungan 20%: Rp {Math.round(parseRupiah(incomeRaw) * 0.2).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleNextFromIncome}
              disabled={parseRupiah(incomeRaw) <= 0}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <span>Lanjut</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* ── STEP: BUDGET ──────────────────────────── */}
        {step === "budget" && (
          <div className="space-y-6">
            <p className="text-sm text-on-surface-variant">
              Batas pengeluaran bulanan adalah total maksimal yang boleh kamu keluarkan untuk kebutuhan dan keinginan (tidak termasuk tabungan).
            </p>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-sm font-bold text-outline">Rp</span>
              </div>
              <input
                type="text"
                autoFocus
                inputMode="numeric"
                value={budgetRaw}
                onChange={(e) => setBudgetRaw(formatRupiah(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && !isSaving && handleFinish()}
                placeholder="0"
                className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-surface-container-high rounded-2xl text-xl font-bold text-primary placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/25 focus:bg-white transition-all tabular-nums"
              />
            </div>

            {/* Budget ratio hint */}
            {parseRupiah(incomeRaw) > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { pct: 50, label: "Konservatif", desc: "Hemat ketat" },
                  { pct: 70, label: "Seimbang", desc: "Disarankan" },
                  { pct: 80, label: "Fleksibel", desc: "Pengeluaran luwes" },
                ].map((opt) => {
                  const val = Math.round((parseRupiah(incomeRaw) * opt.pct) / 100 / 100000) * 100000;
                  const isSelected = parseRupiah(budgetRaw) === val;
                  return (
                    <button
                      key={opt.pct}
                      type="button"
                      onClick={() => setBudgetRaw(formatRupiah(String(val)))}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-surface-container-low border-surface-container-high hover:border-primary"
                      }`}
                    >
                      <p className={`text-xs font-bold ${isSelected ? "text-white" : "text-primary"}`}>
                        {opt.pct}% · {opt.label}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${isSelected ? "text-white/70" : "text-outline"}`}>
                        {opt.desc}
                      </p>
                      <p className={`text-xs font-bold mt-1 tabular-nums ${isSelected ? "text-white" : "text-primary"}`}>
                        Rp {val.toLocaleString("id-ID")}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Summary review */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/40 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-outline">Ringkasan Setup</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Nama</span>
                <span className="font-bold text-primary">{name.trim()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Pemasukan Bulanan</span>
                <span className="font-bold text-primary">Rp {parseRupiah(incomeRaw).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Batas Pengeluaran</span>
                <span className="font-bold text-primary">Rp {parseRupiah(budgetRaw).toLocaleString("id-ID")}</span>
              </div>
              {parseRupiah(incomeRaw) > 0 && parseRupiah(budgetRaw) > 0 && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-surface-container-high/60">
                  <span className="text-on-surface-variant">Target Tabungan Bulanan</span>
                  <span className="font-bold text-tertiary-on-container">
                    Rp {(parseRupiah(incomeRaw) - parseRupiah(budgetRaw)).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-outline">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Semua data tersimpan hanya di browser kamu. Tidak ada yang dikirim ke server.</span>
            </div>

            <button
              onClick={handleFinish}
              disabled={parseRupiah(budgetRaw) <= 0 || isSaving}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              {isSaving ? (
                <span>Menyimpan...</span>
              ) : (
                <>
                  <span>Mulai Kelola Keuangan</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
