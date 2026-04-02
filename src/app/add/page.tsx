"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, Coffee, UtensilsCrossed, Cookie, Sun, Loader2 } from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import { addPurchaseAction } from "@/app/actions";
import { getTodayString, getCurrentTime, inferCategory } from "@/lib/utils";

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
  const [isPending, setIsPending] = useState(false);

  const handleItemNameChange = (value: string) => {
    setItemName(value);
    const inferred = inferCategory(value);
    if (inferred !== "Other") {
      setCategory(inferred);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !cost || isPending) return;

    setIsPending(true);
    try {
      await addPurchaseAction({
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
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  const handleQuickAdd = async (preset: typeof quickAddPresets[0]) => {
    if (isPending) return;
    setIsPending(true);
    try {
      await addPurchaseAction({
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
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
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
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-card-border hover:border-accent-blue hover:bg-accent-blue-light/30 disabled:opacity-50 transition-all duration-200 group"
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
            disabled={isPending}
            className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm transition-all duration-200 placeholder:text-muted-light disabled:opacity-50"
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
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm transition-all duration-200 placeholder:text-muted-light disabled:opacity-50"
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
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm transition-all duration-200 disabled:opacity-50"
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
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm transition-all duration-200 disabled:opacity-50"
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
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm transition-all duration-200 disabled:opacity-50"
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
            disabled={isPending}
            className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm transition-all duration-200 placeholder:text-muted-light resize-none disabled:opacity-50"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-200"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {isPending ? "Adding..." : "Add Purchase"}
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
