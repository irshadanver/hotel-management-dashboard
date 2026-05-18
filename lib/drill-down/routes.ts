/** Drill-down targets: KPI / exception → page + query (API_REQUIRED: same filters on backend) */

export const DASHBOARD_KPI_ROUTES: Record<string, string> = {
  "Occupancy %": "/rooms?status=occupied",
  ADR: "/revenue?metric=adr",
  RevPAR: "/revenue?metric=revpar",
  "Today's Revenue": "/revenue?range=today",
  "MTD Revenue": "/revenue?range=mtd",
  "Cash Position": "/finance?view=cash",
};

export const ROOMS_KPI_ROUTES: Record<string, string> = {
  "Rooms Available": "/rooms?status=vacant-clean",
  "Rooms Sold": "/rooms?status=occupied",
  "Occupancy %": "/rooms",
  "Arrivals Today": "/rooms?focus=arrivals",
  "Departures Today": "/rooms?focus=departures",
  "No-Shows": "/alerts?severity=critical",
};

export const EXCEPTION_ROUTES: Record<string, string> = {
  "High Discounts": "/alerts?department=Front%20Office",
  "Unsettled Folios": "/finance?view=receivables",
  "No-Shows": "/rooms?focus=arrivals",
  "Negative Stock": "/inventory?focus=negative",
  "Overdue Receivables": "/finance?view=receivables",
  "Room Maintenance": "/rooms?status=maintenance",
};

export function roomDetailHref(roomNumber: string) {
  return `/rooms?room=${encodeURIComponent(roomNumber)}`;
}

export function revenueDayHref(dateLabel: string) {
  return `/revenue?range=day&date=${encodeURIComponent(dateLabel)}`;
}
