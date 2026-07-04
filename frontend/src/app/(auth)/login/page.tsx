"use client";

import { useState } from "react";
import AuthSidebar from "@/components/auth/AuthSidebar"; // Sesuaikan jika path berbeda
import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function LoginPage() {
  // State untuk mengontrol tab aktif antara login dan register
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    // Wrapper utama diubah ke flex-col agar footer bisa menempel di paling bawah
    <main className="min-h-screen flex flex-col bg-transparent text-slate-800 dark:text-slate-200 relative overflow-x-hidden">
      
      {/* TOMBOL KEMBALI KE BERANDA */}
      <Link
        href="/"
        className="absolute top-6 right-6 z-50 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 backdrop-blur-md shadow-sm group"
        title="Kembali ke Beranda"
      >
        <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline"></span>
      </Link>

      {/* AREA SPLIT SCREEN (Kiri Sidebar, Kanan Form) */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* SIDEBAR (Kiri di Desktop, Atas di Mobile) */}
        <AuthSidebar />

        {/* AREA HAMPARAN FORM */}
        <section className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 z-10 relative">
          <LayoutGroup>
            <motion.div
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.5 },
                y: { duration: 0.5 },
              }}
              className="w-full max-w-md bg-white/80 dark:bg-[#131928]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8 md:my-0"
            >
              {/* TABS SWITCHER */}
              <motion.div
                layout="position"
                className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl mb-8"
              >
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    activeTab === "login"
                      ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-300"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                  onClick={() => setActiveTab("login")}
                >
                  Masuk
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    activeTab === "register"
                      ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-300"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                  onClick={() => setActiveTab("register")}
                >
                  Daftar
                </button>
              </motion.div>

              {/* ANIMASI PERGANTIAN FORM */}
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeTab}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </section>
      </div>

      {/* FOOTER: Diletakkan di level utama, terpisah dari layout split & form card */}
      <div className="w-full hidden md:block">
        <Footer />
      </div>
      
    </main>
  );
}