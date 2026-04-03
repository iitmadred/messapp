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
    lower.includes("vegetable") ||
    lower.includes("onion") ||
    lower.includes("tomato") ||
    lower.includes("potato") ||
    lower.includes("carrot") ||
    lower.includes("spinach") ||
    lower.includes("garlic") ||
    lower.includes("ginger") ||
    lower.includes("coriander")
  )
    return "Vegetables";
  if (
    lower.includes("chicken") ||
    lower.includes("meat") ||
    lower.includes("fish") ||
    lower.includes("mutton") ||
    lower.includes("beef") ||
    lower.includes("prawn") ||
    lower.includes("sausage")
  )
    return "Meat & Seafood";
  if (
    lower.includes("milk") ||
    lower.includes("egg") ||
    lower.includes("paneer") ||
    lower.includes("cheese") ||
    lower.includes("butter") ||
    lower.includes("ghee") ||
    lower.includes("curd") ||
    lower.includes("yogurt")
  )
    return "Dairy & Eggs";
  if (
    lower.includes("rice") ||
    lower.includes("dal") ||
    lower.includes("lentil") ||
    lower.includes("flour") ||
    lower.includes("atta") ||
    lower.includes("wheat") ||
    lower.includes("bread") ||
    lower.includes("pasta") ||
    lower.includes("oats")
  )
    return "Grains & Pulses";
  if (
    lower.includes("oil") ||
    lower.includes("masala") ||
    lower.includes("chilli") ||
    lower.includes("turmeric") ||
    lower.includes("cumin") ||
    lower.includes("salt") ||
    lower.includes("sugar") ||
    lower.includes("spice")
  )
    return "Spices & Oils";
  return "Other Groceries";
}
