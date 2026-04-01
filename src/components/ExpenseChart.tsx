"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DailyStats } from "@/lib/types";
import { formatDateShort } from "@/lib/utils";

interface ExpenseChartProps {
  data: DailyStats[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-4 py-3 shadow-lg border border-card-border">
        <p className="text-xs text-muted font-medium">{label ? formatDateShort(label) : ''}</p>
        <p className="text-sm font-bold text-foreground mt-0.5">
          {payload[0].value.toFixed(2)} AED
        </p>
      </div>
    );
  }
  return null;
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  const hasData = data.some((d) => d.total > 0);

  if (!hasData) {
    return (
      <div className="bg-card rounded-2xl border border-card-border p-6 animate-fade-in-up">
        <h3 className="text-sm font-semibold text-muted mb-4">Weekly Expenses</h3>
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-sm text-muted">No expense data yet</p>
            <p className="text-xs text-muted-light mt-1">Add purchases to see your chart</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-card-border p-6 animate-fade-in-up">
      <h3 className="text-sm font-semibold text-muted mb-4">Weekly Expenses</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="25%">
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E7E5E4"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateShort}
              tick={{ fontSize: 11, fill: "#78716C" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#78716C" }}
              axisLine={false}
              tickLine={false}
              width={45}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59,130,246,0.05)" }} />
            <Bar
              dataKey="total"
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
