"use client";

import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";
import Image from "next/image";

// Navbar atas dipakai di landing page (publik) & di dalam DashboardLayout (privat).
export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="text-lg font-semibold text-gray-900">EduVesting</div>
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user.full_name ?? user.email}</span>
          {user.avatar_url && (
            <Image src={user.avatar_url} alt={user.full_name ?? "avatar"} width={32} height={32} className="rounded-full" />
          )}
          <button onClick={logout} className="text-sm text-red-600 hover:underline">
            Keluar
          </button>
        </div>
      )}
    </header>
  );
}
