import type { DateRangeQuery } from "./date-range-query";

/**
 * Interpolate mock scale from inclusive day span (1 ≈ today, 7 ≈ last week, 30 ≈ month).
 * Used for currency / KPI drift in mock data.
 */
export function mockNumericScaleForSpan(daySpan: number): number {
  const d = Math.max(1, Math.min(90, daySpan));
  if (d <= 1) return 1;
  if (d <= 7) {
    return 1 + ((0.97 - 1) * (d - 1)) / 6;
  }
  if (d <= 30) {
    return 0.97 + ((1.06 - 0.97) * (d - 7)) / 23;
  }
  return 1.06 + ((1.08 - 1.06) * (d - 30)) / 60;
}

export function mockNumericScale(q: DateRangeQuery): number {
  return mockNumericScaleForSpan(q.daySpan);
}
