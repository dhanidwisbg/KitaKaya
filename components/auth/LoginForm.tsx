"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { initUserWithName } from "@/lib/storage";

export default function LoginForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      toast.error("Silakan masukkan nama Anda");
      return;
    }

    setIsLoading(true);
    try {
      initUserWithName(cleanName);
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName }),
      });
      toast.success(`Selamat datang, ${cleanName}!`);
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Gagal memulai sesi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-surface-container-lowest rounded-3xl border border-surface-container-high/70 shadow-apple-float p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-base font-bold text-primary">Masuk ke Sesi Browser</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-primary">Nama Anda</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Dhani"
            className="w-full h-11 bg-surface-container-low text-primary text-xs px-4 rounded-2xl border border-surface-container-high focus:outline-none focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !name.trim()}
          className="w-full h-12 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Buka Dasbor Saya</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
