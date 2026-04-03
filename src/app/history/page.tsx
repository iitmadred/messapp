"use client";

import { useEffect, useState } from "react";
import { getPurchasesAction, deletePurchaseAction } from "@/app/actions";
import { Purchase } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Receipt, Search, Trash2, Calendar, Clock, Tag, PlusCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshData = async () => {
    setIsLoaded(false);
    try {
      const data = await getPurchasesAction();
      setPurchases(data);
      setFilteredPurchases(data);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredPurchases(
      purchases.filter(
        (p) =>
          p.itemName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, purchases]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this purchase?")) return;
    await deletePurchaseAction(id);
    refreshData();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Purchase History
          </h1>
          <p className="text-muted text-sm mt-1">
            Browse and manage all of your recorded transactions
          </p>
        </div>
        <div>
          <Link href="/add" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
            <PlusCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">New Entry</span>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="animate-fade-in-up" style={{ animationDelay: "60ms" }}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light" />
          <input
            type="text"
            placeholder="Search by name, category, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-card-border bg-card text-sm transition-all duration-200 placeholder:text-muted-light focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "120ms" }}>
        {!isLoaded ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-24 w-full rounded-2xl" />
          ))
        ) : filteredPurchases.length === 0 ? (
          <div className="text-center py-12 px-4 bg-card rounded-2xl border border-card-border border-dashed">
            <Receipt className="w-12 h-12 text-card-border mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">No purchases found</p>
            <p className="text-xs text-muted mt-1">
              {searchQuery ? "Try a different search term" : "Your purchase history is empty"}
            </p>
          </div>
        ) : (
          filteredPurchases.map((purchase) => (
            <div
              key={purchase.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-card-border hover:border-accent-blue/30 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-blue-light/50 flex items-center justify-center flex-shrink-0">
                  <Receipt className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    {purchase.itemName}
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold",
                        purchase.source === "ai-scan"
                          ? "bg-accent-purple-light text-accent-purple"
                          : "bg-card-border text-muted"
                      )}
                    >
                      {purchase.source === "ai-scan" ? "Scanned" : "Manual"}
                    </span>
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-muted">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      {purchase.category}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {purchase.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {purchase.time}
                    </span>
                  </div>

                  {purchase.description && (
                    <p className="mt-2 text-xs text-muted-light line-clamp-2 italic">
                      Note: {purchase.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 pr-2">
                <span className="font-bold text-accent-green">
                  {formatCurrency(purchase.cost)}
                </span>
                <button
                  onClick={() => handleDelete(purchase.id)}
                  className="p-2 rounded-lg text-muted hover:text-danger hover:bg-danger-light transition-colors sm:opacity-0 group-hover:opacity-100"
                  aria-label="Delete purchase"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
