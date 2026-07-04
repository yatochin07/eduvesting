// frontend/src/types/portfolio.ts

export type AssetType = "idx_stock" | "us_stock" | "mutual_fund" | "crypto" | "gold";

export interface PortfolioAssetInput {
  asset_type: AssetType;
  symbol: string;
  name: string;
  average_buy_price: number;
  quantity: number;
}

export interface PortfolioAsset extends PortfolioAssetInput {
  id: string;
  user_id: string;
  current_price?: number;
  market_value?: number;
  unrealized_pnl?: number;
  created_at: string;
  updated_at: string;
}