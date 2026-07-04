"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeCodeForSession } from "@/lib/auth";

export default function LoginCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  
  const hasFetched = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    
    if (!code) {
      // Return diam-diam jika kode tidak ada (efek URL sudah dibersihkan)
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    // 1. Trik Rahasia: Langsung hapus ?code= dari URL agar tidak terkirim ulang saat refresh
    window.history.replaceState(null, "", window.location.pathname);

    exchangeCodeForSession(code)
      .then(() => {
        document.cookie = "has_session=true; path=/";
        router.push("/dashboard");
      })
      .catch((err: any) => {
        // 2. Gunakan console.dir agar error object tidak menjadi {} di terminal Next.js
        console.dir(err); 
        
        const errorMessage = err.response?.data?.detail || err.message || "Gagal login dengan Google.";
        setError(`Error: ${errorMessage}`);
      });
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1423]">
      <div className="bg-white/10 border border-white/10 p-6 rounded-2xl max-w-md w-full text-center backdrop-blur-md shadow-xl">
        <p className="text-sm font-medium text-slate-200">
          {error ?? "Memproses login Google Anda..."}
        </p>
      </div>
    </div>
  );
}