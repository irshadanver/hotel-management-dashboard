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
    description: "PO-2024-0892 awaiting GM approval - SAR 45,000",
    department: "Purchasing",
    severity: "warning",
    timestamp: "2024-01-15 12:30",
    status: "open",
  },
  {
    id: 5,
    type: "Rate Variance",
    description: "BAR rate mismatch on 3 OTA bookings",
    department: "Revenue",
    severity: "warning",
    timestamp: "2024-01-15 11:20",
    status: "open",
  },
  {
    id: 6,
    type: "Maintenance Complete",
    description: "Room 512 maintenance completed",
    department: "Housekeeping",
    severity: "info",
    timestamp: "2024-01-15 10:00",
    status: "resolved",
  },
];

export function getActiveAlertCount(): number {
  return mockAlerts.filter((a) => a.status === "open" && a.severity === "critical")
    .length;
}
