import { Purchase, DailyStats } from "./types";

const STORAGE_KEY = "mesapp_purchases";
const API_KEY_STORAGE = "mesapp_mistral_key";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getPurchases(): Purchase[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addPurchase(
  purchase: Omit<Purchase, "id">
): Purchase {
  const purchases = getPurchases();
  const newPurchase: Purchase = { ...purchase, id: generateId() };
  purchases.unshift(newPurchase);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
  return newPurchase;
}

export function deletePurchase(id: string): void {
  const purchases = getPurchases().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
}

export function clearAllPurchases(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportPurchases(): string {
  return JSON.stringify(getPurchases(), null, 2);
}

export function getTodayTotal(): number {
  const today = new Date().toISOString().split("T")[0];
  return getPurchases()
    .filter((p) => p.date === today)
    .reduce((sum, p) => sum + p.cost, 0);
}

export function getWeekTotal(): number {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];

  return getPurchases()
    .filter((p) => p.date >= weekAgoStr)
    .reduce((sum, p) => sum + p.cost, 0);
}

export function getMonthTotal(): number {
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  return getPurchases()
    .filter((p) => p.date >= monthStart)
    .reduce((sum, p) => sum + p.cost, 0);
}

export function getDailyStats(days: number = 7): DailyStats[] {
  const stats: DailyStats[] = [];
  const purchases = getPurchases();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayPurchases = purchases.filter((p) => p.date === dateStr);
    stats.push({
      date: dateStr,
      total: dayPurchases.reduce((sum, p) => sum + p.cost, 0),
      count: dayPurchases.length,
    });
  }

  return stats;
}

export function getCategoryBreakdown(): { name: string; value: number }[] {
  const purchases = getPurchases();
  const breakdown: Record<string, number> = {};

  purchases.forEach((p) => {
    breakdown[p.category] = (breakdown[p.category] || 0) + p.cost;
  });

  return Object.entries(breakdown).map(([name, value]) => ({
    name,
    value,
  }));
}

export function getRecentPurchases(limit: number = 10): Purchase[] {
  return getPurchases().slice(0, limit);
}

export function getStoredApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(API_KEY_STORAGE) || "";
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE, key);
}
