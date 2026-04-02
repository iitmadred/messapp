"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPurchasesAction() {
  return await prisma.purchase.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function addPurchaseAction(data: {
  itemName: string;
  cost: number;
  date: string;
  time: string;
  category: string;
  description: string;
  source: string;
}) {
  const purchase = await prisma.purchase.create({
    data,
  });
  revalidatePath("/");
  return purchase;
}

export async function deletePurchaseAction(id: string) {
  await prisma.purchase.delete({
    where: { id },
  });
  revalidatePath("/");
}

export async function clearAllPurchasesAction() {
  await prisma.purchase.deleteMany({});
  revalidatePath("/");
}

export async function getAggregatedDataAction() {
  const allPurchases = await prisma.purchase.findMany({
    orderBy: { date: "desc" },
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

  const categoryBreakdown: Record<string, number> = {};

  allPurchases.forEach((p: any) => {
    if (p.date === today) todayTotal += p.cost;
    if (p.date >= weekAgoStr) weekTotal += p.cost;
    if (p.date >= monthStart) monthTotal += p.cost;

    categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + p.cost;
  });

  // Daily Stats for last 7 days
  const dailyStats = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayPurchases = allPurchases.filter((p: any) => p.date === dateStr);
    dailyStats.push({
      date: dateStr,
      total: dayPurchases.reduce((sum: number, p: any) => sum + p.cost, 0),
      count: dayPurchases.length,
    });
  }

  return {
    todayTotal,
    weekTotal,
    monthTotal,
    totalItems: allPurchases.length,
    dailyStats,
    categoryData: Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value })),
    recentPurchases: allPurchases.slice(0, 10),
  };
}
