"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import apiClient from "@/lib/api-client";
import { AllocationProfile } from "@/types";

// Halaman Allocation: profil alokasi aset (konservatif/moderat/agresif/kustom), TANPA API realtime.
export default function AllocationPage() {
  const [profiles, setProfiles] = useState<AllocationProfile[]>([]);

  useEffect(() => {
    apiClient.get<AllocationProfile[]>("/allocation").then((res) => setProfiles(res.data));
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Allocation</h1>
        <div className="flex gap-2">
          <Button variant="outline">Pakai Preset</Button>
          <Button>Buat Kustom</Button>
        </div>
        {/* TODO: preset diambil dari GET /allocation/presets, custom lewat form AllocationProfileCreate */}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {profiles.map((profile) => (
          <Card key={profile.id}>
            <CardHeader><CardTitle className="capitalize">{profile.profile_type}</CardTitle></CardHeader>
            <ul className="space-y-1 text-sm">
              {profile.targets.map((t) => (
                <li key={t.asset_class} className="flex justify-between">
                  <span className="capitalize">{t.asset_class.replace("_", " ")}</span>
                  <span>{t.target_percentage}%</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
