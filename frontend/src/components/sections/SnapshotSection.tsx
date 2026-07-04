"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface MarketData {
  id: string;
  symbol: string;
  name: string;
  priceFormatted: string; 
  changePercent: number;  
  icon: string;
  iconColor: string;
  iconBg: string;
}

export default function SnapshotSection() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch("/api/proxy/market/snapshot");
        
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        setMarketData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data market:", error);
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  return (
    <div className="w-full max-w-sm">
      {/* --- HEADER LIVE SNAPSHOT DENGAN INDIKATOR KELAP-KELIP --- */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="relative flex h-2.5 w-2.5">
          {/* Animasi Ping (Gelombang menyebar) */}
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 dark:bg-emerald-400 opacity-75"></span>
          {/* Titik Inti (Solid) */}
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 dark:bg-emerald-500"></span>
        </div>
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Live Snapshot
        </h3>
      </div>
      {/* --------------------------------------------------------- */}

      <div className="flex flex-col gap-3">
        {isLoading
          ? // Skeleton Loading State (Support Light/Dark)
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-20 rounded-2xl bg-slate-200/50 dark:bg-white/5 animate-pulse border border-slate-200 dark:border-white/5"
              />
            ))
          : // Data Loaded State
            marketData.map((item, index) => {
              const isPositive = item.changePercent >= 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-[#0f1423]/80 backdrop-blur-md border border-slate-200 dark:border-white/5 hover:border-indigo-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none"
                >
                  {/* Bagian Kiri: Icon & Nama */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${item.iconBg}`}
                    >
                      <i className={`${item.icon} ${item.iconColor} text-lg`} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">
                        {item.symbol}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {item.name}
                      </span>
                    </div>
                  </div>

                  {/* Bagian Kanan: Harga & Persentase */}
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                      {item.priceFormatted}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {item.changePercent}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
      </div>
    </div>
  );
}