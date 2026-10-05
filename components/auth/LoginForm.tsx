"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, ArrowRight, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const [authMode, setAuthMode] = useState<"magic_link" | "password">("magic_link");
  const [isLoading, setIsLoading] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setIsMagicLinkSent(true);
      toast.success("Tautan Magic Link berhasil dikirim ke email kamu! 📩");
    } catch (err: any) {
      toast.error(err.message || "Gagal mengirim tautan masuk");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Try sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (!signInError) {
        toast.success("Berhasil masuk! 👋");
        router.push("/dashboard");
        router.refresh();
        return;
      }

      // 2. If invalid credentials, attempt sign up
      if (
        signInError.message.includes("Invalid login credentials") ||
        signInError.message.includes("User not found")
      ) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (signUpError) throw signUpError;

        toast.success("Akun baru berhasil dibuat! 🚀");
        router.push("/onboarding");
        router.refresh();
      } else {
        throw signInError;
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal melakukan autentikasi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || `Gagal masuk dengan ${provider}`);
    }
  };

  return (
    <div className="w-full bg-surface-container-lowest rounded-3xl border border-surface-container-high/70 shadow-apple-float p-6 sm:p-8 space-y-6">
      {/* Security Credential Badge */}
      <div className="flex items-center justify-between bg-surface-container-low/80 border border-surface-container-high/50 rounded-2xl px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-tertiary-container flex items-center justify-center">
            <Lock className="w-3 h-3 text-tertiary-on-container" />
          </div>
          <span className="text-xs font-semibold text-primary">Supabase Auth</span>
        </div>
        <span className="text-[10px] font-bold text-tertiary-on-container uppercase tracking-wider">
          E2E Enkripsi • Active
        </span>
      </div>

      {isMagicLinkSent ? (
        <div className="p-4 rounded-2xl bg-tertiary-container/40 border border-tertiary-on-container/30 space-y-2 text-center animate-scale-up">
          <CheckCircle2 className="w-8 h-8 text-tertiary-on-container mx-auto" />
          <h3 className="text-sm font-bold text-primary">Tautan Terkirim ke Email!</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Periksa kotak masuk (atau spam) di <strong>{email}</strong>. Klik tautan verifikasi
            untuk langsung masuk ke dasbor.
          </p>
          <button
            onClick={() => setIsMagicLinkSent(false)}
            className="mt-2 text-xs font-semibold text-secondary hover:underline"
          >
            Kirim ulang atau gunakan email lain
          </button>
        </div>
      ) : authMode === "magic_link" ? (
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-primary" htmlFor="email">
                Alamat Email Terdaftar
              </label>
              <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">
                Wajib Diisi
              </span>
            </div>

            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama.anda@gmail.com"
                className="w-full h-12 bg-surface-container-low text-primary text-xs pl-11 pr-4 rounded-2xl border border-surface-container-high focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.985] transition-all shadow-md disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Kirim Tautan Magic Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setAuthMode("password")}
              className="text-xs text-outline hover:text-primary transition-colors font-medium"
            >
              Atau masuk menggunakan kata sandi →
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePasswordAuth} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-primary">Alamat Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama.anda@gmail.com"
              className="w-full h-11 bg-surface-container-low text-primary text-xs px-4 rounded-2xl border border-surface-container-high focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-primary">Kata Sandi</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full h-11 bg-surface-container-low text-primary text-xs px-4 rounded-2xl border border-surface-container-high focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.985] transition-all shadow-md disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Masuk / Daftar Otomatis</span>
            )}
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setAuthMode("magic_link")}
              className="text-xs text-outline hover:text-primary transition-colors font-medium"
            >
              ← Kembali ke Magic Link (Tanpa Password)
            </button>
          </div>
        </form>
      )}

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full h-px bg-surface-container-high" />
        <span className="absolute bg-surface-container-lowest px-3 text-[10px] font-bold uppercase text-outline tracking-wider">
          atau lanjutkan secara instan
        </span>
      </div>

      {/* Social OIDC Providers */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          className="h-11 rounded-full bg-surface-container-low hover:bg-surface-container-high border border-surface-container-high/60 transition-colors flex items-center justify-center gap-2 text-primary font-semibold text-xs shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              fill="#EA4335"
            />
            <path
              d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
              fill="#4285F4"
            />
            <path
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              fill="#FBBC05"
            />
            <path
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.4 7.5 23 12 23z"
              fill="#34A853"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={() => handleOAuth("apple")}
          className="h-11 rounded-full bg-surface-container-low hover:bg-surface-container-high border border-surface-container-high/60 transition-colors flex items-center justify-center gap-2 text-primary font-semibold text-xs shadow-sm"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-5.78-8.8-10.15-18.73-13.11-29.78-2.96-11.06-4.44-21.71-4.44-31.96 0-14.28 3.59-26.16 10.77-35.63 7.18-9.48 16.32-14.33 27.42-14.56 4.35 0 9.25 1.13 14.71 3.38 5.46 2.25 9.17 3.44 11.13 3.56 1.8.12 5.62-1.12 11.47-3.71 5.85-2.59 10.78-3.76 14.8-3.52 11.53.59 20.88 4.8 28.05 12.63-10.13 6.13-15.13 14.7-15 25.7.13 8.7 3.42 16.03 9.87 21.99 6.46 5.96 14.24 9.38 23.34 10.27-2.12 6.64-4.82 13.58-8.1 20.81l-1.27 2.82zm-28.61-105.7c0 5.43-1.98 10.75-5.94 15.96-3.96 5.21-9 8.76-15.12 10.65-.24-1.18-.36-2.24-.36-3.18 0-5.19 2.05-10.37 6.15-15.54 4.1-5.17 9.14-8.58 15.13-10.23.08.79.14 1.57.14 2.34z" />
          </svg>
          <span>Apple ID</span>
        </button>
      </div>
    </div>
  );
}
