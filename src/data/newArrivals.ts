import type { BrowseMode } from "../context/BrowseModeContext";

export interface NewArrivalEntry {
  title: string;
  productIds: string[];
  active?: boolean;
}

export const womenNewArrivalsSchedule: NewArrivalEntry[] = [
  { title: "Royal Drops This Week", productIds: ["summer-floral-dress", "leather-tote", "white-sneakers", "dr-001"] },
  { title: "Weekend Casuals", productIds: ["casual-shirt", "casual-set", "casual-trousers", "tp-015"] },
  { title: "Day-To-Night", productIds: ["dr-014", "tp-009", "dr-023", "tp-012"] },
  { title: "Statement Staples", productIds: ["dr-015", "tp-007", "shoes-gen-1", "Accessories-gen-1"] },
  { title: "Fresh Fits", productIds: ["casual-knit", "casual-linen", "dr-021", "tp-020"] },
  { title: "New In Store", productIds: ["dr-003", "tp-004", "white-sneakers", "leather-tote"] },
];

export const menNewArrivalsSchedule: NewArrivalEntry[] = [
  { title: "Sharp New Drops", productIds: ["men-top-001", "men-pant-001", "men-shoe-001", "men-top-gen-1"] },
  { title: "Weekend Ready", productIds: ["men-top-gen-2", "men-pant-gen-1", "men-shoe-gen-1", "men-top-001"] },
  { title: "Office to Street", productIds: ["men-pant-001", "men-top-gen-3", "men-shoe-gen-2", "men-pant-gen-2"] },
  { title: "Fresh Menswear", productIds: ["men-shoe-001", "men-top-gen-4", "men-pant-gen-3", "men-shoe-gen-3"] },
  { title: "Bold Staples", productIds: ["men-top-gen-5", "men-pant-gen-4", "men-shoe-gen-4", "men-top-001"] },
  { title: "New This Week", productIds: ["men-pant-gen-5", "men-shoe-gen-5", "men-top-gen-6", "men-pant-001"] },
];

export function getTodaysNewArrivalEntry(date = new Date(), mode: BrowseMode = "women"): NewArrivalEntry {
  const dayNumber = Math.floor(date.getTime() / 86_400_000);
  const schedule = mode === "men" ? menNewArrivalsSchedule : womenNewArrivalsSchedule;
  return schedule[dayNumber % schedule.length];
}
