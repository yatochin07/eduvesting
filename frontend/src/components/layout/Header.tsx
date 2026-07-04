"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Tutup menu saat diklik
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    // Menggunakan 'absolute' dan 'bg-transparent' agar menyatu dengan background dan ikut terscroll
    <header className="absolute top-0 w-full z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-3 mt-10">
          <div className="flex items-center gap-3 mt-20 md:mb-12 animate-[fadeUp_0.4s_ease_both]">
            <div className="w-9 h-9 md:w-10 md:h-10 relative">
              <Image
                src="/logo3.png"
                alt="EduVesting Logo"
                fill
                className="rounded-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                priority
              />
            </div>
            <span className="font-jakarta font-bold text-xl md:text-2xl tracking-wide bg-gradient-to-r from-slate-800 to-indigo-600 dark:from-slate-100 dark:to-indigo-300 bg-clip-text text-transparent">
              EduVesting
            </span>
          </div>
        </div>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600 dark:text-slate-300">
          <Link
            href="/about"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors "
          >
            Tentang Kami
          </Link>
          <a
            href="#discover"
            onClick={(e) => scrollToSection(e, "discover")}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            FAQ
          </a>
        </nav>

        {/* TOMBOL MENU MOBILE (DIGABUNG LANGSUNG) */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <span
            className={`bg-slate-800 dark:bg-slate-200 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
              isMobileMenuOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
            }`}
          />
          <span
            className={`bg-slate-800 dark:bg-slate-200 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
              isMobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`bg-slate-800 dark:bg-slate-200 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
            }`}
          />
        </button>
      </div>

      {/* DROPDOWN MENU MOBILE (TRANSPARAN & HORIZONTAL) */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-transparent transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-20 py-2 opacity-100"
            : "max-h-0 py-0 opacity-0"
        }`}
      >
        {/* Diubah menjadi flex-row dan justify-center agar sejajar menyamping */}
        <nav className="flex flex-row justify-center items-center gap-8 relative -top-3 font-medium text-sm text-slate-600 dark:text-slate-300 px-6">
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors translate-y-0"
          >
            Tentang Kami
          </Link>
          <a
            href="#discover"
            onClick={(e) => scrollToSection(e, "discover")}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors translate-y-0"
          >
            FAQ
          </a>
        </nav>
      </div>
    </header>
  );
}