/**
 * Backend route map — replace mock implementations in lib/api/services with these paths.
 */
export const API_ENDPOINTS = {
  dashboard: {
    kpis: "/api/dashboard/kpis",
    revenueTrend: "/api/dashboard/revenue-trend",
    occupancyForecast: "/api/dashboard/occupancy-forecast",
    arrivals: "/api/dashboard/arrivals",
    departures: "/api/dashboard/departures",
    exceptions: "/api/dashboard/exceptions",
  },
  rooms: {
    kpis: "/api/rooms/kpis",
    status: "/api/rooms/status",
    arrivals: "/api/rooms/arrivals",
    departures: "/api/rooms/departures",
    vipGuests: "/api/rooms/vip",
    occupancyTrend: "/api/rooms/occupancy-trend",
  },
  revenue: {
    kpis: "/api/revenue/kpis",
    bookingPace: "/api/revenue/booking-pace",
    segmentRevenue: "/api/revenue/segments",
    channelMix: "/api/revenue/channels",
    topAccounts: "/api/revenue/top-accounts",
    lowDemand: "/api/revenue/low-demand",
  },
  fnb: {
    kpis: "/api/fnb/kpis",
    outletSales: "/api/fnb/outlet-sales",
    topItems: "/api/fnb/top-items",
    openChecks: "/api/fnb/open-checks",
    staffMeals: "/api/fnb/staff-meals",
    slowItems: "/api/fnb/slow-items",
    mealPeriods: "/api/fnb/meal-periods",
  },
  inventory: {
    kpis: "/api/inventory/kpis",
    stockValue: "/api/inventory/stock-value",
    consumption: "/api/inventory/consumption",
    reorderAlerts: "/api/inventory/reorder-alerts",
    negativeStock: "/api/inventory/negative-stock",
    slowMoving: "/api/inventory/slow-moving",
    pendingPOs: "/api/inventory/pending-pos",
  },
  finance: {
    kpis: "/api/finance/kpis",
    revenueByDept: "/api/finance/revenue-by-dept",
    arAging: "/api/finance/ar-aging",
    topDebtors: "/api/finance/top-debtors",
    overdueInvoices: "/api/finance/overdue-invoices",
    payablesDue: "/api/finance/payables-due",
    alerts: "/api/finance/alerts",
  },
  alerts: {
    list: "/api/alerts",
    acknowledge: (id: string) => `/api/alerts/${id}/acknowledge`,
    resolve: (id: string) => `/api/alerts/${id}/resolve`,
  },
  auth: {
    profile: "/api/auth/profile",
    properties: "/api/auth/properties",
  },
} as const;
