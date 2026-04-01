"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  accentColor: "blue" | "green" | "orange" | "purple" | "pink";
  delay?: number;
}

const accents = {
  blue: {
    bg: "bg-accent-blue-light",
    text: "text-accent-blue",
    iconBg: "bg-accent-blue/10",
  },
  green: {
    bg: "bg-accent-green-light",
    text: "text-accent-green",
    iconBg: "bg-accent-green/10",
  },
  orange: {
    bg: "bg-accent-orange-light",
    text: "text-accent-orange",
    iconBg: "bg-accent-orange/10",
  },
  purple: {
    bg: "bg-accent-purple-light",
    text: "text-accent-purple",
    iconBg: "bg-accent-purple/10",
  },
  pink: {
    bg: "bg-accent-pink-light",
    text: "text-accent-pink",
    iconBg: "bg-accent-pink/10",
  },
};

export function StatsCard({
  icon: Icon,
  label,
  value,
  subtitle,
  accentColor,
  delay = 0,
}: StatsCardProps) {
  const accent = accents[accentColor];

  return (
    <div
      className="bg-card rounded-2xl border border-card-border p-5 hover:shadow-lg transition-all duration-300 animate-fade-in-up group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted font-medium">{label}</p>
          <p className="text-2xl font-extrabold mt-1 tracking-tight">{value}</p>
          {subtitle && (
            <p className={cn("text-xs font-medium mt-1", accent.text)}>
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
            accent.iconBg
          )}
        >
          <Icon className={cn("w-5 h-5", accent.text)} />
        </div>
      </div>
    </div>
  );
}
