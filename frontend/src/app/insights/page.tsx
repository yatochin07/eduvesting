"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import apiClient from "@/lib/api-client";
import { AIInsight } from "@/types";

// Halaman Insight: analisis AI (Groq) atas seluruh jejak finansial user.
export default function InsightsPage() {
  const [history, setHistory] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchHistory = () => {
    apiClient.get<AIInsight[]>("/insights/history").then((res) => setHistory(res.data));
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await apiClient.post("/insights/generate", { insight_type: "general" });
      fetchHistory();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Insight</h1>
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? "Menganalisis..." : "Buat Insight Baru"}
        </Button>
      </div>

      <div className="space-y-4">
        {history.map((insight) => (
          <Card key={insight.id}>
            <CardHeader><CardTitle>{new Date(insight.created_at).toLocaleDateString("id-ID")}</CardTitle></CardHeader>
            <p className="mb-3 text-sm text-gray-700">{insight.summary}</p>
            <ul className="space-y-2">
              {insight.recommendations?.items.map((rec, i) => (
                <li key={i} className="rounded-lg bg-gray-50 p-3 text-sm">
                  <p className="font-medium">{rec.title}</p>
                  <p className="text-gray-600">{rec.detail}</p>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
