"use client";

import { useState } from "react";

const FEATURES = [
  {
    icon: "fa-wallet",
    color: "indigo",
    title: "Portofolio Virtual",
    desc: "Punya uang Rp 10 Juta? Belajar alokasikan ke berbagai instrumen (Saham, Kripto, Emas) dan lihat pergerakan nilainya secara real-time tanpa takut rugi.",
  },
  {
    icon: "fa-graduation-cap",
    color: "emerald",
    title: "Materi Edukasi & AI Insight",
    desc: "Dapatkan evaluasi otomatis dari AI untuk setiap keputusan investasi yang Anda buat. Pahami diversifikasi dan manajemen risiko dengan cepat.",
  },
  {
    icon: "fa-calculator",
    color: "cyan",
    title: "Panduan Cepat & Kalkulator",
    desc: "Tidak perlu bingung menghitung biaya beli/jual. Gunakan fitur Budget Optimizer untuk mengkalkulasi fee broker dan menemukan nominal lot yang pas.",
  },
];

const COLOR_MAP: Record<string, string> = {
  indigo: "bg-indigo-500/15 text-indigo-500 dark:text-indigo-300",
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  cyan: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300",
};



const FAQS = [
  {
    q: "Apa itu EduVesting?",
    a: "EduVesting adalah platform simulasi manajemen portofolio investasi yang dirancang khusus untuk mahasiswa Indonesia dan juga pemula. Tujuannya adalah untuk belajar investasi secara praktis tanpa menggunakan uang nyata.",
  },
  {
    q: "Apakah ini menggunakan uang sungguhan?",
    a: "Tidak. Semua uang, aset, dan transaksi di dalam aplikasi ini adalah fiktif/simulasi belaka. Kami tidak pernah meminta informasi rekening atau kartu kredit Anda.",
  },
  {
    q: "Bagaimana cara mendaftar?",
    a: 'Sangat mudah! Anda bisa menggunakan tombol "Google" untuk login instan satu klik, atau mendaftar manual menggunakan email aktif universitas/pribadi Anda melalui tab "Daftar" di atas.',
  },
  {
    q: "Instrumen investasi apa saja yang tersedia?",
    a: "Saat ini kami mendukung simulasi untuk Saham Indonesia (IDX), Kripto Spot, Emas, dan Reksa Dana Pasar Uang. Seluruh instrumen disesuaikan dengan perhitungan fee/pajak standar di Indonesia.",
  },
  {
    q: "Apakah harga aset yang ditampilkan real-time?",
    a: "Ya! Harga Kripto ditarik secara live melalui API publik (seperti CoinGecko). Sedangkan untuk Saham IDX, data ditarik dari sistem backend kami agar mencerminkan harga pasar sesungguhnya.",
  },
  {
    q: "Bagaimana kerahasiaan data saya?",
    a: "Data Anda (Nama dan Email) diamankan menggunakan sistem enkripsi tingkat industri dari Supabase. Anda memegang kendali penuh atas privasi Anda dan kami tidak membagikan data kepada pihak ketiga.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 dark:border-white/5 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left bg-transparent border-none cursor-pointer py-6 flex items-center justify-between gap-4 group"
      >
        <span className="text-[15px] font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors">
          {q}
        </span>
        <i
          className={`fa-solid fa-chevron-down flex-shrink-0 text-indigo-500 dark:text-indigo-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className="overflow-hidden transition-[max-height,padding] duration-400 ease-in-out"
        style={{ maxHeight: open ? "500px" : "0px", paddingBottom: open ? "1.5rem" : "0px" }}
      >
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-1">{a}</p>
      </div>
    </div>
  );
}

export default function DiscoverSection() {
  return (
    <>
      {/* ===== FITUR ===== */}
      <section>
        <h2 className="font-jakarta text-3xl md:text-[2.25rem] font-bold text-slate-800 dark:text-slate-50 text-center mb-12">
          Apa yang Bisa Anda Lakukan di Sini?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-8 flex flex-col items-center text-center rounded-3xl bg-white/70 dark:bg-[#0f1423]/60 backdrop-blur-md border border-slate-200 dark:border-white/6 transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500/30"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-2xl ${COLOR_MAP[f.color]}`}>
                <i className={`fa-solid ${f.icon}`} />
              </div>
              <h3 className="text-xl font-jakarta font-semibold text-slate-800 dark:text-slate-100 mb-3">
                {f.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TIM & KONTAK ===== */}
      <section>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          

        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="max-w-3xl mx-auto">
        <h2 className="font-jakarta text-3xl md:text-[2.25rem] font-bold text-slate-800 dark:text-slate-50 text-center mb-12">
          Pertanyaan Umum (FAQ)
        </h2>
        <div className="p-2 sm:p-8 rounded-3xl bg-white/70 dark:bg-[#0f1423]/60 backdrop-blur-md border border-slate-200 dark:border-white/6">
          {FAQS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>
    </>
  );
}