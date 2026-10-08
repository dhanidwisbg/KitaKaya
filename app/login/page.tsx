import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Masuk — KitaKaya",
  description: "Masuk ke akun KitaKaya untuk mengelola keuanganmu",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-bold text-lg text-gray-900">KitaKaya</span>
            </Link>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Beranda
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pt-20 pb-10">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Masuk ke Akun
            </h1>
            <p className="text-gray-600">
              Gunakan email atau akun sosial untuk masuk
            </p>
          </div>

          <LoginForm />

          <div className="text-center text-sm text-gray-600">
            <span>Baru di KitaKaya? </span>
            <Link href="/welcome" className="font-semibold text-amber-600 hover:text-amber-700">
              Coba mode tanpa akun
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-500 border-t border-gray-100">
        <p>© 2026 KitaKaya. Financial freedom made simple.</p>
      </footer>
    </div>
  );
}
