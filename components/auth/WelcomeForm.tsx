"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, ArrowRight, Loader2, Sparkles, ShieldCheck, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { setClientUserId } from "@/lib/session-client";

export default function WelcomeForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();

    if (!cleanName) {
      toast.error("Silakan masukkan nama kamu");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat sesi");
      }

      // Pastikan cookie juga tersimpan di browser
      if (data.user?.id) {
        setClientUserId(data.user.id);
      }

      toast.success(`Selamat datang, ${cleanName}! 🎉`);
      
      // Arahkan langsung ke dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan, silakan coba lagi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-surface-container-high/80 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Tanpa Password • Cepat & Aman
            </span>
            <h1 className="text-xl font-headline font-bold text-on-surface tracking-tight">
              Mulai dengan Nama Kamu
            </h1>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
          Cukup masukkan nama panggilan atau nama lengkapmu. Sesi akan otomatis tersimpan di peramban ini tanpa perlu repot login kata sandi.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-xs font-semibold text-on-surface flex items-center justify-between"
            >
              <span>Nama Kamu</span>
              {name.trim() && (
                <span className="text-[11px] text-primary font-medium">
                  Halo, {name.trim()}! 👋
                </span>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                <User className="w-4 h-4" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Dhani"
                autoFocus
                required
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-surface-container-high rounded-2xl text-sm font-medium text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="w-full py-3.5 px-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyiapkan Dashboard...</span>
              </>
            ) : (
              <>
                <span>Mulai Kelola Keuangan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer info features */}
        <div className="mt-8 pt-6 border-t border-surface-container-high/60 space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Sesi tersimpan aman di cookie peramban Anda</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-medium">
            <MailCheck className="w-4 h-4 text-primary shrink-0" />
            <span>Bisa tambahkan email di menu Profil untuk terima laporan PDF</span>
          </div>
        </div>
      </div>
    </div>
  );
}
