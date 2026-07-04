import Link from "next/link";

// Footer publik dipakai di landing page & halaman legal (about, privacy, terms).
export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 text-sm text-gray-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <span>&copy; {new Date().getFullYear()} EduVesting. Semua hak dilindungi.</span>
        <div className="flex gap-6">
          <Link href="/about" className="hover:text-gray-900">Tentang Kami</Link>
          <Link href="/privacy-policy" className="hover:text-gray-900">Kebijakan Privasi</Link>
          <Link href="/terms-of-service" className="hover:text-gray-900">Syarat & Ketentuan</Link>
        </div>
      </div>
    </footer>
  );
}
