// frontend/src/app/(dashboard)/portfolio/page.tsx
"use client";

import { useState } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { AssetTypeSelect } from "@/components/portfolio/AssetTypeSelect";
import { AssetType } from "@/types/portfolio";
import { formatRupiah } from "@/lib/utils";
import toast from "react-hot-toast";

const ASSET_DICTIONARY: Record<string, string> = {
  'BBCA': 'Bank Central Asia Tbk',
  'BBRI': 'Bank Rakyat Indonesia Tbk',
  'BMRI': 'Bank Mandiri Tbk',
  'BBNI': 'Bank Negara Indonesia Tbk',
  'TLKM': 'Telkom Indonesia Tbk',
  'ASII': 'Astra International Tbk',
  'GOTO': 'GoTo Gojek Tokopedia Tbk',
  'BTC': 'Bitcoin',
  'ETH': 'Ethereum',
  'USDT': 'Tether',
  'XAU': 'Gold (XAU)',
  'AAPL': 'Apple Inc.',
  'TSLA': 'Tesla Inc.',
  'MSFT': 'Microsoft Corp.',
  'GOOGL': 'Alphabet Inc.',
  'XPIN': 'Reksa Dana ETF Pefindo',
  'XIIT': 'Reksa Dana ETF IDX30'
};

function getAutoName(ticker: string) {
  const cleanTicker = ticker.replace(".JK", "").toUpperCase();
  return ASSET_DICTIONARY[cleanTicker] || cleanTicker;
}

function getAssetTypeLabel(type: string) {
  const labels: Record<string, string> = {
    "idx_stock": "Saham (IDX)",
    "us_stock": "Saham (US)",
    "crypto": "Kripto",
    "gold": "Emas",
    "mutual_fund": "Reksadana"
  };
  return labels[type] || type;
}

