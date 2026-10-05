"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  Sparkles,
  BarChart3,
  Settings,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/lib/types/database.types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AppSidebarProps {
  user?: User | null;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transaksi", href: "/transactions", icon: ArrowLeftRight },
  { label: "Impian & Goals", href: "/goals", icon: Target },
  { label: "AI Advisor", href: "/advisor", icon: Sparkles, badge: "AI" },
  { label: "Analitik", href: "/analytics", icon: BarChart3 },
  { label: "Pengaturan", href: "/settings", icon: Settings },
];

export default function AppSidebar({ user }: AppSidebarProps) {
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
    <aside className="hidden lg:flex flex-col w-64 border-r border-apple-subtle bg-apple-white h-screen fixed top-0 left-0 p-5 z-40 justify-between">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-2 px-2 py-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-apple-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
            K
          </div>
          <div>
            <h1 className="font-semibold tracking-tight text-apple-primary leading-none">
              KitaKaya
            </h1>
            <span className="text-[10px] text-apple-secondary font-medium tracking-wide uppercase">
              Financial Studio
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-apple-surface text-apple-primary font-semibold shadow-apple-card"
                    : "text-apple-secondary hover:text-apple-primary hover:bg-apple-surface/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-apple-blue" : "text-apple-secondary"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-apple-blue/10 text-apple-blue">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Footer */}
      <div className="border-t border-apple-subtle pt-4 space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-apple-surface border border-apple-subtle flex items-center justify-center text-xs font-semibold text-apple-primary">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-apple-primary truncate">
                {user?.full_name || user?.email?.split("@")[0] || "Pengguna"}
              </p>
              <p className="text-[10px] text-apple-secondary truncate">
                {user?.currency || "IDR"} Account
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            title="Keluar"
            className="p-1.5 rounded-lg text-apple-secondary hover:text-apple-red hover:bg-apple-red/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
