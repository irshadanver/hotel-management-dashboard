import {
  mockDashboardArrivals,
  mockDashboardDepartures,
  mockOccupancyForecast,
  mockRevenueTrend,
} from "@/lib/api/mock/dashboard";
import { getDashboardKPIsForRange, getOccupancyForecastForRange } from "@/lib/api/mock/dashboard-for-preset";
import {
  mockRoomArrivals,
  mockRoomDepartures,
  getFilteredRoomArrivals,
  getFilteredRoomDepartures,
  getFilteredRooms,
  getFilteredRoomsKPIs,
  getFilteredRoomsOccupancyTrend,
  roomFiltersFromDrillUrl,
  type RoomFilters,
} from "@/lib/api/mock/rooms";
import {
  getFilteredRevenueKPIs,
  getRoomRevenueForecastNumber,
  getRevenuePickupLast7DaysNumber,
  getRevenuePickupTodayNumber,
  getRevenueDrillAdrDisplay,
  getRevenueDrillCashPositionDisplay,
  getRevenueDrillMtdRevenueDisplay,
  getRevenueDrillRevparDisplay,
  getRevenueDrillTodayRevenueDisplay,
  type RevenueFilters,
} from "@/lib/api/mock/revenue";
import {
  fnbFiltersFromDrillUrl,
  getFilteredFnBKPIs,
  getFilteredOpenChecks,
  getFilteredOutletSales,
  getOutletSalesDrillAxis,
  getFnBDiscountsNumber,
  getFnBVoidsNumber,
  type FnBFilters,
} from "@/lib/api/mock/fnb";
import type { DateRangePreset } from "@/lib/date/date-range-preset";
import { buildDateRangeQuery } from "@/lib/date/date-range-query";
import { mockNumericScale } from "@/lib/date/preset-multipliers";
import { formatSAR, type Room } from "@/lib/types";
import { parseSarToNumber } from "@/lib/format/sar";
import type { DrillDownChartSpec } from "./chart-spec";
import type { DrillDateSource, DrillDownUrlParams } from "./query-params";

export interface DrillDownColumn {
  key: string;
  header: string;
  align?: "left" | "right";
}

export interface DrillDownDataset {
  domain: "rooms" | "revenue" | "fnb" | "finance" | "inventory";
  view: string;
  title: string;
  subtitle: string;
  source: string;
  apiRequired: string;
  columns: DrillDownColumn[];
  rows: Record<string, string | number>[];
  /** When set, summary "Primary Value" matches the KPI that launched this drill-down */
  primaryMetric?: string;
  /** Optional chart derived client-side or attached here for richer drill-downs */
  chart?: DrillDownChartSpec;
}

const roomColumns: DrillDownColumn[] = [
  { key: "room", header: "Room" },
  { key: "floor", header: "Floor" },
  { key: "type", header: "Type" },
  { key: "status", header: "Status" },
  { key: "guest", header: "Guest" },
];

const roomSummaryColumns: DrillDownColumn[] = [
  { key: "segment", header: "Segment" },
  { key: "rooms", header: "Rooms", align: "right" },
  { key: "basis", header: "Basis" },
  { key: "status", header: "Status" },
];

const guestColumns: DrillDownColumn[] = [
  { key: "guest", header: "Guest" },
  { key: "room", header: "Room" },
  { key: "roomType", header: "Room Type" },
  { key: "time", header: "Time" },
  { key: "status", header: "Status" },
];

const revenueColumns: DrillDownColumn[] = [
  { key: "date", header: "Date" },
  { key: "metric", header: "Metric" },
  { key: "amount", header: "Amount", align: "right" },
  { key: "source", header: "Source" },
];

const financeColumns: DrillDownColumn[] = [
  { key: "account", header: "Account" },
  { key: "type", header: "Type" },
  { key: "amount", header: "Amount", align: "right" },
  { key: "status", header: "Status" },
];

const inventoryColumns: DrillDownColumn[] = [
  { key: "item", header: "Item" },
  { key: "store", header: "Store" },
  { key: "stock", header: "Stock", align: "right" },
  { key: "reorderLevel", header: "Reorder Level", align: "right" },
  { key: "status", header: "Status" },
];

const fnbColumns: DrillDownColumn[] = [
  { key: "outlet", header: "Outlet" },
  { key: "metric", header: "Metric" },
  { key: "value", header: "Value", align: "right" },
  { key: "status", header: "Status" },
];

const ROOM_DRILL_TYPE_ORDER = ["Standard", "Deluxe", "Executive", "Suite"] as const;

function roomsDrillScopeLabel(filters: RoomFilters): string {
  const d = filters.date ?? "today";
  const rt = filters.roomType ?? "all";
  if (d === "header" && filters.headerRange) {
    return `${filters.headerRange.startDate}–${filters.headerRange.endDate} · ${rt}`;
  }
  const day =
    d === "yesterday"
      ? "Yesterday"
      : d === "tomorrow"
        ? "Tomorrow"
        : d === "today"
          ? "Today"
          : d;
  return `${day} · ${rt}`;
}

function roomsSummaryByType(
  filters: RoomFilters,
  predicate: (room: Room) => boolean,
  statusLabel: string,
  basisDetail: string
): Record<string, string | number>[] {
  const rooms = getFilteredRooms(filters).filter(predicate);
  const byType = new Map<string, number>();
  for (const r of rooms) {
    byType.set(r.type, (byType.get(r.type) ?? 0) + 1);
  }
  const scope = roomsDrillScopeLabel(filters);
  const basis = `${basisDetail} (${scope})`;
  const rows: Record<string, string | number>[] = [];
  for (const t of ROOM_DRILL_TYPE_ORDER) {
    const n = byType.get(t) ?? 0;
    if (n > 0) {
      rows.push({ segment: t, rooms: n, basis, status: statusLabel });
    }
  }
  return rows;
}

function roomsArrivalSummaryRows(filters: RoomFilters): Record<string, string | number>[] {
  const list = getFilteredRoomArrivals(filters);
  const expected = list.filter((a) => a.status === "expected").length;
  const checkedIn = list.filter((a) => a.status === "checked-in").length;
  const delayed = list.filter((a) => a.status === "delayed").length;
  const scope = roomsDrillScopeLabel(filters);
  const basis = `Arrivals (${scope})`;
  return [
    { segment: "Expected", rooms: expected, basis, status: "Pending check-in" },
    { segment: "Checked In", rooms: checkedIn, basis, status: "Completed" },
    { segment: "Delayed", rooms: delayed, basis, status: "Delayed" },
  ];
}

function roomsDepartureSummaryRows(filters: RoomFilters): Record<string, string | number>[] {
  const list = getFilteredRoomDepartures(filters);
  const checkedOut = list.filter((d) => d.status === "checked-out").length;
  const dueOut = list.filter((d) => d.status === "due-out").length;
  const extended = list.filter((d) => d.status === "extended").length;
  const scope = roomsDrillScopeLabel(filters);
  const basis = `Departures (${scope})`;
  return [
    { segment: "Checked Out", rooms: checkedOut, basis, status: "Completed" },
    { segment: "Due Out", rooms: dueOut, basis, status: "Pending" },
    { segment: "Extended", rooms: extended, basis, status: "Extended stay" },
  ];
}

function roomsMaintenanceRowsFromFilters(filters: RoomFilters): Record<string, string | number>[] {
  const rooms = getFilteredRooms(filters);
  return rooms
    .filter((r) => {
      const n = parseInt(String(r.number).replace(/\D/g, ""), 10) || 0;
      return n % 23 === 0 || n % 29 === 0;
    })
    .slice(0, 10)
    .map((room, idx) => ({
      room: room.number,
      floor: room.floor,
      type: room.type,
      status: idx % 2 === 0 ? "maintenance" : "out-of-order",
      guest: room.guest ?? "-",
    }));
}

function roomsNoShowRowsFromFilters(filters: RoomFilters): Record<string, string | number>[] {
  const arrivals = getFilteredRoomArrivals(filters);
  const kpiVal = Number(
    getFilteredRoomsKPIs(filters).find((k) => k.title === "No-Shows")?.value ?? 0
  );
  if (!kpiVal) return [];
  const delayed = arrivals.filter((a) => a.status === "delayed");
  const rest = arrivals.filter((a) => a.status !== "delayed");
  const picked = [...delayed, ...rest].slice(0, kpiVal);
  return picked.map((a) => ({
    guest: a.guestName,
    room: a.roomNumber,
    roomType: a.roomType,
    time: a.eta,
    status: a.status === "delayed" ? "No-show risk" : "Pending arrival",
  }));
}

function roomsKpiPrimary(filters: RoomFilters, title: string): string | undefined {
  const raw = getFilteredRoomsKPIs(filters).find((k) => k.title === title)?.value;
  if (raw === undefined || raw === null) return undefined;
  return String(raw);
}

