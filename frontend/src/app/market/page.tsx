"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { TradingViewWidget } from "@/components/widgets/TradingViewWidget";

const QUICK_SYMBOLS = ["NASDAQ:AAPL", "IDX:BBCA", "BINANCE:BTCUSDT", "OANDA:XAUUSD"];

// Halaman Market: insight pasar realtime memakai widget TradingView (embed langsung, tanpa API key).
export default function MarketPage() {
  const [symbol, setSymbol] = useState(QUICK_SYMBOLS[0]);

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-2xl font-bold">Market Insight</h1>

      <div className="mb-4 flex gap-2">
        {QUICK_SYMBOLS.map((s) => (
          <button
            key={s}
            onClick={() => setSymbol(s)}
            className={`rounded-lg px-3 py-1.5 text-sm ${symbol === s ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <Card className="p-0">
        <TradingViewWidget symbol={symbol} height={520} />
      </Card>
    </DashboardLayout>
  );
}
