"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Wallet,
  CalendarDays,
  TrendingUp,
  ShoppingBag,
  PlusCircle,
  Camera,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { CategoryChart } from "@/components/CategoryChart";
import { RecentPurchases } from "@/components/RecentPurchases";
import { formatCurrency } from "@/lib/utils";
import { DailyStats } from "@/lib/types";

export default function DashboardPage() {
  const [todayTotal, setTodayTotal] = useState(0);
  const [weekTotal, setWeekTotal] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshData = async () => {
    setIsLoaded(false);
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const data = await res.json();
      setTodayTotal(data.todayTotal);
      setWeekTotal(data.weekTotal);
      setMonthTotal(data.monthTotal);
      setTotalItems(data.totalItems);
      setDailyStats(data.dailyStats);
      setCategoryData(data.categoryData);
      setRecentPurchases(data.recentPurchases);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/purchases/${id}`, { method: "DELETE" });
    refreshData();
  };

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div>
          <div className="skeleton h-8 w-48 mb-2" />
          <div className="skeleton h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 skeleton h-72 rounded-2xl" />
          <div className="skeleton h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted text-sm mt-1">
            Track your daily raw material expenses at a glance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/add"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-card-border hover:border-accent-blue hover:bg-accent-blue-light/30 transition-all duration-200"
          >
            <PlusCircle className="w-4 h-4 text-accent-blue" />
            <span className="text-sm font-semibold">Manual</span>
          </Link>
          <Link
            href="/scan"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Camera className="w-4 h-4" />
            <span className="text-sm font-semibold">Scan</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Wallet}
          label="Today"
          value={formatCurrency(todayTotal)}
          accentColor="blue"
          delay={0}
        />
        <StatsCard
          icon={CalendarDays}
          label="This Week"
          value={formatCurrency(weekTotal)}
          accentColor="green"
          delay={60}
        />
        <StatsCard
          icon={TrendingUp}
          label="This Month"
          value={formatCurrency(monthTotal)}
          accentColor="orange"
          delay={120}
        />
        <StatsCard
          icon={ShoppingBag}
          label="Total Purchases"
          value={String(totalItems)}
          subtitle={
            totalItems > 0
              ? `avg ${formatCurrency(monthTotal / Math.max(totalItems, 1))}`
              : undefined
          }
          accentColor="purple"
          delay={180}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ExpenseChart data={dailyStats} />
        </div>
        <div>
          <CategoryChart data={categoryData} />
        </div>
      </div>

      {/* Recent */}
      <RecentPurchases purchases={recentPurchases} onDelete={handleDelete} />
    </div>
  );
}