function dashboardArrivalRows() {
  return mockDashboardArrivals.map((arrival) => ({
    guest: arrival.guestName,
    room: arrival.room ?? "-",
    roomType: arrival.roomType,
    time: arrival.eta,
    status: arrival.status,
  }));
}

function roomArrivalRows() {
  return mockRoomArrivals.map((arrival) => ({
    guest: arrival.guestName,
    room: arrival.roomNumber,
    roomType: arrival.roomType,
    time: arrival.eta,
    status: arrival.status,
  }));
}

function roomDepartureRows() {
  return mockRoomDepartures.map((departure) => ({
    guest: departure.guestName,
    room: departure.roomNumber,
    roomType: departure.roomType,
    time: departure.etd,
    status:
      departure.balance > 0
        ? `${departure.status} (${formatSAR(departure.balance)})`
        : departure.status,
  }));
}

function revenueRows(metric: string, date?: string) {
  const rows = mockRevenueTrend
    .filter((point) => !date || point.date === date)
    .map((point) => ({
      date: String(point.date),
      metric,
      amount: formatSAR(Number(point.revenue)),
      source: "PMS + POS posted revenue",
    }));

  if (metric === "ADR") {
    return rows.map((row) => ({
      ...row,
      amount: "SAR 485",
      source: "Room revenue / rooms sold",
    }));
  }

  if (metric === "RevPAR") {
    return rows.map((row) => ({
      ...row,
      amount: "SAR 380",
      source: "Room revenue / available rooms",
    }));
  }

  return rows;
}

const highDiscountRows = [
  {
    date: "May 14",
    metric: "High Discount",
    amount: "35%",
    source: "Room 405 - Ahmed Al-Rashid",
  },
  {
    date: "May 14",
    metric: "High Discount",
    amount: "32%",
    source: "Corporate booking - Al Rajhi Capital",
  },
  {
    date: "May 13",
    metric: "High Discount",
    amount: "31%",
    source: "Group booking - Weekend package",
  },
];

const revenueTodayRows = [
  {
    date: "May 14",
    metric: "Rooms",
    amount: "SAR 86,500",
    source: "PMS posted room revenue",
  },
  {
    date: "May 14",
    metric: "F&B",
    amount: "SAR 18,450",
    source: "POS posted outlet revenue",
  },
  {
    date: "May 14",
    metric: "Spa & Other",
    amount: "SAR 22,500",
    source: "Ancillary posted revenue",
  },
];

const revenueMtdRows = [
  {
    date: "May MTD",
    metric: "Rooms",
    amount: "SAR 1,245,600",
    source: "PMS posted room revenue",
  },
  {
    date: "May MTD",
    metric: "F&B",
    amount: "SAR 372,900",
    source: "POS posted outlet revenue",
  },
  {
    date: "May MTD",
    metric: "Banquet",
    amount: "SAR 151,200",
    source: "Events posted revenue",
  },
  {
    date: "May MTD",
    metric: "Spa & Other",
    amount: "SAR 86,500",
    source: "Ancillary posted revenue",
  },
];

const roomRevenueForecastRows = [
  {
    date: "Next 7 days",
    metric: "Room Revenue Forecast",
    amount: "SAR 560,000",
    source: "Revenue forecast model",
  },
  {
    date: "Days 8-14",
    metric: "Room Revenue Forecast",
    amount: "SAR 590,000",
    source: "Revenue forecast model",
  },
  {
    date: "Days 15-21",
    metric: "Room Revenue Forecast",
    amount: "SAR 610,000",
    source: "Revenue forecast model",
  },
  {
    date: "Days 22-30",
    metric: "Room Revenue Forecast",
    amount: "SAR 640,000",
    source: "Revenue forecast model",
  },
];

const adrForecastValues = [470, 475, 480, 485, 490, 495, 500];

const financeRows = {
  "cash-position": [
    {
      account: "Main Operating Account",
      type: "Bank",
      amount: "SAR 342,800",
      status: "Available",
    },
    {
      account: "Front Office Cash",
      type: "Cashier",
      amount: "SAR 85,400",
      status: "Open shift",
    },
    {
      account: "POS Settlement",
      type: "Card Receivable",
      amount: "SAR 114,600",
      status: "Pending bank settlement",
    },
  ],
  "unsettled-folios": mockDashboardDepartures
    .filter((departure) => departure.balance > 0)
    .map((departure) => ({
      account: `${departure.guestName} / Room ${departure.room}`,
      type: "Guest folio",
      amount: formatSAR(departure.balance),
      status: departure.status,
    })),
  "overdue-receivables": [
    {
      account: "Global Industries",
      type: "Corporate AR",
      amount: "SAR 125,000",
      status: "45 days overdue",
    },
    {
      account: "Al Noor Travel",
      type: "Travel agent AR",
      amount: "SAR 78,500",
      status: "38 days overdue",
    },
    {
      account: "Desert Events Co.",
      type: "Banquet AR",
      amount: "SAR 42,750",
      status: "32 days overdue",
    },
  ],
  "total-revenue-today": [
    {
      account: "Rooms",
      type: "Department Revenue",
      amount: "SAR 86,500",
      status: "Posted",
    },
    {
      account: "F&B",
      type: "Department Revenue",
      amount: "SAR 18,450",
      status: "Posted",
    },
    {
      account: "Spa & Other",
      type: "Department Revenue",
      amount: "SAR 22,500",
      status: "Posted",
    },
  ],
  "cash-balance": [
    {
      account: "Main Bank",
      type: "Bank",
      amount: "SAR 642,340",
      status: "Reconciled",
    },
    {
      account: "Cash on Hand",
      type: "Cash",
      amount: "SAR 96,400",
      status: "Open shift",
    },
    {
      account: "Card Settlement",
      type: "Receivable",
      amount: "SAR 153,600",
      status: "Pending settlement",
    },
  ],
  "accounts-receivable": [
    {
      account: "Current AR",
      type: "Aging Bucket",
      amount: "SAR 124,500",
      status: "18 invoices",
    },
    {
      account: "1-30 Days",
      type: "Aging Bucket",
      amount: "SAR 89,200",
      status: "12 invoices",
    },
    {
      account: "31-60 Days",
      type: "Aging Bucket",
      amount: "SAR 52,400",
      status: "7 invoices",
    },
    {
      account: "61-90 Days",
      type: "Aging Bucket",
      amount: "SAR 34,800",
      status: "4 invoices",
    },
    {
      account: "90+ Days",
      type: "Aging Bucket",
      amount: "SAR 23,880",
      status: "3 invoices",
    },
  ],
  "accounts-payable": [
    {
      account: "Due in 7 Days",
      type: "Payables Bucket",
      amount: "SAR 63,420",
      status: "7 invoices",
    },
    {
      account: "Due in 15 Days",
      type: "Payables Bucket",
      amount: "SAR 34,380",
      status: "6 invoices",
    },
    {
      account: "Due in 30 Days",
      type: "Payables Bucket",
      amount: "SAR 59,120",
      status: "6 invoices",
    },
  ],
};

