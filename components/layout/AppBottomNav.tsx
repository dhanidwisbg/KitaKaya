"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transaksi", href: "/transactions", icon: ArrowLeftRight },
  { label: "Impian", href: "/goals", icon: Target },
  { label: "AI Advisor", href: "/advisor", icon: Sparkles },
  { label: "Analitik", href: "/analytics", icon: BarChart3 },
];

export default function AppBottomNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-apple-white/90 backdrop-blur-md border-t border-apple-subtle px-3 py-2">
      <nav className="flex items-center justify-around">
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
                "flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors",
                isActive
                  ? "text-apple-blue font-semibold"
                  : "text-apple-secondary hover:text-apple-primary"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
