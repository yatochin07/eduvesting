"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/lib/api-client";

// Halaman Settings: update profil & ganti password (fallback non-Google).
export default function SettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [message, setMessage] = useState<string | null>(null);

  const handleSaveProfile = async () => {
    await apiClient.patch("/users/me", { full_name: fullName });
    setMessage("Profil berhasil diperbarui.");
  };

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profil Akun</CardTitle></CardHeader>
          <div className="space-y-3">
            <Input label="Email" value={user?.email ?? ""} disabled />
            <Input label="Nama Lengkap" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Button onClick={handleSaveProfile}>Simpan Perubahan</Button>
            {message && <p className="text-sm text-green-600">{message}</p>}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Keamanan</CardTitle></CardHeader>
          <p className="text-sm text-gray-500">
            Akun kamu login menggunakan Google. Untuk keamanan tambahan,
            kelola akses langsung lewat pengaturan akun Google kamu.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
