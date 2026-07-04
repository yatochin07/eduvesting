"use client";

import { useEffect, useRef } from "react";

interface TradingViewWidgetProps {
  symbol?: string; // format TradingView, mis. "NASDAQ:AAPL" atau "BINANCE:BTCUSDT"
  height?: number;
}

/**
 * Widget embed TradingView untuk halaman Market. Memakai widget resmi
 * TradingView (script eksternal), TIDAK memerlukan API key.
 * Docs: https://www.tradingview.com/widget/advanced-chart/
 */
export function TradingViewWidget({ symbol = "NASDAQ:AAPL", height = 500 }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "D",
      timezone: "Asia/Jakarta",
      theme: "light",
      style: "1",
      locale: "id",
      allow_symbol_change: true,
    });

    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" style={{ height }}>
      <div ref={containerRef} style={{ height: "100%" }} />
    </div>
  );
}
