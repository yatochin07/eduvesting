from pydantic import BaseModel

class QuoteResponse(BaseModel):
    price: float
    change_percent: float

# Tambahkan ini untuk merespons endpoint snapshot
class MarketSnapshotResponse(BaseModel):
    id: str
    symbol: str
    name: str
    priceFormatted: str
    changePercent: float
    icon: str
    iconColor: str
    iconBg: str