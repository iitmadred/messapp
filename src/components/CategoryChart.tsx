"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CATEGORY_COLORS, CATEGORY_ICONS, Category } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface CategoryChartProps {
  data: { name: string; value: number }[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="glass rounded-xl px-4 py-3 shadow-lg border border-card-border">
        <p className="text-xs font-bold text-foreground">
          {CATEGORY_ICONS[item.name as Category] || "📦"} {item.name}
        </p>
        <p className="text-sm font-bold mt-0.5">{formatCurrency(item.value)}</p>
      </div>
    );
  }
  return null;
}

export function CategoryChart({ data }: CategoryChartProps) {
  if (!data.length) {
    return (
      <div className="bg-card rounded-2xl border border-card-border p-6 animate-fade-in-up">
        <h3 className="text-sm font-semibold text-muted mb-4">
          By Category
        </h3>
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl mb-2">🍽️</p>
            <p className="text-sm text-muted">No categories yet</p>
          </div>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-card rounded-2xl border border-card-border p-6 animate-fade-in-up">
      <h3 className="text-sm font-semibold text-muted mb-4">By Category</h3>
      <div className="flex items-center gap-4">
        <div className="w-36 h-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name as Category] || "#6B7280"}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          {data.slice(0, 5).map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor:
                    CATEGORY_COLORS[item.name as Category] || "#6B7280",
                }}
              />
              <span className="text-xs text-muted truncate flex-1">
                {item.name}
              </span>
              <span className="text-xs font-semibold text-foreground">
                {total > 0 ? Math.round((item.value / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
