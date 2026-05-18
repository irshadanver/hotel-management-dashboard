import { formatPercent, formatSAR, type TimeSeriesDataPoint } from "@/lib/types";

export interface RevenueFilters {
  range?: string;
  segment?: string;
}

export interface RevenueKPI {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export interface SegmentRevenueRow {
  segment: string;
  revenue: number;
}

export interface ChannelMixRow {
  name: string;
  value: number;
  segment: string;
  color: string;
}

export interface TopAccountRow {
  company: string;
  segment: string;
  nights: number;
  revenue: number;
  adr: number;
}

export interface LowDemandRow {
  date: string;
  dayOfWeek: string;
  occupancy: number;
  roomsAvailable: number;
  adr: number;
  severity: "critical" | "warning" | "low";
  segment: string;
}

const rangeDays: Record<string, number> = {
  "7d": 7,
  "14d": 14,
  "30d": 30,
  "90d": 90,
};

const segmentFactors: Record<string, number> = {
  all: 1,
  corporate: 0.38,
  ota: 0.26,
  direct: 0.22,
  group: 0.14,
};

const segmentLabels: Record<string, string> = {
  all: "All segments",
  corporate: "Corporate",
  ota: "OTA",
  direct: "Direct",
  group: "Group",
};

function normalizeFilters(filters?: RevenueFilters) {
  return {
    range: filters?.range ?? "30d",
    segment: filters?.segment ?? "all",
  };
}

function getDays(range: string) {
  return rangeDays[range] ?? rangeDays["30d"];
}

function rangeScale(range: string) {
  return getDays(range) / 30;
}

function segmentScale(segment: string) {
  return segmentFactors[segment] ?? segmentFactors.all;
}

function filterSegment<T extends { segment: string }>(rows: T[], segment: string) {
  return segment === "all" ? rows : rows.filter((row) => row.segment === segment);
}

function formatCompactSAR(value: number) {
  return value >= 1000000
    ? `SAR ${(value / 1000000).toFixed(1)}M`
    : formatSAR(Math.round(value));
}

export function getFilteredRevenueKPIs(filters?: RevenueFilters): RevenueKPI[] {
  const { range, segment } = normalizeFilters(filters);
  const days = getDays(range);
  const scale = rangeScale(range) * segmentScale(segment);
  const occupancy = Math.min(95, 84.3 + (segment === "group" ? -7 : segment === "corporate" ? 3 : 0));
  const adr = Math.round(485 * (segment === "corporate" ? 1.08 : segment === "ota" ? 0.94 : 1));
  const roomRevenue = 2400000 * scale;
  const pickup = Math.round(342 * scale);
  const pickupToday = Math.max(4, Math.round(58 * segmentScale(segment)));
  const segmentLabel = segmentLabels[segment] ?? "Selected segment";

  return [
    {
      title: "Occupancy Forecast",
      value: formatPercent(occupancy),
      subtitle: `${days} days · ${segmentLabel}`,
      trend: { value: "2.3%", positive: true },
    },
    {
      title: "ADR Forecast",
      value: formatSAR(adr),
      subtitle: `${days} days · ${segmentLabel}`,
      trend: { value: "3.1%", positive: true },
    },
    {
      title: "Room Revenue Forecast",
      value: formatCompactSAR(roomRevenue),
      subtitle: `${days} days · ${segmentLabel}`,
      trend: { value: "5.8%", positive: true },
    },
    {
      title: "Pickup (Last 7 Days)",
      value: pickup,
      subtitle: "Room nights booked",
      trend: { value: "12%", positive: true },
    },
    {
      title: "Pickup (Today)",
      value: pickupToday,
      subtitle: "Room nights booked",
      trend: { value: "8%", positive: true },
    },
  ];
}

export function getFilteredBookingPace(filters?: RevenueFilters): TimeSeriesDataPoint[] {
  const { range, segment } = normalizeFilters(filters);
  const days = Math.min(getDays(range), 30);
  const scale = segmentScale(segment);

  return Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    const current = Math.round((105 + index * 31 + Math.sin(index / 3) * 16) * scale);
    return {
      date: `Day ${day}`,
      current,
      lastYear: Math.round(current * 0.78),
    };
  });
}

