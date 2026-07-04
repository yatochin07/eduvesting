"use client";

import SiteHeader from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import DiscoverSection from "@/components/sections/DiscoverSection";
import SiteFooter from "@/components/layout/Footer";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="absolute top-24 right-6 w-11 h-11 rounded-xl bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors z-20 shadow-lg"
      title="Ubah Mode Tampilan"
    >
      {theme === "dark" ? (
        <i className="fa-solid fa-moon text-lg"></i>
      ) : (
        <i className="fa-solid fa-sun text-lg text-amber-500"></i>
      )}
    </button>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden text-slate-800 dark:text-slate-200">
      {/* Background Animasi Cairan WebGL Neat sudah di-mount global di layout.tsx,
          jangan dipanggil lagi di sini - kalau dobel, dua canvas WebGL akan
          render bertumpuk dan bikin tampilan jadi berat/ramai kayak "over-zoom". */}

      {/* Navbar Atas */}
      <SiteHeader />
      <div className="mt-5">
        {/* Tombol tema */}
        <ThemeToggleButton />
      </div>
      {/* Hero Section */}
      <HeroSection />

      {/* Bagian Fitur / Discover */}
      <main
        id="discover"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 space-y-32"
      >
        <DiscoverSection />
      </main>

      {/* Footer Aplikasi */}
      <SiteFooter />
    </div>
  );
}
