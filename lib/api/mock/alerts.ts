import type { DateRangeQuery } from "@/lib/date/date-range-query";

export interface AlertRow {
  id: number;
  type: string;
  description: string;
  department: string;
  severity: "critical" | "warning" | "info";
  timestamp: string;
  status: "open" | "resolved";
}

export const mockAlerts: AlertRow[] = [
  {
    id: 1,
    type: "High Discount",
    description: "35% discount applied on Room 405 - Guest: Ahmed Al-Rashid",
    department: "Front Office",
    severity: "critical",
    timestamp: "2024-01-15 14:32",
    status: "open",
  },
  {
    id: 2,
    type: "Pending Balance",
    description: "Guest checkout with SAR 2,450 pending - Room 312",
    department: "Front Office",
    severity: "critical",
    timestamp: "2024-01-15 14:15",
    status: "open",
  },
  {
    id: 3,
    type: "Negative Stock",
    description: "Chicken Breast stock at -5 units in Main Kitchen",
    department: "Inventory",
    severity: "critical",
    timestamp: "2024-01-15 13:45",
    status: "open",
  },
  {
    id: 4,
    type: "PO Pending Approval",
    description: "PO-2024-0156 for SAR 12,500 awaiting Finance approval",
    department: "Purchasing",
    severity: "warning",
    timestamp: "2024-01-15 12:30",
    status: "open",
  },
  {
    id: 5,
    type: "Overdue Receivable",
    description: "Global Industries - SAR 125,000 overdue by 45 days",
    department: "Finance",
    severity: "critical",
    timestamp: "2024-01-15 11:00",
    status: "open",
  },
  {
    id: 6,
    type: "Room Maintenance",
    description: "Room 508 AC unit requires repair - Guest complaint",
    department: "Engineering",
    severity: "warning",
    timestamp: "2024-01-15 10:45",
    status: "open",
  },
  {
    id: 7,
    type: "Open Check",
    description: "Check #4521 open for 2+ hours at Lobby Cafe",
    department: "F&B",
    severity: "warning",
    timestamp: "2024-01-15 10:30",
    status: "open",
  },
  {
    id: 8,
    type: "Price Variance",
    description: "Supplier price increased 15% on Salmon - Above threshold",
    department: "Purchasing",
    severity: "warning",
    timestamp: "2024-01-15 09:15",
    status: "open",
  },
  {
    id: 9,
    type: "VIP Arrival",
    description: "Platinum member arriving at 3:00 PM - Room upgrade ready",
    department: "Front Office",
    severity: "info",
    timestamp: "2024-01-15 09:00",
    status: "open",
  },
  {
    id: 10,
    type: "Daily Report",
    description: "Night audit completed successfully",
    department: "Finance",
    severity: "info",
    timestamp: "2024-01-15 06:00",
    status: "resolved",
  },
  {
    id: 11,
    type: "Inventory Count",
    description: "Monthly stock count scheduled for tomorrow",
    department: "Inventory",
    severity: "info",
    timestamp: "2024-01-15 08:00",
    status: "open",
  },
  {
    id: 12,
    type: "High Discount",
    description: "28% discount on banquet booking - Manager approved",
    department: "Sales",
    severity: "warning",
    timestamp: "2024-01-14 16:00",
    status: "resolved",
  },
];

function alertTakeCount(total: number, q: DateRangeQuery): number {
  const span = q.daySpan;
  if (span <= 1) return Math.min(q.preset === "yesterday" ? 6 : total, total);
  if (span <= 7) return Math.min(10, total);
  if (span >= 28) return total;
  return Math.min(Math.max(6, Math.round(total * (span / 30))), total);
}

/** Subset of alerts shown for the selected header date range (mock). */
export function getAlertsForRange(q: DateRangeQuery): AlertRow[] {
  const total = mockAlerts.length;
  const take = alertTakeCount(total, q);
  return mockAlerts.slice(0, take);
}

export function getActiveAlertCount(q: DateRangeQuery): number {
  return getAlertsForRange(q).filter(
    (a) => a.status === "open" && a.severity === "critical"
  ).length;
}
