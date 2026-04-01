export interface PurchaseItem {
  name: string;
  price: number;
}

export interface Purchase {
  id: string;
  itemName: string;
  cost: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  category: string;
  description: string;
  source: "manual" | "ai-scan";
  items?: PurchaseItem[];
}

export interface ReceiptScanResult {
  total_amount: number | null;
  list_of_items: PurchaseItem[];
  common_description: string;
  purchase_date: string | null;
  purchase_time: string | null;
  confidence: "high" | "medium" | "low";
}

export interface DailyStats {
  date: string;
  total: number;
  count: number;
}

export type Category =
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Snacks"
  | "Beverages"
  | "Other";

export const CATEGORIES: Category[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Beverages",
  "Other",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Breakfast: "#F59E0B",
  Lunch: "#3B82F6",
  Dinner: "#8B5CF6",
  Snacks: "#10B981",
  Beverages: "#EC4899",
  Other: "#6B7280",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  Breakfast: "☀️",
  Lunch: "🍽️",
  Dinner: "🌙",
  Snacks: "🍿",
  Beverages: "☕",
  Other: "📦",
};
