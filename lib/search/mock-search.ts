import {
  mockDashboardArrivals,
  mockDashboardDepartures,
  mockDashboardExceptions,
} from "@/lib/api/mock/dashboard";
import {
  mockRoomArrivals,
  mockRoomDepartures,
  mockRooms,
  mockVIPGuests,
} from "@/lib/api/mock/rooms";
import {
  drillDownHref,
  roomDetailHref,
} from "@/lib/drill-down/routes";

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  module: "Rooms" | "Guests" | "Revenue" | "F&B" | "Inventory" | "Finance" | "Alerts";
  href: string;
}

const staticResults: SearchResult[] = [
  {
    id: "revenue-today",
    title: "Today's Revenue",
    subtitle: "Revenue drill-down for posted revenue",
    module: "Revenue",
    href: drillDownHref("revenue", "today"),
  },
  {
    id: "revenue-adr",
    title: "ADR Forecast",
    subtitle: "Average daily rate forecast",
    module: "Revenue",
    href: drillDownHref("revenue", "adr-forecast"),
  },
  {
    id: "fnb-sales",
    title: "F&B Today's Sales",
    subtitle: "Outlet sales drill-down",
    module: "F&B",
    href: drillDownHref("fnb", "today-sales"),
  },
  {
    id: "inventory-negative",
    title: "Negative Stock",
    subtitle: "Inventory exception records",
    module: "Inventory",
    href: drillDownHref("inventory", "negative-stock"),
  },
  {
    id: "inventory-reorder",
    title: "Below Reorder Level",
    subtitle: "Items that need ordering",
    module: "Inventory",
    href: drillDownHref("inventory", "below-reorder"),
  },
  {
    id: "finance-cash",
    title: "Cash Balance",
    subtitle: "Finance cash and bank balances",
    module: "Finance",
    href: drillDownHref("finance", "cash-balance"),
  },
  {
    id: "finance-ar",
    title: "Accounts Receivable",
    subtitle: "Open invoices and receivables",
    module: "Finance",
    href: drillDownHref("finance", "accounts-receivable"),
  },
];

const roomResults: SearchResult[] = mockRooms.map((room) => ({
  id: `room-${room.number}`,
  title: `Room ${room.number}`,
  subtitle: `${room.type} · ${room.status}${room.guest ? ` · ${room.guest}` : ""}`,
  module: "Rooms",
  href: roomDetailHref(room.number),
}));

const arrivalResults: SearchResult[] = [
  ...mockDashboardArrivals.map((arrival) => ({
    id: `dashboard-arrival-${arrival.id}`,
    title: arrival.guestName,
    subtitle: `Executive arrival · ${arrival.room ?? "No room"} · ${arrival.roomType} · ${arrival.eta}`,
    module: "Guests" as const,
    href: arrival.room ? roomDetailHref(arrival.room) : drillDownHref("dashboard", "arrivals"),
  })),
  ...mockRoomArrivals.map((arrival) => ({
    id: `room-arrival-${arrival.id}`,
    title: arrival.guestName,
    subtitle: `Arrival · Room ${arrival.roomNumber} · ${arrival.roomType} · ${arrival.status}`,
    module: "Guests" as const,
    href: roomDetailHref(arrival.roomNumber),
  })),
];

const departureResults: SearchResult[] = [
  ...mockDashboardDepartures.map((departure) => ({
    id: `dashboard-departure-${departure.id}`,
    title: departure.guestName,
    subtitle: `Executive departure · Room ${departure.room} · Balance SAR ${departure.balance.toLocaleString()}`,
    module: "Guests" as const,
    href: roomDetailHref(departure.room),
  })),
  ...mockRoomDepartures.map((departure) => ({
    id: `room-departure-${departure.id}`,
    title: departure.guestName,
    subtitle: `Departure · Room ${departure.roomNumber} · ${departure.roomType} · SAR ${departure.balance.toLocaleString()}`,
    module: "Guests" as const,
    href: roomDetailHref(departure.roomNumber),
  })),
];

const vipResults: SearchResult[] = mockVIPGuests.map((guest) => ({
  id: `vip-${guest.id}`,
  title: guest.name,
  subtitle: `VIP ${guest.tier} · Room ${guest.roomNumber} · ${guest.preferences}`,
  module: "Guests",
  href: roomDetailHref(guest.roomNumber),
}));

const alertResults: SearchResult[] = mockDashboardExceptions.map((exception) => ({
  id: `exception-${exception.id}`,
  title: exception.category,
  subtitle: `${exception.description} · Count ${exception.count}`,
  module: "Alerts",
  href:
    exception.category === "Negative Stock"
      ? drillDownHref("inventory", "negative-stock")
      : exception.category === "Overdue Receivables"
        ? drillDownHref("finance", "overdue-receivables")
        : exception.category === "High Discounts"
          ? drillDownHref("revenue", "high-discounts")
          : drillDownHref("rooms", "no-shows"),
}));

const allResults: SearchResult[] = [
  ...roomResults,
  ...arrivalResults,
  ...departureResults,
  ...vipResults,
  ...alertResults,
  ...staticResults,
];

export function searchMockData(query: string, limit = 8): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < 2) return [];

  // API_REQUIRED: replace with GET /api/search?q=<query> for backend search.
  return allResults
    .map((result) => {
      const haystack = `${result.title} ${result.subtitle} ${result.module}`.toLowerCase();
      const exactTitle = result.title.toLowerCase() === normalized ? 100 : 0;
      const startsWithTitle = result.title.toLowerCase().startsWith(normalized) ? 50 : 0;
      const includes = haystack.includes(normalized) ? 10 : 0;

      return { result, score: exactTitle + startsWithTitle + includes };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.result);
}
