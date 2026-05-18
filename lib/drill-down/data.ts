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

const roomAvailableRows = [
  { segment: "Standard", rooms: 14, basis: "Vacant clean inventory", status: "Ready to sell" },
  { segment: "Deluxe", rooms: 12, basis: "Vacant clean inventory", status: "Ready to sell" },
  { segment: "Executive", rooms: 8, basis: "Vacant clean inventory", status: "Ready to sell" },
  { segment: "Suite", rooms: 8, basis: "Vacant clean inventory", status: "Ready to sell" },
];

const roomSoldRows = [
  { segment: "Standard", rooms: 52, basis: "Confirmed occupied/sold rooms", status: "Sold" },
  { segment: "Deluxe", rooms: 44, basis: "Confirmed occupied/sold rooms", status: "Sold" },
  { segment: "Executive", rooms: 26, basis: "Confirmed occupied/sold rooms", status: "Sold" },
  { segment: "Suite", rooms: 16, basis: "Confirmed occupied/sold rooms", status: "Sold" },
];

const roomArrivalSummaryRows = [
  { segment: "Expected", rooms: 23, basis: "Today's arrivals", status: "Pending check-in" },
  { segment: "Checked In", rooms: 5, basis: "Today's arrivals", status: "Completed" },
];

const roomDepartureSummaryRows = [
  { segment: "Checked Out", rooms: 18, basis: "Today's departures", status: "Completed" },
  { segment: "Due Out", rooms: 4, basis: "Today's departures", status: "Pending" },
  { segment: "Extended", rooms: 2, basis: "Today's departures", status: "Extended stay" },
];

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
        subtitle: "Rooms sold summary reconciled to the Rooms Sold KPI (138).",
        source: "Rooms sales summary mock dataset",
        apiRequired: "GET /api/rooms/status?status=occupied",
        columns: roomSummaryColumns,
        rows: roomSoldRows,
      };
    }

    if (view === "available") {
      return {
        domain,
        view,
        title: "Available Rooms",
        subtitle: "Available rooms summary reconciled to the Rooms Available KPI (42).",
        source: "Rooms availability summary mock dataset",
        apiRequired: "GET /api/rooms/status?status=vacant-clean",
        columns: roomSummaryColumns,
        rows: roomAvailableRows,
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
        source: "Rooms arrivals summary mock dataset",
        apiRequired: "GET /api/rooms/arrivals",
        columns: roomSummaryColumns,
        rows: roomArrivalSummaryRows,
      };
    }

    if (view === "departures") {
      return {
        domain,
        view,
        title: "Rooms Departures Today",
        subtitle: "Front-office departure dataset with balances.",
        source: "Rooms departures summary mock dataset",
        apiRequired: "GET /api/rooms/departures",
        columns: roomSummaryColumns,
        rows: roomDepartureSummaryRows,
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

    if (view === "occupancy") {
      return {
        domain,
        view,
        title: "Rooms Occupancy",
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
          amount: `SAR ${adrForecastValues[index] ?? 485}`,
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
        rows: roomRevenueForecastRows,
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
    if (!date && view === "mtd") {
      return {
        domain,
        view,
        title: "Month-to-Date Revenue",
        subtitle: "Posted revenue records reconciled to the dashboard MTD KPI.",
        source: "Revenue MTD summary mock dataset",
        apiRequired: "GET /api/revenue?period=mtd",
        columns: revenueColumns,
        rows: revenueMtdRows,
      };
    }

    if (!date && (!view || view === "today")) {
      return {
        domain,
        view: view ?? "today",
        title: "Today's Revenue",
        subtitle: "Posted revenue records reconciled to the dashboard and finance KPIs.",
        source: "Revenue daily summary mock dataset",
        apiRequired: "GET /api/revenue?date=today",
        columns: revenueColumns,
        rows: revenueTodayRows,
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
    const titleMap: Record<keyof typeof fnbRows, string> = {
      "today-sales": "F&B Today's Sales",
      covers: "F&B Covers",
      "average-check": "F&B Average Check",
      discounts: "F&B Discounts",
      voids: "F&B Voids",
      "open-checks": "F&B Open Checks",
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
