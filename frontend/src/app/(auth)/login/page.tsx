import Link from "next/link";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold">Masuk ke EduVesting</h1>
        <p className="mb-6 text-sm text-gray-500">Gunakan akun Google kamu untuk masuk.</p>
        <GoogleLoginButton />
        <p className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link href="/register" className="text-brand-600 hover:underline">Daftar</Link>
        </p>
      </div>
    </div>
  );
}
