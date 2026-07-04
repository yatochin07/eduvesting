// frontend/src/components/portfolio/AssetTypeSelect.tsx
"use client";

import { AssetType } from "@/types/portfolio";

interface AssetTypeSelectProps {
  value: AssetType | string;
  onChange: (value: AssetType) => void;
}

export function AssetTypeSelect({ value, onChange }: AssetTypeSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AssetType)}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
      >
        <option value="idx_stock" className="bg-slate-900 text-white">Saham (Bursa Efek Indonesia)</option>
        <option value="us_stock" className="bg-slate-900 text-white">Saham (Wall Street / US)</option>
        <option value="crypto" className="bg-slate-900 text-white">Mata Uang Kripto</option>
        <option value="gold" className="bg-slate-900 text-white">Emas</option>
        <option value="mutual_fund" className="bg-slate-900 text-white">Reksadana</option>
      </select>
      <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
    </div>
  );
}