import asyncio
# 1. Import objeknya, bukan method-nya
from app.services.market_data.finnhub_client import finnhub_client

async def main():
    print("Mencoba mengambil data Apple (AAPL)...")
    try:
        # 2. Panggil method get_quote dari objek tersebut
        result = await finnhub_client.get_quote("AAPL")
        print("Berhasil!")
        print(result)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Karena get_quote adalah fungsi async, kita harus menjalankannya pakai asyncio
    asyncio.run(main())