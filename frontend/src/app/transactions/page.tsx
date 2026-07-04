"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import apiClient from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types";

const TYPE_VARIANT = { income: "success", expense: "danger", investment: "neutral" } as const;

// Halaman Transaction: pencatatan harian ala money manager, TANPA API realtime.
export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    apiClient.get<Transaction[]>("/transactions").then((res) => setTransactions(res.data));
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transaction</h1>
        <Button>+ Catat Transaksi</Button>
        {/* TODO: hubungkan ke form TransactionCreate (type, category, amount, date) */}
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-2">Tanggal</th>
              <th className="pb-2">Kategori</th>
              <th className="pb-2">Tipe</th>
              <th className="pb-2 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b last:border-0">
                <td className="py-2">{tx.transaction_date}</td>
                <td className="py-2">{tx.category}</td>
                <td className="py-2"><Badge label={tx.type} variant={TYPE_VARIANT[tx.type]} /></td>
                <td className="py-2 text-right">{formatCurrency(tx.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}
