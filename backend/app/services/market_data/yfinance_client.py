import yfinance as yf
import asyncio

class YFinanceClient:
    async def get_quote(self, symbol: str) -> dict:
        def fetch_data():
            # yfinance butuh symbol asli, misal "^JKSE" untuk IHSG
            stock = yf.Ticker(symbol)
            hist = stock.history(period="2d") 
            
            # PENGAMAN 1: Kalau Yahoo Finance ngirim data kosong (len == 0)
            if hist.empty or len(hist) == 0:
                raise ValueError(f"Yahoo Finance gagal/mengembalikan data kosong untuk {symbol}")
            
            # PENGAMAN 2: Kalau cuma ada data 1 hari (misal hari Senin pagi)
            if len(hist) < 2:
                price = hist['Close'].iloc[-1]
                return {"price": float(price), "change_percent": 0.0}
            
            # Normal: Ada data 2 hari
            prev_close = hist['Close'].iloc[0]
            current_price = hist['Close'].iloc[1]
            change_percent = ((current_price - prev_close) / prev_close) * 100
            
            return {"price": float(current_price), "change_percent": float(change_percent)}

        # Menjalankan fungsi blocking (yfinance) di thread terpisah agar FastAPI tidak macet
        return await asyncio.to_thread(fetch_data)

# Instance tunggal yang dicari oleh MarketDataRouter
yfinance_client = YFinanceClient()