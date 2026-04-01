"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, Coffee, UtensilsCrossed, Cookie, Sun } from "lucide-react";
import { CATEGORIES, Category } from "@/lib/types";
import { addPurchase } from "@/lib/storage";
import { getTodayString, getCurrentTime, cn, inferCategory } from "@/lib/utils";

const quickAddPresets = [
  { name: "Tea", cost: 2, icon: Coffee, category: "Beverages" },
  { name: "Coffee", cost: 5, icon: Coffee, category: "Beverages" },
  { name: "Lunch", cost: 15, icon: UtensilsCrossed, category: "Lunch" },
  { name: "Snack", cost: 5, icon: Cookie, category: "Snacks" },
  { name: "Breakfast", cost: 10, icon: Sun, category: "Breakfast" },
];

export default function AddPurchasePage() {
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [time, setTime] = useState(getCurrentTime());
  const [category, setCategory] = useState<string>("Other");
  const [description, setDescription] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleItemNameChange = (value: string) => {
    setItemName(value);
    const inferred = inferCategory(value);
    if (inferred !== "Other") {
      setCategory(inferred);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !cost) return;

    addPurchase({
      itemName: itemName.trim(),
      cost: parseFloat(cost),
      date,
      time,
      category,
      description: description.trim(),
      source: "manual",
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setItemName("");
      setCost("");
      setDate(getTodayString());
      setTime(getCurrentTime());
      setCategory("Other");
      setDescription("");
    }, 1500);
  };

  const handleQuickAdd = (preset: typeof quickAddPresets[0]) => {
    addPurchase({
      itemName: preset.name,
      cost: preset.cost,
      date: getTodayString(),
      time: getCurrentTime(),
      category: preset.category,
      description: "",
      source: "manual",
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Add Purchase
        </h1>
        <p className="text-muted text-sm mt-1">
          Quickly log a new mess purchase
        </p>
      </div>

      {/* Quick Add */}
      <div className="animate-fade-in-up" style={{ animationDelay: "60ms" }}>
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
          Quick Add
        </p>
        <div className="flex flex-wrap gap-2">
          {quickAddPresets.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.name}
                onClick={() => handleQuickAdd(preset)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-card-border hover:border-accent-blue hover:bg-accent-blue-light/30 transition-all duration-200 group"
              >
                <Icon className="w-4 h-4 text-muted group-hover:text-accent-blue transition-colors" />
                <span className="text-sm font-medium">{preset.name}</span>
                <span className="text-xs text-muted-light">{preset.cost} AED</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-2xl border border-card-border p-6 space-y-5 animate-fade-in-up"
        style={{ animationDelay: "120ms" }}
      >
        {/* Item name */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Item Name
          </label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => handleItemNameChange(e.target.value)}
            placeholder="e.g., Chicken Biryani"
            className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm transition-all duration-200 placeholder:text-muted-light"
            required
          />
        </div>

        {/* Cost + Date row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Cost (AED)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm transition-all duration-200 placeholder:text-muted-light"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Category + Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm transition-all duration-200"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Notes{" "}
            <span className="text-muted-light font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Any additional notes..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm transition-all duration-200 placeholder:text-muted-light resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Purchase
        </button>
      </form>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-success-pop">
          <div className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-accent-green text-white shadow-lg">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold">Purchase added!</span>
          </div>
        </div>
      )}
    </div>
  );
}
