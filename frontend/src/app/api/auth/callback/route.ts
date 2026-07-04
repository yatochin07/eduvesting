import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/server";

/**
 * Proxy semua request /api/proxy/* dari frontend menuju FastAPI backend
 * di Cloud Run. Tujuannya: URL backend + service key tidak pernah exposed
 * ke browser, dan kita bisa validasi session Supabase di sini dulu.
 */
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;
const INTERNAL_KEY = process.env.BACKEND_INTERNAL_API_KEY!;

async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  const targetPath = params.path.join("/");
  const url = new URL(`${BACKEND_URL}/api/v1/${targetPath}`);
  url.search = req.nextUrl.search;

  const body = ["GET", "HEAD"].includes(req.method) ? undefined : await req.text();

  const backendRes = await fetch(url.toString(), {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Api-Key": INTERNAL_KEY,
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body,
  });

  const data = await backendRes.text();
  return new NextResponse(data, {
    status: backendRes.status,
    headers: { "Content-Type": backendRes.headers.get("Content-Type") ?? "application/json" },
  });
}

export {
  handler as GET, handler as POST, handler as PUT,
  handler as DELETE, handler as PATCH,
};
