import { Footer } from "@/components/layout/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <h1 className="mb-4 text-2xl font-bold">Syarat & Ketentuan</h1>
        <p className="text-gray-600">
          Dengan menggunakan EduVesting, kamu setuju untuk menggunakan layanan ini
          sebagaimana mestinya. EduVesting adalah alat bantu pencatatan dan analisis,
          bukan nasihat keuangan profesional.
        </p>
        <p className="mt-4 text-gray-600">
          Lengkapi halaman ini dengan syarat & ketentuan resmi sesuai kebutuhan hukum.
        </p>
      </main>
      <Footer />
    </div>
  );
}
