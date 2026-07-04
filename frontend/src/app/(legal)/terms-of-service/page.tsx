"use client";

import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
  // cast to any to satisfy framer-motion easing typings for cubic-bezier array
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
    },
  } as any;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      
      {/* AnimatedBackground DIHAPUS DARI SINI 
          Karena sudah di-handle oleh layout.tsx secara global 
      */}

      {/* Navbar Minimalis Khusus Halaman Legal (Transparan & Seamless) */}
      <nav className="absolute top-0 z-50 w-full bg-transparent px-6 py-4 sm:py-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* LOGO EDUVESTING */}
          <div className="flex items-center gap-3 mt-10">
            <div className="flex items-center gap-3 md:mb-12 animate-[fadeUp_0.4s_ease_both]">
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

          {/* TOMBOL KEMBALI */}
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10"
          >
            <i className="fa-solid fa-arrow-left" />
            <span className="hidden sm:inline"></span>
          </Link>
        </div>
      </nav>

      {/* Jarak padding (py-24 sm:py-32) diperbesar agar konten tidak tertutup navbar absolute */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-24 sm:py-32">
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="mb-10"
        >
          <h1 className="font-jakarta text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-50 mb-4">
            Syarat & Ketentuan
          </h1>
          <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">
            Terakhir Diperbarui: 22 Juni 2026
          </p>
        </motion.header>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="p-6 sm:p-10 rounded-3xl bg-white/80 dark:bg-[#131928]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl"
        >
          <div className="space-y-8 text-slate-600 dark:text-slate-400 text-sm sm:text-[15px] leading-relaxed">
            <div>
              <p className="mb-4">
                Syarat dan ketentuan ini berlaku untuk aplikasi web{" "}
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  EduVesting
                </strong>{" "}
                beserta seluruh layanan terkait yang dioperasikan oleh Tim
                Developer Mahasiswa (selanjutnya disebut sebagai "Penyedia
                Layanan").
              </p>
              <p>
                Dengan mengakses atau menggunakan aplikasi ini, Anda setuju
                untuk terikat oleh Syarat dan Ketentuan ini. Harap baca dengan
                saksama sebelum mulai menggunakan EduVesting.
              </p>
            </div>

            {/* Poin 1 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                1. Sifat Aplikasi (Simulasi/Edukasi)
              </h2>
              <p className="mb-4">
                EduVesting adalah sebuah{" "}
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  aplikasi simulasi
                </strong>{" "}
                yang ditujukan sepenuhnya untuk keperluan edukasi dan tugas
                akademik. Anda memahami dan menyetujui bahwa:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Semua mata uang, saldo kas, dan aset yang ada di dalam
                  aplikasi ini adalah{" "}
                  <strong className="font-semibold text-slate-800 dark:text-slate-200">
                    virtual/fiktif
                  </strong>{" "}
                  dan tidak memiliki nilai tukar di dunia nyata.
                </li>
                <li>
                  Informasi harga pasar (seperti Kripto dan Saham) yang
                  ditampilkan ditarik dari API publik pihak ketiga dan mungkin
                  mengalami penundaan (<i>delay</i>) atau ketidakakuratan.
                </li>
                <li>
                  EduVesting bukanlah broker, penasihat keuangan, atau entitas
                  investasi yang terdaftar. Platform ini tidak boleh dijadikan
                  sebagai rujukan mutlak untuk melakukan transaksi investasi
                  dengan uang sungguhan.
                </li>
              </ul>
            </div>

            {/* Poin 2 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                2. Lisensi Penggunaan
              </h2>
              <p>
                Penyedia Layanan memberi Anda lisensi terbatas, non-eksklusif,
                dan dapat dibatalkan untuk mengakses serta menggunakan Aplikasi
                secara personal. Anda{" "}
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  tidak diperkenankan
                </strong>{" "}
                untuk menyalin, mendistribusikan, memodifikasi, merekayasa balik
                (<i>reverse engineer</i>), atau mengekstrak kode sumber aplikasi
                tanpa izin tertulis dari Penyedia Layanan.
              </p>
            </div>

            {/* Poin 3 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                3. Kekayaan Intelektual
              </h2>
              <p>
                Seluruh hak kekayaan intelektual yang terdapat dalam aplikasi,
                termasuk namun tidak terbatas pada kode pemrograman, desain
                antarmuka, tata letak, logo, dan merek (<i>branding</i>), adalah
                milik sah Penyedia Layanan. Penggunaan Anda atas aplikasi tidak
                memberikan Anda hak apa pun atas kekayaan intelektual tersebut.
              </p>
            </div>

            {/* Poin 4 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                4. Penggunaan yang Diperbolehkan
              </h2>
              <p className="mb-4">
                Dalam menggunakan EduVesting, Anda setuju untuk{" "}
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  tidak
                </strong>{" "}
                melakukan hal-hal berikut:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Mencoba mengeksploitasi, meretas, atau menyuntikkan{" "}
                  <i>malware/spam</i> ke dalam sistem dan <i>database</i>{" "}
                  aplikasi.
                </li>
                <li>
                  Menggunakan aplikasi untuk tujuan komersial atau menjual
                  belikan akun/saldo fiktif di dalam aplikasi kepada pihak lain.
                </li>
                <li>
                  Memberikan informasi registrasi yang menyesatkan atau
                  menggunakan data orang lain tanpa izin.
                </li>
              </ul>
            </div>

            {/* Poin 5 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                5. Batasan Tanggung Jawab (Limitation of Liability)
              </h2>
              <p className="mb-4">
                Sejauh diizinkan oleh hukum yang berlaku, Penyedia Layanan{" "}
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  tidak bertanggung jawab
                </strong>{" "}
                atas kerugian langsung, tidak langsung, insidental, atau
                konsekuensial yang mungkin Anda alami. Hal ini mencakup:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Kerugian finansial di dunia nyata yang Anda alami akibat
                  meniru atau mengandalkan pola portofolio yang ada di dalam
                  simulasi EduVesting.
                </li>
                <li>
                  Gangguan fungsi aplikasi akibat masalah pada koneksi internet
                  Anda atau <i>downtime</i> dari server pihak ketiga (seperti
                  API harga koin atau layanan Supabase/Vercel).
                </li>
                <li>
                  Hilangnya data portofolio simulasi Anda akibat penghapusan{" "}
                  <i>cache browser</i> (jika menggunakan fitur{" "}
                  <i>LocalStorage</i>) atau insiden teknis lainnya.
                </li>
              </ul>
            </div>

            {/* Poin 6 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                6. Penghentian Akses (Termination)
              </h2>
              <p>
                Penyedia Layanan berhak secara sepihak untuk menangguhkan,
                membatasi, atau menghapus akses Anda ke aplikasi dan{" "}
                <i>database</i> secara permanen jika Anda ditemukan melanggar
                Syarat & Ketentuan ini, melakukan aktivitas mencurigakan, atau
                jika aplikasi ini dihentikan masa operasionalnya (misalnya
                setelah masa tugas akademik selesai).
              </p>
            </div>

            {/* Poin 7 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                7. Perubahan Syarat & Ketentuan
              </h2>
              <p>
                Penyedia Layanan dapat memperbarui Syarat dan Ketentuan ini dari
                waktu ke waktu tanpa pemberitahuan sebelumnya. Dengan terus
                menggunakan aplikasi setelah perubahan tersebut dipublikasikan,
                Anda dianggap menyetujui versi terbaru dari Syarat dan Ketentuan
                ini.
              </p>
            </div>

            {/* Poin 8 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                8. Hubungi Kami
              </h2>
              <p className="mb-4">
                Jika Anda memiliki pertanyaan, saran, atau masukan terkait
                Syarat & Ketentuan ini, jangan ragu untuk menghubungi pengembang
                melalui:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-envelope text-indigo-500 w-5 text-center" />
                  <a
                    href="mailto:eduvesting67@gmail.com"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    eduvesting67@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-brands fa-instagram text-indigo-500 w-5 text-center" />
                  <a
                    href="https://instagram.com/yattchn7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    @yattchn7
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer/>
    </div>
  );
}