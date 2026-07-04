import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client untuk dipakai di Server Component / Route Handler.
 * Membaca & menulis cookie session lewat next/headers.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  const hasSet = typeof (cookieStore as any).set === "function";

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          if (!hasSet) return;
          try {
            (cookieStore as any).set({ name, value, ...options });
          } catch {
            // Dipanggil dari Server Component tanpa mutasi cookie -> aman diabaikan
          }
        },
        remove(name: string, options: CookieOptions) {
          if (!hasSet) return;
          try {
            (cookieStore as any).set({ name, value: "", ...options });
          } catch {
            // idem
          }
        },
      },
    }
  );
}

/** Service-role client (BYPASS RLS) — hanya untuk operasi server yang benar2 privileged. */
export function createSupabaseAdminClient() {
  const { createClient } = require("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
