import httpx

class CoinGeckoClient:
    async def get_quote(self, symbol: str, currency: str = "idr") -> dict:
        """
        Mengambil harga realtime dari CoinGecko.
        Parameter 'symbol' mewakili 'coin_id' (misal: 'bitcoin', 'ethereum').
        """
        url = f"https://api.coingecko.com/api/v3/simple/price?ids={symbol}&vs_currencies={currency}&include_24hr_change=true"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            coin_data = data.get(symbol, {})
            price = coin_data.get(currency, 0.0)
            change_percent = coin_data.get(f"{currency}_24h_change", 0.0)
            
            return {
                "price": float(price), 
                "change_percent": float(change_percent)
            }

# Instance singleton yang akan dipanggil oleh MarketDataRouter
coingecko_client = CoinGeckoClient()