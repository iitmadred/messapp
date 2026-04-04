"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Receipt, Search, Trash2, Calendar, Clock, Tag, 
  PlusCircle, AlertCircle, ChevronDown, ChevronUp, X 
} from "lucide-react";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";

type Purchase = {
  id: string;
  itemName: string;
  cost: number;
  date: string;
  time: string;
  category: string;
  description?: string;
  source: string;
};

export default function HistoryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Accordion state
  const [expandedDates, setExpandedDates] = useState<string[]>([]);

  const refreshData = async () => {
    setIsLoaded(false);
    setError(null);
    try {
      const res = await fetch("/api/purchases", { cache: "no-store" });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setPurchases(data);
      setFilteredPurchases(data);
      
      // Auto-expand the newest date by default if there's data
      if (data.length > 0) {
         const sortedDates = Array.from(new Set(data.map((p: Purchase) => p.date)))
            .sort((a, b) => (b as string).localeCompare(a as string));
         if (sortedDates.length > 0) {
            setExpandedDates([sortedDates[0] as string]);
         }
      }
    } catch (err: any) {
      console.error("History fetch error:", err);
      setError(err.message || "Failed to load purchases");
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filter effect
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredPurchases(
      purchases.filter((p) => {
        const matchesSearch = 
          p.itemName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q);
        
        const matchesDate = dateFilter ? p.date === dateFilter : true;
        
        return matchesSearch && matchesDate;
      })
    );
  }, [searchQuery, dateFilter, purchases]);

  // Grouping logic (Memoized)
  const groupedPurchases = useMemo(() => {
    const groups: Record<string, Purchase[]> = {};
    filteredPurchases.forEach((p) => {
      if (!groups[p.date]) groups[p.date] = [];
      groups[p.date].push(p);
    });

    // Convert to array and sort dates descending (Newest first)
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredPurchases]);

  const toggleDate = (dateString: string) => {
    setExpandedDates((prev) => 
      prev.includes(dateString)
        ? prev.filter((d) => d !== dateString)
        : [...prev, dateString]
    );
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent accordion toggle if clicked inside the expand zone
    if (!confirm("Delete this purchase?")) return;
    try {
      const res = await fetch(`/api/purchases/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      refreshData();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
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
            Browse and filter your transactions day by day
          </p>
        </div>
        <Link
          href="/add"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="text-sm font-semibold">New Entry</span>
        </Link>
      </div>

      {/* Filters (Search & Date) */}
      <div className="animate-fade-in-up flex flex-col sm:flex-row gap-3" style={{ animationDelay: "60ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light" />
          <input
            type="text"
            placeholder="Search by name, category, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-card-border bg-card text-sm transition-all duration-200 placeholder:text-muted-light focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
          />
        </div>
        <div className="relative sm:w-48 flex-shrink-0">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full pl-11 pr-8 py-3 rounded-2xl border border-card-border bg-card text-sm transition-all duration-200 text-foreground focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue cursor-pointer"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted hover:bg-card-border hover:text-foreground transition-colors"
              title="Clear date filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-danger-light border border-danger/20 animate-fade-in-up">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Could not load history</p>
            <p className="text-xs text-muted mt-1">{error}</p>
            <button
              onClick={refreshData}
              className="mt-2 text-xs text-accent-blue underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "120ms" }}>
        {!isLoaded ? (
          Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="skeleton h-20 w-full rounded-2xl" />
          ))
        ) : groupedPurchases.length === 0 ? (
          <div className="text-center py-12 px-4 bg-card rounded-2xl border border-card-border border-dashed">
            <Receipt className="w-12 h-12 text-card-border mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">No purchases found</p>
            <p className="text-xs text-muted mt-1">
              {searchQuery || dateFilter
                ? "Try a different search term or clear the date filter"
                : "Your purchase history is empty — add one!"}
            </p>
          </div>
        ) : (
          groupedPurchases.map(([dateString, dayPurchases]) => {
            const isExpanded = expandedDates.includes(dateString);
            const dailyTotal = dayPurchases.reduce((sum, p) => sum + p.cost, 0);

            return (
              <div 
                key={dateString}
                className="rounded-2xl border border-card-border bg-card overflow-hidden transition-all duration-200 hover:border-accent-blue/30 shadow-sm"
              >
                {/* Accordion Header (Tile) */}
                <button
                  onClick={() => toggleDate(dateString)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-card hover:bg-card-border/20 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300",
                      isExpanded ? "bg-accent-blue text-white shadow-md shadow-accent-blue/20" : "bg-accent-blue-light/50 text-accent-blue"
                    )}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-foreground text-sm sm:text-base">
                        {dateString}
                      </h2>
                      <p className="text-xs text-muted font-medium mt-0.5">
                        {dayPurchases.length} transaction{dayPurchases.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-base sm:text-lg text-foreground">
                      {formatCurrency(dailyTotal)}
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-background border border-card-border">
                       {isExpanded ? (
                         <ChevronUp className="w-4 h-4 text-muted" />
                       ) : (
                         <ChevronDown className="w-4 h-4 text-muted" />
                       )}
                    </div>
                  </div>
                </button>

                {/* Accordion Body (Collapsible Items) */}
                {isExpanded && (
                  <div className="border-t border-card-border bg-background/30 divide-y divide-card-border/50">
                    {dayPurchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-5 hover:bg-card-border/20 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <Receipt className="w-4 h-4 text-muted mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                              {purchase.itemName}
                              <span
                                className={cn(
                                  "text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold",
                                  purchase.source === "ai-scan"
                                    ? "bg-accent-purple-light text-accent-purple"
                                    : "bg-card-border text-muted"
                                )}
                              >
                                {purchase.source === "ai-scan" ? "Scanned" : "Manual"}
                              </span>
                            </h3>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted">
                              <span className="flex items-center gap-1">
                                <Tag className="w-3.5 h-3.5" />
                                {purchase.category}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {purchase.time}
                              </span>
                            </div>

                            {purchase.description && (
                              <p className="mt-1.5 text-xs text-muted-light line-clamp-1 italic">
                                "{purchase.description}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 pl-7 sm:pl-0">
                          <span className="font-bold text-accent-green text-sm">
                            {formatCurrency(purchase.cost)}
                          </span>
                          <button
                            onClick={(e) => handleDelete(purchase.id, e)}
                            className="p-1.5 rounded-md text-muted hover:text-danger hover:bg-danger-light transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
                            aria-label="Delete purchase"
                            title="Delete"
                          >
                            <Trash2 className="w-[14px] h-[14px]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
