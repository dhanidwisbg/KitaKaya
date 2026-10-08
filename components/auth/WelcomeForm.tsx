"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { initUserWithName } from "@/lib/storage";

const QUICK_NAMES = ["Budi", "Sari", "Rizki", "Anya", "Dika", "Nisa", "Reza", "Dani"];

export default function WelcomeForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      toast.error("Isi nama kamu dulu ya 😊");
      return;
    }

    setIsLoading(true);
    try {
      // Save name to localStorage; onboarding_completed stays false if no income yet
      initUserWithName(cleanName);

      // Sync session cookie
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName }),
      });

      toast.success(`Halo, ${cleanName}! 👋`);
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan, coba lagi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-surface-container-high/70 p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.05)] space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Nama Panggilanmu
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
              <User className="w-4 h-4" />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e as any)}
              placeholder="Contoh: Budi, Sari, Rizki..."
              autoFocus
              required
              disabled={isLoading}
              className="w-full pl-11 pr-4 py-3.5 bg-surface-container-low border border-surface-container-high rounded-2xl text-sm font-semibold text-primary placeholder:text-outline placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Quick-pick name chips */}
        <div className="flex flex-wrap gap-2">
          {QUICK_NAMES.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setName(n)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                name === n
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-surface-container-low text-on-surface-variant border-surface-container-high hover:border-primary hover:text-primary"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !name.trim()}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed group mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memuat...</span>
            </>
          ) : (
            <>
              <span>{name.trim() ? `Lanjut sebagai ${name.trim()}` : "Mulai Sekarang"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Already has data hint */}
      <p className="text-center text-[11px] text-outline">
        Sudah pernah pakai? Masukkan nama yang sama untuk melanjutkan sesi sebelumnya.
      </p>
    </div>
  );
}