const inventoryRows = {
  "negative-stock": [
    {
      item: "Chicken Breast",
      store: "Main Kitchen",
      stock: -5,
      reorderLevel: 25,
      status: "Negative stock",
    },
    {
      item: "Salmon Fillet",
      store: "Main Kitchen",
      stock: -2,
      reorderLevel: 10,
      status: "Negative stock",
    },
    {
      item: "Bath Towels",
      store: "Housekeeping Store",
      stock: -18,
      reorderLevel: 120,
      status: "Negative stock",
    },
    {
      item: "Shampoo Amenities",
      store: "Housekeeping Store",
      stock: -9,
      reorderLevel: 80,
      status: "Negative stock",
    },
    {
      item: "Still Water 500ml",
      store: "Mini-bar",
      stock: -12,
      reorderLevel: 100,
      status: "Negative stock",
    },
  ],
  "stock-value": [
    {
      item: "Food Inventory",
      store: "Main Kitchen",
      stock: "SAR 312,450",
      reorderLevel: "-",
      status: "Current",
    },
    {
      item: "Beverage Inventory",
      store: "Bar Store",
      stock: "SAR 184,300",
      reorderLevel: "-",
      status: "Current",
    },
    {
      item: "Housekeeping Supplies",
      store: "Housekeeping",
      stock: "SAR 350,500",
      reorderLevel: "-",
      status: "Current",
    },
  ],
  "below-reorder": [
    {
      item: "Olive Oil - Extra Virgin",
      store: "F&B - Kitchen",
      stock: "3 L",
      reorderLevel: "10 L",
      status: "Critical",
    },
    {
      item: "Chicken Breast",
      store: "F&B - Kitchen",
      stock: "8 kg",
      reorderLevel: "25 kg",
      status: "Critical",
    },
    {
      item: "Bathroom Amenities Set",
      store: "Housekeeping",
      stock: "45 sets",
      reorderLevel: "100 sets",
      status: "Critical",
    },
    {
      item: "Printer Paper A4",
      store: "Admin",
      stock: "5 reams",
      reorderLevel: "15 reams",
      status: "Critical",
    },
    {
      item: "Fresh Salmon",
      store: "F&B - Kitchen",
      stock: "4 kg",
      reorderLevel: "12 kg",
      status: "Critical",
    },
    {
      item: "Cleaning Chemicals",
      store: "Housekeeping",
      stock: "12 L",
      reorderLevel: "20 L",
      status: "Low",
    },
    {
      item: "Bed Linens - King",
      store: "Housekeeping",
      stock: "18 sets",
      reorderLevel: "30 sets",
      status: "Low",
    },
    {
      item: "Coffee Beans - Arabic",
      store: "F&B - Beverage",
      stock: "8 kg",
      reorderLevel: "15 kg",
      status: "Low",
    },
  ],
  "pending-pos": [
    {
      item: "Finance Approval",
      store: "Purchasing",
      stock: 3,
      reorderLevel: "SAR 18,500",
      status: "Awaiting Finance",
    },
    {
      item: "GM Approval",
      store: "Purchasing",
      stock: 2,
      reorderLevel: "SAR 11,700",
      status: "Awaiting GM",
    },
    {
      item: "Vendor Confirmation",
      store: "Purchasing",
      stock: 2,
      reorderLevel: "SAR 12,600",
      status: "Pending approval",
    },
  ],
  "price-variance": [
    {
      item: "Seafood",
      store: "Main Kitchen",
      stock: 1,
      reorderLevel: "10%",
      status: "Above threshold",
    },
    {
      item: "Imported Grocery",
      store: "Main Kitchen",
      stock: 1,
      reorderLevel: "10%",
      status: "Above threshold",
    },
    {
      item: "Housekeeping Chemicals",
      store: "Housekeeping",
      stock: 1,
      reorderLevel: "10%",
      status: "Above threshold",
    },
    {
      item: "Guest Amenities",
      store: "Housekeeping",
      stock: 1,
      reorderLevel: "10%",
      status: "Above threshold",
    },
  ],
};

const fnbRows = {
  "today-sales": [
    {
      outlet: "All Day Dining",
      metric: "Sales",
      value: "SAR 8,650",
      status: "Posted",
    },
    {
      outlet: "Lobby Cafe",
      metric: "Sales",
      value: "SAR 4,280",
      status: "Posted",
    },
    {
      outlet: "Room Service",
      metric: "Sales",
      value: "SAR 5,520",
      status: "Posted",
    },
  ],
  covers: [
    {
      outlet: "All Day Dining",
      metric: "Covers",
      value: 142,
      status: "Breakfast/Lunch",
    },
    {
      outlet: "Lobby Cafe",
      metric: "Covers",
      value: 86,
      status: "Open checks included",
    },
    {
      outlet: "Room Service",
      metric: "Orders",
      value: 56,
      status: "Delivered",
    },
  ],
  "average-check": [
    {
      outlet: "All Day Dining",
      metric: "Average Check",
      value: "SAR 61",
      status: "Normal",
    },
    {
      outlet: "Lobby Cafe",
      metric: "Average Check",
      value: "SAR 50",
      status: "Normal",
    },
    {
      outlet: "Room Service",
      metric: "Average Check",
      value: "SAR 99",
      status: "High",
    },
  ],
  discounts: [
    {
      outlet: "All Day Dining",
      metric: "Discounts",
      value: "SAR 680",
      status: "Manager approved",
    },
    {
      outlet: "Lobby Cafe",
      metric: "Discounts",
      value: "SAR 240",
      status: "Promotion",
    },
    {
      outlet: "Room Service",
      metric: "Discounts",
      value: "SAR 320",
      status: "Guest recovery",
    },
  ],
  voids: [
    {
      outlet: "All Day Dining",
      metric: "Voids",
      value: "SAR 120",
      status: "Incorrect item",
    },
    {
      outlet: "Lobby Cafe",
      metric: "Voids",
      value: "SAR 80",
      status: "Duplicate order",
    },
    {
      outlet: "Room Service",
      metric: "Voids",
      value: "SAR 120",
      status: "Guest cancellation",
    },
  ],
  "open-checks": [
    {
      outlet: "All Day Dining",
      metric: "Open Checks",
      value: "SAR 650",
      status: "2 checks over 60 minutes",
    },
    {
      outlet: "Lobby Cafe",
      metric: "Open Checks",
      value: "SAR 95",
      status: "1 active check",
    },
    {
      outlet: "Room Service",
      metric: "Open Checks",
      value: "SAR 340",
      status: "1 check over 60 minutes",
    },
  ],
};

function fnbDrillScopeLabel(filters: FnBFilters): string {
  const date = filters.date ?? "today";
  const outlet = filters.outlet ?? "all";
  if (date === "header" && filters.headerRange) {
    return `${filters.headerRange.startDate}–${filters.headerRange.endDate} · ${outlet}`;
  }
  const day =
    date === "today"
      ? "Today"
      : date === "yesterday"
        ? "Yesterday"
        : date === "last7"
          ? "Last 7 days"
          : date === "last30"
            ? "Last 30 days"
            : date === "mtd"
              ? "Month to date"
              : date;
  return `${day} · ${outlet}`;
}

function fnbKpiNumber(filters: FnBFilters, title: string): number {
  const raw = getFilteredFnBKPIs(filters).find((k) => k.title === title)?.value;
  if (typeof raw === "number") return raw;
  return parseSarToNumber(String(raw ?? "0"));
}

function fnbSalesDrillRows(filters: FnBFilters): Record<string, string | number>[] {
  return getOutletSalesDrillAxis(filters).map((row) => ({
    outlet: row.outlet,
    metric: "Sales",
    value: formatSAR(row.sales),
    /** Numeric SAR for charts (avoids locale digit parsing issues on `value`). */
    valueNum: row.sales,
    status: "Posted",
  }));
}

function fnbCoversAverageCheckRows(filters: FnBFilters): {
  covers: Record<string, string | number>[];
  averageCheck: Record<string, string | number>[];
} {
  const totalCovers = fnbKpiNumber(filters, "Covers");
  const salesRows = getFilteredOutletSales(filters);
  const sumSales = salesRows.reduce((s, r) => s + r.sales, 0) || 1;

  const covers: Record<string, string | number>[] = [];
  const averageCheck: Record<string, string | number>[] = [];

  for (const row of salesRows) {
    const share = row.sales / sumSales;
    const outletCovers = Math.max(1, Math.round(totalCovers * share));
    const isRoomSvc = row.outletId === "room-service";
    covers.push({
      outlet: row.outlet,
      metric: isRoomSvc ? "Orders" : "Covers",
      value: outletCovers,
      status: isRoomSvc ? "Delivered" : "Breakfast/Lunch",
    });
    const avg = Math.round(row.sales / outletCovers);
    averageCheck.push({
      outlet: row.outlet,
      metric: "Average Check",
      value: formatSAR(avg),
      valueNum: avg,
      status: avg >= 85 ? "High" : "Normal",
    });
  }
  return { covers, averageCheck };
}

function fnbOpenCheckOutletLabel(outletId: string): string {
  const map: Record<string, string> = {
    restaurant: "Main Restaurant",
    cafe: "Lobby Cafe",
    "room-service": "Room Service",
    bar: "Pool Bar",
    banquet: "Banquet",
  };
  return map[outletId] ?? outletId;
}

function fnbOpenChecksDrillRows(filters: FnBFilters): Record<string, string | number>[] {
  return getFilteredOpenChecks(filters).map((c) => ({
    outlet: fnbOpenCheckOutletLabel(c.outletId),
    metric: "Open Checks",
    value: formatSAR(c.amount),
    status:
      c.duration > 60
        ? `Open ${c.duration} min · ${c.table}`
        : `${c.duration} min · ${c.table}`,
  }));
}

function inferDrillCtx(
  domain: string | null,
  view: string | null,
  params?: DrillDownUrlParams | null
): DrillDateSource {
  const c = params?.ctx;
  if (c === "dashboard" || c === "rooms" || c === "revenue" || c === "fnb") return c;
  if (domain === "rooms" && view === "occupancy") return "rooms";
  return "dashboard";
}

function drillDashboardRange(params?: DrillDownUrlParams | null) {
  const preset = (params?.preset as DateRangePreset) ?? "today";
  return buildDateRangeQuery(
    preset,
    params?.startDate ?? "",
    params?.endDate ?? ""
  );
}

/** Same multipliers as `components/inventory/inventory-kpi-cards.tsx` (header range). */
const INVENTORY_KPI_BASE = {
  stockValue: 847_250,
  belowReorder: 8,
  pendingPos: 7,
  pendingPoValue: 42_800,
  priceVariance: 4,
} as const;

