"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getClientUserId } from "@/lib/session-client";
import { useRouter } from "next/navigation";
import {
  Download,
  Send,
  FileText,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  QrCode,
  Clock,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function MonthlyReportPage() {
  const supabase = createClient();
  const router = useRouter();

  const [period, setPeriod] = useState("mar-2026");
  const [reportFormat, setReportFormat] = useState<"executive" | "full">("executive");
  const [frequency, setFrequency] = useState<"monthly" | "quarterly" | "annual">("monthly");
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("Pengguna");

  useEffect(() => {
    async function loadUser() {
      const userId = getClientUserId();
      if (userId) {
        const { data } = await supabase
          .from("users")
          .select("full_name, email")
          .eq("id", userId)
          .single();

        if (data) {
          if (data.full_name) setUserName(data.full_name);
          if (data.email) setUserEmail(data.email);
        }
      }
    }
    loadUser();
  }, []);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      window.print();
      setIsDownloading(false);
      toast.success("Dokumen siap dicetak / diunduh sebagai PDF 📄");
    }, 500);
  };

  const handleResendEmail = async () => {
    if (!userEmail) {
      toast.error("Email penerima belum ditambahkan di Profil!");
      router.push("/settings");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/reports/send", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengirim email laporan");
      }

      toast.success(
        data.message || `Laporan finansial berhasil dikirim ke ${userEmail}! 📩`
      );
    } catch (err: any) {
      toast.error(err.message || "Gagal mengirim laporan");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Action Bar & Cron Status */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-surface-container-high border border-surface-container-highest shadow-sm">
            <span className="w-2 h-2 rounded-full bg-tertiary-on-container animate-pulse" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Otomasi Aktif — Terjadwal 1 Setiap Bulan • 00:00 WIB
            </span>
          </div>

          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            Laporan Finansial Bulanan.
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Dihasilkan otomatis oleh engine laporan setiap penutupan buku dan
            didistribusikan langsung ke{" "}
            {userEmail ? (
              <span className="font-bold text-primary">{userEmail}</span>
            ) : (
              <Link
                href="/settings"
                className="inline-flex items-center gap-1 font-semibold text-amber-600 hover:underline bg-amber-50 px-2 py-0.5 rounded-md"
              >
                <AlertCircle className="w-3.5 h-3.5" /> Tambahkan Email di Profil
              </Link>
            )}{" "}
            via Resend engine.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-surface-container-lowest text-primary text-xs font-semibold px-4 py-3 rounded-full border border-surface-container-high shadow-sm outline-none cursor-pointer"
          >
            <option value="mar-2026">Maret 2026 (Terbaru)</option>
            <option value="feb-2026">Februari 2026</option>
            <option value="jan-2026">Januari 2026</option>
          </select>

          <button
            onClick={handleResendEmail}
            disabled={isSending}
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-surface-container-lowest text-primary text-xs font-bold border border-surface-container-high hover:bg-surface-container-low active:scale-95 transition-all shadow-sm disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Kirim Ulang ke Email</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-primary text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all shadow-md disabled:opacity-50"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Unduh PDF Asli</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Grid: Document Canvas & Cron Sidepanel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* A4 Apple-Editorial PDF Document Container (Col 8) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* Floating Document Header */}
          <div className="w-full flex items-center justify-between pb-2 px-2 text-[11px] text-outline font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-primary" />
              <span>PRATINJAU DOKUMEN SISTEM • LEMBAR 1 DARI 1 (A4 VECTOR)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-tertiary-on-container">CHECKSUM: 0x8F91...BC7A</span>
            </div>
          </div>

          {/* Sheet Container */}
          <div className="w-full bg-surface-container-lowest rounded-3xl border border-surface-container-high/80 shadow-[0_24px_64px_rgba(0,0,0,0.06)] p-6 sm:p-10 md:p-12 flex flex-col gap-6 relative overflow-hidden print:shadow-none print:border-none">
            {/* Header Brand */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-surface-container-high/60">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-base shadow-sm">
                  K
                </div>
                <div>
                  <h2 className="font-headline text-lg font-bold text-primary leading-tight">
                    Kita Kaya
                  </h2>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider">
                    PLATFORM ARUS KAS & AKUMULASI KEKAYAAN
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-0.5">
                <span className="text-xs font-bold text-primary block">
                  LAPORAN FINANSIAL EKSEKUTIF
                </span>
                <span className="text-[11px] text-on-surface-variant block">
                  Periode: 01 Mar 2026 — 31 Mar 2026
                </span>
                <span className="text-[10px] text-outline font-mono block">
                  UID: KTK-99201-ID • VERIFIED PROFILE
                </span>
              </div>
            </div>

            {/* Overall Health Status Banner */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-high/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-outline tracking-wider">
                  KESEHATAN ARUS KAS KESELURUHAN
                </span>
                <h3 className="font-headline text-lg font-bold text-primary mt-0.5">
                  Status Keuangan: Superior (92/100)
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Surplus bersih dialokasikan penuh ke diversifikasi likuid & target impian.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-surface-container-lowest px-4 py-2.5 rounded-2xl shadow-sm border border-surface-container-high self-start md:self-auto">
                <div className="text-center">
                  <span className="font-headline text-xl font-bold text-primary">92</span>
                </div>
                <div className="flex flex-col border-l border-surface-container-high pl-3">
                  <span className="text-[10px] font-bold uppercase text-outline">TIER INDEKS</span>
                  <span className="text-xs font-bold text-tertiary-on-container">Tingkat A+</span>
                </div>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/50">
                <span className="text-[10px] font-bold text-outline uppercase">
                  Total Pemasukan
                </span>
                <p className="font-headline text-lg font-bold text-primary my-1 tabular-nums">
                  Rp 18.200.000
                </p>
                <span className="text-[11px] text-tertiary-on-container font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +8.4% vs bln lalu
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/50">
                <span className="text-[10px] font-bold text-outline uppercase">
                  Total Pengeluaran
                </span>
                <p className="font-headline text-lg font-bold text-primary my-1 tabular-nums">
                  Rp 7.450.000
                </p>
                <span className="text-[11px] text-on-surface-variant">
                  -3.1% hemat dari target
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/50">
                <span className="text-[10px] font-bold text-outline uppercase">
                  Rasio Tabungan
                </span>
                <p className="font-headline text-lg font-bold text-tertiary-on-container my-1 tabular-nums">
                  59.0%
                </p>
                <span className="text-[11px] text-secondary font-semibold">
                  Target ideal (&gt;30%) tembus
                </span>
              </div>
            </div>

            {/* Category Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primary">Distribusi Beban Menurut Kategori</span>
                <span className="text-[10px] font-bold text-outline uppercase">
                  ANGGARAN VS REALISASI
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-2 px-3 rounded-l-lg">Kategori</th>
                      <th className="py-2 px-3">Batas Pagu</th>
                      <th className="py-2 px-3">Realisasi</th>
                      <th className="py-2 px-3">Proporsi</th>
                      <th className="py-2 px-3 rounded-r-lg text-right">Efisiensi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high/50 text-xs">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-primary">Hunian & Utilitas</td>
                      <td className="py-2.5 px-3 text-outline">Rp 3.500.000</td>
                      <td className="py-2.5 px-3 font-semibold text-primary">Rp 3.200.000</td>
                      <td className="py-2.5 px-3 text-on-surface-variant">42.9%</td>
                      <td className="py-2.5 px-3 text-right text-tertiary-on-container font-semibold">
                        +Rp 300.000 (Aman)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-primary">Konsumsi & Makanan</td>
                      <td className="py-2.5 px-3 text-outline">Rp 2.500.000</td>
                      <td className="py-2.5 px-3 font-semibold text-primary">Rp 2.150.000</td>
                      <td className="py-2.5 px-3 text-on-surface-variant">28.8%</td>
                      <td className="py-2.5 px-3 text-right text-tertiary-on-container font-semibold">
                        +Rp 350.000 (Aman)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-primary">Mobilitas & Bensin</td>
                      <td className="py-2.5 px-3 text-outline">Rp 1.200.000</td>
                      <td className="py-2.5 px-3 font-semibold text-primary">Rp 1.100.000</td>
                      <td className="py-2.5 px-3 text-on-surface-variant">14.7%</td>
                      <td className="py-2.5 px-3 text-right text-tertiary-on-container font-semibold">
                        +Rp 100.000 (Aman)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Synthesis Quote Card */}
            <div className="p-5 rounded-2xl bg-surface-container-high/80 border border-surface-container-highest space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-bold text-primary">
                  Analisis Kecerdasan Buatan (Gemini 1.5 Flash)
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-on-surface-variant">
                <div>
                  <span className="font-bold text-primary block mb-0.5">01. DISIPLIN ANGGARAN</span>
                  Semua sub-kategori kebutuhan berada di bawah pagu estimasi, memberi likuiditas maksimal.
                </div>
                <div>
                  <span className="font-bold text-primary block mb-0.5">02. KINERJA TABUNGAN</span>
                  Surplus kas bersih mempercepat pencapaian target Dana Darurat lebih awal.
                </div>
                <div>
                  <span className="font-bold text-primary block mb-0.5">03. REKOMENDASI</span>
                  Pertimbangkan mengalihkan saldo mengendap ke instrumen pasar uang bebas inflasi.
                </div>
              </div>
            </div>

            {/* PDF Footer / Cryptographic Seal */}
            <div className="pt-4 border-t border-surface-container-high/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-outline">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-primary block">TANDA TANGAN KRIPTOGRAFIS</span>
                  <span className="font-mono">SHA256: d83b794f92bc4919...639c0a</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-primary block">KITA KAYA SECURE ENGINE</span>
                <span>Rendered via @react-pdf/renderer on Vercel Node 20.x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidepanel (Col 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Resend Telemetry Card */}
          <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high/70 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary" />
                <h3 className="text-xs font-bold text-primary">Status Kirim Resend</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-primary">
                API LIVE
              </span>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Setiap dokumen diekspor menjadi binary PDF langsung dikirimkan ke kotak masuk tanpa
              server mail perantara yang lambat.
            </p>

            <div className="p-3.5 rounded-2xl bg-surface-container-low space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-outline text-[11px]">Tujuan Utama</span>
                <span className="font-semibold text-primary">{userEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline text-[11px]">Status Kirim</span>
                <span className="font-bold text-tertiary-on-container flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Terkirim (100%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline text-[11px]">Resend Message ID</span>
                <span className="font-mono text-[10px] text-outline">re_99xN28v4Lpq_01</span>
              </div>
            </div>

            <button
              onClick={handleResendEmail}
              disabled={isSending}
              className="w-full py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              Uji Coba Pengiriman Email
            </button>
          </div>

          {/* Cron Job Configuration Card */}
          <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high/70 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold text-primary">Konfigurasi Otomasi</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                Frekuensi Pembuatan
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-surface-container rounded-full text-xs">
                {(["monthly", "quarterly", "annual"] as const).map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setFrequency(freq)}
                    className={`py-1.5 rounded-full font-bold text-[11px] capitalize transition-all ${
                      frequency === freq
                        ? "bg-primary text-white shadow-sm"
                        : "text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    {freq === "monthly" ? "Bulanan" : freq === "quarterly" ? "Kuartalan" : "Tahunan"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                Format Lembar PDF
              </label>
              <div className="space-y-2">
                <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-surface-container-low border border-surface-container-high cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    checked={reportFormat === "executive"}
                    onChange={() => setReportFormat("executive")}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <span className="text-xs font-bold text-primary block">
                      Executive Summary (1 Halaman)
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Rangkuman metrik utama, grafik saldo, dan rekomendasi AI.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-surface-container-low border border-surface-container-high cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    checked={reportFormat === "full"}
                    onChange={() => setReportFormat("full")}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <span className="text-xs font-bold text-primary block">
                      Buku Besar Lengkap (Full Ledger)
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Memuat seluruh baris transaksi individual dengan audit trail.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
