import { Metadata } from "next";
import WelcomeForm from "@/components/auth/WelcomeForm";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Selamat Datang — Kita Kaya",
  description: "Mulai kelola keuangan pribadimu tanpa ribet kata sandi",
};

export default function WelcomePage() {
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
                <ArrowLeft className="w-3.5 h-3.5" /> Beranda
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1.5 rounded-full border border-surface-container-high shadow-sm text-xs">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Sesi Instan Tanpa Sandi
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-20 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col w-full relative overflow-hidden items-center justify-center">
          {/* Ambient Lighting Background */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-primary/10 via-surface-container-low/30 to-transparent blur-3xl pointer-events-none rounded-full" />

          {/* Watermark Background */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 select-none pointer-events-none z-0">
            <span className="font-headline text-[90px] md:text-[160px] leading-none font-bold tracking-tighter text-outline-variant/15 whitespace-nowrap block">
              SELAMAT DATANG
            </span>
          </div>

          {/* Form Container */}
          <div className="w-full relative z-10 my-4">
            <WelcomeForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-surface-container-high/60 bg-surface-container-lowest/50 text-center text-xs text-outline">
        <p>© 2026 KitaKaya. Financial freedom made simple.</p>
      </footer>
    </div>
  );
}