function inventoryKpiScaleFromDrill(params?: DrillDownUrlParams | null) {
  const q = drillDashboardRange(params);
  const m = mockNumericScale(q);
  const s = (n: number) => Math.round(n * m);
  const below = Math.max(
    1,
    Math.round(INVENTORY_KPI_BASE.belowReorder * (1.04 - 0.04 * m))
  );
  const pos = Math.max(
    1,
    Math.round(INVENTORY_KPI_BASE.pendingPos * (0.92 + 0.08 * m))
  );
  const variance = Math.max(
    1,
    Math.round(INVENTORY_KPI_BASE.priceVariance * (0.9 + 0.1 * m))
  );
  const stockTotalNum = s(INVENTORY_KPI_BASE.stockValue);
  const pendingPoTotalNum = s(INVENTORY_KPI_BASE.pendingPoValue);
  return {
    q,
    m,
    rangeCaption: `${q.startDate}–${q.endDate}`,
    stockTotalDisplay: formatSAR(stockTotalNum),
    below,
    pos,
    variance,
    pendingPoTotalDisplay: formatSAR(pendingPoTotalNum),
  };
}

function inventoryPadRows<T extends { item: string }>(
  template: T[],
  target: number
): T[] {
  if (target <= 0) return [];
  if (target <= template.length) return template.slice(0, target);
  const out = [...template];
  for (let k = template.length; k < target; k++) {
    const base = template[k % template.length];
    out.push({
      ...base,
      item: `${base.item} (${k + 1})`,
    });
  }
  return out.slice(0, target);
}

function inventoryPendingPosDrillRows(
  template: (typeof inventoryRows)["pending-pos"],
  posCount: number,
  poValueTotal: number
): (typeof inventoryRows)["pending-pos"] {
  const baseAmounts = template.map((r) =>
    parseSarToNumber(String(r.reorderLevel))
  );
  const baseSum = baseAmounts.reduce((a, b) => a + b, 0) || 1;
  const scaledSar = baseAmounts.map((b) =>
    Math.round((poValueTotal * b) / baseSum)
  );
  let drift = poValueTotal - scaledSar.reduce((a, b) => a + b, 0);
  if (scaledSar.length) scaledSar[scaledSar.length - 1] += drift;

  const baseStocks = template.map((r) => Number(r.stock));
  const stockSum = baseStocks.reduce((a, b) => a + b, 0) || 1;
  const scaledStock = baseStocks.map((b) =>
    Math.max(1, Math.round((posCount * b) / stockSum))
  );
  drift = posCount - scaledStock.reduce((a, b) => a + b, 0);
  if (scaledStock.length) scaledStock[scaledStock.length - 1] += drift;

  const core = template.map((row, i) => ({
    ...row,
    stock: scaledStock[i] ?? row.stock,
    reorderLevel: formatSAR(scaledSar[i] ?? 0),
  }));
  return inventoryPadRows(core, posCount);
}

/** Same BASE and invoice/bill curves as `components/finance/finance-kpi-cards.tsx`. */
const FINANCE_KPI_BASE = {
  revenueToday: 127_450,
  cash: 892_340,
  ar: 324_780,
  ap: 156_920,
  openInvoices: 42,
  pendingBills: 18,
} as const;

function financeKpiScaleFromDrill(params?: DrillDownUrlParams | null) {
  const q = drillDashboardRange(params);
  const m = mockNumericScale(q);
  const s = (n: number) => Math.round(n * m);
  const openInvoices = Math.max(
    1,
    Math.round(FINANCE_KPI_BASE.openInvoices * (0.92 + 0.08 * m))
  );
  const pendingBills = Math.max(
    1,
    Math.round(FINANCE_KPI_BASE.pendingBills * (0.92 + 0.08 * m))
  );
  return {
    q,
    m,
    rangeCaption: `${q.startDate}–${q.endDate}`,
    revenueTodayDisplay: formatSAR(s(FINANCE_KPI_BASE.revenueToday)),
    cashDisplay: formatSAR(s(FINANCE_KPI_BASE.cash)),
    arDisplay: formatSAR(s(FINANCE_KPI_BASE.ar)),
    apDisplay: formatSAR(s(FINANCE_KPI_BASE.ap)),
    openInvoices,
    pendingBills,
  };
}

function distributeIntAcrossWeights(target: number, weights: number[]): number[] {
  if (target <= 0) return weights.map(() => 0);
  const wsum = weights.reduce((a, b) => a + b, 0) || 1;
  const exact = weights.map((w) => (target * w) / wsum);
  const floored = exact.map((x) => Math.floor(x));
  let rem = target - floored.reduce((a, b) => a + b, 0);
  const order = exact
    .map((x, i) => i)
    .sort((i, j) => exact[j] - floored[j] - (exact[i] - floored[i]));
  const out = [...floored];
  for (let r = 0; r < rem; r++) {
    out[order[r % order.length]!]++;
  }
  return out.map((n) => Math.max(0, n));
}

function coerceDrillPresetForRevenue(p?: string | null): DateRangePreset {
  const valid: DateRangePreset[] = [
    "today",
    "yesterday",
    "last7Days",
    "last30Days",
    "custom",
  ];
  if (p && valid.includes(p as DateRangePreset)) return p as DateRangePreset;
  return "today";
}

function revenueFiltersFromDrill(
  params?: DrillDownUrlParams | null
): RevenueFilters {
  const segment = params?.revSegment ?? "all";
  const range = params?.revRange ?? "30d";
  if (range === "header") {
    const headerRange = buildDateRangeQuery(
      coerceDrillPresetForRevenue(params?.preset),
      params?.startDate ?? "",
      params?.endDate ?? ""
    );
    return { range: "header", segment, headerRange };
  }
  return { range, segment };
}

function scaleAmountRowsByPrimary<T extends { amount: string }>(
  rows: T[],
  primaryLabel: string,
  baseTotalFallback: number
): T[] {
  const target = parseSarToNumber(primaryLabel);
  const baseSum =
    rows.reduce((s, r) => s + parseSarToNumber(r.amount), 0) ||
    baseTotalFallback;
  if (!target || !baseSum) return rows;
  const factor = target / baseSum;
  return rows.map((r) => ({
    ...r,
    amount: formatSAR(Math.round(parseSarToNumber(r.amount) * factor)),
  }));
}

