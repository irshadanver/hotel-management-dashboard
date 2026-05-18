/** Drill-down targets: KPI / exception -> relevant dataset view */

export function drillDownHref(
  domain: string,
  view: string,
  params?: Record<string, string>
) {
  const searchParams = new URLSearchParams({ domain, view, ...params });
  return `/drilldown?${searchParams.toString()}`;
}

export const DASHBOARD_KPI_ROUTES: Record<string, string> = {
  "Occupancy %": drillDownHref("rooms", "occupancy"),
  ADR: drillDownHref("revenue", "adr"),
  RevPAR: drillDownHref("revenue", "revpar"),
  "Today's Revenue": drillDownHref("revenue", "today"),
  "MTD Revenue": drillDownHref("revenue", "mtd"),
  "Cash Position": drillDownHref("finance", "cash-position"),
};

export const ROOMS_KPI_ROUTES: Record<string, string> = {
  "Rooms Available": drillDownHref("rooms", "available"),
  "Rooms Sold": drillDownHref("rooms", "sold"),
  "Occupancy %": drillDownHref("rooms", "occupancy"),
  "Arrivals Today": drillDownHref("rooms", "arrivals"),
  "Departures Today": drillDownHref("rooms", "departures"),
  "No-Shows": drillDownHref("rooms", "no-shows"),
};

export const REVENUE_KPI_ROUTES: Record<string, string> = {
  "Occupancy Forecast": drillDownHref("revenue", "occupancy-forecast"),
  "ADR Forecast": drillDownHref("revenue", "adr-forecast"),
  "Room Revenue Forecast": drillDownHref("revenue", "room-revenue-forecast"),
  "Pickup (Last 7 Days)": drillDownHref("revenue", "pickup-7-days"),
  "Pickup (Today)": drillDownHref("revenue", "pickup-today"),
};

export const FNB_KPI_ROUTES: Record<string, string> = {
  "Today's Sales": drillDownHref("fnb", "today-sales"),
  Covers: drillDownHref("fnb", "covers"),
  "Average Check": drillDownHref("fnb", "average-check"),
  Discounts: drillDownHref("fnb", "discounts"),
  Voids: drillDownHref("fnb", "voids"),
};

export const INVENTORY_KPI_ROUTES: Record<string, string> = {
  "Total Stock Value": drillDownHref("inventory", "stock-value"),
  "Below Reorder Level": drillDownHref("inventory", "below-reorder"),
  "Pending POs": drillDownHref("inventory", "pending-pos"),
  "Price Variance Alerts": drillDownHref("inventory", "price-variance"),
};

export const FINANCE_KPI_ROUTES: Record<string, string> = {
  "Total Revenue Today": drillDownHref("finance", "total-revenue-today"),
  "Cash Balance": drillDownHref("finance", "cash-balance"),
  "Accounts Receivable": drillDownHref("finance", "accounts-receivable"),
  "Accounts Payable": drillDownHref("finance", "accounts-payable"),
};

export const EXCEPTION_ROUTES: Record<string, string> = {
  "High Discounts": drillDownHref("revenue", "high-discounts"),
  "Unsettled Folios": drillDownHref("finance", "unsettled-folios"),
  "No-Shows": drillDownHref("rooms", "no-shows"),
  "Negative Stock": drillDownHref("inventory", "negative-stock"),
  "Overdue Receivables": drillDownHref("finance", "overdue-receivables"),
  "Room Maintenance": drillDownHref("rooms", "maintenance"),
};

export const ALERT_ROUTES: Record<string, string> = {
  "High Discount": drillDownHref("revenue", "high-discounts"),
  "Pending Balance": drillDownHref("finance", "unsettled-folios"),
  "Negative Stock": drillDownHref("inventory", "negative-stock"),
  "PO Pending Approval": drillDownHref("inventory", "pending-pos"),
  "Overdue Receivable": drillDownHref("finance", "overdue-receivables"),
  "Room Maintenance": drillDownHref("rooms", "maintenance"),
  "Open Check": drillDownHref("fnb", "open-checks"),
  "Price Variance": drillDownHref("inventory", "price-variance"),
  "VIP Arrival": drillDownHref("rooms", "arrivals"),
  "Daily Report": drillDownHref("finance", "cash-position"),
  "Inventory Count": drillDownHref("inventory", "stock-value"),
};

export function roomDetailHref(roomNumber: string) {
  return `/rooms?room=${encodeURIComponent(roomNumber)}`;
}

export function revenueDayHref(dateLabel: string) {
  return drillDownHref("revenue", "day", { date: dateLabel });
}

export function occupancyForecastHref(dateLabel?: string) {
  return drillDownHref(
    "rooms",
    "occupancy-forecast",
    dateLabel ? { date: dateLabel } : undefined
  );
}
