// frontend/src/components/layout/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/UseCurrentUser";

interface NavItem {
  href: string;
  label: string;
  icon: string; // font-awesome class
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Utama",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: "fa-solid fa-gauge-high" },
      { href: "/portfolio", label: "Portofolio", icon: "fa-solid fa-briefcase" },
      { href: "/transactions", label: "Keuangan", icon: "fa-solid fa-wallet" },
      { href: "/goals", label: "Target Dana", icon: "fa-solid fa-bullseye" },
      { href: "/allocations", label: "Alokasi Aset", icon: "fa-solid fa-chart-pie" },
    ],
  },
  {
    title: "Analisa",
    items: [
      { href: "/insights", label: "EduVesting AI", icon: "fa-solid fa-robot" },
      { href: "/guide", label: "Edukasi", icon: "fa-solid fa-book-open" },
      { href: "/market", label: "Market Insights", icon: "fa-solid fa-chart-line" },
      { href: "/calculator", label: "Kalkulator Investasi", icon: "fa-solid fa-calculator" },
    ],
  },
  {
    title: "Akun",
    items: [{ href: "/settings", label: "Pengaturan", icon: "fa-solid fa-gear" }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleSidebar() {
    setMobileOpen((o) => !o);
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  }

  const displayName = loading ? "Memuat..." : user?.full_name || user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 flex flex-col z-50 transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{
          background: "rgba(10,14,24,0.95)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(16px)",
        }}
      >
        <button
          onClick={toggleSidebar}
          className="md:hidden absolute top-6 right-4 text-slate-400 hover:text-white"
        >
          <i className="fa-solid fa-xmark text-xl" />
        </button>

        <div className="px-6 py-6 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#6366f1,#3b82f6)" }}
          >
            <i className="fa-solid fa-chart-line text-white text-sm" />
          </div>
          <span className="font-display text-lg logo-text font-bold">EduVesting</span>
        </div>

        <div className="mx-4 mb-5 p-3 rounded-xl glass-lighter flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white overflow-hidden"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={displayName} className="w-full h-full object-cover rounded-full" />
            ) : (
              initial
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{displayName}</p>
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="px-4 py-1.5 mt-3 text-xs font-semibold text-slate-600 uppercase tracking-widest">
                {group.title}
              </p>
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-r-lg text-sm ${
                      isActive ? "nav-active text-indigo-300 font-medium" : "text-slate-400"
                    }`}
                  >
                    <i className={`${item.icon} w-4 text-center ${isActive ? "text-indigo-400" : ""}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}

          <button
            onClick={handleLogout}
            className="nav-item w-full flex items-center gap-3 px-4 py-2.5 rounded-r-lg text-rose-400 text-sm text-left"
          >
            <i className="fa-solid fa-right-from-bracket w-4 text-center" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Trigger mobile — dipasang di sini supaya bisa dipanggil dari luar lewat context kalau perlu */}
      <MobileTrigger onToggle={toggleSidebar} />
    </>
  );
}

function MobileTrigger({ onToggle }: { onToggle: () => void }) {
  return (
    <div className="md:hidden flex items-center justify-between px-4 py-4 fade-up">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#6366f1,#3b82f6)" }}
        >
          <i className="fa-solid fa-chart-line text-white text-sm" />
        </div>
        <span className="font-display text-lg logo-text font-bold tracking-wide">EduVesting</span>
      </div>
      <button onClick={onToggle} className="text-slate-300 hover:text-white z-20">
        <i className="fa-solid fa-bars text-xl" />
      </button>
    </div>
  );
}