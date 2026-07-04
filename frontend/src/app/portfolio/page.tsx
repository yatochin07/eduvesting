"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import apiClient from "@/lib/api-client";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { PortfolioAsset } from "@/types";

// Halaman Portfolio: CRUD aset + harga realtime (finnhub/yfinance/coingecko
// dipilih otomatis di backend berdasarkan asset_type).
export default function PortfolioPage() {
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssets = () => {
    setIsLoading(true);
    apiClient.get<PortfolioAsset[]>("/portfolio").then((res) => setAssets(res.data)).finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchAssets(); }, []);

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/portfolio/${id}`);
    fetchAssets();
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <Button>+ Tambah Aset</Button>
        {/* TODO: hubungkan ke <Modal> berisi form PortfolioAssetCreate (lihat schema backend) */}
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Memuat data...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <Card key={asset.id}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold">{asset.symbol}</span>
                <Badge label={asset.asset_type.replace("_", " ")} />
              </div>
              <p className="text-lg font-bold">{formatCurrency(asset.market_value ?? 0, asset.currency)}</p>
              {asset.unrealized_pnl_percentage !== undefined && asset.unrealized_pnl_percentage !== null && (
                <Badge
                  variant={asset.unrealized_pnl_percentage >= 0 ? "success" : "danger"}
                  label={formatPercentage(asset.unrealized_pnl_percentage)}
                />
              )}
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(asset.id)}>Hapus</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
