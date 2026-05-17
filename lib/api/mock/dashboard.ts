import type { TimeSeriesDataPoint } from "@/lib/types";

export interface DashboardKPI {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  trend: "up" | "down" | "neutral";
}

export interface DashboardArrival {
  id: string;
  guestName: string;
  roomType: string;
  eta: string;
  status: "confirmed" | "pending" | "vip";
}

export interface DashboardDeparture {
  id: string;
  guestName: string;
  room: string;
  balance: number;
  status: "checked-out" | "pending" | "overdue";
}

export interface DashboardException {
  id: string;
  category: string;
  description: string;
  count: number;
  severity: "red" | "amber" | "green";
}

export const mockDashboardKPIs: DashboardKPI[] = [
  {
    title: "Occupancy %",
    value: "78.5%",
    change: 5.2,
    changeLabel: "vs last week",
    trend: "up",
  },
  {
    title: "ADR",
    value: "SAR 485",
    change: -2.1,
    changeLabel: "vs last week",
    trend: "down",
  },
  {
    title: "RevPAR",
    value: "SAR 380",
    change: 3.4,
    changeLabel: "vs last week",
    trend: "up",
  },
  {
    title: "Today's Revenue",
    value: "SAR 125,450",
    change: 12.8,
    changeLabel: "vs yesterday",
    trend: "up",
  },
  {
    title: "MTD Revenue",
    value: "SAR 1,856,200",
    change: 8.5,
    changeLabel: "vs last month",
    trend: "up",
  },
  {
    title: "Cash Position",
    value: "SAR 542,800",
    change: 4.2,
    changeLabel: "vs yesterday",
    trend: "up",
  },
];

export const mockRevenueTrend: TimeSeriesDataPoint[] = [
  { date: "May 8", revenue: 105000 },
  { date: "May 9", revenue: 98000 },
  { date: "May 10", revenue: 112000 },
  { date: "May 11", revenue: 128000 },
  { date: "May 12", revenue: 135000 },
  { date: "May 13", revenue: 122000 },
  { date: "May 14", revenue: 125450 },
];

export const mockOccupancyForecast: TimeSeriesDataPoint[] = [
  { date: "May 15", forecast: 82 },
  { date: "May 16", forecast: 85 },
  { date: "May 17", forecast: 88 },
  { date: "May 18", forecast: 92 },
  { date: "May 19", forecast: 90 },
  { date: "May 20", forecast: 75 },
  { date: "May 21", forecast: 70 },
  { date: "May 22", forecast: 78 },
  { date: "May 23", forecast: 82 },
  { date: "May 24", forecast: 85 },
  { date: "May 25", forecast: 90 },
  { date: "May 26", forecast: 95 },
  { date: "May 27", forecast: 88 },
  { date: "May 28", forecast: 80 },
];

export const mockDashboardArrivals: DashboardArrival[] = [
  {
    id: "1",
    guestName: "Mohammed Al-Rashid",
    roomType: "Deluxe King",
    eta: "14:00",
    status: "confirmed",
  },
  {
    id: "2",
    guestName: "Sarah Johnson",
    roomType: "Executive Suite",
    eta: "15:30",
    status: "vip",
  },
  {
    id: "3",
    guestName: "Ahmed Hassan",
    roomType: "Standard Twin",
    eta: "16:00",
    status: "confirmed",
  },
  {
    id: "4",
    guestName: "Emily Chen",
    roomType: "Deluxe Twin",
    eta: "17:30",
    status: "pending",
  },
  {
    id: "5",
    guestName: "Khalid Al-Saud",
    roomType: "Royal Suite",
    eta: "18:00",
    status: "vip",
  },
];

export const mockDashboardDepartures: DashboardDeparture[] = [
  {
    id: "1",
    guestName: "John Williams",
    room: "405",
    balance: 0,
    status: "checked-out",
  },
  {
    id: "2",
    guestName: "Fatima Al-Zahrani",
    room: "312",
    balance: 450,
    status: "pending",
  },
  {
    id: "3",
    guestName: "Michael Brown",
    room: "801",
    balance: 0,
    status: "checked-out",
  },
  {
    id: "4",
    guestName: "Aisha Mohammed",
    room: "215",
    balance: 1250,
    status: "overdue",
  },
  {
    id: "5",
    guestName: "Robert Taylor",
    room: "508",
    balance: 0,
    status: "pending",
  },
];

export const mockDashboardExceptions: DashboardException[] = [
  {
    id: "1",
    category: "High Discounts",
    description: "3 bookings with >30% discount applied",
    count: 3,
    severity: "amber",
  },
  {
    id: "2",
    category: "Unsettled Folios",
    description: "Outstanding balance: SAR 12,450",
    count: 8,
    severity: "red",
  },
  {
    id: "3",
    category: "No-Shows",
    description: "Guests who did not arrive yesterday",
    count: 2,
    severity: "amber",
  },
  {
    id: "4",
    category: "Negative Stock",
    description: "Items below minimum inventory level",
    count: 5,
    severity: "red",
  },
  {
    id: "5",
    category: "Overdue Receivables",
    description: "Corporate accounts past 30 days",
    count: 4,
    severity: "red",
  },
  {
    id: "6",
    category: "Room Maintenance",
    description: "All maintenance requests resolved",
    count: 0,
    severity: "green",
  },
];
