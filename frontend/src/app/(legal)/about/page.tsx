"use client";

import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

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
            Kebijakan Privasi
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
            <p>
              Kebijakan Privasi ini berlaku untuk aplikasi web{" "}
              <strong className="font-semibold text-slate-800 dark:text-slate-200">
                EduVesting
              </strong>{" "}
              beserta seluruh layanan terkait yang dioperasikan oleh Tim
              Developer Mahasiswa (selanjutnya disebut sebagai "Penyedia
              Layanan"). Kami sangat menghargai privasi Anda dan berkomitmen
              untuk melindungi data pribadi Anda.
            </p>

            {/* Poin 1 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                1. Informasi yang Kami Kumpulkan
              </h2>
              <p className="mb-4">
                Karena EduVesting adalah aplikasi simulasi yang dirancang untuk
                tujuan edukasi, kami membatasi pengumpulan data hanya pada
                hal-hal yang benar-benar diperlukan untuk menjalankan fungsi
                aplikasi. Informasi yang kami kumpulkan meliputi:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>
                  <strong className="font-semibold text-slate-800 dark:text-slate-200">
                    Data Profil Pengguna:
                  </strong>{" "}
                  Saat Anda mendaftar (baik secara manual maupun melalui Google
                  OAuth), kami menyimpan Nama Lengkap, Alamat Email, dan
                  Universitas (opsional).
                </li>
                <li>
                  <strong className="font-semibold text-slate-800 dark:text-slate-200">
                    Data Portofolio Fiktif:
                  </strong>{" "}
                  Kami menyimpan rincian aset simulasi yang Anda input, termasuk{" "}
                  <i>ticker</i> saham/kripto, harga beli rata-rata, jumlah unit,
                  dan saldo kas virtual Anda.
                </li>
                <li>
                  <strong className="font-semibold text-slate-800 dark:text-slate-200">
                    Data Sesi Browser:
                  </strong>{" "}
                  Untuk mengelola status masuk (login) Anda, kami menggunakan{" "}
                  <i>Token Sesi (Session Tokens)</i> yang disimpan secara lokal
                  di perangkat Anda menggunakan fitur bawaan <i>browser</i>.
                </li>
              </ul>

              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
                <strong className="font-semibold">PENTING:</strong> Kami{" "}
                <strong>TIDAK PERNAH</strong> meminta, mengumpulkan, atau
                menyimpan data finansial asli Anda seperti nomor Rekening Bank,
                Kartu Kredit, atau Nomor Induk Kependudukan (KTP/NIK).
              </div>
            </div>

            {/* Poin 2 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                2. Bagaimana Kami Menggunakan Informasi Anda
              </h2>
              <p className="mb-4">
                Data yang dikumpulkan semata-mata digunakan untuk:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Membuat dan mengelola akun Anda di dalam sistem kami.</li>
                <li>
                  Menyinkronkan data portofolio simulasi Anda agar dapat diakses
                  melalui berbagai perangkat (seperti PC dan <i>Smartphone</i>).
                </li>
                <li>
                  Memberikan analisis performa portofolio investasi Anda
                  menggunakan fitur <i>EduVesting AI</i>.
                </li>
                <li>
                  Melakukan pemeliharaan, keamanan, dan peningkatan kinerja
                  aplikasi (mendeteksi <i>bug</i> atau <i>error</i>).
                </li>
              </ul>
            </div>

            {/* Poin 3 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                3. Penyimpanan & Perlindungan Data
              </h2>
              <p className="mb-4">
                Untuk memastikan keamanan data, kami menggunakan layanan{" "}
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  Supabase
                </strong>{" "}
                yang dilengkapi dengan enkripsi dan aturan keamanan tingkat
                baris (<i>Row Level Security/RLS</i>). Hal ini menjamin bahwa:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Kata sandi Anda dienkripsi secara penuh oleh sistem
                  autentikasi dan tidak dapat dibaca oleh pihak mana pun,
                  termasuk tim pengembang kami.
                </li>
                <li>
                  Data portofolio Anda bersifat privat dan hanya dapat dilihat,
                  diedit, atau dihapus oleh Anda sendiri saat Anda masuk ke
                  dalam akun.
                </li>
              </ul>
            </div>

            {/* Poin 4 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                4. Akses Pihak Ketiga
              </h2>
              <p className="mb-4">
                Sebagai platform web modern, kami menggunakan infrastruktur dari
                pihak ketiga yang terpercaya untuk menyajikan aplikasi ini
                kepada Anda:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>
                  <strong className="font-semibold text-slate-800 dark:text-slate-200">
                    Supabase:
                  </strong>{" "}
                  Digunakan sebagai penyedia layanan <i>database</i> dan
                  Autentikasi Pengguna.
                </li>
                <li>
                  <strong className="font-semibold text-slate-800 dark:text-slate-200">
                    Vercel & Google Cloud Run:
                  </strong>{" "}
                  Digunakan sebagai penyedia layanan <i>hosting web</i> dan{" "}
                  <i>backend</i> untuk memastikan aplikasi dapat diakses dengan
                  cepat.
                </li>
                <li>
                  <strong className="font-semibold text-slate-800 dark:text-slate-200">
                    Penyedia Data Pasar (Finnhub, CoinGecko, Yahoo Finance):
                  </strong>{" "}
                  Digunakan secara <i>anonim</i> (tanpa mengirimkan data diri
                  Anda) hanya untuk mengambil data harga aset secara{" "}
                  <i>real-time</i>.
                </li>
              </ul>
              <p>
                Kami tidak menjual, menyewakan, atau memperdagangkan data
                pribadi Anda kepada pihak ketiga untuk tujuan pemasaran apa pun.
              </p>
            </div>

            {/* Poin 5 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                5. Kebijakan Cookies dan Penyimpanan Lokal
              </h2>
              <p>
                Aplikasi ini menggunakan{" "}
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  LocalStorage
                </strong>{" "}
                pada <i>browser</i> Anda untuk menyimpan preferensi pengaturan
                (seperti Tema Gelap/Terang) dan beberapa data antarmuka
                non-sensitif. Menghapus <i>cache</i> dan data <i>browser</i>{" "}
                Anda akan secara otomatis menghapus data lokal ini dari
                perangkat Anda.
              </p>
            </div>

            {/* Poin 6 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                6. Hak Anda atas Data
              </h2>
              <p className="mb-4">
                Sesuai dengan prinsip pelindungan data pribadi, Anda memiliki
                hak untuk:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Mengakses seluruh data portofolio dan profil yang kami simpan.
                </li>
                <li>Memperbarui atau mengoreksi data yang tidak akurat.</li>
                <li>
                  Meminta penghapusan permanen atas seluruh akun dan data
                  portofolio Anda dari <i>database</i> kami.
                </li>
              </ul>
            </div>

            {/* Poin 7 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                7. Perubahan pada Kebijakan Privasi
              </h2>
              <p>
                Penyedia Layanan berhak untuk memperbarui Kebijakan Privasi ini
                dari waktu ke waktu menyesuaikan dengan pembaruan fitur
                aplikasi. Setiap perubahan yang dilakukan akan langsung
                diperbarui pada halaman ini, lengkap dengan tanggal efektif
                terbaru.
              </p>
            </div>

            {/* Poin 8 */}
            <div>
              <h2 className="font-jakarta text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                8. Hubungi Kami
              </h2>
              <p className="mb-4">
                Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini,
                atau ingin mengajukan permintaan terkait hak penghapusan data
                Anda, silakan hubungi tim pengembang melalui:
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

      <Footer />
    </div>
  );
}