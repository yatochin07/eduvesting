import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

// Landing page publik. Template sederhana — silakan dikembangkan lebih jauh
// (hero image, testimoni, dsb) sesuai kebutuhan branding.
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between px-6">
        <span className="text-lg font-bold text-brand-600">EduVesting</span>
        <div className="flex gap-3">
          <Link href="/login"><Button variant="outline">Masuk</Button></Link>
          <Link href="/register"><Button>Daftar</Button></Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-2xl text-4xl font-bold text-gray-900 md:text-5xl">
          Kelola Investasi & Keuanganmu Sebagai Mahasiswa, Lebih Mudah
        </h1>
        <p className="mt-4 max-w-xl text-gray-600">
          Pantau portofolio saham, kripto, emas, dan reksadana secara realtime,
          catat transaksi harian, capai target finansial, dan dapatkan insight dari AI.
        </p>
        <Link href="/register" className="mt-8">
          <Button size="lg">Mulai Sekarang</Button>
        </Link>
      </main>

      <Footer />
    </div>
  );
}
