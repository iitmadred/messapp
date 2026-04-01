export function formatCurrency(amount: number): string {
  return `${amount.toFixed(2)} AED`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-AE", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-AE", {
    month: "short",
    day: "numeric",
  });
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function getCurrentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function inferCategory(itemName: string): string {
  const lower = itemName.toLowerCase();
  if (
    lower.includes("tea") ||
    lower.includes("coffee") ||
    lower.includes("juice") ||
    lower.includes("water") ||
    lower.includes("drink") ||
    lower.includes("soda") ||
    lower.includes("milk")
  )
    return "Beverages";
  if (
    lower.includes("breakfast") ||
    lower.includes("egg") ||
    lower.includes("toast") ||
    lower.includes("paratha") ||
    lower.includes("idli") ||
    lower.includes("dosa")
  )
    return "Breakfast";
  if (
    lower.includes("lunch") ||
    lower.includes("rice") ||
    lower.includes("curry") ||
    lower.includes("dal") ||
    lower.includes("roti") ||
    lower.includes("biryani") ||
    lower.includes("thali")
  )
    return "Lunch";
  if (
    lower.includes("dinner") ||
    lower.includes("naan") ||
    lower.includes("paneer")
  )
    return "Dinner";
  if (
    lower.includes("snack") ||
    lower.includes("chips") ||
    lower.includes("biscuit") ||
    lower.includes("samosa") ||
    lower.includes("vada")
  )
    return "Snacks";
  return "Other";
}
