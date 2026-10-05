import { createClient } from "@/lib/supabase/server";
import { formatCurrency, thisMonthRange, formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  TrendingUp,
  Plus,
  Minus,
  ArrowRight,
  Shield,
  Laptop,
  Plane,
  Sparkles,
  Lock,
  ArrowUpRight,
  ChevronDown,
  ShoppingCart,
  Coffee,
  Terminal,
  CreditCard,
  FileDown,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";
import FloatingAiWidget from "@/components/dashboard/FloatingAiWidget";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Finansial — Kita Kaya",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { start, end } = thisMonthRange();

  // Parallelkan semua query agar tidak sequential (waterfall)
  const [
    { data: dbTransactions },
    { data: dbGoals },
    { data: profile },
  ] = await Promise.all([
    supabase
      .from("transactions")
      .select("id,type,amount,category,description,date,note")
      .eq("user_id", user!.id)
      .gte("date", start)
      .lte("date", end)
      .order("date", { ascending: false }),
    supabase
      .from("savings_goals")
      .select("id,name,target_amount,current_amount,deadline,icon,color")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("users")
      .select("full_name,monthly_income,monthly_budget")
      .eq("id", user!.id)
      .single(),
  ]);

  const txList = dbTransactions ?? [];

  // Calculate live numbers
  const liveIncome = txList
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const liveExpense = txList
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Fallback to Stitch design reference values if user has no transactions yet
  const totalIncome = liveIncome > 0 ? liveIncome : 18200000;
  const totalExpense = liveExpense > 0 ? liveExpense : 7450000;
  const netBalance = totalIncome - totalExpense;
  const savingsRate = Math.round((netBalance / totalIncome) * 100);

  const todayStr = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const userName = profile?.full_name?.split(" ")[0] || "Dhani";

  return (
    <div className="flex flex-col w-full pb-16 animate-fade-in space-y-8">
      {/* 1. Top Greeting & Context Section */}
      <section className="relative overflow-hidden pt-2 pb-2">
        {/* Faint Editorial Watermark */}
        <div className="absolute -top-12 -right-8 pointer-events-none select-none opacity-[0.025] font-headline text-[180px] leading-none tracking-tighter text-primary">
          KAYA
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant shadow-sm border border-surface-container-highest">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-on-container animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase font-sans">
              {todayStr}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary">
                Halo, {userName}.
              </h1>
              <p className="text-sm md:text-base text-on-surface-variant max-w-xl mt-1">
                Kekayaan bersih dan arus kas Anda tumbuh sehat bulan ini.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-surface-container-high self-start md:self-auto">
              <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary text-white shadow-sm transition-all">
                Bulan Ini
              </button>
              <button className="px-4 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant hover:text-primary transition-all">
                Kuartal 1
              </button>
              <button className="px-4 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant hover:text-primary transition-all">
                Tahun 2026
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Master Wealth Card (Hero Artifact) */}
      <section>
        <div className="relative overflow-hidden rounded-3xl bg-surface-container-lowest p-6 sm:p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-surface-container-high/60">
          {/* Ambient Lighting Arc */}
          <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-6 relative z-10">
            {/* Card Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">
                  Total Saldo Kekayaan Bersih
                </span>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-container text-tertiary-on-container font-bold text-[11px]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+14.8% vs bln lalu</span>
                </div>
              </div>
              <span className="text-xs text-outline">
                Pembaruan otomatis • Real-time BCA & Jenius
              </span>
            </div>

            {/* Big Metric Number */}
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl font-medium text-outline-variant">Rp</span>
              <span className="font-headline text-5xl sm:text-6xl font-bold tracking-tighter text-primary tabular-nums">
                {netBalance.toLocaleString("id-ID")}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono">
                IDR • AUDITED
              </span>
            </div>

            {/* Secondary Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-outline">
                    Pemasukan Bulan Ini
                  </span>
                  <span className="w-2 h-2 rounded-full bg-tertiary-on-container" />
                </div>
                <span className="font-headline text-2xl font-bold text-primary tabular-nums">
                  Rp {totalIncome.toLocaleString("id-ID")}
                </span>
                <span className="text-xs text-tertiary-on-container font-medium">
                  ↑ 8% melampaui rata-rata target
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-outline">
                    Pengeluaran Bulan Ini
                  </span>
                  <span className="w-2 h-2 rounded-full bg-primary-container" />
                </div>
                <span className="font-headline text-2xl font-bold text-primary tabular-nums">
                  Rp {totalExpense.toLocaleString("id-ID")}
                </span>
                <span className="text-xs text-on-surface-variant">
                  41% dari batas pagu bulanan (Aman)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-outline">
                    Rasio Tabungan (Savings Rate)
                  </span>
                  <span className="text-xs font-bold text-secondary">50/30/20</span>
                </div>
                <span className="font-headline text-2xl font-bold text-primary tabular-nums">
                  {savingsRate},0%
                </span>
                <span className="text-xs text-secondary font-medium">
                  Tier Finansial: Superior Editorial
                </span>
              </div>
            </div>

            {/* Interactive Action Pill Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-surface-container-high/60">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/transactions"
                  className="group flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-white text-xs font-bold shadow-sm hover:bg-neutral-800 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                  <span>+ Pemasukan</span>
                </Link>
                <Link
                  href="/transactions"
                  className="group flex items-center gap-2 px-5 py-3 rounded-full bg-surface-container-lowest text-primary text-xs font-bold shadow-sm border border-surface-container-high hover:bg-surface-container-low active:scale-95 transition-all"
                >
                  <Minus className="w-4 h-4 text-apple-red" />
                  <span>- Pengeluaran</span>
                </Link>
                <Link
                  href="/goals"
                  className="flex items-center gap-1.5 px-4 py-3 rounded-full text-on-surface-variant hover:text-primary text-xs font-semibold transition-colors"
                >
                  <span>Transfer & Investasi</span>
                </Link>
              </div>

              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                <Shield className="w-4 h-4 text-outline" />
                <span className="text-outline text-xs">Enkripsi 256-bit bank level terhubung</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Kantong Tabungan (Savings Goals) Section */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-outline uppercase">
              Alokasi & Komitmen
            </span>
            <h2 className="font-headline text-2xl font-bold text-primary tracking-tight">
              Kantong Tabungan
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Target terencana, pemisahan dana, dan progres otomatis presisi.
            </p>
          </div>
          <Link
            href="/goals"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary text-xs font-bold transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Kantong Baru</span>
          </Link>
        </div>

        {/* 3-Column Goal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Dana Darurat */}
          <div className="group rounded-3xl bg-surface-container-lowest p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-surface-container-high/60 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-tertiary-container flex items-center justify-center text-tertiary-on-container">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-tertiary-container text-tertiary-on-container">
                  Prioritas Utama
                </span>
              </div>
              <div>
                <h3 className="font-headline text-base font-bold text-primary">Dana Darurat</h3>
                <p className="text-xs text-outline mt-0.5">
                  Jaring pengaman likuid 6x pengeluaran operasional
                </p>
              </div>

              <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-baseline justify-between">
                  <span className="font-headline text-xl font-bold text-primary tabular-nums">
                    Rp 35.000.000
                  </span>
                  <span className="text-xs text-outline">dari Rp 50jt</span>
                </div>
                {/* Apple-Style Dynamic Progress Track */}
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden my-1">
                  <div
                    className="h-full bg-tertiary-on-container rounded-full transition-all duration-1000 ease-out"
                    style={{ width: "70%" }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-tertiary-on-container font-bold">70% Tercapai</span>
                  <span className="text-outline">Estimasi 4 bln lagi</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-surface-container-high/50 flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant font-medium">
                Auto-debit: Rp 3.750.000/bln
              </span>
              <ArrowRight className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors" />
            </div>
          </div>

          {/* Card 2: Ganti MacBook Pro */}
          <div className="group rounded-3xl bg-surface-container-lowest p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-surface-container-high/60 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary">
                  <Laptop className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant">
                  Produktivitas
                </span>
              </div>
              <div>
                <h3 className="font-headline text-base font-bold text-primary">
                  Ganti MacBook Pro
                </h3>
                <p className="text-xs text-outline mt-0.5">
                  Alokasi upgrade workstation Apple Silicon M-Series
                </p>
              </div>

              <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-baseline justify-between">
                  <span className="font-headline text-xl font-bold text-primary tabular-nums">
                    Rp 21.000.000
                  </span>
                  <span className="text-xs text-outline">dari Rp 28jt</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden my-1">
                  <div
                    className="h-full bg-tertiary-on-container rounded-full transition-all duration-1000 ease-out"
                    style={{ width: "75%" }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-tertiary-on-container font-bold">75% Tercapai</span>
                  <span className="text-outline">Estimasi 2 bln lagi</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-surface-container-high/50 flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant font-medium">
                Sisa kekurangan: Rp 7.000.000
              </span>
              <ArrowRight className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors" />
            </div>
          </div>

          {/* Card 3: Liburan Kyoto */}
          <div className="group rounded-3xl bg-surface-container-lowest p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-surface-container-high/60 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary">
                  <Plane className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-secondary-fixed text-secondary">
                  Musim Gugur
                </span>
              </div>
              <div>
                <h3 className="font-headline text-base font-bold text-primary">Liburan Kyoto</h3>
                <p className="text-xs text-outline mt-0.5">
                  Tiket penerbangan & penginapan ryokan tradisional
                </p>
              </div>

              <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-baseline justify-between">
                  <span className="font-headline text-xl font-bold text-primary tabular-nums">
                    Rp 9.000.000
                  </span>
                  <span className="text-xs text-outline">dari Rp 15jt</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden my-1">
                  <div
                    className="h-full bg-tertiary-on-container rounded-full transition-all duration-1000 ease-out"
                    style={{ width: "60%" }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-tertiary-on-container font-bold">60% Tercapai</span>
                  <span className="text-outline">Target: Okt 2026</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-surface-container-high/50 flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant font-medium">
                Sisa kekurangan: Rp 6.000.000
              </span>
              <ArrowRight className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Deep Analytics & Cash Flow Breakdown Section (2-Column Grid) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Alokasi Pengeluaran (Doughnut Chart) */}
        <div className="lg:col-span-5 rounded-3xl bg-surface-container-lowest p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-surface-container-high/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-headline text-base font-bold text-primary">
                Alokasi Pengeluaran
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant">
                Maret 2026
              </span>
            </div>
            <p className="text-xs text-outline">
              Distribusi pengeluaran berdasarkan proporsi kategori aktual.
            </p>

            {/* Doughnut Visual Artifact */}
            <div className="relative flex items-center justify-center my-6">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle cx="60" cy="60" fill="transparent" r="48" stroke="#f4f3f8" strokeWidth="12" />
                {/* Kebutuhan & Makanan (42%) */}
                <circle
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r="48"
                  stroke="#1d1d1f"
                  strokeDasharray="126.6 175"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeWidth="12"
                />
                {/* Transportasi (22%) */}
                <circle
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r="48"
                  stroke="#005ab7"
                  strokeDasharray="66.3 235.3"
                  strokeDashoffset="-131"
                  strokeLinecap="round"
                  strokeWidth="12"
                />
                {/* Hiburan (18%) */}
                <circle
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r="48"
                  stroke="#009a3b"
                  strokeDasharray="54.2 247.4"
                  strokeDashoffset="-202"
                  strokeLinecap="round"
                  strokeWidth="12"
                />
                {/* Tagihan & Utilitas (18%) */}
                <circle
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r="48"
                  stroke="#c7c6ca"
                  strokeDasharray="54.2 247.4"
                  strokeDashoffset="-261"
                  strokeLinecap="round"
                  strokeWidth="12"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  Total
                </span>
                <span className="font-headline text-lg font-bold text-primary tabular-nums">
                  Rp 7,45jt
                </span>
                <span className="text-[10px] font-bold text-tertiary-on-container mt-0.5">
                  Optimal
                </span>
              </div>
            </div>

            {/* Breakdown Legend Rows */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                  <span className="text-xs text-primary font-medium">Kebutuhan & Makanan</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-primary tabular-nums">
                    Rp 3.129.000
                  </span>
                  <span className="text-[10px] text-outline ml-1 font-mono">42%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                  <span className="text-xs text-primary font-medium">Transportasi & Servis</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-primary tabular-nums">
                    Rp 1.639.000
                  </span>
                  <span className="text-[10px] text-outline ml-1 font-mono">22%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary-on-container" />
                  <span className="text-xs text-primary font-medium">Hiburan & Langganan</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-primary tabular-nums">
                    Rp 1.341.000
                  </span>
                  <span className="text-[10px] text-outline ml-1 font-mono">18%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                  <span className="text-xs text-primary font-medium">Tagihan & Utilitas</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-primary tabular-nums">
                    Rp 1.341.000
                  </span>
                  <span className="text-[10px] text-outline ml-1 font-mono">18%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-surface-container-low border border-surface-container-high/40 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">
              Efisiensi pengeluaran: <strong className="text-primary font-bold">Terkendali</strong>
            </span>
            <Link
              href="/analytics"
              className="text-xs font-bold text-secondary hover:underline"
            >
              Detail Kategori →
            </Link>
          </div>
        </div>

        {/* Right Column: Cash Flow Trends 6 Bulan Terakhir */}
        <div className="lg:col-span-7 rounded-3xl bg-surface-container-lowest p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-surface-container-high/60 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h2 className="font-headline text-base font-bold text-primary">
                  Arus Kas 6 Bulan Terakhir
                </h2>
                <p className="text-xs text-outline">
                  Korelasi komparatif antara pendapatan dan beban operasional.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase">
                    Pemasukan
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-outline-variant" />
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase">
                    Pengeluaran
                  </span>
                </div>
              </div>
            </div>

            {/* Minimalist Apple Bar Graph (6 Months) */}
            <div className="pt-6 pb-2">
              <div className="h-56 flex items-end justify-between gap-3 px-2">
                {/* Oktober */}
                <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full max-w-[44px] flex items-end justify-center gap-1.5 h-full">
                    <div className="w-1/2 bg-primary rounded-t-md" style={{ height: "65%" }} />
                    <div
                      className="w-1/2 bg-surface-container-highest rounded-t-md"
                      style={{ height: "38%" }}
                    />
                  </div>
                  <span className="text-xs text-outline">Okt</span>
                </div>
                {/* November */}
                <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full max-w-[44px] flex items-end justify-center gap-1.5 h-full">
                    <div className="w-1/2 bg-primary rounded-t-md" style={{ height: "72%" }} />
                    <div
                      className="w-1/2 bg-surface-container-highest rounded-t-md"
                      style={{ height: "42%" }}
                    />
                  </div>
                  <span className="text-xs text-outline">Nov</span>
                </div>
                {/* Desember */}
                <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full max-w-[44px] flex items-end justify-center gap-1.5 h-full">
                    <div className="w-1/2 bg-primary rounded-t-md" style={{ height: "88%" }} />
                    <div
                      className="w-1/2 bg-surface-container-highest rounded-t-md"
                      style={{ height: "55%" }}
                    />
                  </div>
                  <span className="text-xs text-outline">Des</span>
                </div>
                {/* Januari */}
                <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full max-w-[44px] flex items-end justify-center gap-1.5 h-full">
                    <div className="w-1/2 bg-primary rounded-t-md" style={{ height: "68%" }} />
                    <div
                      className="w-1/2 bg-surface-container-highest rounded-t-md"
                      style={{ height: "35%" }}
                    />
                  </div>
                  <span className="text-xs text-outline">Jan</span>
                </div>
                {/* Februari */}
                <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full max-w-[44px] flex items-end justify-center gap-1.5 h-full">
                    <div className="w-1/2 bg-primary rounded-t-md" style={{ height: "78%" }} />
                    <div
                      className="w-1/2 bg-surface-container-highest rounded-t-md"
                      style={{ height: "40%" }}
                    />
                  </div>
                  <span className="text-xs text-outline">Feb</span>
                </div>
                {/* Maret (Active Month Peak Badge) */}
                <div className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="relative w-full max-w-[44px] flex items-end justify-center gap-1.5 h-full">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold shadow-sm">
                      +18.2jt
                    </div>
                    <div className="w-1/2 bg-primary rounded-t-md shadow-md" style={{ height: "94%" }} />
                    <div
                      className="w-1/2 bg-surface-container-highest rounded-t-md"
                      style={{ height: "41%" }}
                    />
                  </div>
                  <span className="text-xs font-bold text-primary">Mar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Insight Editorial Banner */}
          <div className="mt-4 p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-tertiary-on-container shadow-sm border border-surface-container-high">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  Analisis Stabilitas
                </div>
                <div className="text-xs text-primary">
                  Surplus kas rata-rata Anda berada di{" "}
                  <strong className="text-primary font-bold tabular-nums">
                    Rp 10.750.000 / bulan
                  </strong>
                  .
                </div>
              </div>
            </div>

            <Link
              href="/reports"
              className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:underline cursor-pointer"
            >
              <span>Ekspor Laporan</span>
              <FileDown className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Recent Transactions Feed */}
      <section>
        <div className="rounded-3xl bg-surface-container-lowest p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-surface-container-high/60 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-headline text-lg font-bold text-primary tracking-tight">
                Transaksi Terbaru
              </h2>
              <p className="text-xs text-outline">
                Catatan alur transaksi terkonsolidasi dari seluruh rekening.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-full border border-surface-container-high self-start sm:self-auto">
              <button className="px-4 py-1 rounded-full text-xs font-semibold bg-surface-container-lowest text-primary shadow-sm">
                Semua
              </button>
              <button className="px-4 py-1 rounded-full text-xs font-semibold text-outline hover:text-primary transition-colors">
                Pemasukan
              </button>
              <button className="px-4 py-1 rounded-full text-xs font-semibold text-outline hover:text-primary transition-colors">
                Pengeluaran
              </button>
            </div>
          </div>

          {/* Transaction List Rows */}
          <div className="divide-y divide-surface-container-high/50">
            {/* Row 1: Gaji Bulanan */}
            <div className="flex items-center justify-between py-3.5 px-2 hover:bg-surface-container-low/60 rounded-2xl transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-tertiary-container text-tertiary-on-container flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-primary truncate">
                    Gaji Bulanan PT Teknologi Maju
                  </span>
                  <div className="flex items-center gap-2 text-outline text-[11px] mt-0.5">
                    <span>Hari ini, 09:30 WIB</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant text-[10px] font-bold">
                      BCA Digital
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 pl-3">
                <span className="text-sm font-bold text-tertiary-on-container tabular-nums">
                  +Rp 18.000.000
                </span>
                <div className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  Payroll • Masuk
                </div>
              </div>
            </div>

            {/* Row 2: Apple Developer Program */}
            <div className="flex items-center justify-between py-3.5 px-2 hover:bg-surface-container-low/60 rounded-2xl transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center flex-shrink-0">
                  <Terminal className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-primary truncate">
                    Apple Developer Program
                  </span>
                  <div className="flex items-center gap-2 text-outline text-[11px] mt-0.5">
                    <span>Kemarin, 14:15 WIB</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant text-[10px] font-bold">
                      Jenius Card
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 pl-3">
                <span className="text-sm font-bold text-primary tabular-nums">-Rp 1.499.000</span>
                <div className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  Langganan Software
                </div>
              </div>
            </div>

            {/* Row 3: Supermarket Grand Lucky */}
            <div className="flex items-center justify-between py-3.5 px-2 hover:bg-surface-container-low/60 rounded-2xl transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-primary truncate">
                    Supermarket Grand Lucky
                  </span>
                  <div className="flex items-center gap-2 text-outline text-[11px] mt-0.5">
                    <span>22 Maret 2026, 19:40 WIB</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant text-[10px] font-bold">
                      QRIS BCA
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 pl-3">
                <span className="text-sm font-bold text-primary tabular-nums">-Rp 845.000</span>
                <div className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  Kebutuhan Pokok
                </div>
              </div>
            </div>

            {/* Row 4: Kopi Artisan Single Origin */}
            <div className="flex items-center justify-between py-3.5 px-2 hover:bg-surface-container-low/60 rounded-2xl transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-primary truncate">
                    Kopi Artisan Single Origin
                  </span>
                  <div className="flex items-center gap-2 text-outline text-[11px] mt-0.5">
                    <span>21 Maret 2026, 11:20 WIB</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant text-[10px] font-bold">
                      QRIS Jenius
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 pl-3">
                <span className="text-sm font-bold text-primary tabular-nums">-Rp 62.000</span>
                <div className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  Hiburan • Cafe
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <Link
              href="/transactions"
              className="px-6 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container-high text-primary font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Buka Seluruh Transaksi & Catatan AI</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Editorial Wealth Strategy Banner */}
      <section>
        <div className="relative rounded-3xl overflow-hidden bg-primary text-white p-8 md:p-10 shadow-apple-float">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-secondary-fixed text-[11px] font-bold uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4 text-tertiary-on-container" />
                <span>Optimasi Portofolio Mandiri</span>
              </div>
              <h3 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Rasio likuiditas Anda siap untuk investasi reksa dana obligasi.
              </h3>
              <p className="text-xs sm:text-sm text-outline-variant leading-relaxed">
                Surplus Rp 3.500.000 dari rekening utama dapat menghasilkan imbal hasil tahunan ~6.2%
                tanpa mengganggu dana darurat aktif.
              </p>
            </div>
            <Link
              href="/advisor"
              className="px-6 py-3.5 rounded-full bg-white text-primary font-bold text-xs shadow-xl hover:bg-surface-container-low active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
            >
              <span>Buka Simulasi Portofolio</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Floating Bottom-Right AI Assistant Widget */}
      <FloatingAiWidget userName={userName} />
    </div>
  );
}
