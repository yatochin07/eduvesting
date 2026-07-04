/**
 * Middleware Next.js: melindungi route privat di level edge sebelum halaman
 * dirender. Karena token disimpan di localStorage (bukan cookie httpOnly di
 * template ini demi kesederhanaan), pengecekan utama dilakukan di client
 * lewat hook useAuth. Middleware ini menyediakan lapisan tambahan berbasis
 * cookie opsional `has_session` yang di-set setelah login berhasil.
 */
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = [
  "/dashboard",
  "/portfolio",
  "/transactions",
  "/goals",
  "/allocation",
  "/insights",
  "/settings",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const hasSession = request.cookies.get("has_session")?.value === "true";

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/portfolio/:path*", "/transactions/:path*", "/goals/:path*", "/allocation/:path*", "/insights/:path*", "/settings/:path*"],
};