function formatAssetCurrency(value: number, assetType: string) {
  if (assetType === "us_stock" || assetType === "crypto" || assetType === "gold") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  }
  
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PortfolioPage() {
  const { assets, loading, metrics, createAsset, updateAsset, deleteAsset, usdToIdr } = usePortfolio();

  const [form, setForm] = useState({
    asset_type: "idx_stock" as AssetType,
    symbol: "",
    average_buy_price: "",
    quantity: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseInputValue = (value: string): number => {
    if (!value) return 0;
    if (value.includes(".") && value.includes(",")) {
      return parseFloat(value.replace(/\./g, "").replace(",", "."));
    }
    if (value.includes(",")) {
       return parseFloat(value.replace(",", "."));
    }
    return parseFloat(value);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const parsedPrice = parseInputValue(form.average_buy_price);
    const parsedQty = parseInputValue(form.quantity);

    if (isNaN(parsedPrice) || isNaN(parsedQty) || parsedPrice <= 0 || parsedQty <= 0) {
      toast.error("Harga beli dan kuantitas harus berupa angka valid di atas nol.");
      setIsSubmitting(false);
      return;
    }

    let finalSymbol = form.symbol.toUpperCase().trim();
    
    // FIX REKSADANA: Mutual fund lokal (ETF) juga butuh akhiran .JK agar terbaca oleh yfinance!
    if ((form.asset_type === "idx_stock" || form.asset_type === "mutual_fund") && !finalSymbol.endsWith(".JK")) {
      finalSymbol += ".JK";
    }

    const payload = {
      asset_type: form.asset_type,
      symbol: finalSymbol,
      name: getAutoName(finalSymbol),
      average_buy_price: parsedPrice,
      quantity: parsedQty,
    };

    try {
      if (editId) {
        await updateAsset(editId, payload);
        toast.success(`Aset ${finalSymbol.replace(".JK", "")} berhasil diupdate!`);
      } else {
        await createAsset(payload);
        toast.success(`Aset ${finalSymbol.replace(".JK", "")} berhasil ditambahkan!`);
      }
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan saat menyimpan aset.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setForm({ asset_type: "idx_stock", symbol: "", average_buy_price: "", quantity: "" });
    setEditId(null);
  }

  function startEdit(asset: typeof assets[number]) {
    setEditId(asset.id);
    setForm({
      asset_type: asset.asset_type,
      symbol: asset.symbol.replace(".JK", ""), 
      average_buy_price: String(asset.average_buy_price),
      quantity: String(asset.quantity),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string, symbol: string) {
      const displaySymbol = symbol.replace(".JK", ""); 
      if(window.confirm(`Yakin ingin menghapus aset ${displaySymbol}?`)) {
          try {
              await deleteAsset(id);
              toast.success(`Aset ${displaySymbol} dihapus.`);
          } catch(err: any) {
              toast.error(err?.message || "Gagal menghapus aset");
          }
      }
  }

  const isUSDAsset = form.asset_type === "us_stock" || form.asset_type === "crypto" || form.asset_type === "gold";

  return (
    <div className="animate-[fadeUp_0.4s_ease_both]">
      <header className="mb-8">
        <h1 className="font-display text-2xl text-slate-100 font-semibold">Portofolio Saya</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola kuantitas dan harga beli rata-rata aset investasi Anda.</p>
        
        <div className="mt-3 inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
          <i className="fa-solid fa-bolt text-amber-400 text-xs"></i>
          <span className="text-xs text-indigo-300 font-medium">Kurs Realtime: 1 USD = {formatRupiah(usdToIdr)}</span>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-2xl p-5 border border-white/5 shadow-lg relative overflow-hidden">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1.5 font-medium relative z-10">Total Nilai Aset</p>
          <p className="font-display text-2xl text-slate-100 font-bold relative z-10">{formatRupiah(metrics?.totalValue || 0)}</p>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/5 shadow-lg relative overflow-hidden">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1.5 font-medium relative z-10">Total Modal</p>
          <p className="font-display text-2xl text-slate-100 font-bold relative z-10">{formatRupiah(metrics?.totalCost || 0)}</p>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/5 shadow-lg relative overflow-hidden">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1.5 font-medium relative z-10">Floating P/L</p>
          <p className={`font-display text-2xl font-bold relative z-10 ${(metrics?.floatingPL || 0) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {(metrics?.floatingPL || 0) > 0 ? "+" : ""}{formatRupiah(metrics?.floatingPL || 0)}
          </p>
        </div>
      </section>

      <section className="glass rounded-2xl p-6 mb-8 border border-white/5 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <i className={`fa-solid ${editId ? 'fa-pen-to-square text-amber-400' : 'fa-plus text-indigo-400'}`}></i>
            {editId ? "Edit Aset" : "Tambah Aset Baru"}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block uppercase tracking-wider">Jenis Aset</label>
              <AssetTypeSelect
                value={form.asset_type}
                onChange={(val) => setForm((f) => ({ ...f, asset_type: val }))}
              />
          </div>
          
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block uppercase tracking-wider">Ticker / Kode</label>
            <input
              type="text"
              value={form.symbol}
              onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value }))}
              placeholder={isUSDAsset ? "Cth: AAPL / BTC" : "Cth: BBCA / XPIN"}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all uppercase"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block uppercase tracking-wider">
              Harga Beli Avg {isUSDAsset ? "(USD)" : "(IDR)"}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={form.average_buy_price}
              onChange={(e) => setForm((f) => ({ ...f, average_buy_price: e.target.value }))}
              placeholder={isUSDAsset ? "Cth: 60000" : "Cth: 10000"}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block uppercase tracking-wider">Jumlah / Qty</label>
            <input
              type="text"
              inputMode="decimal"
              value={form.quantity}
              onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              placeholder={isUSDAsset ? "Cth: 0.5" : "Cth: 100"}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              required
            />
          </div>
          
          <div className="md:col-span-4 flex items-center justify-end gap-3 pt-4 mt-2 border-t border-white/5">
            {editId && (
              <button 
                type="button" 
                onClick={resetForm} 
                disabled={isSubmitting}
                className="text-sm font-medium text-slate-400 hover:text-white px-4 py-2 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
            )}
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-slate-700 px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-500/20"
            >
              {isSubmitting ? (
                  <span className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-notch fa-spin"></i> Proses...
                  </span>
              ) : (
                  editId ? "Update Aset" : "Simpan Aset"
              )}
            </button>
          </div>
        </form>
      </section>

      <section className="glass rounded-2xl overflow-hidden border border-white/5 shadow-xl">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
            <thead className="bg-black/20">
                <tr className="border-b border-white/5">
                <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Aset</th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Harga Avg</th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Harga Terakhir</th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Qty</th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Floating P/L</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                
                {loading ? (
                    <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                            <i className="fa-solid fa-circle-notch fa-spin text-2xl text-indigo-500 mb-3"></i>
                            <p>Memuat portofolio...</p>
                        </td>
                    </tr>
                ) : assets.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                            <i className="fa-solid fa-box-open text-3xl mb-3 opacity-50"></i>
                            <p>Belum ada aset di portofolio Anda.</p>
                        </td>
                    </tr>
                ) : (
                    assets.map((a) => {
                      const isRowUSD = a.asset_type === "us_stock" || a.asset_type === "crypto" || a.asset_type === "gold";
                      const pnlValue = a.unrealized_pnl ?? 0;
                      
                      const pnlIdrConverted = isRowUSD ? (pnlValue * (usdToIdr || 16000)) : 0;
                      
                      return (
                        <tr key={a.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-white/10 shrink-0">
                                    {a.symbol.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-200">{a.symbol.replace(".JK", "")}</p>
                                    <p className="text-xs text-slate-500 capitalize">{getAssetTypeLabel(a.asset_type)}</p>
                                </div>
                            </div>
                            </td>
                            <td className="px-4 py-4 text-right font-medium text-slate-300">
                              {formatAssetCurrency(a.average_buy_price, a.asset_type)}
                            </td>
                            <td className="px-4 py-4 text-right font-medium text-slate-300">
                              {formatAssetCurrency(a.current_price ?? 0, a.asset_type)}
                            </td>
                            <td className="px-4 py-4 text-right font-medium text-slate-300">
                              {new Intl.NumberFormat("id-ID", { maximumFractionDigits: 4 }).format(a.quantity)}
                            </td>
                            <td className={`px-4 py-4 text-right font-semibold ${pnlValue >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                              <div>
                                {pnlValue > 0 ? "+" : ""}
                                {formatAssetCurrency(pnlValue, a.asset_type)}
                              </div>
                              {isRowUSD && (
                                <div className="text-[10px] text-slate-400 font-normal mt-1 tracking-wide bg-white/5 inline-block px-1.5 py-0.5 rounded">
                                  ~ {pnlIdrConverted > 0 ? "+" : ""}{formatRupiah(pnlIdrConverted)}
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => startEdit(a)} 
                                        className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center"
                                        title="Edit Aset"
                                    >
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(a.id, a.symbol)} 
                                        className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                                        title="Hapus Aset"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                      );
                    })
                )}
            </tbody>
            </table>
        </div>
      </section>
    </div>
  );
}