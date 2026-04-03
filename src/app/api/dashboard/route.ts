import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Purchase = {
  id: string;
  itemName: string;
  cost: number;
  date: string;
  time: string;
  category: string;
  description: string;
  source: string;
  createdAt: Date;
};

// GET /api/dashboard — aggregated stats + recent purchases
export async function GET() {
  try {
    const allPurchases = await prisma.purchase.findMany({
      orderBy: { createdAt: "desc" },
    });

    const today = new Date().toISOString().split("T")[0];

    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split("T")[0];
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    let todayTotal = 0;
    let weekTotal = 0;
    let monthTotal = 0;
    let totalValue = 0;
    const categoryBreakdown: Record<string, number> = {};

    allPurchases.forEach((p: Purchase) => {
      if (p.date === today) todayTotal += p.cost;
      if (p.date >= weekAgoStr) weekTotal += p.cost;
      if (p.date >= monthStart) monthTotal += p.cost;
      totalValue += p.cost;
      categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + p.cost;
    });

    // Daily stats for last 7 days
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayPurchases = allPurchases.filter((p: Purchase) => p.date === dateStr);
      dailyStats.push({
        date: dateStr,
        total: dayPurchases.reduce((sum: number, p: Purchase) => sum + p.cost, 0),
        count: dayPurchases.length,
      });
    }

    return NextResponse.json({
      todayTotal,
      weekTotal,
      monthTotal,
      totalValue,
      totalItems: allPurchases.length,
      dailyStats,
      categoryData: Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value })),
      recentPurchases: allPurchases.slice(0, 10),
    });
  } catch (error) {
    console.error("[GET /api/dashboard] DB error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
