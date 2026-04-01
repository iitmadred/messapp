"use client";

import { useState, useEffect } from "react";
import {
  Key,
  Download,
  Trash2,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  getStoredApiKey,
  setStoredApiKey,
  exportPurchases,
  clearAllPurchases,
  getPurchases,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [purchaseCount, setPurchaseCount] = useState(0);

  useEffect(() => {
    setApiKey(getStoredApiKey());
    setPurchaseCount(getPurchases().length);
  }, []);

  const handleSaveKey = () => {
    setStoredApiKey(apiKey);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleExport = () => {
    const data = exportPurchases();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mesapp-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    clearAllPurchases();
    setPurchaseCount(0);
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Settings
        </h1>
        <p className="text-muted text-sm mt-1">
          Configure your app preferences
        </p>
      </div>

      {/* API Key */}
      <div
        className="bg-card rounded-2xl border border-card-border p-6 animate-fade-in-up"
        style={{ animationDelay: "60ms" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent-purple-light flex items-center justify-center">
            <Key className="w-5 h-5 text-accent-purple" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Mistral API Key</h2>
            <p className="text-xs text-muted-light">
              Required for AI receipt scanning
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Mistral API key..."
              className="w-full px-4 py-3 pr-12 rounded-xl border border-card-border bg-background text-sm font-mono placeholder:text-muted-light"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-card-border/50 text-muted transition-colors"
            >
              {showKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveKey}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-purple text-white text-sm font-semibold hover:bg-accent-purple/90 transition-colors"
            >
              {keySaved ? <Check className="w-4 h-4" /> : <Key className="w-4 h-4" />}
              {keySaved ? "Saved!" : "Save Key"}
            </button>
            <p className="text-xs text-muted-light">
              Get a free key from{" "}
              <a
                href="https://console.mistral.ai/"
                target="_blank"
                rel="noopener"
                className="text-accent-blue hover:underline"
              >
                console.mistral.ai
              </a>
            </p>
          </div>

          <p className="text-xs text-muted-light p-3 rounded-xl bg-background">
            💡 You can also set the <code className="text-accent-blue">MISTRAL_API_KEY</code> environment variable in <code className="text-accent-blue">.env.local</code> for server-side usage. The key saved here will override it.
          </p>
        </div>
      </div>

      {/* Export */}
      <div
        className="bg-card rounded-2xl border border-card-border p-6 animate-fade-in-up"
        style={{ animationDelay: "120ms" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-blue-light flex items-center justify-center">
              <Download className="w-5 h-5 text-accent-blue" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Export Data</h2>
              <p className="text-xs text-muted-light">
                {purchaseCount} purchase{purchaseCount !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={purchaseCount === 0}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors",
              purchaseCount > 0
                ? "bg-accent-blue text-white hover:bg-accent-blue/90"
                : "bg-card-border text-muted cursor-not-allowed"
            )}
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Clear */}
      <div
        className="bg-card rounded-2xl border border-card-border p-6 animate-fade-in-up"
        style={{ animationDelay: "180ms" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger-light flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-danger" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Clear All Data</h2>
              <p className="text-xs text-muted-light">
                Permanently delete all purchases
              </p>
            </div>
          </div>
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={purchaseCount === 0}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                purchaseCount > 0
                  ? "bg-danger text-white hover:bg-danger/90"
                  : "bg-card-border text-muted cursor-not-allowed"
              )}
            >
              <Trash2 className="w-4 h-4" />
              Clear Data
            </button>
          ) : (
            <div className="flex items-center gap-2 animate-scale-in">
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-danger/90"
              >
                <AlertTriangle className="w-4 h-4" />
                Confirm
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2.5 rounded-xl bg-card-border text-sm font-semibold hover:bg-card-border/80"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
