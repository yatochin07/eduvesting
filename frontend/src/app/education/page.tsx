"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import apiClient from "@/lib/api-client";
import { EducationContent } from "@/types";

// Halaman Edukasi: konten investasi (publik / RLS disabled), TANPA API realtime.
export default function EducationPage() {
  const [contents, setContents] = useState<EducationContent[]>([]);

  useEffect(() => {
    apiClient.get<EducationContent[]>("/education").then((res) => setContents(res.data));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-2xl font-bold">Edukasi Investasi</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contents.map((content) => (
          <Card key={content.id}>
            <CardHeader><CardTitle>{content.title}</CardTitle></CardHeader>
            <p className="text-sm text-gray-600">{content.summary}</p>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
