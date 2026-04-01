"use client";

import { Purchase } from "@/lib/types";
import { CATEGORY_ICONS, Category } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Trash2, ScanLine, PenLine } from "lucide-react";

interface RecentPurchasesProps {
  purchases: Purchase[];
  onDelete: (id: string) => void;
}

export function RecentPurchases({ purchases, onDelete }: RecentPurchasesProps) {
  if (!purchases.length) {
    return (
      <div className="bg-card rounded-2xl border border-card-border p-6 animate-fade-in-up">
        <h3 className="text-sm font-semibold text-muted mb-4">
          Recent Purchases
        </h3>
        <div className="py-8 text-center">
          <p className="text-4xl mb-3">🛒</p>
          <p className="text-sm font-medium text-foreground">No purchases yet</p>
          <p className="text-xs text-muted-light mt-1">
            Add your first purchase to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-card-border p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted">Recent Purchases</h3>
        <span className="text-xs text-muted-light">{purchases.length} items</span>
      </div>
      <div className="space-y-2">
        {purchases.map((purchase, index) => (
          <div
            key={purchase.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-background transition-colors duration-200 group animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-lg flex-shrink-0">
              {CATEGORY_ICONS[purchase.category as Category] || "📦"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{purchase.itemName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-light">
                  {formatDate(purchase.date)}
                </span>
                {purchase.source === "ai-scan" ? (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-accent-purple bg-accent-purple-light px-1.5 py-0.5 rounded-full">
                    <ScanLine className="w-2.5 h-2.5" />
                    AI
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-accent-blue bg-accent-blue-light px-1.5 py-0.5 rounded-full">
                    <PenLine className="w-2.5 h-2.5" />
                    Manual
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm font-bold text-foreground flex-shrink-0">
              {formatCurrency(purchase.cost)}
            </p>
            <button
              onClick={() => onDelete(purchase.id)}
              className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-danger-light hover:text-danger transition-all duration-200 flex-shrink-0"
              title="Delete purchase"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
