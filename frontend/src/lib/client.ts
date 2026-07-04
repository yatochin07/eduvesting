"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk dipakai di Client Component ("use client").
 * Auth Google OAuth di-handle penuh oleh Supabase Auth (provider Google
 * dikonfigurasi di Supabase Dashboard, credential-nya dari Google Cloud Console).
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
