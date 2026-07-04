"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { User } from "@/types";
import { isAuthenticated } from "@/lib/auth";

// Hook reusable untuk ambil data user login saat ini, dipakai di Navbar,
// DashboardLayout, dan halaman mana pun yang butuh info user.
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      setIsLoading(false);
      return;
    }
    apiClient
      .get<User>("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  return { user, isLoading };
}
