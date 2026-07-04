import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#07090f]/80 backdrop-blur-md pt-12 sm:pt-16 pb-8 mt-12 sm:mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* UBAH GRID: 2 Kolom di Mobile, 4 Kolom di Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 md:gap-12 mb-12">
          {/* Kolom 1: Brand & Deskripsi (Ambil 2 kolom penuh di Mobile) */}
          <div className="col-span-2 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-3 mt-0">
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
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto sm:mx-0">
              Platform simulasi manajemen portofolio investasi terpadu. Belajar
              saham, kripto, dan emas tanpa risiko finansial dengan data dunia
              nyata.
            </p>
          </div>

          {/* Kolom 2: Tautan Cepat (Sebelah kiri di Mobile) */}
          <div className="col-span-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Platform
            </h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link
                  href="#discover"
                  className="hover:text-indigo-500 transition-colors"
                >
                  Fitur Kami
                </Link>
              </li>
              <li>
                <Link
                  href="#discover"
                  className="hover:text-indigo-500 transition-colors"
                >
                  Materi Edukasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Legalitas (Sebelah kanan di Mobile) */}
          <div className="col-span-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Legalitas
            </h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 mb-6">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-indigo-500 transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="hover:text-indigo-500 transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>

            {/* Ikon Sosial Media (VERSI DESKTOP - Sembunyi di Mobile) */}
            <div className="hidden md:flex items-center gap-5 text-slate-400">
              <a
                href="https://www.instagram.com/yattchn7"
                className="hover:text-indigo-500 transition-colors"
              >
                <i className="fa-brands fa-instagram text-lg"></i>
              </a>
              <a
                href="https://github.com/yatochin07"
                className="hover:text-indigo-500 transition-colors"
              >
                <i className="fa-brands fa-github text-lg"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/hilmawan-ega-tetama-a32060341"
                className="hover:text-indigo-500 transition-colors"
              >
                <i className="fa-brands fa-linkedin text-lg"></i>
              </a>
            </div>
          </div>

          {/* Ikon Sosial Media (VERSI MOBILE - Tampil di tengah bawah, Sembunyi di Desktop) */}
          <div className="col-span-2 flex justify-center md:hidden pt-2">
            <div className="flex items-center gap-6 text-slate-400">
              <a
                href="https://www.instagram.com/yattchn7"
                className="hover:text-indigo-500 transition-colors"
              >
                <i className="fa-brands fa-instagram text-xl"></i>
              </a>
              <a
                href="https://github.com/yatochin07"
                className="hover:text-indigo-500 transition-colors"
              >
                <i className="fa-brands fa-github text-xl"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/hilmawan-ega-tetama-a32060341"
                className="hover:text-indigo-500 transition-colors"
              >
                <i className="fa-brands fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Garis Bawah & Disclaimer */}
        <div className="border-t border-slate-200 dark:border-white/10 pt-8 flex flex-col items-center justify-center text-center px-4 sm:px-0">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-3">
            © {new Date().getFullYear()} EduVesting Project. Hak Cipta
            Dilindungi.
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-xs max-w-3xl leading-relaxed">
            <span className="font-semibold text-amber-600 dark:text-amber-500">
              Disclaimer:
            </span>{" "}
            Ini adalah proyek simulasi untuk tujuan edukasi yang dibuat oleh
            mahasiswa. Semua angka portofolio dan saldo adalah fiktif. Kami
            tidak memberikan rekomendasi investasi sungguhan. Harap selalu
            gunakan penasihat keuangan berlisensi sebelum melakukan investasi di
            dunia nyata.
          </p>
        </div>
      </div>
    </footer>
  );
}
