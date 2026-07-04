import { Footer } from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <h1 className="mb-4 text-2xl font-bold">Tentang Kami</h1>
        <p className="text-gray-600">
          EduVesting adalah platform manajemen investasi dan keuangan yang dirancang
          khusus untuk membantu mahasiswa memahami dan mengelola portofolio investasi,
          transaksi harian, serta target finansial mereka secara terintegrasi.
        </p>
        <p className="mt-4 text-gray-600">
          Silakan lengkapi halaman ini dengan cerita, visi-misi, dan tim di balik EduVesting.
        </p>
      </main>
      <Footer />
    </div>
  );
}
