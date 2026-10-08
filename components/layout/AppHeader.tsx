"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/lib/types/database.types";
import { Sparkles, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getStoredUser, clearUserSession, subscribeStorage } from "@/lib/storage";

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

export default function AppHeader({ user: initialUser }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser || null);

  useEffect(() => {
    setCurrentUser(getStoredUser());
    const unsubscribe = subscribeStorage(() => {
      setCurrentUser(getStoredUser());
    });
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    clearUserSession();
    await fetch("/api/auth/session", { method: "DELETE" });
    toast.success("Sesi telah keluar");
    router.push("/welcome");
    router.refresh();
  };

  const displayName = currentUser?.full_name || "Dhani";

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/85 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center group">
          <Image
            src="/logo.png"
            alt="Kita Kaya"
            width={108}
            height={40}
            className="h-9 w-auto object-contain group-hover:opacity-80 transition-opacity"
            priority
          />
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary text-xs font-semibold transition-colors border border-surface-container-high"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>AI Advisor</span>
          </Link>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1 border-l border-surface-container-high">
            <Link
              href="/settings"
              className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container-low transition-colors"
              title="Pengaturan Akun & Data"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:flex items-center gap-1.5 pr-2">
                <span className="text-xs font-semibold text-primary">
                  {displayName}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
                  Lokal
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
