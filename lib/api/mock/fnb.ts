import { formatSAR } from "@/lib/types";
import type { DateRangePreset } from "@/lib/date/date-range-preset";
import {
  buildDateRangeQuery,
  type DateRangeQuery,
} from "@/lib/date/date-range-query";

export interface FnBFilters {
  date?: string;
  outlet?: string;
  /** When `date` is `"header"`, mirrors the executive header date range. */
  headerRange?: DateRangeQuery | null;
}

export interface FnBKPI {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export interface OutletSalesRow {
  outlet: string;
  outletId: string;
  sales: number;
  color: string;
}

export interface MealPeriodRow {
  period: string;
  breakfast: number;
  lunch: number;
  dinner: number;
}

export interface FnBItemRow {
  name: string;
  category: string;
  outletId: string;
  quantity: number;
  revenue: number;
}

export interface SlowItemRow {
  name: string;
  category: string;
  outletId: string;
  quantity: number;
  lastSold: string;
  status: "critical" | "warning";
}

export interface OpenCheckRow {
  checkNumber: string;
  table: string;
  server: string;
  outletId: string;
  amount: number;
  openTime: string;
  duration: number;
}

export interface MealEntryRow {
  type: "complimentary" | "staff";
  description: string;
  outlet: string;
  outletId: string;
  amount: number;
  authorizedBy?: string;
  reason?: string;
}

const dateMultipliers: Record<string, number> = {
  today: 1,
  yesterday: 0.86,
  last7: 6.4,
  last30: 24,
  mtd: 14.2,
};

const dateLabels: Record<string, string> = {
  today: "Today",
  yesterday: "Yesterday",
  last7: "Last 7 days",
  last30: "Last 30 days",
  mtd: "Month to date",
};

function normalizeFilters(filters?: FnBFilters) {
  return {
    date: filters?.date ?? "today",
    outlet: filters?.outlet ?? "all",
    headerRange: filters?.headerRange ?? null,
  };
}

type NormalizedFnBFilters = ReturnType<typeof normalizeFilters>;

/** Map header day span to the same scale curve as discrete F&B date presets. */
function headerSpanScale(q: DateRangeQuery): number {
  const span = Math.max(1, Math.min(90, q.daySpan));
  if (span <= 1) {
    return q.preset === "yesterday" ? dateMultipliers.yesterday : dateMultipliers.today;
  }
  if (span <= 7) {
    return (
      dateMultipliers.today +
      ((dateMultipliers.last7 - dateMultipliers.today) * (span - 1)) / 6
    );
  }
  if (span <= 30) {
    return (
      dateMultipliers.last7 +
      ((dateMultipliers.last30 - dateMultipliers.last7) * (span - 7)) / 23
    );
  }
  return Math.min(
    45,
    dateMultipliers.last30 +
      ((41 - dateMultipliers.last30) * (span - 30)) / 60
  );
}

function dateScaleFromFilters(n: NormalizedFnBFilters): number {
  if (n.date === "header" && n.headerRange) {
    return headerSpanScale(n.headerRange);
  }
  return dateMultipliers[n.date] ?? dateMultipliers.today;
}

function outletMatches(outletId: string, selectedOutlet: string) {
  return selectedOutlet === "all" || outletId === selectedOutlet;
}

function scaleAmount(value: number, n: NormalizedFnBFilters) {
  return Math.round(value * dateScaleFromFilters(n));
}

function scaleCount(value: number, n: NormalizedFnBFilters) {
  return Math.max(0, Math.round(value * dateScaleFromFilters(n)));
}

const baseOutletSales: OutletSalesRow[] = [
  { outlet: "Main Restaurant", outletId: "restaurant", sales: 8450, color: "oklch(0.55 0.12 250)" },
  { outlet: "Lobby Cafe", outletId: "cafe", sales: 4200, color: "oklch(0.60 0.12 165)" },
  { outlet: "Room Service", outletId: "room-service", sales: 3100, color: "oklch(0.55 0.10 280)" },
  { outlet: "Pool Bar", outletId: "bar", sales: 1800, color: "oklch(0.65 0.15 55)" },
  { outlet: "Banquet", outletId: "banquet", sales: 900, color: "oklch(0.55 0.12 200)" },
];

const baseTopItems: FnBItemRow[] = [
  { name: "Arabic Breakfast Platter", category: "Breakfast", outletId: "restaurant", quantity: 42, revenue: 2520 },
  { name: "Grilled Lamb Chops", category: "Main Course", outletId: "restaurant", quantity: 28, revenue: 2240 },
  { name: "Fresh Orange Juice", category: "Beverages", outletId: "cafe", quantity: 86, revenue: 1290 },
  { name: "Club Sandwich", category: "All Day Dining", outletId: "room-service", quantity: 35, revenue: 1225 },
  { name: "Chicken Shawarma", category: "Main Course", outletId: "restaurant", quantity: 38, revenue: 1140 },
  { name: "Arabic Coffee", category: "Beverages", outletId: "cafe", quantity: 124, revenue: 992 },
  { name: "Caesar Salad", category: "Starters", outletId: "restaurant", quantity: 31, revenue: 930 },
  { name: "Hummus & Bread", category: "Starters", outletId: "room-service", quantity: 52, revenue: 780 },
  { name: "Kunafa", category: "Desserts", outletId: "banquet", quantity: 28, revenue: 700 },
  { name: "Mango Smoothie", category: "Beverages", outletId: "bar", quantity: 45, revenue: 675 },
];

const baseSlowItems: SlowItemRow[] = [
  { name: "Lobster Thermidor", category: "Main Course", outletId: "restaurant", quantity: 1, lastSold: "3 days ago", status: "critical" },
  { name: "Beef Wellington", category: "Main Course", outletId: "restaurant", quantity: 2, lastSold: "2 days ago", status: "critical" },
  { name: "Oyster Platter", category: "Starters", outletId: "banquet", quantity: 0, lastSold: "5 days ago", status: "critical" },
  { name: "Duck Confit", category: "Main Course", outletId: "room-service", quantity: 3, lastSold: "Yesterday", status: "warning" },
  { name: "Truffle Risotto", category: "Main Course", outletId: "restaurant", quantity: 2, lastSold: "2 days ago", status: "warning" },
  { name: "Tiramisu", category: "Desserts", outletId: "cafe", quantity: 4, lastSold: "Yesterday", status: "warning" },
];

const baseOpenChecks: OpenCheckRow[] = [
  { checkNumber: "CHK-4521", table: "Table 12", server: "Ahmed K.", outletId: "restaurant", amount: 485, openTime: "12:30 PM", duration: 95 },
  { checkNumber: "CHK-4518", table: "Pool Bar 3", server: "Sara M.", outletId: "bar", amount: 220, openTime: "1:15 PM", duration: 50 },
  { checkNumber: "CHK-4523", table: "Table 8", server: "Mohammed R.", outletId: "restaurant", amount: 165, openTime: "1:45 PM", duration: 20 },
  { checkNumber: "CHK-4520", table: "Room 412", server: "Fatima A.", outletId: "room-service", amount: 340, openTime: "12:45 PM", duration: 80 },
  { checkNumber: "CHK-4525", table: "Table 5", server: "Ahmed K.", outletId: "cafe", amount: 95, openTime: "2:00 PM", duration: 5 },
];

const baseMealEntries: MealEntryRow[] = [
  { type: "complimentary", description: "VIP Guest - Suite 801", outlet: "Main Restaurant", outletId: "restaurant", amount: 450, authorizedBy: "GM", reason: "Guest complaint resolution" },
  { type: "complimentary", description: "Wedding Anniversary", outlet: "Main Restaurant", outletId: "restaurant", amount: 180, authorizedBy: "F&B Manager", reason: "Dessert & champagne" },
  { type: "staff", description: "Kitchen Staff (12)", outlet: "Staff Cafeteria", outletId: "restaurant", amount: 360, reason: "Lunch" },
  { type: "staff", description: "Front Office (8)", outlet: "Staff Cafeteria", outletId: "cafe", amount: 240, reason: "Lunch" },
  { type: "complimentary", description: "Media Influencer", outlet: "Lobby Cafe", outletId: "cafe", amount: 85, authorizedBy: "Marketing", reason: "PR hosting" },
  { type: "staff", description: "Housekeeping (15)", outlet: "Staff Cafeteria", outletId: "room-service", amount: 450, reason: "Lunch" },
];

function filteredOutletRows(filters?: FnBFilters) {
  const n = normalizeFilters(filters);
  return baseOutletSales
    .filter((row) => outletMatches(row.outletId, n.outlet))
    .map((row) => ({ ...row, sales: scaleAmount(row.sales, n) }));
}

export function getFilteredFnBKPIs(filters?: FnBFilters): FnBKPI[] {
  const n = normalizeFilters(filters);
  const salesRows = filteredOutletRows(filters);
  const topItems = getFilteredTopItems(filters);
  const slowItems = getFilteredSlowItems(filters);
  const totalSales = salesRows.reduce((sum, row) => sum + row.sales, 0);
  const covers = Math.max(1, scaleCount(n.outlet === "all" ? 284 : 62, n));
  const discounts = Math.round(totalSales * 0.067);
  const voids = Math.round(totalSales * 0.017);
  const label =
    n.date === "header" && n.headerRange
      ? `${n.headerRange.startDate} – ${n.headerRange.endDate}`
      : (dateLabels[n.date] ?? "Selected date");

  return [
    { title: "Today's Sales", value: formatSAR(totalSales), subtitle: label, trend: { value: "+8.2%", positive: true } },
    { title: "Covers", value: covers, subtitle: "Guests served", trend: { value: "+12%", positive: true } },
    { title: "Average Check", value: formatSAR(Math.round(totalSales / covers)), subtitle: "Per cover", trend: { value: "+3.5%", positive: true } },
    { title: "Discounts", value: formatSAR(discounts), subtitle: "6.7% of sales", trend: { value: "+1.2%", positive: false } },
    { title: "Voids", value: formatSAR(voids), subtitle: `${Math.max(1, Math.round(topItems.length * 0.8))} transactions`, trend: { value: `+${slowItems.length}`, positive: false } },
  ];
}

const VALID_FN_PRESETS: DateRangePreset[] = [
  "today",
  "yesterday",
  "last7Days",
  "last30Days",
  "custom",
];

function coerceFnBDrillPreset(p?: string | null): DateRangePreset {
  if (p && VALID_FN_PRESETS.includes(p as DateRangePreset)) return p as DateRangePreset;
  return "today";
}

/** Rebuild F&B filters from drill URL (`fnbDate=header` + preset/start/end). */
export function fnbFiltersFromDrillUrl(
  fnbDate?: string | null,
  fnbOutlet?: string | null,
  preset?: string | null,
  startDate?: string | null,
  endDate?: string | null
): FnBFilters {
  const outlet = fnbOutlet ?? "all";
  const date = fnbDate ?? "today";
  if (date === "header") {
    const headerRange = buildDateRangeQuery(
      coerceFnBDrillPreset(preset),
      startDate ?? "",
      endDate ?? ""
    );
    return { date: "header", outlet, headerRange };
  }
  return { date, outlet };
}

/** Numeric discounts total for KPI "Discounts" (same formula as the card). */
export function getFnBDiscountsNumber(filters?: FnBFilters): number {
  const totalSales = filteredOutletRows(filters).reduce(
    (sum, row) => sum + row.sales,
    0
  );
  return Math.round(totalSales * 0.067);
}

/** Numeric voids total for KPI "Voids" (same formula as the card). */
export function getFnBVoidsNumber(filters?: FnBFilters): number {
  const totalSales = filteredOutletRows(filters).reduce(
    (sum, row) => sum + row.sales,
    0
  );
  return Math.round(totalSales * 0.017);
}

export function getFilteredOutletSales(filters?: FnBFilters) {
  return filteredOutletRows(filters);
}

export function getFilteredMealPeriods(filters?: FnBFilters): MealPeriodRow[] {
  const n = normalizeFilters(filters);
  const scale = dateScaleFromFilters(n) * (n.outlet === "all" ? 1 : 0.32);
  const rows = [
    { period: "6 AM", breakfast: 450, lunch: 0, dinner: 0 },
    { period: "7 AM", breakfast: 1200, lunch: 0, dinner: 0 },
    { period: "8 AM", breakfast: 2100, lunch: 0, dinner: 0 },
    { period: "9 AM", breakfast: 1800, lunch: 0, dinner: 0 },
    { period: "10 AM", breakfast: 650, lunch: 0, dinner: 0 },
    { period: "11 AM", breakfast: 0, lunch: 320, dinner: 0 },
    { period: "12 PM", breakfast: 0, lunch: 2400, dinner: 0 },
    { period: "1 PM", breakfast: 0, lunch: 3200, dinner: 0 },
    { period: "2 PM", breakfast: 0, lunch: 1800, dinner: 0 },
    { period: "3 PM", breakfast: 0, lunch: 450, dinner: 0 },
    { period: "6 PM", breakfast: 0, lunch: 0, dinner: 1200 },
    { period: "7 PM", breakfast: 0, lunch: 0, dinner: 2800 },
    { period: "8 PM", breakfast: 0, lunch: 0, dinner: 3500 },
    { period: "9 PM", breakfast: 0, lunch: 0, dinner: 2200 },
    { period: "10 PM", breakfast: 0, lunch: 0, dinner: 850 },
  ];

  return rows.map((row) => ({
    period: row.period,
    breakfast: Math.round(row.breakfast * scale),
    lunch: Math.round(row.lunch * scale),
    dinner: Math.round(row.dinner * scale),
  }));
}

export function getFilteredTopItems(filters?: FnBFilters) {
  const n = normalizeFilters(filters);
  return baseTopItems
    .filter((item) => outletMatches(item.outletId, n.outlet))
    .map((item) => ({
      ...item,
      quantity: scaleCount(item.quantity, n),
      revenue: scaleAmount(item.revenue, n),
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function getFilteredSlowItems(filters?: FnBFilters) {
  const { outlet } = normalizeFilters(filters);
  return baseSlowItems.filter((item) => outletMatches(item.outletId, outlet));
}

export function getFilteredOpenChecks(filters?: FnBFilters) {
  const n = normalizeFilters(filters);
  return baseOpenChecks
    .filter((check) => outletMatches(check.outletId, n.outlet))
    .map((check) => ({ ...check, amount: scaleAmount(check.amount, n) }));
}

export function getFilteredMealEntries(filters?: FnBFilters) {
  const n = normalizeFilters(filters);
  return baseMealEntries
    .filter((entry) => outletMatches(entry.outletId, n.outlet))
    .map((entry) => ({ ...entry, amount: scaleAmount(entry.amount, n) }));
}
