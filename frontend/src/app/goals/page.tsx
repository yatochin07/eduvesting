"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import apiClient from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import { Goal } from "@/types";

// Halaman Goals: target dana masa depan, TANPA API realtime.
export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    apiClient.get<Goal[]>("/goals").then((res) => setGoals(res.data));
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Goals</h1>
        <Button>+ Tambah Target</Button>
        {/* TODO: hubungkan ke form GoalCreate (title, target_amount, target_date) */}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader><CardTitle>{goal.title}</CardTitle></CardHeader>
            <p className="mb-2 text-sm text-gray-500">
              {formatCurrency(goal.current_amount)} dari {formatCurrency(goal.target_amount)}
            </p>
            <ProgressBar percentage={goal.progress_percentage} />
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
