"use client";

import { useEffect, useState } from "react";
import {
  Wallet,
  CalendarDays,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { CategoryChart } from "@/components/CategoryChart";
import { RecentPurchases } from "@/components/RecentPurchases";
import {
  getTodayTotal,
  getWeekTotal,
  getMonthTotal,
  getDailyStats,
  getCategoryBreakdown,
  getRecentPurchases,
  deletePurchase,
  getPurchases,
} from "@/lib/storage";
import { formatCurrency } from "@/lib/utils";
import { DailyStats, Purchase } from "@/lib/types";

export default function DashboardPage() {
  const [todayTotal, setTodayTotal] = useState(0);
  const [weekTotal, setWeekTotal] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshData = () => {
    setTodayTotal(getTodayTotal());
    setWeekTotal(getWeekTotal());
    setMonthTotal(getMonthTotal());
    setTotalItems(getPurchases().length);
    setDailyStats(getDailyStats(7));
    setCategoryData(getCategoryBreakdown());
    setRecentPurchases(getRecentPurchases(8));
  };

  useEffect(() => {
    refreshData();
    setIsLoaded(true);
  }, []);

  const handleDelete = (id: string) => {
    deletePurchase(id);
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
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted text-sm mt-1">
          Track your daily mess expenses at a glance
        </p>
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
          subtitle={totalItems > 0 ? `avg ${formatCurrency(monthTotal / Math.max(totalItems, 1))}` : undefined}
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
