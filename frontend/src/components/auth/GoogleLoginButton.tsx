"use client";

import { redirectToGoogleLogin } from "@/lib/auth";

export function GoogleLoginButton() {
  return (
    <button
      onClick={redirectToGoogleLogin}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
    >
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
      Masuk dengan Google
    </button>
  );
}
