"use client";

import Link from "next/link";
import { Plus, Bot, Target, BarChart3 } from "lucide-react";

const actions = [
  {
    href: "/transactions/new",
    icon: Plus,
    label: "Catat",
    sublabel: "Transaksi",
    bg: "bg-foreground",
    text: "text-background",
  },
  {
    href: "/ai",
    icon: Bot,
    label: "Tanya",
    sublabel: "AI",
    bg: "bg-savings/10",
    text: "text-savings",
  },
  {
    href: "/savings",
    icon: Target,
    label: "Goals",
    sublabel: "Tabungan",
    bg: "bg-income/10",
    text: "text-income",
  },
  {
    href: "/analytics",
    icon: BarChart3,
    label: "Analitik",
    sublabel: "Laporan",
    bg: "bg-gold-light",
    text: "text-yellow-600",
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3 animate-slide-up">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.href}
            href={action.href}
            className="flex flex-col items-center gap-2 p-3 bg-white squircle shadow-apple hover:shadow-apple-md transition-all press-effect group"
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center ${action.bg}`}
            >
              <Icon className={`w-5 h-5 ${action.text}`} />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground leading-none">
                {action.label}
              </p>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                {action.sublabel}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
