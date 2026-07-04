// Tipe data bersama, mencerminkan schema Pydantic di backend.
// Menjaga tipe FE & BE selaras adalah kunci maintainability jangka panjang.

export type AssetType = "us_stock" | "idx_stock" | "mutual_fund" | "crypto" | "gold";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface PortfolioAsset {
  id: string;
  asset_type: AssetType;
  symbol: string;
  name: string | null;
  quantity: number;
  average_buy_price: number;
  currency: string;
  current_price?: number | null;
  market_value?: number | null;
  unrealized_pnl?: number | null;
  unrealized_pnl_percentage?: number | null;
  price_source?: string | null;
}

export interface Transaction {
  id: string;
  type: "income" | "expense" | "investment";
  category: string;
  amount: number;
  description: string | null;
  transaction_date: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  status: "in_progress" | "achieved" | "cancelled";
  progress_percentage: number;
}

export interface AllocationTarget {
  asset_class: "stock" | "crypto" | "gold" | "mutual_fund" | "cash";
  target_percentage: number;
}

export interface AllocationProfile {
  id: string;
  profile_type: "conservative" | "moderate" | "aggressive" | "custom";
  is_active: boolean;
  targets: AllocationTarget[];
}

export interface AIInsight {
  id: string;
  insight_type: string;
  summary: string;
  recommendations: { items: { title: string; detail: string }[] } | null;
  created_at: string;
}

export interface EducationContent {
  id: string;
  title: string;
  category: string;
  summary: string | null;
  content_body: string;
  thumbnail_url: string | null;
}
