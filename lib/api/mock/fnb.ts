import { formatSAR } from "@/lib/types";

export interface FnBFilters {
  date?: string;
  outlet?: string;
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
  };
}

function dateScale(date: string) {
  return dateMultipliers[date] ?? dateMultipliers.today;
}

function outletMatches(outletId: string, selectedOutlet: string) {
  return selectedOutlet === "all" || outletId === selectedOutlet;
}

function scaleAmount(value: number, date: string) {
  return Math.round(value * dateScale(date));
}

function scaleCount(value: number, date: string) {
  return Math.max(0, Math.round(value * dateScale(date)));
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
  const { date, outlet } = normalizeFilters(filters);
  return baseOutletSales
    .filter((row) => outletMatches(row.outletId, outlet))
    .map((row) => ({ ...row, sales: scaleAmount(row.sales, date) }));
}

export function getFilteredFnBKPIs(filters?: FnBFilters): FnBKPI[] {
  const { date, outlet } = normalizeFilters(filters);
  const salesRows = filteredOutletRows(filters);
  const topItems = getFilteredTopItems(filters);
  const slowItems = getFilteredSlowItems(filters);
  const totalSales = salesRows.reduce((sum, row) => sum + row.sales, 0);
  const covers = Math.max(1, scaleCount(outlet === "all" ? 284 : 62, date));
  const discounts = Math.round(totalSales * 0.067);
  const voids = Math.round(totalSales * 0.017);
  const label = dateLabels[date] ?? "Selected date";

  return [
    { title: "Today's Sales", value: formatSAR(totalSales), subtitle: label, trend: { value: "+8.2%", positive: true } },
    { title: "Covers", value: covers, subtitle: "Guests served", trend: { value: "+12%", positive: true } },
    { title: "Average Check", value: formatSAR(Math.round(totalSales / covers)), subtitle: "Per cover", trend: { value: "+3.5%", positive: true } },
    { title: "Discounts", value: formatSAR(discounts), subtitle: "6.7% of sales", trend: { value: "+1.2%", positive: false } },
    { title: "Voids", value: formatSAR(voids), subtitle: `${Math.max(1, Math.round(topItems.length * 0.8))} transactions`, trend: { value: `+${slowItems.length}`, positive: false } },
  ];
}

export function getFilteredOutletSales(filters?: FnBFilters) {
  return filteredOutletRows(filters);
}

export function getFilteredMealPeriods(filters?: FnBFilters): MealPeriodRow[] {
  const { date, outlet } = normalizeFilters(filters);
  const scale = dateScale(date) * (outlet === "all" ? 1 : 0.32);
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
  const { date, outlet } = normalizeFilters(filters);
  return baseTopItems
    .filter((item) => outletMatches(item.outletId, outlet))
    .map((item) => ({
      ...item,
      quantity: scaleCount(item.quantity, date),
      revenue: scaleAmount(item.revenue, date),
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function getFilteredSlowItems(filters?: FnBFilters) {
  const { outlet } = normalizeFilters(filters);
  return baseSlowItems.filter((item) => outletMatches(item.outletId, outlet));
}

export function getFilteredOpenChecks(filters?: FnBFilters) {
  const { date, outlet } = normalizeFilters(filters);
  return baseOpenChecks
    .filter((check) => outletMatches(check.outletId, outlet))
    .map((check) => ({ ...check, amount: scaleAmount(check.amount, date) }));
}

export function getFilteredMealEntries(filters?: FnBFilters) {
  const { date, outlet } = normalizeFilters(filters);
  return baseMealEntries
    .filter((entry) => outletMatches(entry.outletId, outlet))
    .map((entry) => ({ ...entry, amount: scaleAmount(entry.amount, date) }));
}
