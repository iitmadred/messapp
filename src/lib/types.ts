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
  | "Vegetables"
  | "Meat & Seafood"
  | "Dairy & Eggs"
  | "Grains & Pulses"
  | "Spices & Oils"
  | "Other Groceries";

export const CATEGORIES: Category[] = [
  "Vegetables",
  "Meat & Seafood",
  "Dairy & Eggs",
  "Grains & Pulses",
  "Spices & Oils",
  "Other Groceries",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  "Vegetables": "#10B981",           // Emerald Green
  "Meat & Seafood": "#EF4444",       // Red
  "Dairy & Eggs": "#F59E0B",         // Amber
  "Grains & Pulses": "#D97706",      // Orange/Brown
  "Spices & Oils": "#8B5CF6",        // Purple
  "Other Groceries": "#6B7280",      // Gray
};

export const CATEGORY_ICONS: Record<Category, string> = {
  "Vegetables": "🥬",
  "Meat & Seafood": "🍗",
  "Dairy & Eggs": "🥚",
  "Grains & Pulses": "🌾",
  "Spices & Oils": "🧂",
  "Other Groceries": "🛒",
};