const baseSegmentRevenue: SegmentRevenueRow[] = [
  { segment: "Corporate", revenue: 485000 },
  { segment: "OTA", revenue: 320000 },
  { segment: "Direct", revenue: 275000 },
  { segment: "Group", revenue: 180000 },
];

export function getFilteredSegmentRevenue(filters?: RevenueFilters) {
  const { range, segment } = normalizeFilters(filters);
  const scale = rangeScale(range);
  const rows = segment === "all"
    ? baseSegmentRevenue
    : baseSegmentRevenue.filter((row) => row.segment.toLowerCase() === segment);

  return rows.map((row) => ({
    ...row,
    revenue: Math.round(row.revenue * scale),
  }));
}

const baseChannelMix: ChannelMixRow[] = [
  { name: "Booking.com", value: 32, segment: "ota", color: "oklch(0.55 0.15 250)" },
  { name: "Direct Website", value: 28, segment: "direct", color: "oklch(0.65 0.15 145)" },
  { name: "Expedia", value: 18, segment: "ota", color: "oklch(0.55 0.12 280)" },
  { name: "Corporate Portal", value: 14, segment: "corporate", color: "oklch(0.65 0.15 50)" },
  { name: "GDS", value: 8, segment: "group", color: "oklch(0.65 0.12 165)" },
];

export function getFilteredChannelMix(filters?: RevenueFilters) {
  const { segment } = normalizeFilters(filters);
  const rows = filterSegment(baseChannelMix, segment);
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  return rows.map((row) => ({
    ...row,
    value: total ? Math.round((row.value / total) * 100) : 0,
  }));
}

const baseTopAccounts: TopAccountRow[] = [
  { company: "Saudi Aramco", segment: "corporate", nights: 245, revenue: 142500, adr: 582 },
  { company: "SABIC Corporation", segment: "corporate", nights: 198, revenue: 108900, adr: 550 },
  { company: "Saudi Telecom", segment: "corporate", nights: 156, revenue: 85800, adr: 550 },
  { company: "National Water Co", segment: "corporate", nights: 134, revenue: 67000, adr: 500 },
  { company: "Riyadh Bank", segment: "direct", nights: 112, revenue: 56000, adr: 500 },
  { company: "Al Rajhi Capital", segment: "corporate", nights: 98, revenue: 49000, adr: 500 },
  { company: "ACWA Power", segment: "group", nights: 87, revenue: 43500, adr: 500 },
  { company: "Maaden Mining", segment: "ota", nights: 76, revenue: 38000, adr: 500 },
];

export function getFilteredTopAccounts(filters?: RevenueFilters) {
  const { range, segment } = normalizeFilters(filters);
  const scale = rangeScale(range);

  return filterSegment(baseTopAccounts, segment).map((account) => ({
    ...account,
    nights: Math.round(account.nights * scale),
    revenue: Math.round(account.revenue * scale),
  }));
}

const baseLowDemand: LowDemandRow[] = [
  { date: "May 19, 2026", dayOfWeek: "Tuesday", occupancy: 42, roomsAvailable: 104, adr: 385, severity: "critical", segment: "ota" },
  { date: "May 20, 2026", dayOfWeek: "Wednesday", occupancy: 48, roomsAvailable: 94, adr: 395, severity: "critical", segment: "group" },
  { date: "May 26, 2026", dayOfWeek: "Tuesday", occupancy: 52, roomsAvailable: 86, adr: 410, severity: "warning", segment: "direct" },
  { date: "May 27, 2026", dayOfWeek: "Wednesday", occupancy: 55, roomsAvailable: 81, adr: 420, severity: "warning", segment: "corporate" },
  { date: "Jun 2, 2026", dayOfWeek: "Tuesday", occupancy: 58, roomsAvailable: 76, adr: 425, severity: "warning", segment: "ota" },
  { date: "Jun 3, 2026", dayOfWeek: "Wednesday", occupancy: 60, roomsAvailable: 72, adr: 430, severity: "low", segment: "direct" },
];

export function getFilteredLowDemand(filters?: RevenueFilters) {
  const { range, segment } = normalizeFilters(filters);
  const dayLimit = getDays(range);
  return filterSegment(baseLowDemand, segment).slice(0, Math.max(1, Math.ceil(dayLimit / 15)));
}
