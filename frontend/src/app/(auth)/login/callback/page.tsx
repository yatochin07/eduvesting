"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeCodeForSession } from "@/lib/auth";

// Halaman redirect target Google OAuth (GOOGLE_REDIRECT_URI).
// Menukar `code` dari query param menjadi session (JWT) lewat backend.
export default function LoginCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("Kode otorisasi Google tidak ditemukan.");
      return;
    }
    exchangeCodeForSession(code)
      .then(() => {
        document.cookie = "has_session=true; path=/";
        router.push("/dashboard");
      })
      .catch(() => setError("Gagal login dengan Google. Silakan coba lagi."));
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-gray-500">{error ?? "Memproses login..."}</p>
    </div>
  );
}
