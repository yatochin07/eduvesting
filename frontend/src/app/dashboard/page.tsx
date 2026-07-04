"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import apiClient from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

interface DashboardSummary {
  portfolio: { total_value: number; total_unrealized_pnl: number; asset_count: number };
  monthly_finance: { income: number; expense: number; investment: number; net: number };
  recent_goals: { title: string; target_amount: number; current_amount: number }[];
}

// Halaman Dashboard: mengagregasi data dari modul lain lewat endpoint /dashboard/summary.
// Template ini sengaja sederhana — silakan tambah chart (recharts) sesuai kebutuhan.
export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    apiClient.get<DashboardSummary>("/dashboard/summary").then((res) => setSummary(res.data));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total Nilai Portofolio</CardTitle></CardHeader>
          <p className="text-2xl font-bold">{summary ? formatCurrency(summary.portfolio.total_value) : "-"}</p>
        </Card>
        <Card>
          <CardHeader><CardTitle>Keuntungan/Kerugian</CardTitle></CardHeader>
          <p className="text-2xl font-bold">{summary ? formatCurrency(summary.portfolio.total_unrealized_pnl) : "-"}</p>
        </Card>
        <Card>
          <CardHeader><CardTitle>Arus Kas Bulan Ini</CardTitle></CardHeader>
          <p className="text-2xl font-bold">{summary ? formatCurrency(summary.monthly_finance.net) : "-"}</p>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Target Finansial Terbaru</CardTitle></CardHeader>
        <ul className="space-y-2">
          {summary?.recent_goals.map((goal) => (
            <li key={goal.title} className="flex justify-between text-sm">
              <span>{goal.title}</span>
              <span>{formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </DashboardLayout>
  );
}
