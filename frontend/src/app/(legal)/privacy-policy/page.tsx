import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <h1 className="mb-4 text-2xl font-bold">Kebijakan Privasi</h1>
        <p className="text-gray-600">
          Kami menghargai privasi pengguna. Data yang kami simpan (profil, portofolio,
          transaksi, target finansial) dilindungi menggunakan Row Level Security (RLS)
          di database, sehingga hanya pemilik akun yang dapat mengakses datanya sendiri.
        </p>
        <p className="mt-4 text-gray-600">
          Lengkapi halaman ini dengan detail kebijakan privasi resmi sesuai regulasi yang berlaku.
        </p>
      </main>
      <Footer />
    </div>
  );
}
