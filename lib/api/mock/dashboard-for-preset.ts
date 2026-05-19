import type { DateRangeQuery } from "@/lib/date/date-range-query";
import { mockNumericScale } from "@/lib/date/preset-multipliers";
import type { TimeSeriesDataPoint } from "@/lib/types";
import type {
  DashboardArrival,
  DashboardDeparture,
  DashboardException,
  DashboardKPI,
} from "./dashboard";
import {
  mockDashboardArrivals,
  mockDashboardDepartures,
  mockDashboardExceptions,
  mockDashboardKPIs,
  mockOccupancyForecast,
  mockRevenueTrend,
} from "./dashboard";

function scaleSarInString(value: string, mult: number): string {
  return value.replace(/SAR\s*([\d,]+)/gi, (_, num: string) => {
    const n = parseInt(String(num).replace(/,/g, ""), 10);
    if (Number.isNaN(n)) return `SAR ${num}`;
    return `SAR ${Math.round(n * mult).toLocaleString()}`;
  });
}

function scalePercentInString(value: string, mult: number): string {
  return value.replace(/(\d+\.?\d*)\s*%/g, (match, num: string) => {
    const p = parseFloat(num);
    if (Number.isNaN(p)) return match;
    const next = Math.min(100, Math.max(0, p * (0.55 + 0.45 * mult)));
    return `${next.toFixed(1)}%`;
  });
}

function scaleDashboardKpiValue(value: string, mult: number): string {
  if (value.includes("%")) return scalePercentInString(value, mult);
  if (/SAR/i.test(value)) return scaleSarInString(value, mult);
  return value;
}

export function getDashboardKPIsForRange(q: DateRangeQuery): DashboardKPI[] {
  const m = mockNumericScale(q);
  return mockDashboardKPIs.map((kpi) => ({
    ...kpi,
    value: scaleDashboardKpiValue(kpi.value, m),
    change: Math.round((kpi.change * (0.65 + 0.35 * m)) * 10) / 10,
  }));
}

function scaleSeriesRevenue(
  points: TimeSeriesDataPoint[],
  mult: number
): TimeSeriesDataPoint[] {
  return points.map((p, i) => {
    const rev = p.revenue;
    if (typeof rev !== "number") return { ...p };
    const wobble = 1 + 0.015 * Math.sin(i * 1.7);
    return { ...p, revenue: Math.round(rev * mult * wobble) };
  });
}

function trendPointCount(q: DateRangeQuery): number {
  const span = q.daySpan;
  if (q.preset === "today") return Math.min(7, Math.max(3, span + 2));
  if (q.preset === "yesterday") return Math.min(6, Math.max(3, span + 2));
  return Math.min(21, Math.max(4, Math.round(span * 0.65) + 3));
}

export function getRevenueTrendForRange(q: DateRangeQuery): TimeSeriesDataPoint[] {
  const base = mockRevenueTrend;
  const m = mockNumericScale(q);
  const n = trendPointCount(q);

  if (q.preset === "today") {
    return scaleSeriesRevenue(base.slice(-Math.min(n, base.length)), m);
  }
  if (q.preset === "yesterday") {
    return scaleSeriesRevenue(
      base.slice(-Math.min(n + 1, base.length), -1),
      m * 0.98
    );
  }
  if (q.preset === "last30Days" || q.daySpan >= 28) {
    const out: TimeSeriesDataPoint[] = [];
    const weeks = Math.min(14, Math.max(8, Math.ceil(q.daySpan / 7)));
    for (let i = 0; i < weeks; i++) {
      const src = base[i % base.length];
      const revenue = typeof src.revenue === "number" ? src.revenue : 0;
      const wobble = 1 + 0.04 * Math.sin(i * 0.5);
      out.push({
        date: `W${i + 1}`,
        revenue: Math.round(revenue * m * wobble * 1.02),
      });
    }
    return out;
  }
  const sliceLen = Math.min(base.length, n);
  return scaleSeriesRevenue(base.slice(-sliceLen), m);
}

export function getOccupancyForecastForRange(q: DateRangeQuery): TimeSeriesDataPoint[] {
  const m = mockNumericScale(q);
  const full = mockOccupancyForecast;
  const span = q.daySpan;
  let take: number;
  if (q.preset === "today") take = Math.min(12, Math.max(5, span + 4));
  else if (q.preset === "yesterday") take = Math.min(10, Math.max(5, span + 4));
  else if (q.preset === "last30Days" || span >= 28) take = full.length;
  else if (span <= 7) take = Math.min(10, Math.max(6, span + 2));
  else take = Math.min(full.length, Math.max(8, Math.round(span * 0.35) + 4));

  const slice = full.slice(-take);
  return slice.map((p, i) => {
    const f = p.forecast;
    if (typeof f !== "number") return { ...p };
    const wobble = 1 + 0.01 * Math.sin(i);
    return {
      ...p,
      forecast: Math.round(Math.min(100, f * (0.92 + 0.08 * m) * wobble)),
    };
  });
}

export function getDashboardArrivalsForRange(q: DateRangeQuery): DashboardArrival[] {
  const all = mockDashboardArrivals;
  if (q.preset === "yesterday") return all.slice(0, Math.min(3, all.length));
  if (q.preset === "last30Days" || q.daySpan >= 28) return all;
  if (q.daySpan <= 1) return all.slice(0, Math.min(5, all.length));
  if (q.daySpan <= 7) return all.slice(0, Math.min(7, all.length));
  return all;
}

export function getDashboardDeparturesForRange(
  q: DateRangeQuery
): DashboardDeparture[] {
  const all = mockDashboardDepartures;
  if (q.preset === "yesterday") return all.slice(0, Math.min(3, all.length));
  if (q.preset === "last30Days" || q.daySpan >= 28) return all;
  return all;
}

export function getDashboardExceptionsForRange(
  q: DateRangeQuery
): DashboardException[] {
  const m = mockNumericScale(q);
  const spanBoost = 0.85 + 0.15 * Math.min(1, q.daySpan / 30);
  return mockDashboardExceptions.map((ex) => ({
    ...ex,
    count: Math.max(0, Math.round(ex.count * (0.75 + 0.25 * m) * spanBoost)),
  }));
}
