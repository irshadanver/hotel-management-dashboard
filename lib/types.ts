// Common data types used across dashboards

// Guest and booking related
export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  vipTier?: "gold" | "platinum" | "diamond";
  company?: string;
}

export interface Booking {
  id: string;
  guestName: string;
  roomNumber?: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: "confirmed" | "checked-in" | "checked-out" | "pending" | "cancelled" | "no-show";
  rate: number;
  balance?: number;
  source?: string;
  notes?: string;
}

// Room related
export type RoomStatus = "vacant-clean" | "vacant-dirty" | "occupied" | "reserved" | "maintenance" | "out-of-order";

export interface Room {
  number: string;
  floor: number;
  type: string;
  status: RoomStatus;
  guest?: string;
  notes?: string;
}

// Financial related
export interface Invoice {
  id: string;
  number: string;
  company: string;
  amount: number;
  dueDate: string;
  status: "current" | "overdue" | "critical" | "paid";
  daysOverdue?: number;
}

export interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  department: string;
  status: "posted" | "unposted" | "pending";
}

// Inventory related
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  store: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
  value: number;
  lastMovement?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  amount: number;
  items: number;
  createdBy: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected" | "received";
  priority: "urgent" | "normal";
}

// F&B related
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  quantity: number;
  revenue: number;
  status?: "active" | "slow-moving" | "out-of-stock";
}

export interface FBCheck {
  id: string;
  tableNumber: string;
  server: string;
  amount: number;
  covers: number;
  openedAt: string;
  status: "open" | "closed" | "voided";
  outlet: string;
}

// Alert and exception related
export type AlertSeverity = "critical" | "warning" | "info";
export type AlertStatus = "active" | "acknowledged" | "resolved";

export interface Alert {
  id: string;
  type: string;
  description: string;
  department: string;
  severity: AlertSeverity;
  status: AlertStatus;
  timestamp: string;
  count?: number;
}

// KPI and metric related
export interface KPIMetric {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  alert?: boolean;
}

// Chart data types
export interface TimeSeriesDataPoint {
  date: string;
  [key: string]: string | number;
}

export interface CategoryDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Currency formatting helper
export const CURRENCY = "SAR";

export function formatSAR(value: number): string {
  return `${CURRENCY} ${value.toLocaleString()}`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatCompact(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
}
