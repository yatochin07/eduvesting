import Link from "next/link";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";

// Karena login/register memakai Google OAuth, halaman register secara teknis
// sama dengan login (backend otomatis membuat user baru jika belum ada / lihat
// AuthService.login_with_google). Halaman dipisah untuk kejelasan UX saja.
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold">Buat Akun EduVesting</h1>
        <p className="mb-6 text-sm text-gray-500">Daftar cepat dengan akun Google kamu.</p>
        <GoogleLoginButton />
        <p className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-brand-600 hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  );
}
