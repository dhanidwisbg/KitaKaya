import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import WelcomeForm from "@/components/auth/WelcomeForm";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Masuk — Kita Kaya",
  description: "Masukkan nama kamu untuk mulai mengelola keuangan pribadi.",
};

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#faf9fe] flex flex-col selection:bg-primary selection:text-white">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="Kita Kaya"
              width={108}
              height={40}
              className="h-8 w-auto object-contain group-hover:opacity-80 transition-opacity"
            />
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center pt-16 px-4">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-primary/8 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="w-full max-w-md relative z-10 space-y-6 py-12">
          {/* Eyebrow label */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-surface-container-high shadow-sm text-[11px] font-bold text-outline uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Tanpa Password · Tanpa Akun
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold text-primary tracking-tight mt-3">
              Siapa nama kamu?
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Cukup satu langkah untuk mulai mengelola keuanganmu.
            </p>
          </div>

          {/* Form */}
          <WelcomeForm />

          {/* Privacy note */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-outline">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Data tersimpan 100% di browser kamu — tidak ada server yang menyimpan.</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 border-t border-surface-container-high/60 bg-white/50 text-center text-xs text-outline">
        <p>© 2026 KitaKaya — Finansial pribadi, privasi terjaga.</p>
      </footer>
    </div>
  );
}
