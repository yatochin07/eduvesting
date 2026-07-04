"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import apiClient from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

interface CalculatorResult {
  final_value: number;
  total_contributed: number;
  total_interest: number;
}

// Halaman Calculator: simulasi compound interest, TANPA API realtime.
export default function CalculatorPage() {
  const [form, setForm] = useState({
    initial_amount: 1000000,
    monthly_contribution: 500000,
    annual_return_rate: 8,
    duration_years: 10,
  });
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const handleCalculate = async () => {
    const { data } = await apiClient.post<CalculatorResult>("/calculator/compound-interest", {
      ...form,
      save_history: true,
    });
    setResult(data);
  };

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-2xl font-bold">Kalkulator Investasi</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Input Simulasi</CardTitle></CardHeader>
          <div className="space-y-3">
            <Input label="Dana Awal (Rp)" type="number" value={form.initial_amount}
              onChange={(e) => setForm({ ...form, initial_amount: Number(e.target.value) })} />
            <Input label="Kontribusi Bulanan (Rp)" type="number" value={form.monthly_contribution}
              onChange={(e) => setForm({ ...form, monthly_contribution: Number(e.target.value) })} />
            <Input label="Estimasi Return Tahunan (%)" type="number" value={form.annual_return_rate}
              onChange={(e) => setForm({ ...form, annual_return_rate: Number(e.target.value) })} />
            <Input label="Durasi (Tahun)" type="number" value={form.duration_years}
              onChange={(e) => setForm({ ...form, duration_years: Number(e.target.value) })} />
            <Button onClick={handleCalculate} className="w-full">Hitung</Button>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Hasil Proyeksi</CardTitle></CardHeader>
          {result ? (
            <div className="space-y-2 text-sm">
              <p>Total Dana Akhir: <strong>{formatCurrency(result.final_value)}</strong></p>
              <p>Total Kontribusi: {formatCurrency(result.total_contributed)}</p>
              <p>Total Keuntungan: {formatCurrency(result.total_interest)}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Isi form lalu klik Hitung.</p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
