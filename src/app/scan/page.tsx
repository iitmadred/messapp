"use client";

import { useState } from "react";
import { Check, AlertCircle, Edit3, Save } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { ReceiptScanResult, CATEGORIES } from "@/lib/types";
import { getStoredApiKey } from "@/lib/storage";
import {
  fileToBase64,
  getTodayString,
  getCurrentTime,
  cn,
  inferCategory,
} from "@/lib/utils";

export default function ScanReceiptPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<ReceiptScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Editable fields from scan result
  const [editName, setEditName] = useState("");
  const [editCost, setEditCost] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editCategory, setEditCategory] = useState("Other Groceries");
  const [editDescription, setEditDescription] = useState("");

  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setScanResult(null);
    const base64 = await fileToBase64(selectedFile);
    setPreview(base64);

    // Auto-scan
    await scanReceipt(base64);
  };

  const scanReceipt = async (imageBase64: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const apiKey = getStoredApiKey();
      const response = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey && { "X-Mistral-Key": apiKey }),
        },
        body: JSON.stringify({ image: imageBase64 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to scan receipt");
      }

      const result: ReceiptScanResult = data;
      setScanResult(result);

      // Populate editable fields
      setEditName(result.common_description || "");
      setEditCost(result.total_amount?.toString() || "");
      setEditDate(result.purchase_date || getTodayString());
      setEditTime(result.purchase_time || getCurrentTime());
      setEditCategory(inferCategory(result.common_description || ""));
      setEditDescription(
        result.list_of_items.length > 0
          ? result.list_of_items.map((i) => `${i.name}: ${i.price} AED`).join(", ")
          : ""
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to scan receipt. Please fill in the details manually."
      );
      // Pre-fill with defaults for manual entry
      setEditName("");
      setEditCost("");
      setEditDate(getTodayString());
      setEditTime(getCurrentTime());
      setEditCategory("Other Groceries");
      setEditDescription("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setFile(null);
    setScanResult(null);
    setError(null);
    setEditName("");
    setEditCost("");
    setEditDate("");
    setEditTime("");
    setEditCategory("Other Groceries");
    setEditDescription("");
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editName.trim() || !editCost || isSaving) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName: editName.trim(),
          cost: parseFloat(editCost),
          date: editDate || getTodayString(),
          time: editTime || getCurrentTime(),
          category: editCategory,
          description: editDescription,
          source: "ai-scan",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error ${res.status}`);
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        handleClear();
      }, 1500);
    } catch (error: any) {
      console.error("Save scan error:", error);
      setSaveError(error.message || "Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasResults = scanResult || error;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Scan Receipt
        </h1>
        <p className="text-muted text-sm mt-1">
          Upload a photo and let AI extract the details
        </p>
      </div>

      {/* Upload Zone */}
      <div className="animate-fade-in-up" style={{ animationDelay: "60ms" }}>
        <DropZone
          onFileSelected={handleFileSelected}
          preview={preview}
          onClear={handleClear}
          isProcessing={isProcessing}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-accent-orange-light border border-accent-orange/20 animate-scale-in">
          <AlertCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Could not fully read the receipt
            </p>
            <p className="text-xs text-muted mt-1">{error}</p>
            <p className="text-xs text-muted mt-1">
              Please fill in the details manually below.
            </p>
          </div>
        </div>
      )}

      {/* Scan results / Editable form */}
      {hasResults && !isProcessing && (
        <div className="bg-card rounded-2xl border border-card-border p-6 space-y-5 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-accent-blue" />
              <h2 className="text-sm font-semibold">
                {scanResult ? "Review & Edit" : "Enter Details"}
              </h2>
            </div>
            {scanResult && (
              <span
                className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full",
                  scanResult.confidence === "high"
                    ? "bg-accent-green-light text-accent-green"
                    : scanResult.confidence === "medium"
                      ? "bg-accent-orange-light text-accent-orange"
                      : "bg-danger-light text-danger"
                )}
              >
                {scanResult.confidence} confidence
              </span>
            )}
          </div>

          {/* Items breakdown */}
          {scanResult && scanResult.list_of_items.length > 0 && (
            <div className="p-3 rounded-xl bg-background space-y-1.5">
              <p className="text-xs font-semibold text-muted mb-2">
                Items detected:
              </p>
              {scanResult.list_of_items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-foreground">{item.name}</span>
                  <span className="text-muted font-medium">
                    {item.price.toFixed(2)} AED
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Editable fields */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Description
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="e.g., Cafeteria lunch"
              className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm placeholder:text-muted-light"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Total (AED)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editCost}
                onChange={(e) => setEditCost(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm placeholder:text-muted-light"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Date
              </label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Category
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm"
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
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Notes
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm placeholder:text-muted-light resize-none"
            />
          </div>

          {saveError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-danger-light border border-danger/20 text-xs text-danger">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {saveError}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={!editName.trim() || !editCost || isSaving}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-all duration-200",
              editName.trim() && editCost
                ? "bg-gradient-to-r from-accent-green to-accent-blue text-white hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                : "bg-card-border text-muted cursor-not-allowed"
            )}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Confirm & Save"}
          </button>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-success-pop">
          <div className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-accent-green text-white shadow-lg">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold">Receipt saved!</span>
          </div>
        </div>
      )}
    </div>
  );
}
