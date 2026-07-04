"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Wallet, Receipt, Target, PieChart,
  Sparkles, BookOpen, LineChart, Calculator, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/transactions", label: "Transaction", icon: Receipt },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/allocation", label: "Allocation", icon: PieChart },
  { href: "/insights", label: "Insight", icon: Sparkles },
  { href: "/education", label: "Edukasi", icon: BookOpen },
  { href: "/market", label: "Market", icon: LineChart },
  { href: "/calculator", label: "Calculator", icon: Calculator },
  { href: "/settings", label: "Settings", icon: Settings },
];

// Sidebar dipakai bersama di semua halaman privat lewat DashboardLayout.
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white p-4 md:block">
      <div className="mb-6 px-2 text-xl font-bold text-brand-600">EduVesting</div>
      <nav className="space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
