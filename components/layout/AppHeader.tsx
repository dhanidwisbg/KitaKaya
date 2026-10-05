"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/lib/types/database.types";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  Bell,
  Sparkles,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AppHeaderProps {
  user?: User | null;
}

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Tabungan", href: "/goals" },
  { label: "Transaksi & AI", href: "/transactions" },
  { label: "Laporan Bulanan", href: "/reports" },
  { label: "Analitik", href: "/analytics" },
];

export default function AppHeader({ user }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar");
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-base shadow-sm">
            K
          </div>
          <span className="font-headline font-bold text-lg text-primary tracking-tight">
            Kita Kaya
          </span>
        </Link>

        {/* Center Nav Pills (Desktop) */}
        <nav className="hidden md:flex items-center bg-surface-container-low p-1 rounded-full border border-surface-container-high/50">
          {navLinks.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                  isActive
                    ? "bg-primary text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container/60"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/advisor"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-fixed text-secondary text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Advisor</span>
          </Link>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1 border-l border-surface-container-high">
            <Link
              href="/settings"
              className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container-low transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "D"}
              </div>
              <div className="hidden lg:flex items-center gap-1.5 pr-2">
                <span className="text-xs font-semibold text-primary">
                  {user?.full_name || user?.email?.split("@")[0] || "Dhani"}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-secondary text-white">
                  PRO
                </span>
              </div>
            </Link>

            <button
              onClick={handleSignOut}
              title="Keluar"
              className="p-1.5 rounded-full text-on-surface-variant hover:text-apple-red hover:bg-apple-red/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
