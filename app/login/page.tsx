import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import { Lock, ArrowLeft, KeyRound, Timer, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Masuk — Passwordless Magic Link",
  description: "Masuk aman tanpa kata sandi ke akun KitaKaya kamu",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-primary selection:text-white">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-base shadow-sm">
                K
              </div>
              <span className="font-headline font-bold text-lg text-primary tracking-tight">
                Kita Kaya
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 pl-4 border-l border-surface-container-high">
              <Link
                href="/"
                className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1.5 rounded-full border border-surface-container-high shadow-sm text-xs">
              <Lock className="w-3.5 h-3.5 text-tertiary-on-container" />
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Supabase 256-Bit
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-20 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col w-full relative overflow-hidden items-center justify-center">
          {/* Ambient Lighting Background */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-secondary-fixed/40 via-surface-container-low/30 to-transparent blur-3xl pointer-events-none rounded-full" />

          {/* Watermark */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 select-none pointer-events-none z-0">
            <span className="font-headline text-[110px] md:text-[180px] leading-none font-bold tracking-tighter text-outline-variant/15 whitespace-nowrap block">
              MASUK
            </span>
          </div>

          {/* Container */}
          <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">
            {/* Editorial Header */}
            <div className="text-center mb-6 max-w-md">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container-low border border-surface-container-high shadow-sm mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-on-container animate-pulse" />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Supabase Passwordless Auth
                </span>
              </div>
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary tracking-tight mb-2">
                Masuk Tanpa Kata Sandi.
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Akses instan dan aman ke dasbor finansial Anda melalui Magic Link yang dikirimkan
                langsung ke email Anda.
              </p>
            </div>

            {/* Bento Card */}
            <LoginForm />

            {/* Security Pillars (3 Cards) */}
            <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-surface-container-lowest/90 rounded-2xl p-4 border border-surface-container-high/60 shadow-sm flex flex-col justify-between">
                <div className="w-7 h-7 rounded-xl bg-surface-container-high flex items-center justify-center mb-2">
                  <KeyRound className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-primary mb-0.5">Tanpa Kata Sandi</h2>
                  <p className="text-[11px] text-on-surface-variant leading-tight">
                    Proteksi terhadap kebocoran kata sandi dan credential stuffing.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest/90 rounded-2xl p-4 border border-surface-container-high/60 shadow-sm flex flex-col justify-between">
                <div className="w-7 h-7 rounded-xl bg-surface-container-high flex items-center justify-center mb-2">
                  <Timer className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-primary mb-0.5">Verifikasi 10 Menit</h2>
                  <p className="text-[11px] text-on-surface-variant leading-tight">
                    Setiap Magic Link berlaku sekali pakai dan otomatis kedaluwarsa.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest/90 rounded-2xl p-4 border border-surface-container-high/60 shadow-sm flex flex-col justify-between">
                <div className="w-7 h-7 rounded-xl bg-surface-container-high flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-primary mb-0.5">Terenkripsi 256-Bit</h2>
                  <p className="text-[11px] text-on-surface-variant leading-tight">
                    Standar enkripsi data finansial kelas perbankan modern.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-[11px] text-outline border-t border-surface-container-high/50">
        Kita Kaya © 2026. Financial Studio Minimalist.
      </footer>
    </div>
  );
}