export function getDrillDownDataset(
  domain: string | null,
  view: string | null,
  params?: DrillDownUrlParams | null
): DrillDownDataset | null {
  if (domain === "rooms") {
    const roomsDrillFilters = roomFiltersFromDrillUrl(
      params?.roomsDate,
      params?.roomType,
      params?.preset,
      params?.startDate,
      params?.endDate
    );
    const roomsScope = roomsDrillScopeLabel(roomsDrillFilters);

    if (view === "occupied" || view === "sold") {
      const soldRows = roomsSummaryByType(
        roomsDrillFilters,
        (room) => room.status === "occupied" || room.status === "reserved",
        "Sold",
        "Confirmed occupied/sold rooms"
      );
      const primary = roomsKpiPrimary(roomsDrillFilters, "Rooms Sold");
      return {
        domain,
        view,
        title: view === "sold" ? "Rooms Sold" : "Occupied Rooms",
        subtitle: `Rooms sold summary reconciled to the Rooms Sold KPI for ${roomsScope}.`,
        source: "lib/api/mock/rooms.ts -> getFilteredRooms",
        apiRequired: "GET /api/rooms/status?status=occupied",
        columns: roomSummaryColumns,
        rows: soldRows,
        primaryMetric: primary,
      };
    }

    if (view === "available") {
      const availRows = roomsSummaryByType(
        roomsDrillFilters,
        (room) => room.status === "vacant-clean",
        "Ready to sell",
        "Vacant clean inventory"
      );
      const primary = roomsKpiPrimary(roomsDrillFilters, "Rooms Available");
      return {
        domain,
        view,
        title: "Available Rooms",
        subtitle: `Available rooms summary reconciled to the Rooms Available KPI for ${roomsScope}.`,
        source: "lib/api/mock/rooms.ts -> getFilteredRooms",
        apiRequired: "GET /api/rooms/status?status=vacant-clean",
        columns: roomSummaryColumns,
        rows: availRows,
        primaryMetric: primary,
      };
    }

    if (view === "maintenance") {
      return {
        domain,
        view,
        title: "Room Maintenance",
        subtitle: `Mock maintenance / out-of-order sample for ${roomsScope} (API will return real statuses).`,
        source: "lib/api/mock/rooms.ts -> getFilteredRooms (synthetic maintenance rows)",
        apiRequired: "GET /api/rooms/status?status=maintenance",
        columns: roomColumns,
        rows: roomsMaintenanceRowsFromFilters(roomsDrillFilters),
      };
    }

    if (view === "arrivals") {
      const primary = roomsKpiPrimary(roomsDrillFilters, "Arrivals Today");
      return {
        domain,
        view,
        title: "Room Arrivals",
        subtitle: `Front-office arrivals for ${roomsScope}, aligned with the Arrivals KPI.`,
        source: "lib/api/mock/rooms.ts -> getFilteredRoomArrivals",
        apiRequired: "GET /api/rooms/arrivals",
        columns: roomSummaryColumns,
        rows: roomsArrivalSummaryRows(roomsDrillFilters),
        primaryMetric: primary,
      };
    }

    if (view === "departures") {
      const primary = roomsKpiPrimary(roomsDrillFilters, "Departures Today");
      return {
        domain,
        view,
        title: "Room Departures",
        subtitle: `Front-office departures for ${roomsScope}, aligned with the Departures KPI.`,
        source: "lib/api/mock/rooms.ts -> getFilteredRoomDepartures",
        apiRequired: "GET /api/rooms/departures",
        columns: roomSummaryColumns,
        rows: roomsDepartureSummaryRows(roomsDrillFilters),
        primaryMetric: primary,
      };
    }

    if (view === "no-shows") {
      const primary = roomsKpiPrimary(roomsDrillFilters, "No-Shows");
      return {
        domain,
        view,
        title: "No-Shows",
        subtitle: `Arrival-backed no-show sample for ${roomsScope}, aligned with the No-Shows KPI.`,
        source: "lib/api/mock/rooms.ts -> getFilteredRoomArrivals",
        apiRequired: "GET /api/rooms/no-shows",
        columns: guestColumns,
        rows: roomsNoShowRowsFromFilters(roomsDrillFilters),
        primaryMetric: primary,
      };
    }

    if (view === "occupancy") {
      const ctx = inferDrillCtx(domain, view, params);
      let primaryMetric: string | undefined;
      let rows: Record<string, string | number>[];
      let subtitle: string;

      if (ctx === "dashboard") {
        const q = drillDashboardRange(params);
        const kpi = getDashboardKPIsForRange(q).find((k) => k.title === "Occupancy %");
        primaryMetric = kpi?.value;
        const forecast = getOccupancyForecastForRange(q);
        rows = forecast.map((point) => ({
          date: String(point.date),
          occupancy:
            typeof point.forecast === "number"
              ? `${Math.round(point.forecast)}%`
              : "-",
          source: `Header range · ${q.startDate}–${q.endDate}`,
        }));
        subtitle =
          "Occupancy aligned with the executive dashboard KPI for the selected header date range.";
      } else {
        const trend = getFilteredRoomsOccupancyTrend(roomsDrillFilters);
        const kpi = getFilteredRoomsKPIs(roomsDrillFilters).find((k) => k.title === "Occupancy %");
        primaryMetric = String(kpi?.value ?? "");
        const roomsScopeLabel =
          roomsDrillFilters.date === "header" && roomsDrillFilters.headerRange
            ? `${roomsDrillFilters.headerRange.startDate}–${roomsDrillFilters.headerRange.endDate}`
            : `${roomsDrillFilters.date} · ${roomsDrillFilters.roomType}`;
        rows = trend.map((point) => ({
          date: String(point.date),
          occupancy: `${Math.round(Number(point.occupancy))}%`,
          source: `Rooms dashboard · ${roomsScopeLabel}`,
        }));
        subtitle =
          roomsDrillFilters.date === "header" && roomsDrillFilters.headerRange
            ? "Occupancy from the Rooms dashboard using the executive header date range."
            : "Occupancy from the Rooms dashboard date and room-type filters.";
      }

      return {
        domain,
        view,
        title: "Rooms Occupancy",
        subtitle,
        source:
          ctx === "dashboard"
            ? "lib/api/mock/dashboard-for-preset.ts (header date range)"
            : "lib/api/mock/rooms.ts -> getFilteredRoomsOccupancyTrend",
        apiRequired: "GET /api/rooms/occupancy-trend",
        columns: [
          { key: "date", header: "Date" },
          { key: "occupancy", header: "Occupancy", align: "right" },
          { key: "source", header: "Source" },
        ],
        rows,
        primaryMetric,
      };
    }

    if (view === "occupancy-forecast") {
      return {
        domain,
        view,
        title: "Rooms Occupancy Forecast",
        subtitle: "Forecast data shown on the executive dashboard occupancy chart.",
        source: "lib/api/mock/dashboard.ts -> mockOccupancyForecast",
        apiRequired: "GET /api/rooms/occupancy-forecast",
        columns: [
          { key: "date", header: "Date" },
          { key: "occupancy", header: "Forecast", align: "right" },
          { key: "source", header: "Source" },
        ],
        rows: mockOccupancyForecast.map((point) => ({
          date: String(point.date),
          occupancy: `${point.forecast}%`,
          source: params?.date ? `Selected point: ${params.date}` : "Executive forecast",
        })),
      };
    }
  }

  if (domain === "revenue") {
    if (view === "occupancy-forecast") {
      return {
        domain,
        view,
        title: "Revenue Occupancy Forecast",
        subtitle: "Forecast used by Revenue Management for pricing decisions.",
        source: "lib/api/mock/dashboard.ts -> mockOccupancyForecast",
        apiRequired: "GET /api/revenue/occupancy-forecast",
        columns: [
          { key: "date", header: "Date" },
          { key: "metric", header: "Metric" },
          { key: "amount", header: "Forecast", align: "right" },
          { key: "source", header: "Source" },
        ],
        rows: mockOccupancyForecast.map((point) => ({
          date: String(point.date),
          metric: "Occupancy Forecast",
          amount: `${point.forecast}%`,
          source: "Revenue forecast model",
        })),
      };
    }

    if (view === "adr-forecast") {
      const ctx = inferDrillCtx(domain, view, params);
      let pivotAdr = 485;
      let primaryMetric: string | undefined;
      let rowSource = "Revenue forecast model";

      if (ctx === "revenue") {
        const f = revenueFiltersFromDrill(params);
        const kpi = getFilteredRevenueKPIs(f).find((k) => k.title === "ADR Forecast");
        primaryMetric = kpi?.value !== undefined ? String(kpi.value) : undefined;
        pivotAdr = parseSarToNumber(primaryMetric ?? "SAR 485");
        rowSource = "Revenue dashboard · ADR Forecast KPI";
      } else {
        const q = drillDashboardRange(params);
        const k = getDashboardKPIsForRange(q).find((x) => x.title === "ADR");
        primaryMetric = k?.value !== undefined ? String(k.value) : undefined;
        pivotAdr = parseSarToNumber(primaryMetric ?? "SAR 485");
        rowSource = `Header range · ${q.startDate}–${q.endDate}`;
      }

      const baseline = 485;
      return {
        domain,
        view,
        title: "ADR Forecast",
        subtitle: "Average daily rate forecast by stay date.",
        source: "lib/api/mock/revenue.ts -> getFilteredRevenueKPIs (headline) + ladder offsets",
        apiRequired: "GET /api/revenue/adr-forecast",
        columns: revenueColumns,
        primaryMetric,
        rows: revenueRows("ADR Forecast").map((row, index) => ({
          ...row,
          amount: formatSAR(
            Math.round(pivotAdr + (adrForecastValues[index] ?? baseline) - baseline)
          ),
          source: rowSource,
        })),
      };
    }

    if (view === "room-revenue-forecast") {
      const ctx = inferDrillCtx(domain, view, params);
      const f: RevenueFilters =
        ctx === "revenue"
          ? revenueFiltersFromDrill(params)
          : {
              range: "header",
              segment: "all",
              headerRange: drillDashboardRange(params),
            };
      const pivotTotal = getRoomRevenueForecastNumber(f);
      const kpi = getFilteredRevenueKPIs(f).find(
        (k) => k.title === "Room Revenue Forecast"
      );
      const primaryMetric =
        kpi?.value !== undefined ? String(kpi.value) : undefined;
      const baseAmounts = roomRevenueForecastRows.map((r) =>
        parseSarToNumber(String(r.amount))
      );
      const baseSum = baseAmounts.reduce((a, b) => a + b, 0) || 1;
      const rounded = baseAmounts.map((b) =>
        Math.round((pivotTotal * b) / baseSum)
      );
      const drift = pivotTotal - rounded.reduce((a, b) => a + b, 0);
      if (rounded.length) rounded[rounded.length - 1] += drift;

      const q = drillDashboardRange(params);
      const rowSource =
        ctx === "revenue"
          ? "Revenue dashboard · Room Revenue Forecast KPI"
          : `Header range · ${q.startDate}–${q.endDate}`;

      return {
        domain,
        view,
        title: "Room Revenue Forecast",
        subtitle: "Forecasted room revenue by stay date.",
        source:
          "lib/api/mock/revenue.ts -> getRoomRevenueForecastNumber + bucket split",
        apiRequired: "GET /api/revenue/room-revenue-forecast",
        columns: revenueColumns,
        primaryMetric,
        rows: roomRevenueForecastRows.map((row, i) => ({
          ...row,
          amount: formatSAR(rounded[i] ?? 0),
          source: rowSource,
        })),
      };
    }

    if (view === "pickup-7-days" || view === "pickup-today") {
      const ctx = inferDrillCtx(domain, view, params);
      const f: RevenueFilters =
        ctx === "revenue"
          ? revenueFiltersFromDrill(params)
          : {
              range: "header",
              segment: "all",
              headerRange: drillDashboardRange(params),
            };
      const q = drillDashboardRange(params);
      const rowSource =
        ctx === "revenue"
          ? "Revenue dashboard · Pickup KPI"
          : `Header range · ${q.startDate}–${q.endDate}`;

      if (view === "pickup-today") {
        const pivot = getRevenuePickupTodayNumber(f);
        const kpi = getFilteredRevenueKPIs(f).find(
          (k) => k.title === "Pickup (Today)"
        );
        const primaryMetric =
          kpi?.value !== undefined ? String(kpi.value) : String(pivot);
        return {
          domain,
          view,
          title: "Pickup Today",
          subtitle: "Room-night pickup from the revenue booking pace dataset.",
          source:
            "lib/api/mock/revenue.ts -> getRevenuePickupTodayNumber (aligned to KPI)",
          apiRequired: "GET /api/revenue/booking-pace?view=pickup-today",
          columns: [
            { key: "date", header: "Date" },
            { key: "metric", header: "Metric" },
            { key: "amount", header: "Room Nights", align: "right" },
            { key: "source", header: "Source" },
          ],
          primaryMetric,
          rows: [
            {
              date: "May 14",
              metric: "Pickup",
              amount: pivot,
              source: rowSource,
            },
          ],
        };
      }

      const pickup7Base = [42, 36, 51, 48, 62, 45, 58];
      const pickup7Dates = [
        "May 8",
        "May 9",
        "May 10",
        "May 11",
        "May 12",
        "May 13",
        "May 14",
      ];
      const pivotTotal = getRevenuePickupLast7DaysNumber(f);
      const kpi = getFilteredRevenueKPIs(f).find(
        (k) => k.title === "Pickup (Last 7 Days)"
      );
      const primaryMetric =
        kpi?.value !== undefined ? String(kpi.value) : String(pivotTotal);
      const baseSum = pickup7Base.reduce((a, b) => a + b, 0) || 1;
      const rounded = pickup7Base.map((b) =>
        Math.round((pivotTotal * b) / baseSum)
      );
      const drift = pivotTotal - rounded.reduce((a, b) => a + b, 0);
      if (rounded.length) rounded[rounded.length - 1] += drift;

      return {
        domain,
        view,
        title: "Pickup Last 7 Days",
        subtitle: "Room-night pickup from the revenue booking pace dataset.",
        source:
          "lib/api/mock/revenue.ts -> getRevenuePickupLast7DaysNumber + daily split",
        apiRequired: "GET /api/revenue/booking-pace?view=pickup-7-days",
        columns: [
          { key: "date", header: "Date" },
          { key: "metric", header: "Metric" },
          { key: "amount", header: "Room Nights", align: "right" },
          { key: "source", header: "Source" },
        ],
        primaryMetric,
        rows: pickup7Dates.map((date, i) => ({
          date,
          metric: "Pickup",
          amount: rounded[i] ?? 0,
          source: rowSource,
        })),
      };
    }

    if (view === "adr") {
      const ctx = inferDrillCtx(domain, view, params);
      const date = params?.date ?? undefined;
      let primaryMetric: string | undefined;
      let rows = revenueRows("ADR", date);
      if (ctx === "dashboard") {
        const q = drillDashboardRange(params);
        const k = getDashboardKPIsForRange(q).find((x) => x.title === "ADR");
        primaryMetric = k?.value;
        rows = rows.map((r) => ({
          ...r,
          amount: primaryMetric ?? r.amount,
          source: `Header range · ${q.startDate}–${q.endDate}`,
        }));
      } else if (ctx === "revenue") {
        const f = revenueFiltersFromDrill(params);
        primaryMetric = getRevenueDrillAdrDisplay(f);
        rows = rows.map((r) => ({
          ...r,
          amount: primaryMetric ?? r.amount,
          source: "Revenue dashboard filters",
        }));
      }
      return {
        domain,
        view,
        title: "ADR Drill-Down",
        subtitle: "Average daily rate dataset.",
        source: "lib/api/mock/dashboard.ts -> mockRevenueTrend",
        apiRequired: "GET /api/revenue/kpis?metric=adr",
        columns: revenueColumns,
        rows,
        primaryMetric,
      };
    }

    if (view === "revpar") {
      const ctx = inferDrillCtx(domain, view, params);
      const date = params?.date ?? undefined;
      let primaryMetric: string | undefined;
      let rows = revenueRows("RevPAR", date);
      if (ctx === "dashboard") {
        const q = drillDashboardRange(params);
        const k = getDashboardKPIsForRange(q).find((x) => x.title === "RevPAR");
        primaryMetric = k?.value;
        rows = rows.map((r) => ({
          ...r,
          amount: primaryMetric ?? r.amount,
          source: `Header range · ${q.startDate}–${q.endDate}`,
        }));
      } else if (ctx === "revenue") {
        const f = revenueFiltersFromDrill(params);
        primaryMetric = getRevenueDrillRevparDisplay(f);
        rows = rows.map((r) => ({
          ...r,
          amount: primaryMetric ?? r.amount,
          source: "Revenue dashboard filters",
        }));
      }
      return {
        domain,
        view,
        title: "RevPAR Drill-Down",
        subtitle: "Revenue per available room dataset.",
        source: "lib/api/mock/dashboard.ts -> mockRevenueTrend",
        apiRequired: "GET /api/revenue/kpis?metric=revpar",
        columns: revenueColumns,
        rows,
        primaryMetric,
      };
    }

    if (view === "high-discounts") {
      return {
        domain,
        view,
        title: "High Discounts",
        subtitle: "Revenue exceptions for discounts above policy threshold.",
        source: "Revenue exception dataset",
        apiRequired: "GET /api/revenue/exceptions?type=high-discounts",
        columns: revenueColumns,
        rows: highDiscountRows,
      };
    }

    const date = params?.date ?? undefined;
    if (!date && view === "mtd") {
      const ctx = inferDrillCtx(domain, view, params);
      let primaryMetric: string | undefined;
      let rows: Record<string, string | number>[] = revenueMtdRows;
      const baseMtdTotal = 1_856_200;

      if (ctx === "dashboard") {
        const q = drillDashboardRange(params);
        const k = getDashboardKPIsForRange(q).find((x) => x.title === "MTD Revenue");
        primaryMetric = k?.value;
        if (primaryMetric) {
          rows = scaleAmountRowsByPrimary(
            [...revenueMtdRows],
            primaryMetric,
            baseMtdTotal
          );
        }
      } else if (ctx === "revenue") {
        primaryMetric = getRevenueDrillMtdRevenueDisplay(
          revenueFiltersFromDrill(params)
        );
        rows = scaleAmountRowsByPrimary(
          [...revenueMtdRows],
          primaryMetric,
          baseMtdTotal
        );
      }

      return {
        domain,
        view,
        title: "Month-to-Date Revenue",
        subtitle: "Posted revenue records reconciled to the dashboard MTD KPI.",
        source: "Revenue MTD summary mock dataset",
        apiRequired: "GET /api/revenue?period=mtd",
        columns: revenueColumns,
        rows,
        primaryMetric,
      };
    }

    if (!date && (!view || view === "today")) {
      const ctx = inferDrillCtx(domain, view, params);
      let primaryMetric: string | undefined;
      let rows: Record<string, string | number>[] = revenueTodayRows;
      if (ctx === "dashboard") {
        const q = drillDashboardRange(params);
        const k = getDashboardKPIsForRange(q).find((x) => x.title === "Today's Revenue");
        primaryMetric = k?.value;
        if (primaryMetric) {
          rows = scaleAmountRowsByPrimary([...revenueTodayRows], primaryMetric, 127450);
        }
      } else if (ctx === "revenue") {
        const f = revenueFiltersFromDrill(params);
        primaryMetric = getRevenueDrillTodayRevenueDisplay(f);
        rows = scaleAmountRowsByPrimary([...revenueTodayRows], primaryMetric, 127450);
      }
      return {
        domain,
        view: view ?? "today",
        title: "Today's Revenue",
        subtitle: "Posted revenue records reconciled to the dashboard and finance KPIs.",
        source: "Revenue daily summary mock dataset",
        apiRequired: "GET /api/revenue?date=today",
        columns: revenueColumns,
        rows,
        primaryMetric,
      };
    }

    return {
      domain,
      view: view ?? "today",
      title:
        view === "mtd"
          ? "Month-to-Date Revenue"
          : date
            ? `Revenue for ${date}`
            : "Today's Revenue",
      subtitle: "Posted revenue records from the revenue dataset.",
      source: "lib/api/mock/dashboard.ts -> mockRevenueTrend",
      apiRequired: "GET /api/revenue",
      columns: revenueColumns,
      rows: revenueRows("Revenue", date),
    };
  }

  if (domain === "fnb" && view && view in fnbRows) {
    const fnbDrillFilters = fnbFiltersFromDrillUrl(
      params?.fnbDate,
      params?.fnbOutlet,
      params?.preset,
      params?.startDate,
      params?.endDate
    );
    const fnbScope = fnbDrillScopeLabel(fnbDrillFilters);

    const titleMap: Record<keyof typeof fnbRows, string> = {
      "today-sales": "F&B Today's Sales",
      covers: "F&B Covers",
      "average-check": "F&B Average Check",
      discounts: "F&B Discounts",
      voids: "F&B Voids",
      "open-checks": "F&B Open Checks",
    };

    if (view === "discounts") {
      const pivot = getFnBDiscountsNumber(fnbDrillFilters);
      const kpi = getFilteredFnBKPIs(fnbDrillFilters).find(
        (k) => k.title === "Discounts"
      );
      const primaryMetric =
        kpi?.value !== undefined ? String(kpi.value) : formatSAR(pivot);
      const baseRows = fnbRows.discounts;
      const baseAmounts = baseRows.map((r) =>
        parseSarToNumber(String(r.value))
      );
      const baseSum = baseAmounts.reduce((a, b) => a + b, 0) || 1;
      const scaled = baseAmounts.map((b) =>
        Math.round((pivot * b) / baseSum)
      );
      const drift = pivot - scaled.reduce((a, b) => a + b, 0);
      if (scaled.length) scaled[scaled.length - 1] += drift;
      const rows = baseRows.map((row, i) => ({
        ...row,
        value: formatSAR(scaled[i] ?? 0),
      }));

      return {
        domain,
        view,
        title: titleMap.discounts,
        subtitle: `Food & Beverage discounts for ${fnbScope}.`,
        source:
          "lib/api/mock/fnb.ts -> getFnBDiscountsNumber + outlet split (matches KPI)",
        apiRequired: `GET /api/fnb/${view}`,
        columns: fnbColumns,
        primaryMetric,
        rows,
      };
    }

    if (view === "voids") {
      const pivot = getFnBVoidsNumber(fnbDrillFilters);
      const kpi = getFilteredFnBKPIs(fnbDrillFilters).find((k) => k.title === "Voids");
      const primaryMetric =
        kpi?.value !== undefined ? String(kpi.value) : formatSAR(pivot);
      const baseRows = fnbRows.voids;
      const baseAmounts = baseRows.map((r) =>
        parseSarToNumber(String(r.value))
      );
      const baseSum = baseAmounts.reduce((a, b) => a + b, 0) || 1;
      const scaled = baseAmounts.map((b) =>
        Math.round((pivot * b) / baseSum)
      );
      const drift = pivot - scaled.reduce((a, b) => a + b, 0);
      if (scaled.length) scaled[scaled.length - 1] += drift;
      const rows = baseRows.map((row, i) => ({
        ...row,
        value: formatSAR(scaled[i] ?? 0),
      }));

      return {
        domain,
        view,
        title: titleMap.voids,
        subtitle: `Food & Beverage voids for ${fnbScope}.`,
        source:
          "lib/api/mock/fnb.ts -> getFnBVoidsNumber + outlet split (matches KPI)",
        apiRequired: `GET /api/fnb/${view}`,
        columns: fnbColumns,
        primaryMetric,
        rows,
      };
    }

    if (view === "today-sales") {
      const kpi = getFilteredFnBKPIs(fnbDrillFilters).find(
        (k) => k.title === "Today's Sales"
      );
      return {
        domain,
        view,
        title: titleMap["today-sales"],
        subtitle: `Outlet sales for ${fnbScope}, aligned with the Today's Sales KPI.`,
        source: "lib/api/mock/fnb.ts -> getOutletSalesDrillAxis",
        apiRequired: `GET /api/fnb/${view}`,
        columns: fnbColumns,
        rows: fnbSalesDrillRows(fnbDrillFilters),
        primaryMetric:
          kpi?.value !== undefined ? String(kpi.value) : undefined,
      };
    }

    if (view === "covers") {
      const { covers } = fnbCoversAverageCheckRows(fnbDrillFilters);
      return {
        domain,
        view,
        title: titleMap.covers,
        subtitle: `Cover counts for ${fnbScope}, split by outlet sales mix (matches Covers KPI).`,
        source: "lib/api/mock/fnb.ts -> getFilteredOutletSales + getFilteredFnBKPIs",
        apiRequired: `GET /api/fnb/${view}`,
        columns: fnbColumns,
        rows: covers,
        primaryMetric: String(fnbKpiNumber(fnbDrillFilters, "Covers")),
      };
    }

    if (view === "average-check") {
      const { averageCheck } = fnbCoversAverageCheckRows(fnbDrillFilters);
      const kpi = getFilteredFnBKPIs(fnbDrillFilters).find(
        (k) => k.title === "Average Check"
      );
      return {
        domain,
        view,
        title: titleMap["average-check"],
        subtitle: `Per-outlet average check for ${fnbScope} (derived from outlet sales ÷ covers).`,
        source: "lib/api/mock/fnb.ts -> getFilteredOutletSales + getFilteredFnBKPIs",
        apiRequired: `GET /api/fnb/${view}`,
        columns: fnbColumns,
        rows: averageCheck,
        primaryMetric:
          kpi?.value !== undefined ? String(kpi.value) : undefined,
      };
    }

    if (view === "open-checks") {
      const checks = getFilteredOpenChecks(fnbDrillFilters);
      const totalOpen = checks.reduce((s, c) => s + c.amount, 0);
      return {
        domain,
        view,
        title: titleMap["open-checks"],
        subtitle: `Open checks for ${fnbScope} (amounts scaled like the F&B screen).`,
        source: "lib/api/mock/fnb.ts -> getFilteredOpenChecks",
        apiRequired: `GET /api/fnb/${view}`,
        columns: fnbColumns,
        rows: fnbOpenChecksDrillRows(fnbDrillFilters),
        primaryMetric: formatSAR(totalOpen),
      };
    }

    return {
      domain,
      view,
      title: titleMap[view as keyof typeof fnbRows],
      subtitle: "Food & Beverage dataset only.",
      source: "F&B mock outlet dataset",
      apiRequired: `GET /api/fnb/${view}`,
      columns: fnbColumns,
      rows: fnbRows[view as keyof typeof fnbRows],
    };
  }

  if (domain === "finance" && view && view in financeRows) {
    const fin = financeKpiScaleFromDrill(params);
    const rangeSubtitle = `Global header range ${fin.rangeCaption}.`;

    const titleMap: Record<keyof typeof financeRows, string> = {
      "cash-position": "Cash Position",
      "unsettled-folios": "Unsettled Folios",
      "overdue-receivables": "Overdue Receivables",
      "total-revenue-today": "Finance Total Revenue Today",
      "cash-balance": "Finance Cash Balance",
      "accounts-receivable": "Accounts Receivable",
      "accounts-payable": "Accounts Payable",
    };

    type FinanceDrillRow = {
      account: string;
      type: string;
      amount: string;
      status: string;
    };

    if (view === "cash-position") {
      const baseRows = financeRows["cash-position"] as FinanceDrillRow[];
      let rows: FinanceDrillRow[] = [...baseRows];
      let primaryMetric: string | undefined;
      let subtitle =
        `${rangeSubtitle} Cash position drill uses dashboard or revenue context when present.`;

      const ctx = inferDrillCtx(domain, view, params);
      if (ctx === "dashboard") {
        const q = drillDashboardRange(params);
        const k = getDashboardKPIsForRange(q).find((x) => x.title === "Cash Position");
        primaryMetric = k?.value;
        subtitle =
          "Cash position aligned with the executive dashboard for the selected header date range.";
      } else if (ctx === "revenue") {
        primaryMetric = getRevenueDrillCashPositionDisplay(
          revenueFiltersFromDrill(params)
        );
        subtitle =
          "Cash position scaled to match the Revenue dashboard range and segment filters.";
      }
      if (primaryMetric) {
        rows = scaleAmountRowsByPrimary(rows, primaryMetric, 542800);
      }

      return {
        domain,
        view,
        title: titleMap["cash-position"],
        subtitle,
        source: "Finance mock dataset",
        apiRequired: `GET /api/finance/${view}`,
        columns: financeColumns,
        rows,
        primaryMetric,
      };
    }

    if (view === "total-revenue-today") {
      const baseRows = financeRows["total-revenue-today"] as FinanceDrillRow[];
      const rows = scaleAmountRowsByPrimary(
        [...baseRows],
        fin.revenueTodayDisplay,
        FINANCE_KPI_BASE.revenueToday
      );
      return {
        domain,
        view,
        title: titleMap["total-revenue-today"],
        subtitle: `${rangeSubtitle} Department amounts sum to the Total Revenue Today KPI.`,
        source:
          "Finance mock dataset → scaled to match components/finance/finance-kpi-cards.tsx",
        apiRequired: `GET /api/finance/${view}`,
        columns: financeColumns,
        rows,
        primaryMetric: fin.revenueTodayDisplay,
      };
    }

    if (view === "cash-balance") {
      const baseRows = financeRows["cash-balance"] as FinanceDrillRow[];
      const rows = scaleAmountRowsByPrimary(
        [...baseRows],
        fin.cashDisplay,
        FINANCE_KPI_BASE.cash
      );
      return {
        domain,
        view,
        title: titleMap["cash-balance"],
        subtitle: `${rangeSubtitle} Account balances sum to the Cash Balance KPI.`,
        source:
          "Finance mock dataset → scaled to match components/finance/finance-kpi-cards.tsx",
        apiRequired: `GET /api/finance/${view}`,
        columns: financeColumns,
        rows,
        primaryMetric: fin.cashDisplay,
      };
    }

    if (view === "accounts-receivable") {
      const baseRows = financeRows["accounts-receivable"] as FinanceDrillRow[];
      const scaled = scaleAmountRowsByPrimary(
        [...baseRows],
        fin.arDisplay,
        FINANCE_KPI_BASE.ar
      );
      const weights = [18, 12, 7, 4, 3];
      const invCounts = distributeIntAcrossWeights(fin.openInvoices, weights);
      const rows = scaled.map((r, i) => ({
        ...r,
        status: `${invCounts[i] ?? 1} invoices`,
      }));
      return {
        domain,
        view,
        title: titleMap["accounts-receivable"],
        subtitle: `${rangeSubtitle} Aging buckets sum to AR; invoice counts match the AR KPI subtitle.`,
        source:
          "Finance mock dataset → scaled to match components/finance/finance-kpi-cards.tsx",
        apiRequired: `GET /api/finance/${view}`,
        columns: financeColumns,
        rows,
        primaryMetric: fin.arDisplay,
      };
    }

    if (view === "accounts-payable") {
      const baseRows = financeRows["accounts-payable"] as FinanceDrillRow[];
      const scaled = scaleAmountRowsByPrimary(
        [...baseRows],
        fin.apDisplay,
        FINANCE_KPI_BASE.ap
      );
      const weights = [7, 6, 6];
      const billCounts = distributeIntAcrossWeights(fin.pendingBills, weights);
      const rows = scaled.map((r, i) => ({
        ...r,
        status: `${billCounts[i] ?? 1} invoices`,
      }));
      return {
        domain,
        view,
        title: titleMap["accounts-payable"],
        subtitle: `${rangeSubtitle} Payable buckets sum to AP; invoice counts match the AP KPI subtitle.`,
        source:
          "Finance mock dataset → scaled to match components/finance/finance-kpi-cards.tsx",
        apiRequired: `GET /api/finance/${view}`,
        columns: financeColumns,
        rows,
        primaryMetric: fin.apDisplay,
      };
    }

    const baseRows = financeRows[view as keyof typeof financeRows] as FinanceDrillRow[];
    const rows = baseRows.map((r) => ({
      ...r,
      amount: formatSAR(Math.round(parseSarToNumber(r.amount) * fin.m)),
    }));

    return {
      domain,
      view,
      title: titleMap[view as keyof typeof financeRows],
      subtitle: `${rangeSubtitle} Amounts scaled by the same mock range factor (m) as Finance KPIs.`,
      source: "Finance mock dataset",
      apiRequired: `GET /api/finance/${view}`,
      columns: financeColumns,
      rows,
    };
  }

  if (domain === "inventory" && view && view in inventoryRows) {
    const inv = inventoryKpiScaleFromDrill(params);
    const titleMap: Record<keyof typeof inventoryRows, string> = {
      "negative-stock": "Negative Stock",
      "stock-value": "Total Stock Value",
      "below-reorder": "Below Reorder Level",
      "pending-pos": "Pending Purchase Orders",
      "price-variance": "Price Variance Alerts",
    };

    const subtitle = `Mock inventory for ${inv.rangeCaption}. Values use the same header date range scaling as the Inventory KPI cards.`;

    if (view === "stock-value") {
      const template = inventoryRows["stock-value"];
      const base = template.map((r) => ({
        item: r.item,
        store: r.store,
        reorderLevel: r.reorderLevel,
        status: r.status,
        amount: String(r.stock),
      }));
      const scaled = scaleAmountRowsByPrimary(
        base,
        inv.stockTotalDisplay,
        INVENTORY_KPI_BASE.stockValue
      );
      const rows = scaled.map((r) => ({
        item: r.item,
        store: r.store,
        stock: r.amount,
        reorderLevel: r.reorderLevel,
        status: r.status,
      }));
      return {
        domain,
        view,
        title: titleMap["stock-value"],
        subtitle,
        source:
          "Inventory mock dataset → scaled with mockNumericScale (matches Inventory KPI cards)",
        apiRequired: `GET /api/inventory/${view}`,
        columns: inventoryColumns,
        rows,
        primaryMetric: inv.stockTotalDisplay,
      };
    }

    if (view === "below-reorder") {
      const rows = inventoryPadRows(
        inventoryRows["below-reorder"],
        inv.below
      ) as (typeof inventoryRows)["below-reorder"];
      return {
        domain,
        view,
        title: titleMap["below-reorder"],
        subtitle,
        source:
          "Inventory mock dataset → row count matches Below Reorder KPI for the header range",
        apiRequired: `GET /api/inventory/${view}`,
        columns: inventoryColumns,
        rows,
        primaryMetric: String(inv.below),
      };
    }

    if (view === "pending-pos") {
      const rows = inventoryPendingPosDrillRows(
        inventoryRows["pending-pos"],
        inv.pos,
        parseSarToNumber(inv.pendingPoTotalDisplay)
      );
      return {
        domain,
        view,
        title: titleMap["pending-pos"],
        subtitle,
        source:
          "Inventory mock dataset → counts and PO value match Pending POs KPI for the header range",
        apiRequired: `GET /api/inventory/${view}`,
        columns: inventoryColumns,
        rows,
        primaryMetric: String(inv.pos),
      };
    }

    if (view === "price-variance") {
      const rows = inventoryPadRows(
        inventoryRows["price-variance"],
        inv.variance
      ) as (typeof inventoryRows)["price-variance"];
      return {
        domain,
        view,
        title: titleMap["price-variance"],
        subtitle,
        source:
          "Inventory mock dataset → row count matches Price Variance Alerts KPI for the header range",
        apiRequired: `GET /api/inventory/${view}`,
        columns: inventoryColumns,
        rows,
        primaryMetric: String(inv.variance),
      };
    }

    if (view === "negative-stock") {
      const rows = inventoryRows["negative-stock"].map((r) => ({
        ...r,
        stock: Math.round(Number(r.stock) * inv.m),
        reorderLevel:
          typeof r.reorderLevel === "number"
            ? Math.max(1, Math.round(Number(r.reorderLevel) * inv.m))
            : r.reorderLevel,
      }));
      return {
        domain,
        view,
        title: titleMap["negative-stock"],
        subtitle,
        source:
          "Inventory mock dataset → scaled by mockNumericScale for the header range",
        apiRequired: `GET /api/inventory/${view}`,
        columns: inventoryColumns,
        rows,
      };
    }

    return {
      domain,
      view,
      title: titleMap[view as keyof typeof inventoryRows],
      subtitle: "Inventory dataset only.",
      source: "Inventory mock dataset",
      apiRequired: `GET /api/inventory/${view}`,
      columns: inventoryColumns,
      rows: inventoryRows[view as keyof typeof inventoryRows],
    };
  }

  if (domain === "dashboard" && view === "arrivals") {
    return {
      domain: "rooms",
      view,
      title: "Executive Dashboard Arrivals",
      subtitle: "Records shown on the executive dashboard arrival table.",
      source: "lib/api/mock/dashboard.ts -> mockDashboardArrivals",
      apiRequired: "GET /api/dashboard/arrivals",
      columns: guestColumns,
      rows: dashboardArrivalRows(),
    };
  }

  return null;
}
