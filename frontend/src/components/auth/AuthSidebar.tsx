"use client";

import Image from "next/image";
// Pastikan path ini mengarah ke file komponen MarketSnapshot yang berisi dummy data tadi
import MarketSnapshot from "../sections/SnapshotSection";

export default function AuthSidebar() {
  return (
   
    <aside className="flex flex-col w-full md:w-1/2 p-6 sm:p-10 md:p-12 relative overflow-hidden md:h-screen md:sticky md:top-0">
      <div className="flex-1">
        {/* Logo & Tagline Section */}
        <div className="flex items-center gap-3 mb-8 md:mb-12 animate-[fadeUp_0.4s_ease_both]">
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

        <div className="animate-[fadeUp_0.45s_ease_both_0.1s]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-jakarta font-bold leading-tight text-slate-800 dark:text-slate-100 mb-3 md:mb-4">
            Kelola Portofolio<br />
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent">
              Seperti Pro.
            </span>
          </h1>
          <p className="text-slate-800 dark:text-slate-300 font-jakarta text-sm leading-relaxed max-w-xs">
            Platform simulasi manajemen portofolio untuk mahasiswa atau pemula — saham, kripto, emas, dan reksa dana dalam satu dashboard yang elegan.
          </p>
        </div>
      </div>

      {/* Market Ticker Section */}
      <div className="mt-8 md:mt-10 animate-[fadeUp_0.5s_ease_both_0.2s]">
       
        <MarketSnapshot />
      </div>
    </aside>
  );
}