import {
  mockDashboardArrivals,
  mockDashboardDepartures,
  mockOccupancyForecast,
  mockRevenueTrend,
} from "@/lib/api/mock/dashboard";
import {
  mockRoomArrivals,
  mockRoomDepartures,
  mockRooms,
  mockRoomsOccupancyTrend,
} from "@/lib/api/mock/rooms";
import { formatSAR } from "@/lib/types";

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
}

const roomColumns: DrillDownColumn[] = [
  { key: "room", header: "Room" },
  { key: "floor", header: "Floor" },
  { key: "type", header: "Type" },
  { key: "status", header: "Status" },
  { key: "guest", header: "Guest" },
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

function roomRows(status?: string) {
  return mockRooms
    .filter((room) => !status || room.status === status)
    .map((room) => ({
      room: room.number,
      floor: room.floor,
      type: room.type,
      status: room.status,
      guest: room.guest ?? "-",
    }));
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
      account: "Global Industries",
      type: "Corporate Invoice",
      amount: "SAR 125,000",
      status: "Overdue",
    },
    {
      account: "Al Noor Travel",
      type: "Travel Agent",
      amount: "SAR 78,500",
      status: "Open",
    },
    {
      account: "Riyadh Events",
      type: "Banquet Invoice",
      amount: "SAR 121,280",
      status: "Open",
    },
  ],
  "accounts-payable": [
    {
      account: "Fresh Foods Co.",
      type: "Vendor Bill",
      amount: "SAR 42,800",
      status: "Due this week",
    },
    {
      account: "Linen Supply",
      type: "Vendor Bill",
      amount: "SAR 38,600",
      status: "Pending approval",
    },
    {
      account: "Utility Provider",
      type: "Utility Bill",
      amount: "SAR 75,520",
      status: "Scheduled",
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
      item: "Coffee Beans",
      store: "Main Kitchen",
      stock: 8,
      reorderLevel: 25,
      status: "Below reorder",
    },
    {
      item: "Bath Amenities",
      store: "Housekeeping",
      stock: 42,
      reorderLevel: 120,
      status: "Below reorder",
    },
    {
      item: "Mineral Water",
      store: "Mini-bar",
      stock: 30,
      reorderLevel: 80,
      status: "Below reorder",
    },
  ],
  "pending-pos": [
    {
      item: "PO-2024-0156",
      store: "Purchasing",
      stock: "SAR 12,500",
      reorderLevel: "-",
      status: "Awaiting Finance",
    },
    {
      item: "PO-2024-0182",
      store: "Purchasing",
      stock: "SAR 8,700",
      reorderLevel: "-",
      status: "Awaiting GM",
    },
    {
      item: "PO-2024-0191",
      store: "Purchasing",
      stock: "SAR 21,600",
      reorderLevel: "-",
      status: "Pending approval",
    },
  ],
  "price-variance": [
    {
      item: "Salmon Fillet",
      store: "Main Kitchen",
      stock: "+15%",
      reorderLevel: "10%",
      status: "Above threshold",
    },
    {
      item: "Olive Oil",
      store: "Main Kitchen",
      stock: "+12%",
      reorderLevel: "10%",
      status: "Above threshold",
    },
    {
      item: "Laundry Chemicals",
      store: "Housekeeping",
      stock: "+11%",
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
};

export function getDrillDownDataset(
  domain: string | null,
  view: string | null,
  params?: { date?: string | null }
): DrillDownDataset | null {
  if (domain === "rooms") {
    if (view === "occupied" || view === "sold") {
      return {
        domain,
        view,
        title: "Occupied Rooms",
        subtitle: "Rooms currently sold/occupied from the rooms status dataset.",
        source: "lib/api/mock/rooms.ts -> mockRooms",
        apiRequired: "GET /api/rooms/status?status=occupied",
        columns: roomColumns,
        rows: roomRows("occupied"),
      };
    }

    if (view === "available") {
      return {
        domain,
        view,
        title: "Available Rooms",
        subtitle: "Vacant clean rooms ready to sell.",
        source: "lib/api/mock/rooms.ts -> mockRooms",
        apiRequired: "GET /api/rooms/status?status=vacant-clean",
        columns: roomColumns,
        rows: roomRows("vacant-clean"),
      };
    }

    if (view === "maintenance") {
      return {
        domain,
        view,
        title: "Room Maintenance",
        subtitle: "Rooms filtered to maintenance/out-of-order statuses.",
        source: "lib/api/mock/rooms.ts -> mockRooms",
        apiRequired: "GET /api/rooms/status?status=maintenance",
        columns: roomColumns,
        rows: [...roomRows("maintenance"), ...roomRows("out-of-order")],
      };
    }

    if (view === "arrivals") {
      return {
        domain,
        view,
        title: "Rooms Arrivals Today",
        subtitle: "Front-office arrivals dataset, not alerts or finance data.",
        source: "lib/api/mock/rooms.ts -> mockRoomArrivals",
        apiRequired: "GET /api/rooms/arrivals",
        columns: guestColumns,
        rows: roomArrivalRows(),
      };
    }

    if (view === "departures") {
      return {
        domain,
        view,
        title: "Rooms Departures Today",
        subtitle: "Front-office departure dataset with balances.",
        source: "lib/api/mock/rooms.ts -> mockRoomDepartures",
        apiRequired: "GET /api/rooms/departures",
        columns: guestColumns,
        rows: roomDepartureRows(),
      };
    }

    if (view === "no-shows") {
      return {
        domain,
        view,
        title: "No-Shows",
        subtitle: "Arrival records that failed to arrive, scoped to rooms.",
        source: "lib/api/mock/dashboard.ts -> operational exception backing data",
        apiRequired: "GET /api/rooms/no-shows",
        columns: guestColumns,
        rows: [
          {
            guest: "Omar Farooq",
            room: "108",
            roomType: "Standard",
            time: "11:00",
            status: "No-show risk",
          },
          {
            guest: "Emily Chen",
            room: "410",
            roomType: "Deluxe",
            time: "16:00",
            status: "Pending arrival",
          },
        ],
      };
    }

    if (view === "occupancy" || view === "occupancy-forecast") {
      return {
        domain,
        view,
        title: view === "occupancy" ? "Rooms Occupancy" : "Occupancy Forecast",
        subtitle: "Occupancy data from the rooms/occupancy dataset.",
        source: "lib/api/mock/rooms.ts -> mockRoomsOccupancyTrend",
        apiRequired: "GET /api/rooms/occupancy-trend",
        columns: [
          { key: "date", header: "Date" },
          { key: "occupancy", header: "Occupancy", align: "right" },
          { key: "source", header: "Source" },
        ],
        rows: mockRoomsOccupancyTrend.map((point) => ({
          date: String(point.date),
          occupancy: `${point.occupancy}%`,
          source: params?.date ? `Selected point: ${params.date}` : "Rooms forecast",
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
      return {
        domain,
        view,
        title: "ADR Forecast",
        subtitle: "Average daily rate forecast by stay date.",
        source: "Revenue forecast dataset",
        apiRequired: "GET /api/revenue/adr-forecast",
        columns: revenueColumns,
        rows: revenueRows("ADR Forecast").map((row, index) => ({
          ...row,
          amount: `SAR ${[485, 492, 501, 478, 515, 530, 505][index] ?? 485}`,
          source: "Revenue forecast model",
        })),
      };
    }

    if (view === "room-revenue-forecast") {
      return {
        domain,
        view,
        title: "Room Revenue Forecast",
        subtitle: "Forecasted room revenue by stay date.",
        source: "Revenue forecast dataset",
        apiRequired: "GET /api/revenue/room-revenue-forecast",
        columns: revenueColumns,
        rows: revenueRows("Room Revenue Forecast"),
      };
    }

    if (view === "pickup-7-days" || view === "pickup-today") {
      return {
        domain,
        view,
        title: view === "pickup-today" ? "Pickup Today" : "Pickup Last 7 Days",
        subtitle: "Room-night pickup from the revenue booking pace dataset.",
        source: "Revenue booking pace dataset",
        apiRequired: `GET /api/revenue/booking-pace?view=${view}`,
        columns: [
          { key: "date", header: "Date" },
          { key: "metric", header: "Metric" },
          { key: "amount", header: "Room Nights", align: "right" },
          { key: "source", header: "Source" },
        ],
        rows: (view === "pickup-today"
          ? [{ date: "May 14", pickup: 58 }]
          : [
              { date: "May 8", pickup: 42 },
              { date: "May 9", pickup: 36 },
              { date: "May 10", pickup: 51 },
              { date: "May 11", pickup: 48 },
              { date: "May 12", pickup: 62 },
              { date: "May 13", pickup: 45 },
              { date: "May 14", pickup: 58 },
            ]
        ).map((row) => ({
          date: row.date,
          metric: "Pickup",
          amount: row.pickup,
          source: "Reservations created in period",
        })),
      };
    }

    if (view === "adr") {
      return {
        domain,
        view,
        title: "ADR Drill-Down",
        subtitle: "Average daily rate dataset.",
        source: "lib/api/mock/dashboard.ts -> mockRevenueTrend",
        apiRequired: "GET /api/revenue/kpis?metric=adr",
        columns: revenueColumns,
        rows: revenueRows("ADR"),
      };
    }

    if (view === "revpar") {
      return {
        domain,
        view,
        title: "RevPAR Drill-Down",
        subtitle: "Revenue per available room dataset.",
        source: "lib/api/mock/dashboard.ts -> mockRevenueTrend",
        apiRequired: "GET /api/revenue/kpis?metric=revpar",
        columns: revenueColumns,
        rows: revenueRows("RevPAR"),
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
    const titleMap: Record<keyof typeof fnbRows, string> = {
      "today-sales": "F&B Today's Sales",
      covers: "F&B Covers",
      "average-check": "F&B Average Check",
      discounts: "F&B Discounts",
      voids: "F&B Voids",
    };

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
    const titleMap: Record<keyof typeof financeRows, string> = {
      "cash-position": "Cash Position",
      "unsettled-folios": "Unsettled Folios",
      "overdue-receivables": "Overdue Receivables",
      "total-revenue-today": "Finance Total Revenue Today",
      "cash-balance": "Finance Cash Balance",
      "accounts-receivable": "Accounts Receivable",
      "accounts-payable": "Accounts Payable",
    };

    return {
      domain,
      view,
      title: titleMap[view as keyof typeof financeRows],
      subtitle: "Finance dataset only.",
      source: "Finance mock dataset",
      apiRequired: `GET /api/finance/${view}`,
      columns: financeColumns,
      rows: financeRows[view as keyof typeof financeRows],
    };
  }

  if (domain === "inventory" && view && view in inventoryRows) {
    const titleMap: Record<keyof typeof inventoryRows, string> = {
      "negative-stock": "Negative Stock",
      "stock-value": "Total Stock Value",
      "below-reorder": "Below Reorder Level",
      "pending-pos": "Pending Purchase Orders",
      "price-variance": "Price Variance Alerts",
    };

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
