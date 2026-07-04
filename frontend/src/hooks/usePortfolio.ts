// frontend/src/hooks/usePortfolio.ts
import { useCallback, useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { PortfolioAsset, PortfolioAssetInput } from "@/types/portfolio";
import toast from "react-hot-toast";

export function usePortfolio() {
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [usdToIdr, setUsdToIdr] = useState<number>(16000);

  const loadData = useCallback(async () => {
    setLoading(true);
    
    // 1. Ambil Kurs Realtime dari Bank Sentral
    let currentRate = 16000;
    try {
      const rateRes = await fetch("https://open.er-api.com/v6/latest/USD");
      const rateData = await rateRes.json();
      if (rateData?.rates?.IDR) {
        currentRate = rateData.rates.IDR;
        setUsdToIdr(currentRate);
      }
    } catch (error) {
      console.error("Gagal mengambil kurs USD/IDR", error);
    }

    // 2. Ambil Data Portofolio
    try {
      const res = await apiClient.get<PortfolioAsset[]>("/portfolio");
      const rawAssets = res.data;

      // 3. NORMALISASI BRUTAL (Solusi Angka Kacau)
      const normalizedAssets = rawAssets.map((a) => {
        let price = a.current_price ?? 0;

        // FIX KRIPTO & EMAS: Backend ngirim IDR miliaran, kita konversi paksa jadi USD murni!
        if (a.asset_type === "crypto" || a.asset_type === "gold") {
          if (price > 0) {
            price = price / currentRate;
          }
        }

        // Kalkulasi ulang P/L murni (USD vs USD, atau IDR vs IDR)
        const market_value = price * a.quantity;
        const cost_basis = a.average_buy_price * a.quantity;
        const unrealized_pnl = market_value - cost_basis;

        return {
          ...a,
          current_price: price,
          market_value,
          unrealized_pnl
        };
      });

      setAssets(normalizedAssets);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Gagal memuat data portofolio.");
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    loadData(); 
  }, [loadData]);

  const extractErrorMessage = (error: any, defaultMsg: string) => {
    if (error.response?.status === 422 && Array.isArray(error.response?.data?.detail)) {
      return error.response.data.detail.map((err: any) => 
        `${err.loc[err.loc.length - 1]}: ${err.msg}`
      ).join(', ');
    }
    return error.response?.data?.detail || defaultMsg;
  };

  const createAsset = async (payload: PortfolioAssetInput) => {
    try {
      await apiClient.post("/portfolio", payload);
      await loadData();
    } catch (error: any) {
      throw new Error(extractErrorMessage(error, "Gagal menambah aset."));
    }
  };

  const updateAsset = async (id: string, payload: Partial<PortfolioAssetInput>) => {
    try {
      await apiClient.put(`/portfolio/${id}`, payload);
      await loadData();
    } catch (error: any) {
      throw new Error(extractErrorMessage(error, "Gagal mengupdate aset."));
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      await apiClient.delete(`/portfolio/${id}`);
      await loadData();
    } catch (error: any) {
      throw new Error(extractErrorMessage(error, "Gagal menghapus aset."));
    }
  };

  const isUSDAsset = (type: string) => ["us_stock", "crypto", "gold"].includes(type);

  // Kalkulasi Metrik Header (Sudah dikalikan kurs untuk akumulasi IDR)
  const metrics = {
    totalValue: assets.reduce((sum, a) => {
      const rate = isUSDAsset(a.asset_type) ? usdToIdr : 1;
      return sum + ((a.market_value ?? 0) * rate);
    }, 0),
    totalCost: assets.reduce((sum, a) => {
      const rate = isUSDAsset(a.asset_type) ? usdToIdr : 1;
      return sum + (a.average_buy_price * a.quantity * rate);
    }, 0),
    floatingPL: assets.reduce((sum, a) => {
      const rate = isUSDAsset(a.asset_type) ? usdToIdr : 1;
      return sum + ((a.unrealized_pnl ?? 0) * rate);
    }, 0),
  };

  return { assets, loading, metrics, fetchAssets: loadData, createAsset, updateAsset, deleteAsset, usdToIdr };
}